import { NextResponse } from 'next/server';
import { connectToDatabase } from 'src/utils';
import { google } from 'googleapis';
import { client_email, private_key } from '.meta/google-credentials.json';
import { toColumnName } from './utils';
import { dropAndBulkInsertProducts } from '@/src/services/product';
import { updateStorageNames } from '@/src/services/metadata';
import { IProduct } from '@/src/types';

connectToDatabase();

const START_CELL = 'A6';

const { SPREAD_SHEET_ID, SPREAD_SHEET_PRODUCT_NAME } = process.env;

const SHEET_MATCH_MAP: { [K in keyof IProduct] } = {
  brand: {
    row: 'A',
    rowNum: 1,
  },
  pattern: {
    row: 'B',
    rowNum: 2,
  },
  patternKr: {
    row: 'C',
    rowNum: 3,
  },
  productCode: {
    row: 'D',
    rowNum: 4,
  },
  size: {
    row: 'E',
    rowNum: 5,
  },
  sizeSearchKeyword: {
    row: 'F',
    rowNum: 6,
  },
  speedSymbolLoadIndex: {
    row: 'G',
    rowNum: 7,
  },
  marking: {
    row: 'H',
    rowNum: 8,
  },
  origin: {
    row: 'I',
    rowNum: 9,
  },
  season: {
    row: 'J',
    rowNum: 10,
  },
  special: {
    row: 'L',
    rowNum: 11,
  },
  etc: {
    row: 'L',
    rowNum: 12,
  },
  specialDiscountRate: {
    row: 'M',
    rowNum: 13,
  },
  factoryPrice: {
    row: 'N',
    rowNum: 14,
  },
  storages: {
    startRowNum: 16, // 첫번째 sto-a가 시작하는 칼럼의 번호
  },
};

const serializeSheetToObjectForProductMeta = (
  sheetData: Array<Array<string>>
) => {
  const storageNames = sheetData[0]
    .slice(SHEET_MATCH_MAP.storages.startRowNum - 1)
    .filter(name => name);

  return updateStorageNames(storageNames);
};

const serializeSheetToObjectForProduct = (
  sheetData: Array<Array<string>>
): IProduct[] => {
  const results: IProduct[] = [];

  sheetData.slice(2).forEach(row => {
    const product: IProduct = {
      brand: '',
      pattern: '',
      patternKr: '',
      productCode: '',
      size: '',
      sizeSearchKeyword: '',
      speedSymbolLoadIndex: '',
      factoryPrice: 0,
      storages: [],
    };

    Object.keys(SHEET_MATCH_MAP).forEach(key => {
      const map = SHEET_MATCH_MAP[key as keyof IProduct];

      if (key !== 'storages') {
        if (typeof row[map.rowNum - 1] !== 'undefined') {
          if (key === 'factoryPrice' && row[map.rowNum - 1]) {
            (product[key as keyof IProduct] as number) = parseInt(
              row[map.rowNum - 1].replace('₩', '').replace(',', ''),
              10
            );
          } else if (key === 'specialDiscountRate' && row[map.rowNum - 1]) {
            (product[key as keyof IProduct] as number) =
              parseInt(row[map.rowNum - 1].replace('%', ''), 10) / 100;
          } else if (key == 'season') {
            if (
              row[map.rowNum - 1] === '겨울용' ||
              row[map.rowNum - 1] === '겨울'
            ) {
              (product[key as keyof IProduct] as string) = 'winter';
            } else if (
              row[map.rowNum - 1] === '썸머용' ||
              row[map.rowNum - 1] === '썸머'
            ) {
              (product[key as keyof IProduct] as string) = 'summer';
            } else if (row[map.rowNum - 1] === '사계절') {
              (product[key as keyof IProduct] as string) = 'all-weathers';
            } else {
              (product[key as keyof IProduct] as string) = 'ERROR';
            }
          } else {
            (product[key as keyof IProduct] as string) = row[map.rowNum - 1];
          }
        }
      } else {
        const storageNames = sheetData[0].slice(map.startRowNum - 1);
        const storageRows = row.slice(map.startRowNum - 1);
        const storages: IProduct['storages'] = storageNames.reduce(
          (acc, name, index) => {
            if (name) {
              return [
                ...acc,
                {
                  name,
                  stock: parseInt(storageRows[index], 10) || 0,
                  dot: storageRows[index + 1]
                    ? storageRows[index + 1].split('\n')
                    : [],
                },
              ];
            }
            return acc;
          },
          []
        );
        product.storages = storages;
      }
    });

    results.push(product);
  });

  return results;
};

async function getSheetRange(
  spreadsheetId: string = SPREAD_SHEET_ID ?? '',
  sheetName: string = SPREAD_SHEET_PRODUCT_NAME ?? ''
) {
  const authorize = new google.auth.JWT(client_email, undefined, private_key, [
    'https://www.googleapis.com/auth/spreadsheets',
  ]);

  const googleSheet = google.sheets({
    version: 'v4',
    auth: authorize,
  });

  // 스프레드시트의 메타데이터를 먼저 가져옵니다.
  const sheetMetadata = await googleSheet.spreadsheets.get({
    spreadsheetId,
  });

  // 첫 번째 시트의 정보를 가져옵니다. (여러 시트가 있을 수 있으므로 필요하면 수정)
  if (!sheetMetadata.data.sheets) {
    throw new Error('No sheet found');
  }

  const sheetInfo = sheetMetadata.data.sheets.find(
    sheet => sheet.properties?.title === sheetName
  );

  if (!sheetInfo?.properties?.gridProperties) {
    throw new Error('No gridProperties found');
  }

  const rowCount = sheetInfo.properties.gridProperties.rowCount ?? 0;
  const colCount = sheetInfo.properties.gridProperties.columnCount ?? 0;

  const endCell = toColumnName(colCount) + rowCount;

  return {
    startCell: START_CELL,
    endCell,
  };
}

async function getSpreadSheetData(
  spreadsheetId = SPREAD_SHEET_ID ?? '',
  sheetName = SPREAD_SHEET_PRODUCT_NAME ?? '',
  startCell: string,
  endCell: string
) {
  const authorize = new google.auth.JWT(client_email, undefined, private_key, [
    'https://www.googleapis.com/auth/spreadsheets',
  ]);
  const googleSheet = google.sheets({
    version: 'v4',
    auth: authorize,
  });

  const context = await googleSheet.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!${startCell}:${endCell}`,
  });

  return context.data.values;
}

export async function POST() {
  try {
    const sheetRange = await getSheetRange();
    const spreadSheetData =
      (await getSpreadSheetData(
        SPREAD_SHEET_ID,
        SPREAD_SHEET_PRODUCT_NAME,
        sheetRange.startCell,
        sheetRange.endCell
      )) ?? [];
    const serializedProducts =
      serializeSheetToObjectForProduct(spreadSheetData);

    const isDropAndBulkInsertSuccess = await dropAndBulkInsertProducts(
      serializedProducts
    );

    const meta = await serializeSheetToObjectForProductMeta(spreadSheetData);

    return NextResponse.json({
      message: 'success',
      status: 201,
      success: isDropAndBulkInsertSuccess,
      meta,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('!! ERROR: ', error.message);
      return NextResponse.json({
        status: 500,
        message: error.message,
      });
    }

    return NextResponse.json('unknown error', {
      status: 500,
    });
  }
}
