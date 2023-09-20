import { getProductsByProductCodes } from '@/src/services/product';
import { base64ToJSON, connectToDatabase } from '@/src/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

connectToDatabase();

/**
 *
 * @param req
 * @param params productCodes (base64)
 * @returns
 */
export async function GET(req: NextApiRequest, { params }) {
  const { productCodes: base64ProductCodes } = params;
  const productCodes = base64ToJSON(base64ProductCodes);
  console.log(productCodes);

  try {
    const products = await getProductsByProductCodes(productCodes);
    return NextResponse.json(products, {
      status: 200,
    });
  } catch (error) {
    console.error('!! ERROR:', error);
    return NextResponse.json('error', {
      status: 500,
    });
  }
}
