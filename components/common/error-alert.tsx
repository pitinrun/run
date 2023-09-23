import Link from 'next/link';

const defaultMessageMap = {
  401: 'You are not logged in.',
  402: 'Payment is required.',
  403: 'You do not have permission to access this page.',
  404: 'This page could not be found.',
  500: 'Internal Server Error',
};

type ErrorAlertProps = {
  statusCode: number;
  children?: React.ReactNode;
};
export default function ErrorAlert({ statusCode, children }: ErrorAlertProps) {
  return (
    <div className='h-screen w-full flex items-center justify-center bg-gray-100'>
      <div className='bg-white rounded-lg shadow-lg p-8 m-4 w-full sm:w-3/4 lg:w-1/2'>
        <h1 className='text-3xl font-bold mb-4'>{statusCode}</h1>
        <p className='text-gray-700 mb-4'>{defaultMessageMap[statusCode]}</p>
        <p>{children}</p>
        <div className='flex justify-center'>
          <Link href='/'>
            <button className='btn btn-primary btn-block'>
              Go to Homepage
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
