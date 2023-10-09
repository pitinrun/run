import { updateProductStock } from '@/src/services/spreadsheet';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }) {
  try {
    // const { productCode } = params;
    const data: {
      productCode: string;
      shipmentEntries: [string, number][];
    }[] = await req.json();

    await updateProductStock(data);
    // const promiseUpdatedProductStocks = data.map(
    //   ({ productCode, shipmentEntries }) =>{

    //   }
    // );

    // const response = await Promise.all(promiseUpdatedProductStocks);

    return NextResponse.json({
      message: 'success',
      status: 200,
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

    return NextResponse.json('Unknown error', {
      status: 500,
    });
  }
}
