'use client';

import {
  ResponseGetOrders,
  deleteOrderRequest,
  getOrdersRequest,
} from 'requests/order.api';
import { IOrder } from '@/src/types';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ConfirmDialog from 'components/confirm-dialog';
import OrderCard from './order-card';

const ORDER_STATUSES = [
  {
    name: '전체',
    value: 0,
  },
  {
    name: '주문 확인중',
    value: 1,
  },
  // {
  //   name: '배송 대기',
  //   value: 2,
  // },
  {
    name: '배송중',
    value: 3,
  },
  {
    name: '배송완료',
    value: 4,
  },
];

let targetRemoveOrder: string | null = null;

export default function OrderList({}) {
  const [orders, setOrders] = useState<ResponseGetOrders[]>([]);
  const [filterStatus, setFilterStatus] = useState<IOrder['status'] | null>(
    null
  );
  const [filterPeriod, setFilterPeriod] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [openRemoveConfirm, setOpenRemoveConfirm] = useState(false);

  const fetchOrders = async () => {
    const reqOrderParams = {};
    if (filterStatus !== null && filterStatus !== ORDER_STATUSES[0].value)
      reqOrderParams['orderStatus'] = filterStatus;
    if (filterPeriod) reqOrderParams['period'] = filterPeriod;

    const ordersData = await getOrdersRequest(reqOrderParams);
    setOrders(ordersData);
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, filterPeriod]);

  const handleConfirmRemoveOrder = async () => {
    try {
      if (!targetRemoveOrder) return;
      await deleteOrderRequest(targetRemoveOrder);
      await fetchOrders();
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('!!ERROR: ', error.response?.data);
        toast.error(error.response?.data.message);
      }
    }
  };

  const handleRemoveOrder = (id: string) => {
    targetRemoveOrder = id;
    setOpenRemoveConfirm(true);
  };

  return (
    <div>
      <div className='mb-4 flex gap-4'>
        <div>
          <h6 className='mb-2'>주문 상태</h6>
          <select
            className='select select-bordered w-full max-w-xs select-xs md:select-md'
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
              className='input input-bordered w-full input-xs md:input-md'
              onChange={e => {
                setFilterPeriod(e.target.value);
              }}
              value={filterPeriod}
            />
          </div>
        </div>
      </div>
      <div>
        {orders.map(order => (
          <OrderCard
            key={`order-${order.createdAt}`}
            onClickRemove={() => {
              handleRemoveOrder(order._id);
            }}
            {...order}
          />
        ))}
      </div>
      <ConfirmDialog
        open={openRemoveConfirm}
        title='주문 삭제'
        onClose={() => {
          setOpenRemoveConfirm(false);
        }}
        onConfirm={() => {
          handleConfirmRemoveOrder();
          setOpenRemoveConfirm(false);
        }}
      >
        주문을 삭제하시겠습니까?
      </ConfirmDialog>
    </div>
  );
}
