// components/stock-dialog.tsx
'use client';
import { IProduct } from '@/src/types';
import { useEffect, useState } from 'react';
import { getProductByProductCode } from 'requests/product.api';
import { getTotalStock } from 'src/utils';

export default function StockDialog({
  open = false,
  productCode = '',
  onClose = () => {},
}: {
  open?: boolean;
  productCode: string | null;
  onClose?: () => void;
}) {
  const [product, setProduct] = useState<IProduct | null>(null);
  const modalClass = open ? 'modal modal-open' : 'modal';

  useEffect(() => {
    if (!productCode) return;

    const fetchProduct = async () => {
      const data = await getProductByProductCode(productCode);
      setProduct(data);
    };

    fetchProduct();
  }, [productCode]);

  return (
    <dialog className={modalClass}>
      <div className='modal-box text-center max-w-[46rem]'>
        <h3 className='font-bold text-lg'>총 재고 {product?.productCode}</h3>
        {product && (
          <div>
            <h2 className='font-semibold text-2xl'>{product.patternKr}</h2>
            <h3>
              {product.size} {product.special} {product.marking}{' '}
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
              {product.storages.map(storage => (
                <div>
                  <div
                    className='flex justify-between items-center'
                    key={`${productCode}-${storage.name}`}
                  >
                    <span className='font-medium'>{storage.name}</span>
                    <span className='text-blue-500'>{storage.stock}</span>
                  </div>
                  <div className='text-right'>
                    {storage.dot.map(dot => {
                      return <div>{dot}</div>;
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-4'>
              총 재고량: <strong>{getTotalStock(product.storages)}</strong>
            </div>
          </div>
        )}
        <div className='modal-action w-full mt-6 sticky bottom-0'>
          <button className='btn btn-primary flex-1' onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </dialog>
  );
}
