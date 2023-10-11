import { updateStatusDeliveryStart } from '@/src/services/order';
import { updateProductStorage } from '@/src/services/product';
import { updateSheetStock } from '@/src/services/spreadsheet';
import { ProductShipmentEntry } from '@/src/types';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }) {
  try {
    const { orderId } = params;

    return NextResponse.json({
      message: '배송이 완료되었습니다.',
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
