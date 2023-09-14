'use client';
import { useEffect, useState } from 'react';
import ProductCard from './product-card';
import axios from 'axios';
import { BrandType, IProduct, SeasonType } from '@/src/types';

const EmptyProducts = () => (
  <div className='card border border-solid border-neutral-200'>
    <div className='card-body'>
      <div className='text-center text-neutral-600'>
        <div className='text-base sm:text-lg'>검색된 제품이 없습니다.</div>
        <div className='text-base sm:text-lg'>검색 조건을 확인해 주세요!</div>
      </div>
    </div>
  </div>
);

export default function ProductCardDashboard__V2({
  selectedBrands = [],
  season = '',
  onlySpecialDiscount = false,
  sizeSearchKeyword = '',
  perPage = 10,
}: {
  selectedBrands?: BrandType[];
  season?: SeasonType | '';
  onlySpecialDiscount?: boolean;
  sizeSearchKeyword?: string;
  perPage?: number;
}) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProducts([]);
    setPage(1);
  }, [season, onlySpecialDiscount, selectedBrands, sizeSearchKeyword]);

  useEffect(() => {
    let isMounted = true; // 이 플래그로 컴포넌트가 마운트 상태인지 확인

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/product?${new URLSearchParams({
            page: page.toString(),
            perPage: perPage.toString(),
            brands: selectedBrands.join(','),
            season,
            onlySpecialDiscount: onlySpecialDiscount.toString(),
            sizeSearchKeyword,
          }).toString()}`
        );

        if (isMounted) {
          setProducts(prevProducts => [
            ...prevProducts,
            ...response.data.products,
          ]);
          setMaxPage(response.data.pagination.pages);
        }

        setIsLoading(false);
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
  }, [page, season, onlySpecialDiscount, selectedBrands, sizeSearchKeyword]);

  if (isLoading && page === 1) {
    return (
      <div className='text-center'>
        <span className='loading loading-spinner loading-lg' />
      </div>
    );
  }

  return (
    <div>
      {!isLoading && products.length <= 0 && <EmptyProducts />}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
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
