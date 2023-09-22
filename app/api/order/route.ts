import { connectToDatabase } from '@/src/utils';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { IOrderDocument, Order } from '@/src/models/order';

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    const body: IOrderDocument = await req.json();
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
      console.error('!!ERROR: Invalid or Do not have token');
      return NextResponse.json(
        { message: '!!ERROR: Do not have token' },
        {
          status: 400,
        }
      );
    }

    body.userId = token.sub;
    body.state = 1;

    const newOrder = new Order(body);
    const saved = await newOrder.save();

    return NextResponse.json(saved, {
      status: 201,
    });
  } catch (error) {
    console.error('!! ERROR:', error);
    return NextResponse.json(
      {
        message: '주문을 생성하는데 실패했습니다.',
      },
      {
        status: 500,
      }
    );
  }
}
