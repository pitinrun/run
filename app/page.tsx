import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import NoticeList from 'components/notice-list';
import ProductCardDashboard from 'components/product-card-dashboard';

function ProductSearchInput({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
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
      <div className='max-w-3xl	w-full mx-auto flex aligns-center justify-be border border-solid border-current rounded-lg py-2 px-4'>
        <input
          type='text'
          placeholder='Search…'
          className='input-bordered flex-1'
        />
        <button className='btn-ghost'>
          <MagnifyingGlassIcon className='w-8 h-8' />
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className='container'>
      <ProductSearchInput className='mb-12' />
      <NoticeList />
      <ProductCardDashboard onlySpecialDiscount />
    </div>
  );
}
