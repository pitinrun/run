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

export type ResponseGetOrders = Omit<IOrder, 'products' | 'userId'> & {
  products: (IProduct & {
    quantity: number;
    discountRate: number;
  })[];
  _id: string;
};
export const getOrdersRequest = async ({
  orderStatus,
  period,
}: {
  orderStatus?: string;
  period?: string;
}) => {
  const { data } = await axios.get<ResponseGetOrders[]>('/api/order', {
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

export const deleteOrderRequest = async (orderId: string) => {
  const response = await axios.delete('/api/order', {
    params: {
      orderId,
    },
  });
  return response.data;
};
