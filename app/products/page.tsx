'use client';

import { BRANDS, BrandType, IProduct, SeasonType } from '@/src/types';
import ProductCardDashboard__V2 from 'components/product-card-dashboard-v2';
import ProductSearchBar from 'components/product-search-bar';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const PER_PAGE = 10;

function BrandFilter({
  brands,
  selectedBrand,
  setBrand,
  className,
}: {
  brands: BrandType[];
  selectedBrand: BrandType;
  setBrand: (brand: BrandType) => void;
  className?: string;
}) {
  return (
    <div>
      {brands.map((item, index) => (
        <button
          className={`btn btn-sm sm:btn-md ${
            selectedBrand === item ? 'btn-primary' : 'btn-ghost'
          } ${className}`}
          name='options'
          aria-label={item}
          key={index}
          onClick={() => setBrand(item)}
        >
          {item || '전체'}
        </button>
      ))}
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
      {seasons.map((item, index) => (
        <input
          className='join-item btn btn-sm sm:btn-md sm:flex-inherit flex-1 sm:flex-none'
          type='radio'
          name='options'
          aria-label={item.label}
          key={index}
          onClick={() => setSeason(item.value as SeasonType)}
          checked={selectedSeason === item.value}
        />
      ))}
    </div>
  );
};

function ProductDashboard({
  brand,
  season,
  sizeSearchKeyword,
}: {
  brand: BrandType;
  season: SeasonType;
  sizeSearchKeyword: string;
}) {
  return (
    <div>
      <h2 className='text-lg sm:text-2xl font-bold mb-2'>특가 상품</h2>
      <ProductCardDashboard__V2
        brand={brand}
        season={season}
        onlySpecialDiscount={true}
        sizeSearchKeyword={sizeSearchKeyword}
        perPage={PER_PAGE}
      />
      <h2 className='text-lg sm:text-2xl font-bold my-2'>상품</h2>
      <ProductCardDashboard__V2
        brand={brand as any as BrandType}
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

  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [season, setSeason] = useState(searchParams.get('season') || '');
  const [sizeSearchKeyword, setSizeSearchKeyword] = useState(
    searchParams.get('sizeSearchKeyword') || ''
  );
  const [sizeSearchKeyword2, setSizeSearchKeyword2] = useState(
    searchParams.get('sizeSearchKeyword') || ''
  );

  useEffect(() => {
    route.replace(
      `${pathname}?${new URLSearchParams({
        brand,
        season,
        sizeSearchKeyword,
      }).toString()}`,
      { scroll: false }
    );
  }, [season, brand, sizeSearchKeyword]);

  return (
    <div className='container'>
      <div className='sm:flex sm:gap-4'>
        <ProductSearchBar
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
        selectedBrand={brand as any as BrandType}
        setBrand={setBrand}
        className='mb-2 sm:my-2'
      />

      <ProductDashboard
        brand={brand as any as BrandType}
        season={season as any as SeasonType}
        sizeSearchKeyword={sizeSearchKeyword}
      />

      <ProductSearchBar
        className='my-2 ml-0 sm:flex-1'
        value={sizeSearchKeyword2}
        setValue={setSizeSearchKeyword2}
      />
      <ProductDashboard
        brand={brand as any as BrandType}
        season={season as any as SeasonType}
        sizeSearchKeyword={sizeSearchKeyword2}
      />
    </div>
  );
}
