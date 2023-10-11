import {
  convertNumberToKRW,
  getDiscountedPrice,
  getTotalStock,
  roundUpToHundred,
} from '@/src/utils';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { ResponseGetOrders } from 'requests/order.api';

type OrderCardProps = ResponseGetOrders & {
  onClickRemove?: () => void;
};
export default function OrderCard({
  createdAt,
  status,
  products,
  onClickRemove,
  _id,
}: OrderCardProps) {
  const statusMap = {
    1: '주문 확인중',
    2: '배송 대기', // NOTE: deprecated
    3: '배송중',
    4: '배송완료',
  };

  const isWaiting = status === 1;

  const totalQuantity = products.reduce((acc, cur) => acc + cur.quantity, 0);

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
                {totalQuantity}개
              </span>
            </span>
            {!isWaiting && (
              <span>
                <span className='mr-2 text-xs md:text-sm lg:text-base text-neutral-400'>
                  매입가
                </span>
                <span className='font-semibold text-base md:text-lg lg:text-xl'>
                  {/* {'15,000,000'}원 */}
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
                  ) + '원'}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
