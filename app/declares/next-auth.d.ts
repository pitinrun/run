import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    /** The user's name. */
    id: string;
    name: string;
    role: number;
  }
  interface Session {
    user: User;
  }
}
j;

import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    role?: number;
    id?: string;
  }
}
