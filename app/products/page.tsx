'use client';

import { BRANDS, IProduct } from '@/src/models/product';
import axios from 'axios';
import NoticeList from 'components/notice-list';
import ProductCardDashboard from 'components/product-card-dashboard';
import ProductSearchBar from 'components/product-search-bar';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const PER_PAGE = 10;

const SeasonFilter = ({ season, setSeason }) => {
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
          checked={season === item.value}
        />
      ))}
    </div>
  );
};

export default function ProductPage() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  // const [total, setTotal] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [onlySpecialDiscount, setOnlySpecialDiscount] = useState(
    searchParams.get('onlySpecialDiscount') || false
  );
  const [season, setSeason] = useState(searchParams.get('season') || '');

  useEffect(() => {
    // Replace with your actual API endpoint
    setProducts([]);
    setPage(1);
  }, [season, onlySpecialDiscount, brand]);

  useEffect(() => {
    let isMounted = true; // 이 플래그로 컴포넌트가 마운트 상태인지 확인

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/product?page=${page}&perPage=${PER_PAGE}
          ${brand ? `&brand=${brand}` : ''}
          ${season ? `&season=${season}` : ''}`
        );

        if (isMounted) {
          setProducts(prevProducts => [
            ...prevProducts,
            ...response.data.products,
          ]);
          setMaxPage(response.data.pagination.pages);
        }
      } catch (error) {
        if (isMounted) {
          console.error('There was an error fetching data', error);
        }
      }
    };

    fetchData(); // 아니면, 기존 로직대로 fetchData를 호출합니다.

    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 플래그를 false로 설정
    };
  }, [page, brand, season, onlySpecialDiscount]);

  return (
    <div className='container'>
      <div className='sm:flex sm:gap-4'>
        <ProductSearchBar className='mb-12 ml-0 flex-1' />
        <SeasonFilter season={season} setSeason={setSeason} />
      </div>

      <ProductCardDashboard products={products} />
      {page < maxPage && (
        <button
          className='btn btn-outline w-full btn-ghost btn-block text-2xl my-4'
          onClick={() => setPage(page + 1)}
        >
          + 더보기
        </button>
      )}
    </div>
  );
}
