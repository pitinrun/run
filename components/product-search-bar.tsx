'use client';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

export default function ProductSearchBar({
  className = '',
}: {
  className?: string;
}) {
  const [inputValue, setInputValue] = useState('');
  const [sizeSearchKeyword, setSizeSearchKeyword] = useState('');
  const router = useRouter();

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSizeSearchKeyword(inputValue);
    }
  };

  const handleClick = () => {
    setSizeSearchKeyword(inputValue);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.trim());
  };

  return (
    <div
      className={`max-w-3xl w-full flex border border-solid border-current rounded-lg py-2 px-4 ${className}`}
    >
      <input
        type='number'
        placeholder='2454518'
        className='input-bordered flex-1'
        onKeyDown={handleKeyDown}
        value={inputValue}
        onChange={e => {
          handleChange(e);
        }}
      />
      <button className='btn-ghost' onClick={handleClick}>
        <MagnifyingGlassIcon className='w-8 h-8' />
      </button>
    </div>
  );
}
