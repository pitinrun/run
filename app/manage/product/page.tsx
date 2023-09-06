'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

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

// Replace this component with your actual ProductTable implementation
function ProductTable({ products }) {
  return (
    <div className='overflow-x-auto'>
      <table className='table'>
        {/* head */}
        <thead>
          <tr>
            <th>브랜드</th>
            <th>Pattern</th>
            <th>Size</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.brand}</td>
              <td>{product.pattern}</td>
              <td>{product.size}</td>
              <td>{product.factoryPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [brand, setBrand] = useState('');
  const [total, setTotal] = useState(0);
  const [maxPage, setMaxPage] = useState(0);

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

  return (
    <div className='container'>
      <h1 className='text-3xl font-bold mb-4'>상품 관리</h1>
      <div className='dropdown'>
        <label tabIndex={0} className='btn m-1'>
          {brand || '전체'}
        </label>
        <ul
          tabIndex={0}
          className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
        >
          {BRANDS.map((brandName, index) => (
            <li key={index}>
              <a onClick={() => setBrand(brandName)}>{brandName || '전체'}</a>
            </li>
          ))}
        </ul>
      </div>
      <ProductTable products={products} />
      <div>
        <span>Rows per page:</span>
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
        <span>{`${(page - 1) * perPage + 1}-${
          page * perPage
        } of ${total}`}</span>
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
  );
}
