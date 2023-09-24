import { IOrder, IProduct, UserType } from '@/src/types';
import axios from 'axios';

export type ResponseGetOrdersForManager = Omit<IOrder, 'products' | 'userId'> & {
  products: (IProduct & {
    quantity: number;
    discountRate: number;
  })[];
  userData: UserType;
  _id: string;
};
export const getOrdersRequestForManager = async ({
  orderStatus,
  period,
}: {
  orderStatus?: string;
  period?: string;
}) => {
  const { data } = await axios.get<ResponseGetOrdersForManager[]>('/api/manage/order', {
    params: {
      orderStatus,
      period,
    },
  });

  data.forEach(order => {
    order.createdAt = new Date(order.createdAt);
  });

  return data;
};
