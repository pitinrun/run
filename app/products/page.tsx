'use client';

import { IProduct } from '@/src/models/product';
import axios from 'axios';
import NoticeList from 'components/notice-list';
import ProductCardDashboard from 'components/product-card-dashboard';
import ProductSearchBar from 'components/product-search-bar';
import { useEffect, useState } from 'react';

const PER_PAGE = 10;

export default function ProductPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [brand, setBrand] = useState('');

  useEffect(() => {
    // Replace with your actual API endpoint
    axios
      .get(`/api/product?page=${page}&perPage=${PER_PAGE}`)
      .then(response => {
        setProducts([...products, ...response.data.products]);
        setTotal(response.data.pagination.total);
        setMaxPage(response.data.pagination.pages);
      })
      .catch(error => {
        console.error('There was an error fetching data', error);
      });
  }, [page, brand]);

  return (
    <div className='container'>
      <ProductSearchBar className='mb-12 ml-0' />
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
