'use client';

import { BRANDS, BrandType, IProduct, SeasonType } from '@/src/types';
import axios from 'axios';
import ProductCardDashboard from 'components/product-card-dashboard';
import ProductCardDashboard__V2 from 'components/product-card-dashboard-v2';
import ProductSearchBar from 'components/product-search-bar';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const PER_PAGE = 10;

function BrandFilter({
  brands,
  selectedBrand,
  setBrand,
}: {
  brands: BrandType[];
  selectedBrand: BrandType;
  setBrand: (brand: BrandType) => void;
}) {
  return (
    <div>
      {brands.map((item, index) => (
        <button
          className={`btn ${
            selectedBrand === item ? 'btn-primary' : 'btn-ghost'
          }`}
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

const SeasonFilter = ({ season: selectedSeason, setSeason }) => {
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
    <div className='join'>
      {seasons.map((item, index) => (
        <input
          className='join-item btn'
          type='radio'
          name='options'
          aria-label={item.label}
          key={index}
          onClick={() => setSeason(item.value)}
          checked={selectedSeason === item.value}
        />
      ))}
    </div>
  );
};

export default function ProductPage() {
  const searchParams = useSearchParams();
  const route = useRouter();
  const pathname = usePathname();

  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [onlySpecialDiscount, setOnlySpecialDiscount] = useState(
    (searchParams.get('onlySpecialDiscount') as unknown as boolean) || false
  );
  const [season, setSeason] = useState(searchParams.get('season') || '');

  useEffect(() => {
    route.replace(
      `${pathname}?${new URLSearchParams({
        brand,
        season,
        onlySpecialDiscount: onlySpecialDiscount.toString(),
      }).toString()}`,
      { scroll: false }
    );
  }, [season, onlySpecialDiscount, brand]);

  return (
    <div className='container'>
      <div className='sm:flex sm:gap-4'>
        <ProductSearchBar className='mb-4 ml-0 flex-1' />
        <SeasonFilter season={season} setSeason={setSeason} />
      </div>
      <BrandFilter
        brands={BRANDS as any as BrandType[]}
        selectedBrand={brand as any as BrandType}
        setBrand={setBrand}
      />

      <div>
        <h2 className='text-xl sm:text-3xl font-bold'>특가 상품</h2>
        <ProductCardDashboard__V2
          brand={brand as any as BrandType}
          season={season as any as SeasonType}
          onlySpecialDiscount={onlySpecialDiscount}
          perPage={PER_PAGE}
        />
      </div>
    </div>
  );
}
