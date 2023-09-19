// Use the client directive for using usePathname hook.
'use client';

// Use usePathname for catching route name.
import { usePathname } from 'next/navigation';
import NavigationBar from './navigation-bar';
import { RoleType } from '@/src/types';

export const LayoutProvider = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: RoleType;
}) => {
  const pathname = usePathname();
  const isShowNav = pathname !== '/auth/sign-in';

  return (
    <>
      {isShowNav && <NavigationBar role={role} />}
      {children}
    </>
  );
};
