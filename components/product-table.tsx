'use client';

import { IProduct } from '@/src/models/product';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function ProductTable({ products }: { products: IProduct[] }) {
  // NOTE: https://codevoweb.com/setup-and-use-mongodb-in-nextjs-13-app-directory/
  // NOTE: https://github.com/wpcodevo/nextjs13-mongodb-setup
  // 서버사이드 하려면 위에 링크 참조 지금은 일단 CLS로 해결
  // 'use server';
  const [storageNames, setStorageNames] = useState([]);

  useEffect(() => {
    axios.get('/api/metadata').then(response => {
      setStorageNames(response.data.storageNames);
    });
  }, []);

  return (
    <div className='overflow-x-auto'>
      <table className='table'>
        {/* head */}
        <thead>
          <tr>
            <th>브랜드</th>
            <th>제품명(영문)</th>
            <th>제품명(한글)</th>
            <th>사이즈</th>
            <th>SS/LR</th>
            <th>마킹</th>
            <th>원산지</th>
            <th>계절</th>
            <th>특수</th>
            <th>기타</th>
            <th>공장도가격</th>
            <th>할인율</th>
            <th>총 수량</th>
            {storageNames.map((storageName, index) => (
              <th key={index}>{storageName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.brand}</td>
              <td>{product.pattern}</td>
              <td>{product.patternKr}</td>
              <td>{product.size}</td>
              <td>{product.speedSymbolLoadIndex}</td>
              <td>{product.marking}</td>
              <td>{product.origin}</td>
              <td>{product.season}</td>
              <td>{product.special}</td>
              <td>{product.etc}</td>
              <td>{product.factoryPrice}</td>
              <td>{product.specialDiscountRate}</td>
              <td>
                {product.storages.reduce((acc, currentValue, currentIndex) => {
                  return acc + currentValue.stock;
                }, 0)}
              </td>
              {product.storages.map((storage, index) => (
                <td key={index}>{storage.stock}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
