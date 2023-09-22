'use client';

import { IOrder } from '@/src/types';
import { useState } from 'react';

const ORDER_STATUSES = [
  {
    name: '전체',
    value: 0,
  },
  {
    name: '주문 확인중',
    value: 1,
  },
  {
    name: '배송 대기',
    value: 2,
  },
  {
    name: '배송중',
    value: 3,
  },
  {
    name: '배송완료',
    value: 4,
  },
];

export default function OrderList() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [status, setStatus] = useState(null);
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));

  return (
    <div className='mb-4 flex gap-4'>
      <div>
        <h6 className='mb-2'>주문 상태</h6>
        <select
          className='select select-bordered w-full max-w-xs select-xs sm:select-md'
          style={{
            minWidth: '6rem',
          }}
        >
          {ORDER_STATUSES.map(status => (
            <option key={status.value} value={status.value}>
              {status.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h6 className='mb-2'>기간</h6>
        <div className='flex gap-2'>
          <input
            type='month'
            className='input input-bordered w-full input-xs sm:input-md'
            onChange={e => {
              setPeriod(e.target.value);
            }}
            value={period}
          />
        </div>
      </div>
    </div>
  );
}
