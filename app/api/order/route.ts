import { IOrderDocument, Order } from '@/src/models/order'; // Order 모델을 import 합니다.
import { connectToDatabase } from 'src/utils';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { FilterQuery } from 'mongoose';
import { getOrders } from '@/src/services/order';

// MongoDB에 연결합니다.
connectToDatabase();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // 쿼리 파라미터에서 필요한 값을 추출합니다.
    const orderStatus = searchParams.get('orderStatus');
    const month = searchParams.get('month');
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
      console.error('!!ERROR: Invalid or Do not have token');
      return NextResponse.json(
        { message: '!!ERROR: Do not have token' },
        {
          status: 401,
        }
      );
    }

    // MongoDB 필터 객체를 구성합니다.
    const filter: FilterQuery<IOrderDocument> = {};

    // 주문 상태 필터링을 위한 로직입니다.
    if (orderStatus) {
      filter.state = Number(orderStatus);
    }

    // 년도-월 필터링을 위한 로직입니다.
    if (month) {
      const [year, m] = month.split('-');
      const startDate = new Date(Number(year), Number(m) - 1, 1);
      const endDate = new Date(Number(year), Number(m), 0);
      filter.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // 주문한 사용자의 ID를 필터로 추가합니다.
    filter.userId = token.sub;

    // 주어진 필터를 사용해 주문 정보를 가져옵니다.
    const orders = await getOrders(filter);

    // 응답 데이터를 반환합니다.
    return NextResponse.json({
      orders: orders,
    });
  } catch (error) {
    console.error('!! ERROR:', error);
    return NextResponse.json('error', {
      status: 500,
    });
  }
}
