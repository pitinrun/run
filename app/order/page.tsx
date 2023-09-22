import { IOrder } from '@/src/types';
import OrderList from 'components/order/order-list';
import { useState } from 'react';

export default function OrderPage() {
  return (
    <div className='container'>
      <h1 className='text-lg sm:text-2xl font-bold mb-3 sm:mb-6'>주문내역</h1>
      <OrderList />
    </div>
  );
}
