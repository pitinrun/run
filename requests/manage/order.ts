import { IOrder, IProduct } from '@/src/types';
import axios from 'axios';

export type GetManageOrdersDataType = Omit<IOrder, 'products' | 'userId'> & {
  products: (IProduct & {
    quantity: number;
    discountRate: number;
  })[];
  _id: string;
};
export const getManageOrdersRequest = async ({
  orderStatus,
  period,
}: {
  orderStatus?: string;
  period?: string;
}) => {
  const { data } = await axios.get<GetManageOrdersDataType[]>('/api/manage/order', {
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
