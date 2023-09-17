// Use the client directive for using usePathname hook.
'use client';

// Use usePathname for catching route name.
import { usePathname } from 'next/navigation';
import NavigationBar from './navigation-bar';

export const LayoutProvider = ({ children }) => {
  const pathname = usePathname();

  const isShowNav = pathname !== '/auth/sign-in';
  return (
    <>
      {isShowNav && <NavigationBar />}
      {children}
    </>
  );
};
