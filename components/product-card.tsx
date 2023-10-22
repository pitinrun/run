'use client';
import { IProduct } from '@/src/types';
import {
  convertNumberToKRW,
  convertNumberToPercent,
  getDiscountedPrice,
  getTotalStock,
  roundUpToHundred,
} from '@/src/utils';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

function DividerHorizon() {
  return (
    <span className='mx-2 w-px border-r border-solid border-black border-neutral-800 h-4' />
  );
}

const displaySeasonMap = {
  summer: '여름용',
  winter: '겨울용',
  'all-weathers': '사계절용',
  ERROR: '-',
};

type ProductCardProps = {
  defaultQuantity?: number;
  defaultDiscountRate?: number;
  onRoundUpToHundred?: boolean;
  onChangeQuantity?: (productCode: string, quantity: number) => void;
  onChangeDiscountRate?: (productCode: string, discountRate: number) => void;
  onRemoveWishlistClick?: (productCode: string) => void;
  onPurchaseClick?: ({
    productCode,
    quantity,
    discountRate,
  }: {
    productCode: string;
    quantity: number;
    discountRate: number;
  }) => void;
  onStockClick?: (productCode: string) => void;
} & IProduct;

export default function ProductCard({
  brand,
  pattern,
  patternKr,
  size,
  speedSymbolLoadIndex,
  marking,
  origin,
  season,
  special,
  etc,
  factoryPrice,
  specialDiscountRate,
  storages,
  productCode,
  defaultQuantity,
  defaultDiscountRate,
  onRoundUpToHundred = false,
  onChangeDiscountRate,
  onChangeQuantity,
  onPurchaseClick,
  onRemoveWishlistClick,
  onStockClick,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState<number | null>(defaultQuantity ?? 0);
  const [discountRate, setDiscountRate] = useState<number | null>(
    Math.round((specialDiscountRate ?? defaultDiscountRate ?? 0) * 100) || 0
  );
  const { data: session, status } = useSession();
  const { role, id } = session?.user ?? {};

  const handlePurchaseClick = () => {
    onPurchaseClick &&
      onPurchaseClick({
        productCode,
        quantity: quantity ?? 0,
        discountRate: discountRate ?? 0,
      });
  };

  const handleStockClick = () => {
    if (role && role >= 9) {
      onStockClick && onStockClick(productCode);
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: null | number = parseInt(event.target.value, 10);
    // NOTE: NaN이거나 1보다 작으면, null로 설정합니다.
    if (!value || value < 1) value = null;

    setQuantity(value);
    onChangeQuantity && onChangeQuantity(productCode, value ?? 1);
  };

  const handleDiscountRateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value: null | number = parseInt(event.target.value, 10);
    if (value < 0 || value > 100 || !value) value = null;

    setDiscountRate(value);
    onChangeDiscountRate && onChangeDiscountRate(productCode, value ?? 0);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const totalFactoryPrice = convertNumberToKRW(
    Math.round(
      onRoundUpToHundred
        ? roundUpToHundred(factoryPrice)
        : factoryPrice * (quantity ?? 1)
    )
  );

  const totalFactoryPriceWithDiscount = convertNumberToKRW(
    Math.round(
      onRoundUpToHundred
        ? roundUpToHundred(
            getDiscountedPrice(
              factoryPrice,
              (discountRate ?? 0) / 100,
              quantity ?? 1
            )
          )
        : getDiscountedPrice(
            factoryPrice,
            (discountRate ?? 0) / 100,
            quantity ?? 1
          )
    )
  );

  return (
    <div className='card border border-solid border-neutral-200'>
      <div
        className={`flex justify-between text-white items-center px-2 sm:px-4 py-2 rounded-t-lg ${
          specialDiscountRate ? 'bg-[var(--run-red-2)]' : 'bg-neutral-500'
        }`}
      >
        {/* TOP */}
        <div className='flex-1'>
          <div className='card-title mb-1 text-base sm:text-2xl'>
            <span>{patternKr}</span>
          </div>
          <div className=''>
            <span className='badge badge-sm sm:badge-md badge-warning mr-1'>
              {brand}
            </span>
            {season && (
              <span className='badge badge-sm sm:badge-md badge-success mr-1'>
                {displaySeasonMap[season]}
              </span>
            )}
            {special && (
              <span className='badge badge-sm sm:badge-md badge-info mr-1'>
                {special}
              </span>
            )}
          </div>
        </div>
        <button
          className='btn-sm px-8 border-solid border border-white rounded btn-sm sm:btn-md'
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
          onClick={handleStockClick}
        >
          총 재고 {getTotalStock(storages)}
        </button>
      </div>
      {/* BODY TOP */}
      <div className='card-body px-4 py-2 text-xs sm:text-sm'>
        <span className='font-bold'>{pattern}</span>
        <div className='flex items-center'>
          <span
            className=''
            style={{
              color: 'var(--run-red-2)',
            }}
          >
            {size}
          </span>
          <DividerHorizon />
          <span className=''>{speedSymbolLoadIndex}</span>
          {origin && (
            <>
              <DividerHorizon />
              <span className=''>{origin}</span>
            </>
          )}
          {marking && (
            <>
              <DividerHorizon />
              <span className=''>{marking}</span>
            </>
          )}
          {etc && (
            <>
              <DividerHorizon />
              <span className=''>{etc}</span>
            </>
          )}
        </div>
      </div>
      <div className='divider my-0' />
      {/* BODY BOTTOM */}
      <div className='card-body px-4 py-2 text-xs sm:text-sm flex-row flex justify-between items-center'>
        <div className='font-semibold'>
          <span className='text-xs sm:text-sm mr-2'>매입가</span>
          <br className='sm:hidden' />
          <span className='text-lg sm:text-3xl relative'>
            {discountRate ? (
              <>
                {totalFactoryPriceWithDiscount}원
                <del className='absolute right-[-1.5rem] sm:right-0 text-sm sm:text-base text-neutral-400 font-normal bottom-[1.5rem] sm:bottom-[2rem]'>
                  {totalFactoryPrice}원
                </del>
              </>
            ) : (
              <>{totalFactoryPrice}원</>
            )}
          </span>
        </div>
        <div>
          <div className='flex items-center mb-2'>
            <label className='w-12'>수량</label>
            <input
              type='number'
              className='input input-xs input-bordered w-full mx-2 text-right'
              value={quantity ?? ''}
              onChange={handleQuantityChange}
              onFocus={handleFocus}
              style={{
                maxWidth: '5rem',
              }}
              placeholder='1'
              min={1}
            />
            <span>개</span>
          </div>
          <div className='flex items-center'>
            <label className='w-12'>할인율</label>
            <input
              type='number'
              className={`input input-xs input-bordered w-full mx-2 text-right`}
              value={discountRate ?? ''}
              onChange={handleDiscountRateChange}
              onFocus={handleFocus}
              disabled={!!specialDiscountRate}
              style={{
                maxWidth: '5rem',
              }}
              placeholder='0'
              min={0}
              max={100}
            />
            <span>%</span>
          </div>
          {onPurchaseClick && (
            <div>
              <button
                className='btn btn-sm btn-neutral w-full mt-4'
                onClick={handlePurchaseClick}
              >
                구매하기
              </button>
            </div>
          )}
          {onRemoveWishlistClick && (
            <div>
              <button
                className='btn btn-sm btn-neutral w-full mt-4'
                onClick={() => onRemoveWishlistClick(productCode)}
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
