import { IOrder } from '@/src/types';
import axios from 'axios';

export const createOrderRequest = async ({
  products,
}: Omit<IOrder, 'state' | 'userId' | 'createdAt'>) => {
  const response = await axios.post('/api/order', {
    products,
  });
  return response.data;
};
