import { FetchConfig } from 'http-react';
import './globals.css';
import AuthSession from 'components/common/auth-session';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LayoutProvider } from 'components/common/layout-provider';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { getUser } from '@/src/services/user';
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  weight: ['100', '300', '400', '500', '700'],
  subsets: ['latin'],
  preload: false,
  display: 'swap',
  variable: '--noto-sans-kr',
  fallback: [
    '-apple-system',
    'Malgun Gothic',
    'Apple SD Gothic Neo',
    'Roboto',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'sans-serif',
  ],
});

async function MainLayout({ children }) {
  const data = await getServerSession(authOptions);

  const userData = data ? await getUser(data.user.id) : null;

  return (
    <FetchConfig baseUrl='/api'>
      <html data-theme='light' lang='ko' className={notoSansKr.className}>
        <head>
          <title>Run</title>
          <meta name='description' content='A Starter with Next.js' />
        </head>
        <body>
          <div className=''>
            <AuthSession>
              <LayoutProvider role={userData?.role}>
                <ToastContainer />
                {children}
                <ToastContainer />
              </LayoutProvider>
            </AuthSession>
          </div>
        </body>
      </html>
    </FetchConfig>
  );
}

export default MainLayout;
