import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

export default function ProductSearchBar({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div
      className={`max-w-3xl	w-full mx-auto flex border border-solid border-current rounded-lg py-2 px-4 ${className}`}
    >
      <input
        type='text'
        placeholder='Search…'
        className='input-bordered flex-1'
      />
      <button className='btn-ghost'>
        <MagnifyingGlassIcon className='w-8 h-8' />
      </button>
    </div>
  );
}
