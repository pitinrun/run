'use client';
import { useSearchParams } from 'next/navigation';
import NoticeList from 'components/notice-list';
import ProductCardDashboard from 'components/product-card-dashboard';
import ProductSearchBar from 'components/product-search-bar';
import { useEffect, useState } from 'react';
import { IProduct, SeasonType } from '@/src/models/product';
import axios from 'axios';

const PER_PAGE = 10;

export default function Home() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  // const [total, setTotal] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [brand, setBrand] = useState('');

  useEffect(() => {
    // Replace with your actual API endpoint
    axios
      .get(
        `/api/product?page=${page}&perPage=${PER_PAGE}&brand=${brand}&onlySpecialDiscount=true`
      )
      .then(response => {
        setProducts([...products, ...response.data.products]);
        // setTotal(response.data.pagination.total);
        setMaxPage(response.data.pagination.pages);
      })
      .catch(error => {
        console.error('There was an error fetching data', error);
      });
  }, [page, brand]);

  return (
    <div className='container'>
      <div className='mb-4'>
        <h2 className='text-3xl	font-bold text-center'>
          원하는{' '}
          <span
            style={{
              color: 'var(--run-red-1)',
            }}
          >
            사이즈
          </span>
          를 입력해주세요.
        </h2>
      </div>
      <ProductSearchBar className='mb-12' />
      <NoticeList />
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
