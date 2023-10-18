// Use the client directive for using usePathname hook.
'use client';

// Use usePathname for catching route name.
import { usePathname } from 'next/navigation';
import NavigationBar from './navigation-bar';
import { UserType } from '@/src/types';

export const LayoutProvider = ({
  children,
  // role,
  userData,
}: {
  children: React.ReactNode;
  userData: UserType | null;
  // role?: UserType['role'];
}) => {
  const pathname = usePathname();
  const isShowNav = pathname !== '/auth/sign-in';

  return (
    <>
      {isShowNav && <NavigationBar userData={userData} />}
      {children}
    </>
  );
};
