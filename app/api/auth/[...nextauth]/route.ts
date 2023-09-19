// pages/api/auth/[...nextauth].ts
import NextAuth, { Session, Awaitable, AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { IUser } from '@/src/types';
import { User } from '@/src/models/user';
import { connectToDatabase } from '@/src/utils';

connectToDatabase();

const verifyEmailPassword = async (
  password: string,
  needComparePassword: string
) => {
  try {
    if (bcrypt.compareSync(password, needComparePassword)) {
      return true;
    }
  } catch (error) {
    console.error('$$ error', error);
    return false;
  }
};

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        id: { label: '아이디', type: 'text', placeholder: 'jsmith' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        const _user = await User.findOne<IUser>({
          userId: credentials?.id,
        });

        if (_user) {
          const isVerified = await verifyEmailPassword(
            credentials?.password,
            _user.password
          );

          if (isVerified) {
            const user = {
              id: _user.userId,
              name: _user.businessName,
              role: _user.role ?? 0,
            };

            return user;
          } else {
            return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
          }
        }
        // Return a rejected promise with an error message
        return Promise.reject(new Error('유저를 찾을 수 없습니다.'));
      },
    }),
  ],
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    // error: "/admin/error",
    // signOut: "/auth/sign-out",
    signIn: '/auth/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 14 * 24 * 60 * 60,
    updateAge: 2 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session.user && token.sub) {
        // Add property to session
        session.user.id = token.sub;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return `${baseUrl}`;
      }
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
