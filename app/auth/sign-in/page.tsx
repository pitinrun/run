'use client';
import * as React from 'react';
import { useSession, signOut, signIn, getSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AuthSignInPage() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      id: { value: string };
      password: { value: string };
    };
    if (!target.id.value || !target.password.value) {
      toast.error('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    const userId = target.id.value;
    const password = target.password.value;

    const response = await signIn('credentials', {
      id: userId,
      password,
      redirect: false,
    });

    if (response?.error) {
      toast.error(response.error);
    } else {
      toast.success(`${userId}님 환영합니다!`);
      router.push(response?.url || '/');
    }
  };

  return (
    <div className='md:flex w-full h-screen'>
      <div className='bg-hero-tire flex-1 bg-center bg-cover bg-no-repeat hidden md:block' />
      <div className='flex-1 container flex items-center justify-center h-full'>
        <form onSubmit={handleSubmit} className='max-w-sm w-full'>
          <Image
            src='/assets/images/run-logo.png'
            alt='logo'
            width={130}
            height={50}
            className='mb-4'
          />
          <div className='mb-4 text-neutral-400'>서비스 이용을 위해 로그인을 해주세요.</div>
          <div className='mb-4'>
            <div className='mb-4'>
              <h6 className='mb-1'>사업자번호</h6>
              <input
                type='text'
                name='id'
                placeholder='아이디'
                className='w-full p-4 border rounded-md'
              />
            </div>
            <div>
              <h6 className='mb-1'>비밀번호</h6>
              <input
                type='password'
                name='password'
                placeholder='비밀번호'
                className='w-full p-4 border rounded-md mt-2'
              />
            </div>
          </div>
          <div>
            <button
              type='submit'
              className='btn btn-neutral w-full p-4 rounded-md'
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
    // <div className='container mx-auto max-w-sm h-screen flex flex-col justify-center items-center'>
    //   <div className='text-center mb-10'>
    //     <h1 className='text-4xl font-bold'>아이홀덤</h1>
    //   </div>
    // </div>
  );
}

// export async function getServerSideProps(context: any) {
//   const session = await getSession(context);

//   // If the user is already logged in, redirect to root "/"
//   if (session) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   const { callbackUrl } = context.query;
//   if (callbackUrl) {
//     return {
//       redirect: {
//         destination: callbackUrl,
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: {},
//   };
// }
