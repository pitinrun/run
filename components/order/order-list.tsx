'use client';

import { getOrdersRequest } from '@/app/requests/order';
import { IOrder, IProduct } from '@/src/types';
import {
  PencilIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';

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

type OrderCardProps = Omit<IOrder, 'products'> & {
  products: IProduct[];
};

// type OrderCardProps = IOrder;

function OrderCard({ createdAt, status, products }: OrderCardProps) {
  return (
    <div className='card w-full border border-solid border-neutral-200'>
      <div className='card-header bg-gray-200 flex flex-row items-center justify-between px-8 py-4'>
        <div className='flex items-center gap-4 rounded-t-lg'>
          <h6 className='text-xl font-semibold'>{'2023-07-09'}</h6>
          <div className='badge badge-lg'>{'주문 확인중'}</div>
        </div>
        <div>
          <button className='btn btn-sm btn-outline mr-4'>
            <TrashIcon className='w-5 h-5' />
          </button>
          <button className='btn btn-sm btn-outline'>
            <PencilSquareIcon className='w-5 h-5' />
          </button>
        </div>
      </div>
      <div className='card-body p-0'>
        <div className='px-8 py-3 flex flex-row justify-between border-b border-solid border-neutral-200'>
          <div className='sm:flex items-center text-neutral-400 font-semibold'>
            <div className='mr-5 sm:text-xl font-semibold text-run-red-1'>
              {'프라이머시 투어 AS'}
            </div>
            <span className='mx-5'>{'미쉐린'}</span>
            <span className='mx-5'>{'305/30ZR20'}</span>
            <span className='mx-5'>{'GOE'}</span>
          </div>
          <div className='flex items-center sm:text-xl font-semibold gap-10'>
            <div>{100}개</div>
            <div>{20}%</div>
            <div>{'1,000,000'}원</div>
          </div>
        </div>
        {/* 하단은 지워도 됨 */}
        <div className='px-8 py-3 flex flex-row justify-between border-b border-solid border-neutral-200'>
          <div className='sm:flex items-center text-neutral-400 font-semibold'>
            <div className='mr-5 sm:text-xl font-semibold text-run-red-1'>
              {'프라이머시 투어 AS'}
            </div>
            <span className='mx-5'>{'미쉐린'}</span>
            <span className='mx-5'>{'305/30ZR20'}</span>
            <span className='mx-5'>{'GOE'}</span>
          </div>
          <div className='flex items-center sm:text-xl font-semibold gap-10'>
            <div>{100}개</div>
            <div>{20}%</div>
            <div>{'1,000,000'}원</div>
          </div>
        </div>
        {/* :END */}
      </div>
      <div className='card-body px-8 py-4'>
        <div className='flex justify-end items-center'>
          <div>
            <span className='mr-8'>
              <span className='mr-2 text-neutral-400'>총 수량</span>
              <span className='font-semibold text-xl'>{40}</span>
            </span>
            <span>
              <span className='mr-2 text-neutral-400'>매입가</span>
              <span className='font-semibold text-xl'>{'15,000,000'}원</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderList() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filterStatus, setFilterStatus] = useState<IOrder['status'] | null>(
    null
  );
  const [filterPeriod, setFilterPeriod] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    const fetchOrders = async () => {
      const reqOrderParams = {};
      if (filterStatus !== null && filterStatus !== ORDER_STATUSES[0].value)
        reqOrderParams['orderStatus'] = filterStatus;
      if (filterPeriod) reqOrderParams['period'] = filterPeriod;

      const ordersData = await getOrdersRequest(reqOrderParams);

      console.log('$$ ordersData', ordersData);
    };

    fetchOrders();
  }, [filterStatus, filterPeriod]);

  return (
    <div>
      <div className='mb-4 flex gap-4'>
        <div>
          <h6 className='mb-2'>주문 상태</h6>
          <select
            className='select select-bordered w-full max-w-xs select-xs sm:select-md'
            style={{
              minWidth: '6rem',
            }}
            value={filterStatus ?? ORDER_STATUSES[0].value}
            onChange={e => {
              setFilterStatus(Number(e.target.value) as IOrder['status']);
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
                setFilterPeriod(e.target.value);
              }}
              value={filterPeriod}
            />
          </div>
        </div>
      </div>
      <div>{/* <OrderCard /> */}</div>
    </div>
  );
}