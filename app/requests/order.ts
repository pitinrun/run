import { IOrder } from '@/src/types';
import axios from 'axios';

export const createOrderRequest = async ({
  products,
}: Omit<IOrder, 'status' | 'userId' | 'createdAt'>) => {
  const response = await axios.post('/api/order', {
    products,
  });
  return response.data;
};

export const getOrdersRequest = async ({
  orderStatus,
  period,
}: {
  orderStatus?: string;
  period?: string;
}) => {
  const response = await axios.get('/api/order', {
    params: {
      orderStatus,
      period,
    },
  });
  return response.data;
};
