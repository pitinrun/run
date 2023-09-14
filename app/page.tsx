'use client';

import NoticeList from 'components/notice-list';
import ProductSearchBar from 'components/product-search-bar';
import ProductCardDashboard__V2 from 'components/product-card-dashboard-v2';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();

  const [sizeSearchKeyword, setSizeSearchKeyword] = useState('');

  const handle = () => {
    router.push(
      `/products?${new URLSearchParams({
        sizeSearchKeyword,
      }).toString()}`
    );
  };

  useEffect(() => {
    if (sizeSearchKeyword) {
      handle();
    }
  }, [sizeSearchKeyword]);

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
      <ProductSearchBar
        className='mb-12 mx-auto'
        setValue={setSizeSearchKeyword}
      />
      <NoticeList />
      <ProductCardDashboard__V2 onlySpecialDiscount />
    </div>
  );
}
