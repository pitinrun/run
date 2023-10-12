// app/api/product/[productCode]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getProductByProductCode,
  getProductsByProductCodes,
} from '@/src/services/product';
import { connectToDatabase } from '@/src/utils';

// MongoDB 연결
connectToDatabase();

/**
 * 제품 코드를 기준으로 제품을 조회하는 GET 엔드포인트
 *
 * @param req
 * @param params productCode
 * @returns
 */
export async function GET(req: NextRequest, { params }) {
  const { productCode: productCodeBase64 } = params;
  const productCode = Buffer.from(productCodeBase64, 'base64').toString();

  try {
    // 제품 코드 배열을 기존 함수에 맞게 배열 형태로 변환
    const product = await getProductByProductCode(productCode);

    // 제품이 조회되지 않았을 경우의 처리
    if (!product) {
      return NextResponse.json(
        {
          message: `Product with code ${productCode} not found.`,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(product, {
      status: 200,
    });
  } catch (error) {
    console.error('!! ERROR:', error);
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
