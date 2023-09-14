'use client';
import { useEffect, useState } from 'react';
import ProductCard from './product-card';
import axios from 'axios';
import { BrandType, IProduct, SeasonType } from '@/src/types';

export default function ProductCardDashboard__V2({
  brand,
  season,
  onlySpecialDiscount,
  perPage,
}: {
  brand: BrandType;
  season: SeasonType | '';
  onlySpecialDiscount: boolean;
  perPage: number;
}) {
  // NOTE: 일반 상품
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);

  const [maxPage, setMaxPage] = useState(0);

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
          `/api/product?${new URLSearchParams({
            page: page.toString(),
            perPage: perPage.toString(),
            brand,
            season,
            onlySpecialDiscount: onlySpecialDiscount.toString(),
          }).toString()}`
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
    <div>
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
