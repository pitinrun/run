'use client';

import { BRANDS, BrandType, IProduct, SeasonType } from '@/src/types';
import ProductCardDashboard__V2 from 'components/product-card-dashboard-v2';
import BrandFilter from '@/app/products/components/brand-filter';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

const PER_PAGE = 10;

function SizeSearchBar({
  className = '',
  value = '',
  setValue,
}: {
  className?: string;
  value?: string;
  setValue?: (value: string) => void;
}) {
  const [inputValue, setInputValue] = useState(value || '');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setValue && setValue(inputValue);
    }
  };

  const handleClickButton = () => {
    setValue && setValue(inputValue);
  };


  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <div
      className={`max-w-3xl w-full flex border border-solid border-current rounded-lg py-2 px-4 ${className}`}
    >
      <input
        type='text'
        placeholder='2454518'
        className='input-bordered flex-1'
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        value={inputValue}
        onChange={e => {
          setInputValue(e.target.value);
        }}
      />
      <button className='btn-ghost' onClick={handleClickButton}>
        <MagnifyingGlassIcon className='w-8 h-8' />
      </button>
    </div>
  );
}

const SeasonFilter = ({
  season: selectedSeason,
  setSeason,
  className,
}: {
  season: SeasonType;
  setSeason: (season: SeasonType) => void;
  className?: string;
}) => {
  // console.log('$$ season', selectedSeason);
  const seasons = [
    {
      label: '전체',
      value: '',
    },
    {
      label: '사계절용',
      value: 'all-weathers',
    },
    {
      label: '겨울',
      value: 'winter',
    },
    {
      label: '여름',
      value: 'summer',
    },
  ];
  return (
    <div className={'join w-full sm:w-auto ' + className}>
      {seasons.map((item, index) => {
        // console.log('$$ selectedSeason item.value', selectedSeason, item.value);
        return (
          <input
            className='join-item btn btn-sm sm:btn-md sm:flex-inherit flex-1 sm:flex-none'
            type='radio'
            name='options'
            aria-label={item.label}
            key={index}
            onChange={() => setSeason(item.value as SeasonType)}
            checked={selectedSeason === item.value}
          />
        );
      })}
    </div>
  );
};

function ProductDashboard({
  selectedBrands,
  season,
  sizeSearchKeyword,
}: {
  selectedBrands: BrandType[];
  season: SeasonType;
  sizeSearchKeyword: string;
}) {
  return (
    <div>
      <h2 className='text-lg sm:text-2xl font-bold mb-2'>특가 상품</h2>
      <ProductCardDashboard__V2
        selectedBrands={selectedBrands}
        season={season}
        onlySpecialDiscount={true}
        sizeSearchKeyword={sizeSearchKeyword}
        perPage={PER_PAGE}
      />
      <h2 className='text-lg sm:text-2xl font-bold my-2'>상품</h2>
      <ProductCardDashboard__V2
        selectedBrands={selectedBrands}
        season={season as any as SeasonType}
        onlySpecialDiscount={false}
        sizeSearchKeyword={sizeSearchKeyword}
        perPage={PER_PAGE}
      />
    </div>
  );
}

export default function ProductPage() {
  const searchParams = useSearchParams();
  const route = useRouter();
  const pathname = usePathname();

  const initialBrand = searchParams.get('brands')
    ? ((searchParams.get('brands') || '').split(',') as BrandType[])
    : [];

  const [selectedBrands, setSelectedBrands] =
    useState<BrandType[]>(initialBrand);

  const [season, setSeason] = useState(searchParams.get('season') || '');
  const [sizeSearchKeyword, setSizeSearchKeyword] = useState(
    searchParams.get('sizeSearchKeyword') || ''
  );
  const [sizeSearchKeyword2, setSizeSearchKeyword2] = useState(
    searchParams.get('sizeSearchKeyword') || ''
  );

  useEffect(() => {
    const updatedParams = new URLSearchParams({
      brands: selectedBrands.join(','),
      season,
      sizeSearchKeyword,
    });

    route.replace(`${pathname}?${updatedParams.toString()}`, { scroll: false });
  }, [season, selectedBrands, sizeSearchKeyword]);

  return (
    <div className='container'>
      <div className='sm:flex sm:gap-4'>
        <SizeSearchBar
          className='mb-4 sm:mb-0 ml-0 sm:flex-1'
          value={sizeSearchKeyword}
          setValue={setSizeSearchKeyword}
        />
        <SeasonFilter
          season={season as SeasonType}
          setSeason={setSeason}
          className='mb-2 sm:mb-0 sm:mb-0'
        />
      </div>
      <BrandFilter
        brands={BRANDS as any as BrandType[]}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        className='mb-2 sm:my-2'
      />
      <ProductDashboard
        selectedBrands={selectedBrands}
        season={season as any as SeasonType}
        sizeSearchKeyword={sizeSearchKeyword}
      />
      <div className='divider' />
      <h6 className='text-3xl	font-bold text-center my-2'>
        <span
          style={{
            color: 'var(--run-red-1)',
          }}
        >
          후륜타이어 사이즈
        </span>{' '}
        검색
      </h6>
      <SizeSearchBar
        className='my-2 ml-0 sm:flex-1'
        value={sizeSearchKeyword2}
        setValue={setSizeSearchKeyword2}
      />
      <ProductDashboard
        selectedBrands={selectedBrands}
        season={season as any as SeasonType}
        sizeSearchKeyword={sizeSearchKeyword2}
      />
    </div>
  );
}
