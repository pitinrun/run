import { IProduct } from '@/src/models/product';
import { convertNumberToKRW, getTotalStock } from '@/src/utils';

function DividerHorizon() {
  return (
    <span className='mx-2 w-px border-r border-solid border-black border-neutral-800 h-4' />
  );
}

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
}: IProduct) {
  const displayPrice =
    (factoryPrice || 0) * (1 - (specialDiscountRate || 0) / 100);

  const displaySeasonMap = {
    summer: '여름용',
    winter: '겨울용',
    'all-weather': '사계절용',
  };

  return (
    <div className='card border border-solid border-neutral-200'>
      <div
        className='flex justify-between text-white items-center px-4 py-2 rounded-t-lg'
        style={{
          backgroundColor: 'var(--run-red-2)',
        }}
      >
        {/* TOP */}
        <div>
          <div className='card-title mb-1'>{patternKr}</div>
          <div className='flex gap-1'>
            {special && <span className='badge badge-primary'>{special}</span>}
            {season && (
              <span className='badge badge-secondary'>
                {displaySeasonMap[season]}
              </span>
            )}
            <span className='badge badge-ghost'>{brand}</span>
          </div>
        </div>
        <button
          className='btn-sm px-8 border-solid border border-white rounded'
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          총 재고 {getTotalStock(storages)}
        </button>
      </div>
      {/* BODY */}
      <div className='card-body px-4 py-2 text-sm'>
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
      <div className='card-body px-4 py-2 text-sm flex-row flex justify-between items-center'>
        <div className='font-semibold'>
          <span className='text-sm mr-2'>매입가</span>
          <span className='text-3xl relative'>
            {convertNumberToKRW(
              Math.round(
                (factoryPrice || 0) * (1 - (specialDiscountRate || 0) / 100)
              )
            )}
            원
            <del
              className='absolute right-0 text-base text-neutral-400 font-normal'
              style={{
                bottom: '2rem',
              }}
            >
              {
                convertNumberToKRW(
                  Math.round((factoryPrice || 0) * (1 - (0 || 0) / 100))
                ).split(' ')[0]
              }
              원
            </del>
          </span>
        </div>
        <div>
          <div className='flex items-center mb-2'>
            <label className='w-12'>수량</label>
            <input
              type='number'
              className='input input-xs input-bordered w-full mx-2 text-right'
              style={{
                maxWidth: '5rem',
              }}
              placeholder='0'
            />
            <span>개</span>
          </div>
          <div className='flex items-center'>
            <label className='w-12'>할인율</label>
            <input
              type='number'
              className={`input input-xs input-bordered w-full mx-2 text-right`}
              disabled={!!specialDiscountRate}
              value={
                specialDiscountRate ? Math.floor(specialDiscountRate * 100) : 0
              }
              style={{
                maxWidth: '5rem',
              }}
              placeholder='0'
            />
            <span>%</span>
          </div>
          <div>
            <button className='btn btn-sm btn-primary w-full mt-4'>
              구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
