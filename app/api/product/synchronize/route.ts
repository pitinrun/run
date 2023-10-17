import { NextResponse } from 'next/server';
import { connectToDatabase } from 'src/utils';
import { dropAndBulkInsertProducts } from '@/src/services/product';
import {
  getSheetRange,
  getSpreadSheetData,
  serializeSheetToObjectForProduct,
  serializeSheetToObjectForProductMeta,
} from '@/src/services/spreadsheet';

connectToDatabase();

/**
 * @for Vercel
 */
export const maxDuration = 60 * 3; // 3 minutes

const { SPREAD_SHEET_ID, SPREAD_SHEET_PRODUCT_NAME } = process.env;
/**
 * 주어진 스프레드시트의 데이터를 사용하여 상품 데이터를 업데이트합니다.
 *
 * @returns 응답 객체
 */
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
      console.error('!! ERROR: ', error);
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json('unknown error', {
      status: 500,
    });
  }
}
