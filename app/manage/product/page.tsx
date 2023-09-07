'use client';
import React, { useEffect, useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import ProductTable from 'components/product-table';

const BRANDS = [
  '',
  '금호',
  '한국',
  '넥센',
  '미쉐린',
  '콘티넨탈',
  '피렐리',
  '던롭',
  '브릿지스톤',
  '굿이어',
  '요코하마',
  '패더럴',
  '사일룬',
  '트라이앵글',
  'BFG',
  '라우펜',
];

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [brand, setBrand] = useState('');
  const [total, setTotal] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [syncLoading, setSyncLoading] = useState(false);

  useEffect(() => {
    // Replace with your actual API endpoint
    axios
      .get(`/api/product?page=${page}&perPage=${perPage}&brand=${brand}`)
      .then(response => {
        setProducts(response.data.products);
        setTotal(response.data.pagination.total);
        setMaxPage(response.data.pagination.pages);
      })
      .catch(error => {
        console.error('There was an error fetching data', error);
      });
  }, [page, perPage, brand]);

  const handleClickSynchronize = async () => {
    setSyncLoading(true);

    try {
      const { data } = await axios.post(`/api/product/synchronize`);
      if (data.success) {
        const responseGetProducts = await axios.get(
          `/api/product?page=${page}&perPage=${perPage}&brand=${brand}`
        );
        setProducts(responseGetProducts.data.products);
        setTotal(responseGetProducts.data.pagination.total);
        setMaxPage(responseGetProducts.data.pagination.pages);
        setPage(1);
        setSyncLoading(false);
      }
    } catch (error) {
      isAxiosError(error) && console.error('!!ERROR: ', error.response?.data);
    }
    // axios
    //   .post(`/api/product/synchronize`)
    //   .then(response => {
    //     console.log(response);
    //     setProducts(response.data.products);
    //     setTotal(response.data.pagination.total);
    //     setMaxPage(response.data.pagination.pages);
    //     setSyncLoading(false);
    //   })
    //   .catch(error => {
    //     console.error('There was an error fetching data', error);
    //   });
  };

  return (
    <div className='container'>
      <h1 className='text-3xl font-bold mb-4'>상품 관리</h1>
      <div className='mb-4'>
        <h6 className='mb-2'>브랜드</h6>
        <select
          className='select select-bordered w-full max-w-xs'
          value={brand}
          onChange={e => {
            setBrand(e.target.value);
            setPage(1);
          }}
        >
          {BRANDS.map((brandName, index) => (
            <option key={index} value={brandName}>
              {brandName || '전체'}
            </option>
          ))}
        </select>
      </div>
      <ProductTable products={products} />
      <div className='flex items-center'>
        <div>
          <span className='mr-2'>Rows per page: </span>
          <select
            className='select'
            value={perPage}
            onChange={e => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
        <div className='mr-10'>
          <span>{`${(page - 1) * perPage + 1}-${
            page * perPage
          } of ${total}`}</span>
        </div>
        <div className='flex gap-2'>
          <button
            className='btn btn-ghost'
            disabled={page <= 1} // 첫 페이지일 때 버튼을 비활성화
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeftIcon className='w-5 h-5' />
          </button>
          <button
            className='btn btn-ghost'
            disabled={page >= maxPage} // 마지막 페이지일 때 버튼을 비활성화
            onClick={() => setPage(page + 1)}
          >
            <ChevronRightIcon className='w-5 h-5' />
          </button>
        </div>
      </div>
      <div className='text-right'>
        {syncLoading ? (
          <button className='btn btn-disabled'>
            <span className='loading loading-spinner'></span>
            loading
          </button>
        ) : (
          <button className='btn btn-primary' onClick={handleClickSynchronize}>
            스프레드시트 데이터 연동
          </button>
        )}
      </div>
    </div>
  );
}
