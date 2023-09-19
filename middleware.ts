import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/manage')) {
    if (!token.role) {
      return NextResponse.redirect(new URL('/403', request.url));
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
    '/products/:path*',
    '/manage/:path*',
    '/wishlist/:path*',
  ],
};
