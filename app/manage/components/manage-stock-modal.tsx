// app/manage/components/manage-stock-modal.tsx
import { useContext, useEffect, useState } from 'react';
import { OrderModalContext } from '../contexts/order-modal.context';
import {
  convertNumberToKRW,
  getDiscountedPrice,
  roundUpToHundred,
} from '@/src/utils';

export default function ManageStockModal({
  open = false,
  onConfirm = () => {},
  onClose = () => {},
}: {
  open?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
}) {
  const modalClass = open ? 'modal modal-open' : 'modal';

  const { userData, products } = useContext(OrderModalContext);
  const [enteredQuantities, setEnteredQuantities] = useState({});
  const [productQuantities, setProductQuantities] = useState({});
  const [productPrices, setProductPrices] = useState({});
  const [productDiscountRates, setProductDiscountRates] = useState({});

  const handleInputChange = (key, value) => {
    setEnteredQuantities(prev => {
      const newQuantities = { ...prev, [key]: value };
      // 상품 코드 추출
      const productCode = key.split('-')[0];
      // 해당 상품에 대한 수량 합계 및 금액 계산
      if (!products) return;

      const product = products.find(p => p.productCode === productCode);
      const totalForProduct = Object.entries(newQuantities).reduce(
        (sum, [k, v]) => {
          if (k.startsWith(productCode)) sum += Number(v);
          return sum;
        },
        0
      );
      const priceForProduct =
        totalForProduct *
        (product?.factoryPrice || 0) *
        (1 - (product?.discountRate || 0));

      // productQuantities 및 productPrices 업데이트
      setProductQuantities(prev => ({
        ...prev,
        [productCode]: totalForProduct,
      }));
      setProductPrices(prev => ({
        ...prev,
        [productCode]: priceForProduct,
      }));
      return newQuantities;
    });
  };

  const handleDiscountChange = (productCode, discountRate) => {
    setProductDiscountRates(prev => ({
      ...prev,
      [productCode]: discountRate,
    }));
  };

  useEffect(() => {
    if (!products) return;
    const initialQuantities = products.reduce((acc, product) => {
      acc[product.productCode] = 0;
      return acc;
    }, {});
    setEnteredQuantities(initialQuantities);
  }, [products]);

  // const totalQuantity = Object.values(enteredQuantities).reduce<number>(
  //   (sum, value) => sum + Number(value),
  //   0
  // );

  // const totalPrice =
  //   products &&
  //   products.reduce((sum, product) => {
  //     return (
  //       sum +
  //       product.storages.reduce((subSum, storage) => {
  //         const key = `${product.productCode}-${storage.name}`;
  //         const quantity = enteredQuantities[key] || 0;
  //         return subSum + quantity * product.factoryPrice;
  //       }, 0)
  //     );
  //   }, 0);

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
            const discountRate =
              productDiscountRates[product.productCode] ||
              // product.discountRate ||
              0;

            const quantity = productQuantities[product.productCode] || 0;

            const totalPrice = roundUpToHundred(
              getDiscountedPrice(
                product.factoryPrice,
                discountRate / 100,
                quantity
              )
            );

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
                    const key = `${product.productCode}-${storage.name}`;
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
                              handleInputChange(key, e.target.value)
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
                    value={discountRate <= 0 ? '' : discountRate}
                    onChange={e =>
                      handleDiscountChange(product.productCode, e.target.value)
                    }
                  />
                  {' %'}
                  <span className='text-neutral-500 ml-4 mr-2 font-semibold'>
                    수량
                  </span>
                  <span className='text-neutral-700 ml-4 mr-2 text-run-red-1 sm:text-xl font-semibold'>
                    {quantity}
                  </span>
                  <span>{'/'}</span>
                  <span className='text-neutral-700 ml-4 mr-2 text-neutral-900 sm:text-xl font-semibold'>
                    {product.quantity}
                  </span>
                  <span className='text-neutral-500 ml-4 mr-2 font-semibold'>
                    금액
                  </span>
                  <span className='text-neutral-700 ml-4 mr-2 text-neutral-900 sm:text-xl font-semibold'>
                    {convertNumberToKRW(totalPrice)} 원
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
          <button className='btn flex-1 btn-primary' onClick={onConfirm}>
            접수
          </button>
          {/* </form> */}
        </div>
      </div>
    </dialog>
  );
}
