import Image from 'next/image';
import { Bars4Icon, ShoppingCartIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

export default function NavigationBar() {
  return (
    <div className='drawer drawer-end'>
      <input id='my-drawer' type='checkbox' className='drawer-toggle' />

      <div className='drawer-content'>
        <nav className='navbar bg-base-100 lg:px-16 px-2'>
          <div className='flex-1'>
            <Image
              src='/assets/images/run-logo.png'
              alt='logo'
              width={105}
              height={40}
            />
          </div>
          <div className='flex-none'>
            <label htmlFor='my-drawer' className='btn btn-ghost btn-circle'>
              <Bars4Icon className='w-6 h-6 text-neutral-600' />
            </label>
          </div>
        </nav>
        {/* Page content would go here */}
      </div>

      <div className='drawer-side'>
        <label htmlFor='my-drawer' className='drawer-overlay z-5'></label>
        <h1>Hello</h1>
        <ul className='menu p-4 w-80 min-h-full bg-base-100'>
          <li>
            <Link href=''>장바구니</Link>
            {/* <ShoppingCartIcon className='w-6 h-6' /> */}
            {/* <Link href=''>장바구니</Link> */}
          </li>
          {/* <li><a href="#">Sidebar Item 1</a></li>
          <li><a href="#">Sidebar Item 2</a></li> */}
          {/* More sidebar items */}
        </ul>
      </div>
    </div>
  );
}
