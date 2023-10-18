// app/api/user/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { User, IUserDocument } from '@/src/models/user'; // 경로는 실제 파일 위치에 따라 변경해 주세요.
import { connectToDatabase } from 'src/utils';
import { getUserById } from '@/src/services/user';
import bcrypt from 'bcrypt';

connectToDatabase();

const generatePassword = (password: string) => {
  const SALT_ROUNDS = 10;

  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

// export async function GET(req: NextRequest, { params }) {
//
// app/api/users/route.ts
export async function GET(req: NextRequest, { params }) {
  const { id: _id } = params;
  try {
    const user = await getUserById(_id);
    return NextResponse.json(user);
  } catch {
    return NextResponse.json('error', {
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest, { params }) {
  try {
    const { id: _id } = params;
    const updateData: Partial<IUserDocument> = await req.json();

    if (!_id) {
      return NextResponse.json(
        {
          message: 'User ID 필요.',
        },
        {
          status: 400,
        }
      );
    }

    const user = await User.findById(_id);

    if (!user) {
      return NextResponse.json(
        {
          message: '사용자를 찾을 수 없습니다.',
        },
        {
          status: 404,
        }
      );
    }

    if (updateData.password) {
      const hashedPassword = generatePassword(updateData.password);
      updateData.password = hashedPassword;
    }

    // 사용자 정보 업데이트
    Object.assign(user, updateData);

    await user.save();

    return NextResponse.json(user);
  } catch (error) {
    console.error('!! ERROR', error);
    return NextResponse.json('error', {
      status: 500,
    });
  }
}
