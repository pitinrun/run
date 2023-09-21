import { connectToDatabase } from '@/src/utils';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getUser } from '@/src/services/user';

connectToDatabase();

// const data = await getServerSession(authOptions);

export async function GET(req: NextRequest) {
  // const productCodes = base64ToJSON(base64ProductCodes);

  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json('!!ERROR: Do have not token', {
        status: 400,
      });
    }

    if (!token.id) {
      return NextResponse.json('!!ERROR: Do have not token.id', {
        status: 400,
      });
    }

    const user = await getUser(token.id);

    return NextResponse.json(user, {
      status: 200,
    });
  } catch (error) {
    console.error('!! ERROR:', error);
    return NextResponse.json('error', {
      status: 500,
    });
  }
}
