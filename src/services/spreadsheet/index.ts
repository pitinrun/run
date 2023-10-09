// src/services/spreadsheet/index.ts
import { google } from 'googleapis';
import { getStorages, updateStorageNames } from '@/src/services/metadata';
import { IProduct } from '@/src/types';
import { fromColumnName, toColumnName } from './utils';
import { IMetaData } from '@/src/models/metadata';

const DEBUG_MODE = false;

const credential = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS ?? '', 'base64').toString()
);

const START_ROW = 6;
const START_CELL = `A${START_ROW}`;
const { SPREAD_SHEET_ID, SPREAD_SHEET_PRODUCT_NAME } = process.env;

/**
 * 시트와 상품 객체의 매핑 정보를 정의합니다.
 */
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

/**
 * 시트 데이터를 메타데이터 객체로 직렬화합니다.
 * 창고 이름과 코드를 매핑합니다.
 * @param {Array<Array<string>>} sheetData - 시트 데이터
 * @returns 메타데이터의 배열
 */
export const serializeSheetToObjectForProductMeta = (
  sheetData: Array<Array<string>>
) => {
  const storageNames = sheetData[0]
    .slice(SHEET_MATCH_MAP.storages.startRowNum - 1)
    .reduce((acc, name, index, arr) => {
      if (index % 2 === 0) {
        return [
          ...acc,
          {
            name,
            code: arr[index + 1],
            sheetColumn: toColumnName(
              SHEET_MATCH_MAP.storages.startRowNum + index
            ),
          },
        ];
      }
      return acc;
    }, []);

  return updateStorageNames(storageNames);
};

/**
 * 시트 데이터를 상품 객체로 직렬화합니다.
 *
 * @param {Array<Array<string>>} sheetData - 시트 데이터
 * @returns 상품 객체의 배열
 */
export const serializeSheetToObjectForProduct = (
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
              row[map.rowNum - 1].replace('₩', '').replaceAll(',', ''),
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
        // NOTE: if key is storages
        const storageNames = sheetData[0].slice(map.startRowNum - 1);
        const storageRows = row.slice(map.startRowNum - 1);

        const storages: IProduct['storages'] = storageNames.reduce(
          (acc, name, index) => {
            if (index % 2 === 1) {
              // NOTE: 홀수 번째는 창고 코드
              return acc;
            }
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

/**
 * 주어진 스프레드시트의 범위를 가져옵니다.
 *
 * @param {string} spreadsheetId - 스프레드시트의 ID
 * @param {string} sheetName - 시트의 이름
 * @returns 시작 셀과 끝 셀의 정보를 포함한 객체
 */
export async function getSheetRange(
  spreadsheetId: string = SPREAD_SHEET_ID ?? '',
  sheetName: string = SPREAD_SHEET_PRODUCT_NAME ?? ''
) {
  const authorize = new google.auth.JWT(
    credential.client_email,
    undefined,
    credential.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

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

  if (DEBUG_MODE && process.env.NODE_ENV === 'development') {
    return {
      startCell: START_CELL,
      endCell: 'AO106',
    };
  }

  return {
    startCell: START_CELL,
    endCell,
  };
}

/**
 * 주어진 스프레드시트에서 데이터를 가져옵니다.
 *
 * @param {string} spreadsheetId - 스프레드시트의 ID
 * @param {string} sheetName - 시트의 이름
 * @param {string} startCell - 시작 셀
 * @param {string} endCell - 끝 셀
 * @returns 시트의 데이터 배열
 */
export async function getSpreadSheetData(
  spreadsheetId: string = SPREAD_SHEET_ID ?? '',
  sheetName: string = SPREAD_SHEET_PRODUCT_NAME ?? '',
  startCell: string,
  endCell: string
) {
  const authorize = new google.auth.JWT(
    credential.client_email,
    undefined,
    credential.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
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

type RowDataResult = {
  rowIndex: number;
  rowData: string[];
};

/**
 * 주어진 제품코드에 해당하는 행 데이터를 반환합니다.
 *
 * @param {string} productCode - 검색할 제품코드
 * @returns rowIndex와 rowData를 포함한 객체
 */
export async function getRowDataByProductCode(
  productCode: string
): Promise<RowDataResult> {
  // 기본 범위 설정으로 전체 데이터를 가져옵니다.
  const range = await getSheetRange();
  const sheetData = await getSpreadSheetData(
    undefined,
    undefined,
    range.startCell,
    range.endCell
  );

  if (!sheetData) {
    throw new Error('No sheet data found.');
  }

  // 제품코드 컬럼 위치를 찾습니다.
  const productCodeColIndex = SHEET_MATCH_MAP.productCode.rowNum - 1;

  // 해당 제품코드의 행을 찾습니다.
  for (let i = 0; i < sheetData.length; i++) {
    const row = sheetData[i];
    if (row[productCodeColIndex] === productCode) {
      return {
        rowIndex: i,
        rowData: row,
      };
    }
  }

  // 제품코드에 해당하는 행이 없을 경우 오류를 발생시킵니다.
  throw new Error(`Product code ${productCode} not found.`);
}

/**
 * 주어진 제품코드에 해당하는 행의 재고를 반환합니다.
 *
 * @param storages
 * @param storageName
 * @returns
 */
function getSheetColumnByStorageName(
  storages: IMetaData['storages'],
  storageName: string
) {
  const storage = storages.find(storage => storage.name === storageName);

  if (!storage) {
    throw new Error(`Storage ${storageName} not found.`);
  }

  return storage.sheetColumn;
}

/**
 * 스프레드시트에서 제품의 재고를 출하합니다.
 *
 * @param productCode - 제품 코드
 * @param shipments - 창고 이름과 출하할 수량이 있는 배열
 */
export async function updateProductStock(
  productCode: string,
  shipments: [string, number][]
) {
  // 스프레드시트에서 데이터를 가져옴
  const { startCell, endCell } = await getSheetRange();
  const sheetData = await getSpreadSheetData(
    undefined,
    undefined,
    startCell,
    endCell
  );

  if (!sheetData) {
    throw new Error('No sheet data found.');
  }

  if (!SPREAD_SHEET_ID) {
    throw new Error('No spreadsheet ID found.');
  }

  // 제품 코드에 해당하는 행을 찾음
  const rowIndex = sheetData.findIndex(
    row => row[SHEET_MATCH_MAP.productCode.rowNum - 1] === productCode
  );

  // 제품 코드에 해당하는 행이 없다면 에러 발생
  if (rowIndex === -1) {
    throw new Error(`Product with code ${productCode} not found.`);
  }

  const authorize = new google.auth.JWT(
    credential.client_email,
    undefined,
    credential.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  const googleSheet = google.sheets({
    version: 'v4',
    auth: authorize,
  });

  const requestParams: {
    spreadsheetId: string;
    range: string;
    valueInputOption: string;
    requestBody: {
      values: string[][];
    };
  }[] = [];

  // 각 출하 품목에 대한 처리
  for (const [storageName, quantity] of shipments) {
    const storages = await getStorages();
    const storageColumn = getSheetColumnByStorageName(storages, storageName);
    const columnIndex = fromColumnName(storageColumn) - 1;

    if (!storageColumn) {
      throw new Error(`Storage ${storageName} not found.`);
    }

    const currentStock = parseInt(sheetData[rowIndex][columnIndex], 10) || 0;

    // 출하 수량이 현재 재고보다 많다면 에러 발생
    if (currentStock < quantity) {
      throw new Error(
        `Not enough stock in ${storageName}. Available: ${currentStock}, Requested: ${quantity}`
      );
    }

    // 재고 업데이트
    sheetData[rowIndex][columnIndex] = (currentStock - quantity).toString();

    // NOTE: 스프레드시트에 변경 사항을 requestParams에 추가
    // 이러한 이유는 병렬 전송 및 특정 상품 재고 부족 시 에러 처리를 위함
    const updateRange = `${storageColumn}${rowIndex + START_ROW}`;
    requestParams.push({
      spreadsheetId: SPREAD_SHEET_ID,
      range: `${SPREAD_SHEET_PRODUCT_NAME}!${updateRange}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[sheetData[rowIndex][columnIndex]]],
      },
    });
  }

  const requests = requestParams.map((requestParam, index) => {
    return googleSheet.spreadsheets.values.update(requestParam);
  });
  const responses = await Promise.all(requests);

  responses.forEach(response => {
    if (response.status !== 200) {
      throw new Error(`Error updating stock DATA: ${response.data}.`);
    }
  });

  return true;
}
