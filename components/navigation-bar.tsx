import Image from 'next/image';
import {
  ArchiveBoxIcon,
  Bars4Icon,
  ListBulletIcon,
  ShoppingCartIcon,
  SpeakerWaveIcon,
  UserGroupIcon,
  UserPlusIcon,
} from '@heroicons/react/20/solid';
import Link from 'next/link';
import { UserType } from '@/src/types';
import { signOut } from 'next-auth/react';
import { toast } from 'react-toastify';

type ContentItemType = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const userContents: ContentItemType[] = [
  {
    name: '장바구니',
    href: '/wishlist',
    icon: <ShoppingCartIcon className='w-6 h-6 mr-4' />,
  },
  {
    name: '주문내역',
    href: '/order',
    icon: <ListBulletIcon className='w-6 h-6 mr-4' />,
  },
];

const managerContents: ContentItemType[] = [
  {
    name: '주문 관리',
    href: '/manage/order',
    icon: <ListBulletIcon className='w-6 h-6 mr-4' />,
  },
];

const masterContents: ContentItemType[] = [
  {
    name: '회원 관리',
    href: '/manage/users',
    icon: <UserGroupIcon className='w-6 h-6 mr-4' />,
  },
  {
    name: '회원 등록',
    href: '/manage/users/register',
    icon: <UserPlusIcon className='w-6 h-6 mr-4' />,
  },
  {
    name: '주문 관리',
    href: '/manage/order',
    icon: <ListBulletIcon className='w-6 h-6 mr-4' />,
  },
  {
    name: '상품 관리',
    href: '/manage/product',
    icon: <ArchiveBoxIcon className='w-6 h-6 mr-4' />,
  },
  {
    name: '공지 관리',
    href: '',
    icon: <SpeakerWaveIcon className='w-6 h-6 mr-4' />,
  },
];

const drawerContents: Record<string, ContentItemType[]> = {
  user: userContents,
  manager: managerContents,
  master: masterContents,
};
const getContents = (role: UserType['role']) => {
  if (!role) return drawerContents['user'];

  return {
    10: drawerContents['master'],
    9: drawerContents['manager'],
  }[role];
};

export default function NavigationBar({ role }: { role?: UserType['role'] }) {
  const contents = getContents(role);
  const displayRole = role
    ? {
        10: '마스터 관리자',
        9: '일반 관리자',
      }[role]
    : '주문 관리';

  return (
    <div className='drawer drawer-end'>
      <input id='my-drawer' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content'>
        <nav className='navbar bg-base-100 lg:px-16 px-2'>
          <div className='flex-1'>
            <Link href='/'>
              <Image
                src='/assets/images/run-logo.png'
                alt='logo'
                width={105}
                height={40}
              />
            </Link>
          </div>
          <div className='flex-none'>
            <label htmlFor='my-drawer' className='btn btn-ghost btn-circle'>
              <Bars4Icon className='w-6 h-6 text-neutral-600' />
            </label>
          </div>
        </nav>
        {/* Page content would go here */}
      </div>

      <div className='drawer-side z-50'>
        <label htmlFor='my-drawer' className='drawer-overlay' />
        <ul className='menu p-4 w-80 min-h-full bg-base-100 menu-lg'>
          <li className='my-4 text-neutral-500'>{displayRole}</li>
          {contents.map(content => (
            <li key={content.name}>
              <Link href={content.href}>
                {content.icon}
                {content.name}
              </Link>
            </li>
          ))}
          <div className='divider my-1' />
          <li className='text-neutral-500'>
            <a
              onClick={() => {
                signOut();
                toast.success('로그아웃 되었습니다.');
              }}
            >
              <div className='mx-5' />
              로그아웃
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
