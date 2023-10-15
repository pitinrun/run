import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) {
    // NOTE: 토큰이 없으면 로그인 페이지로 이동
    if (!request.nextUrl.pathname.startsWith('/auth/sign-in')) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
  } else {
    if (token.role === null || token.role === undefined) {
      return NextResponse.redirect(new URL('/403', request.url));
    }
    // NOTE: 토큰이 있으면 로그인 페이지로 이동
    if (request.nextUrl.pathname.startsWith('/auth/sign-in')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (request.nextUrl.pathname.startsWith('/manage')) {
      if (token.role < 9) {
        console.log('$$ redirect');
        return NextResponse.redirect(new URL('/403', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/product/:path*',
    '/api/user/:path*',
    '/api/metadata/:path*',
    '/',
    '/auth/sign-in',
    '/products/:path*',
    '/manage/:path*',
    '/wishlist/:path*',
  ],
};
