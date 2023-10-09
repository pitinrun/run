import { getProductsByProductCodes } from '@/src/services/product';
import { base64ToJSON, connectToDatabase } from '@/src/utils';
import { NextRequest, NextResponse } from 'next/server';

connectToDatabase();

/**
 *
 * @param req
 * @param params productCodes (base64)
 * @returns
 * @todo productCodes는 body로 받아야 함
 */
export async function GET(req: NextRequest, { params }) {
  const { productCodes: base64ProductCodes } = params;
  const productCodes = base64ToJSON(base64ProductCodes);

  try {
    const products = await getProductsByProductCodes(productCodes);
    return NextResponse.json(products, {
      status: 200,
    });
  } catch (error) {
    console.error('!! ERROR:', error);
    return NextResponse.json({
      message: error.message,
    }, {
      status: 500,
    });
  }
}
