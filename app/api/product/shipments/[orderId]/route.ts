import { updateStatusDeliveryStart } from '@/src/services/order';
import { updateProductStorage } from '@/src/services/product';
import { updateSheetStock } from '@/src/services/spreadsheet';
import { ProductShipmentEntry } from '@/src/types';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }) {
  try {
    const { orderId } = params;
    const {
      entries: productShipmentEntry,
      deliveryInfo,
    }: {
      entries: ProductShipmentEntry[];
      deliveryInfo: string;
    } = await req.json();

    await updateProductStorage(productShipmentEntry);
    await updateSheetStock(productShipmentEntry);
    await updateStatusDeliveryStart(
      orderId,
      productShipmentEntry,
      deliveryInfo
    );

    return NextResponse.json({
      message: '정상적으로 접수되었습니다.',
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
