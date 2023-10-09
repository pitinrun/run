import { updateProductStock } from '@/src/services/spreadsheet';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }) {
  try {
    const { productCode } = params;
    const { shipments } = await req.json();

    // console.log('$$ shipments', shipments);
    // console.log('$$ productCode', productCode);
    updateProductStock(productCode, shipments);
    return NextResponse.json({
      message: 'success',
      status: 201,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('!! ERROR: ', error);
      return NextResponse.json({
        message: error.message,
      });
    }

    return NextResponse.json('unknown error', {
      status: 500,
    });
  }
}
