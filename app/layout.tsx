import { FetchConfig } from 'http-react';
import './globals.css';
import AuthSession from 'components/common/auth-session';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LayoutProvider } from 'components/common/layout-provider';

function MainLayout({ children }) {
  return (
    <FetchConfig baseUrl='/api'>
      <html data-theme='light'>
        <head>
          <title>Next.js starter</title>
          <meta name='description' content='A Starter with Next.js' />
        </head>
        <body>
          <div className=''>
            <AuthSession>
              <LayoutProvider>
                <ToastContainer
                // position="top-right"
                // autoClose={5000}
                // hideProgressBar={false}
                // newestOnTop={false}
                // closeOnClick
                // rtl={false}
                // pauseOnFocusLoss
                // draggable
                // pauseOnHover
                // theme="light"
                />
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
