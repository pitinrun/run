import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';

export default function ProductSearchBar({
  className = '',
  value = '',
  setValue,
}: {
  className?: string;
  value?: string;
  setValue?: (value: string) => void;
}) {
  const [inputValue, setInputValue] = useState(value || '');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setValue && setValue(inputValue);
    }
  };

  const handleClick = () => {
    setValue && setValue(inputValue);
  };

  return (
    <div
      className={`max-w-3xl w-full flex border border-solid border-current rounded-lg py-2 px-4 ${className}`}
    >
      <input
        type='text'
        placeholder='2454518'
        className='input-bordered flex-1'
        onKeyDown={handleKeyDown}
        value={inputValue}
        onChange={e => {
          setInputValue(e.target.value);
        }}
      />
      <button className='btn-ghost' onClick={handleClick}>
        <MagnifyingGlassIcon className='w-8 h-8' />
      </button>
    </div>
  );
}
