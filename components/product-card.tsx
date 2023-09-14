import { IProduct } from '@/src/types';
import { convertNumberToKRW, getTotalStock } from '@/src/utils';

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
            {special && (
              <span className='badge badge-sm sm:badge-md badge-primary mr-1'>
                {special}
              </span>
            )}
            {season && (
              <span className='badge badge-sm sm:badge-md badge-secondary mr-1'>
                {displaySeasonMap[season]}
              </span>
            )}
            <span className='badge badge-sm sm:badge-md badge-ghost mr-1'>
              {brand}
            </span>
          </div>
        </div>
        <button
          className='btn-sm px-8 border-solid border border-white rounded btn-sm sm:btn-md'
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
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
            {specialDiscountRate ? (
              <>
                {convertNumberToKRW(
                  Math.round(factoryPrice * (1 - specialDiscountRate))
                )}
                원
                <del className='absolute right-[-1.5rem] sm:right-0 text-sm sm:text-base text-neutral-400 font-normal bottom-[1.5rem] sm:bottom-[2rem]'>
                  {convertNumberToKRW(Math.round(factoryPrice)).split(' ')[0]}원
                </del>
              </>
            ) : (
              <>{convertNumberToKRW(Math.round(factoryPrice))}원</>
            )}
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
            <button className='btn btn-sm btn-neutral w-full mt-4'>
              구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
