'use client';

import {
  GetOrdersDataType,
  deleteOrderRequest,
  getOrdersRequest,
} from 'requests/order';
import { IOrder } from '@/src/types';
import { convertNumberToKRW, getDiscountedPrice } from '@/src/utils';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { isAxiosError } from 'axios';
import ConfirmDialog from 'components/common/confirm-dialog';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';

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

type OrderCardProps = GetOrdersDataType & {
  onClickRemove?: () => void;
  onClickEdit?: () => void;
};
function OrderCard({
  createdAt,
  status,
  products,
  onClickRemove,
  _id,
  onClickEdit,
}: OrderCardProps) {
  const statusMap = {
    1: '주문 확인중',
    2: '배송 대기', // NOTE: deprecated
    3: '배송중',
    4: '배송완료',
  };

  const isWaiting = status === 1;

  return (
    <div className='card w-full border border-solid border-neutral-200 my-4'>
      <div className='card-header bg-gray-200 rounded-t-lg flex flex-row items-center justify-between px-4 py-2 lg:px-8 lg:py-4'>
        <div className='flex items-center gap-2 md:gap-4 rounded-t-lg'>
          <h6 className='text-base md:text-lg lg:text-xl font-semibold'>
            {createdAt.toLocaleDateString('ko')}
          </h6>
          <div className='badge badge-md md:badge-lg'>{statusMap[status]}</div>
        </div>
        {status === 1 && (
          <div>
            <button className='btn btn-xs md:btn-sm btn-outline mr-2 md:mr-4'>
              <TrashIcon
                className='w-4 h-4 md:w-5 md:h-5'
                onClick={onClickRemove}
              />
            </button>
            <Link href={`/order/edit/${_id}`}>
              <button className='btn btn-xs md:btn-sm btn-outline'>
                <PencilSquareIcon className='w-4 h-4 md:w-5 md:h-5' />
              </button>
            </Link>
          </div>
        )}
      </div>
      <div className='card-body p-0'>
        {products.map(product => {
          return (
            <div
              className='px-4 py-2 lg:px-8 lg:py-3 md:flex flex-row justify-between border-b border-solid border-neutral-200'
              key={`${createdAt}-${product.productCode}`}
            >
              <div className='block md:flex items-center text-neutral-400 font-semibold'>
                <div className='md:mr-5 text-sm md:text-lg lg:text-xl text-run-red-1'>
                  {product.patternKr}
                </div>
                <span className='text-xs md:text-sm lg:text-base md:mx-2 md:mx-5'>
                  {product.brand}
                </span>
                <span className='text-xs md:text-sm lg:text-base mx-2 md:mx-5'>
                  {product.size}
                </span>
                {product.marking && (
                  <span className='text-xs md:text-sm lg:text-base mx-2 md:mx-5'>
                    {product.marking}
                  </span>
                )}
                {product.speedSymbolLoadIndex && (
                  <span className='text-xs md:text-sm lg:text-base mx-2 md:mx-5'>
                    {product.speedSymbolLoadIndex}
                  </span>
                )}
              </div>
              <div className='flex justify-end items-center text-xs md:text-base lg:text-xl font-semibold gap-2 md:gap-10'>
                <div>{product.quantity}개</div>
                {!isWaiting && (
                  <>
                    <div>{Math.round(product.discountRate * 100)}%</div>
                    <div>
                      {convertNumberToKRW(
                        getDiscountedPrice(
                          product.factoryPrice,
                          product.discountRate,
                          product.quantity
                        )
                      )}
                      원
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className='card-body px-4 py-2 lg:px-8 lg:py-4'>
        <div className='flex justify-end items-center'>
          <div>
            <span className={!isWaiting ? 'mr-8' : ''}>
              <span className='mr-2 text-xs md:text-sm lg:text-base text-neutral-400'>
                총 수량
              </span>
              <span className='font-semibold text-base md:text-lg lg:text-xl'>
                {products.reduce((acc, cur) => acc + cur.quantity, 0)}개
              </span>
            </span>
            {!isWaiting && (
              <span>
                <span className='mr-2 text-xs md:text-sm lg:text-base text-neutral-400'>
                  매입가
                </span>
                <span className='font-semibold text-base md:text-lg lg:text-xl'>
                  {'15,000,000'}원
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

let targetRemoveOrder: string | null = null;

export default function OrderList({}) {
  const [orders, setOrders] = useState<GetOrdersDataType[]>([]);
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
