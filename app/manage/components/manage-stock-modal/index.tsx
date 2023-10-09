// app/manage/components/manage-stock-modal.tsx
'use client';
import { useContext, useEffect, useState } from 'react';
import { OrderModalContext } from '../../contexts/order-modal.context';
import {
  convertNumberToKRW,
  getDiscountedPrice,
  roundUpToHundred,
} from '@/src/utils';
import { OrderInfoType, orderProduct } from './api';

export default function ManageStockModal({
  open = false,
  onClose = () => {},
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const modalClass = open ? 'modal modal-open' : 'modal';
  const { userData, products } = useContext(OrderModalContext);

  const [orderInfos, setOrderInfos] = useState<OrderInfoType>(
    Object.fromEntries(
      products?.map(product => [
        product.productCode,
        {
          discountRate: 0,
          totalQuantity: 0,
          totalFactoryPrice: 0,
          stocks: Object.fromEntries(
            product.storages.map(storage => [storage.name, 0])
          ),
        },
      ]) ?? []
    )
  );

  useEffect(() => {
    setOrderInfos(
      Object.fromEntries(
        products?.map(product => [
          product.productCode,
          {
            discountRate: 0,
            totalQuantity: 0,
            totalFactoryPrice: 0,
            stocks: Object.fromEntries(
              product.storages.map(storage => [storage.name, 0])
            ),
          },
        ]) ?? []
      )
    );
  }, [products]);

  const handleStockQuantityInputChange = (
    productCode: string,
    storageName: string,
    value: number
  ) => {
    setOrderInfos(prev => {
      const prevProductInfo = prev[productCode];
      const updatedStocks = {
        ...prevProductInfo.stocks,
        [storageName]: value,
      };
      const totalQuantity = Object.values(updatedStocks).reduce(
        (acc, cur) => acc + cur,
        0
      );

      const totalFactoryPrice =
        roundUpToHundred(
          products?.find(product => product.productCode === productCode)
            ?.factoryPrice!
        ) * totalQuantity;

      return {
        ...prev,
        [productCode]: {
          ...prevProductInfo,
          stocks: updatedStocks,
          totalQuantity,
          totalFactoryPrice,
        },
      };
    });
  };

  const handleDiscountChange = (productCode: string, value: string) => {
    const discount = parseFloat(value);
    setOrderInfos(prev => {
      const prevProductInfo = prev[productCode];
      return {
        ...prev,
        [productCode]: {
          ...prevProductInfo,
          discountRate: discount || 0,
        },
      };
    });
  };

  const handleClickOrder = () => {
    orderProduct(orderInfos);
  };

  const calculateTotalPrice = (productCode: string) => {
    const productInfo = orderInfos[productCode];
    const { totalFactoryPrice } = productInfo;

    return convertNumberToKRW(
      getDiscountedPrice(
        totalFactoryPrice,
        orderInfos[productCode].discountRate / 100
      )
    );
  };

  return (
    <dialog className={modalClass}>
      <div className='modal-box max-w-none'>
        <h3 className='font-bold text-lg mb-2'>주문 접수</h3>
        <h4 className='text-sm text-neutral-400'>
          {userData?.businessName} {userData?.businessAddress?.address}{' '}
          {userData?.businessAddressDetail}
        </h4>
        <div className='overflow-scroll'>
          {products?.map(product => {
            const productStockAndDiscount = orderInfos[product.productCode];
            const productInfo = orderInfos[product.productCode];
            if (!productInfo) return null;
            const totalQuantity = productInfo.totalQuantity;

            return (
              <div className='my-4 border-b py-4' key={product.productCode}>
                <div className='flex gap-4 lg:gap-8 items-center font-semibold'>
                  <h5 className='text-lg md:text-xl'>{product.patternKr}</h5>
                  <span className='text-sm sm:text-md text-neutral-400'>
                    공장가: {convertNumberToKRW(product.factoryPrice)} 원
                  </span>
                  <span className='text-sm sm:text-md text-neutral-400'>
                    {product.brand}
                  </span>
                  <span className='text-sm sm:text-md text-neutral-400'>
                    {product.size}
                  </span>
                  <span className='text-sm sm:text-md text-neutral-400'>
                    {product.marking}
                  </span>
                  <span className='text-sm sm:text-md text-neutral-400'>
                    주문 수량: {product.quantity}
                  </span>
                </div>
                <div className='flex gap-2 items-center font-semibold'>
                  {product.storages.map(storage => {
                    return (
                      <div key={`${product.productCode}-${storage.name}`}>
                        <div>
                          <span className='font-medium text-xs sm:text-sm mr-2'>
                            {storage.name}
                          </span>
                          <span className='font-semibold text-xs sm:text-sm text-run-red-1'>
                            {storage.stock}개
                          </span>
                        </div>
                        <div>
                          <input
                            min={0}
                            type='number'
                            className='input input-bordered w-[6rem]'
                            onChange={e =>
                              handleStockQuantityInputChange(
                                product.productCode,
                                storage.name,
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className='mt-2'>
                  <span className='text-neutral-500 mr-2'>할인율</span>
                  <input
                    type='number'
                    className='input input-bordered w-[6rem]'
                    value={
                      productStockAndDiscount.discountRate <= 0
                        ? ''
                        : productStockAndDiscount.discountRate
                    }
                    onChange={e =>
                      handleDiscountChange(product.productCode, e.target.value)
                    }
                  />
                  {' %'}
                  <span className='text-neutral-500 ml-4 mr-2 font-semibold'>
                    수량
                  </span>
                  <span className='text-neutral-700 ml-4 mr-2 text-run-red-1 sm:text-xl font-semibold'>
                    {totalQuantity}
                  </span>
                  <span>{'/'}</span>
                  <span className='text-neutral-700 ml-4 mr-2 text-neutral-900 sm:text-xl font-semibold'>
                    {product.quantity}
                  </span>
                  <span className='text-neutral-500 ml-4 mr-2 font-semibold'>
                    금액
                  </span>
                  <span className='text-neutral-700 ml-4 mr-2 text-neutral-900 sm:text-xl font-semibold'>
                    {calculateTotalPrice(product.productCode)} 원
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className='modal-action w-full'>
          {/* <form method='dialog flex w-full'> */}
          {/* if there is a button in form, it will close the modal */}
          <button className='btn flex-1' onClick={onClose}>
            닫기
          </button>
          <button className='btn flex-1 btn-primary' onClick={handleClickOrder}>
            접수
          </button>
          {/* </form> */}
        </div>
      </div>
    </dialog>
  );
}
