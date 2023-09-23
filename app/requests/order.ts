import { IOrder, IProduct } from '@/src/types';
import axios from 'axios';

export const createOrderRequest = async ({
  products,
}: Omit<IOrder, 'status' | 'userId' | 'createdAt'>) => {
  const response = await axios.post('/api/order', {
    products,
  });
  return response.data;
};

export type GetOrdersDataType = Omit<IOrder, 'products' | 'userId'> & {
  products: (IProduct & {
    quantity: number;
    discountRate: number;
  })[];
};

export const getOrdersRequest = async ({
  orderStatus,
  period,
}: {
  orderStatus?: string;
  period?: string;
}) => {
  const { data } = await axios.get<GetOrdersDataType[]>('/api/order', {
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
