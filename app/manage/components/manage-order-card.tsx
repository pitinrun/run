// app/manage/components/manage-order-card.tsx
'use client';

import {
  convertNumberToKRW,
  getDiscountedPrice,
  roundUpToHundred,
} from '@/src/utils';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import dayjs from 'dayjs';
import { ResponseGetOrdersForManager } from 'requests/manage/order.api';
import { useContext } from 'react';
import { OrderModalContext } from '../contexts/order-modal.context';

type ManageOrderCardProps = ResponseGetOrdersForManager & {
  onClickRemove?: () => void;
  onClickEdit?: () => void;
};
export default function ManageOrderCard({
  createdAt,
  status,
  products,
  deliveredAt,
  deliveryStartedAt,
  deliveryInfo,
  onClickRemove,
  _id,
  userData,
  onClickEdit,
}: ManageOrderCardProps) {
  const { setProducts, setUserData, setOrderId, openModal } =
    useContext(OrderModalContext);

  const statusMap = {
    1: '주문 확인중',
    // 2: '배송 대기', // NOTE: deprecated
    3: '배송중',
    4: '배송완료',
  };

  const statusButtonTextMap = {
    1: '주문 접수',
    3: '배송 완료',
  };

  const isWaiting = status === 1;
  const isDelivering = status === 3;
  const isDelivered = status === 4;

  const orderLabelClasses = 'text-xs md:text-sm text-neutral-400';
  const orderValueClasses = 'text-xs md:text-base text-neutral-800';
  const orderBgColorMap = {
    1: 'bg-slate-100',
    3: 'bg-slate-300',
    4: 'bg-neutral-400',
  };

  const handleClickButton = async () => {
    setOrderId(_id);
    if (isWaiting) {
      setProducts(products);
      setUserData(userData);
      openModal('stock');
    } else if (isDelivering) {
      openModal('delivered');
    }
  };

  return (
    <div className='card w-full border border-solid border-neutral-200 my-4'>
      <div
        className={`card-header rounded-t-lg flex flex-row items-center justify-between px-4 py-2 lg:px-8 lg:py-4 ${orderBgColorMap[status]}`}
      >
        <div className='flex items-center gap-2 md:gap-4 rounded-t-lg'>
          <h6 className='text-base md:text-lg lg:text-xl font-semibold'>
            {userData.businessName}
          </h6>
          <div className='badge badge-md md:badge-lg'>{statusMap[status]}</div>
        </div>
        <div className='flex items-center'>
          {/* <button className='btn btn-xs md:btn-sm btn-outline mr-2 md:mr-4'>
            <TrashIcon
              className='w-4 h-4 md:w-5 md:h-5'
              onClick={onClickRemove}
            />
          </button> */}
          <button className='btn btn-xs md:btn-sm btn-outline mr-2 md:mr-4'>
            <TrashIcon
              className='w-4 h-4 md:w-5 md:h-5'
              onClick={onClickRemove}
            />
          </button>
          {!isDelivered && (
            <button
              className='btn btn-xs btn-neutral md:btn-sm'
              onClick={handleClickButton}
            >
              {statusButtonTextMap[status]}
            </button>
          )}
        </div>
      </div>
      <div className='card-body p-0'>
        <div className='px-4 py-2 lg:px-8 lg:py-3 md:flex flex-row justify-between border-b border-solid border-neutral-200'>
          <div className='grid gap-2 md:gap-4 grid-cols-12 font-semibold'>
            <div className='col-span-12 md:col-span-4 text-sm md:font-medium text-neutral-800'>
              <div>{userData.tel}</div>
              <div>
                {userData.businessAddress?.address}{' '}
                {userData.businessAddressDetail}
              </div>
            </div>
            <div className='col-span-3 md:col-span-2'>
              <div className={orderLabelClasses}>주문 일자</div>
              <div className={orderValueClasses}>
                {dayjs(createdAt).format('YY-MM-DD hh:mm')}
              </div>
            </div>
            <div className='col-span-3 md:col-span-2'>
              <div className={orderLabelClasses}>배송 시작일</div>
              <div className={orderValueClasses}>
                {deliveryStartedAt
                  ? dayjs(deliveryStartedAt).format('YY-MM-DD hh:mm')
                  : '-'}
              </div>
            </div>
            <div className='col-span-3 md:col-span-2'>
              <div className={orderLabelClasses}>배송 완료일</div>
              <div className={orderValueClasses}>
                {deliveredAt
                  ? dayjs(deliveredAt).format('YY-MM-DD hh:mm')
                  : '-'}
              </div>
            </div>
            <div className='col-span-3 md:col-span-2'>
              <div className={orderLabelClasses}>배송 정보</div>
              <div className={orderValueClasses}>{deliveryInfo || '-'}</div>
            </div>
          </div>
        </div>
      </div>
      <div className='card-body p-0'>
        {products.map(product => {
          return (
            <div
              className='px-4 py-2 lg:px-8 lg:py-3 md:flex flex-row justify-between border-b border-solid border-neutral-200'
              key={`${createdAt}-${product.productCode}`}
            >
              <div className='block md:flex items-center text-neutral-400 font-semibold'>
                <div
                  className={`md:mr-5 text-sm md:text-lg lg:text-xl ${
                    product.specialDiscountRate
                      ? 'text-run-red-1'
                      : 'text-neutral-800'
                  }`}
                >
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
                        roundUpToHundred(
                          getDiscountedPrice(
                            product.factoryPrice,
                            product.discountRate,
                            product.quantity
                          )
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
                  공장도가
                </span>
                <span className='font-semibold text-base md:text-lg lg:text-xl'>
                  {convertNumberToKRW(
                    products.reduce((acc, cur) => {
                      return (
                        acc +
                        roundUpToHundred(
                          getDiscountedPrice(
                            cur.factoryPrice,
                            cur.discountRate,
                            cur.quantity
                          )
                        )
                      );
                    }, 0)
                  )}{' '}
                  원
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
