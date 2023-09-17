// app/api/users/route.ts
import Validate from 'next-api-validation';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { User, IUserDocument } from '@/src/models/user'; // 경로는 실제 파일 위치에 따라 변경해 주세요.
import { connectToDatabase } from 'src/utils';

connectToDatabase();

const generatePassword = (password: string) => {
  const SALT_ROUNDS = 10;

  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

export async function POST(req: Request) {
  try {
    const body: IUserDocument = await req.json();

    // 비밀번호 해싱
    const hashedPassword = generatePassword(body.password);
    body.password = hashedPassword;

    // 주소는 주석 처리
    // body.businessAddress = { /* 주석 처리된 코드 */ };

    const newUser = new User(body);
    const saved = await newUser.save();

    return NextResponse.json(saved);
  } catch (error) {
    console.error('!! ERROR', error);
    return NextResponse.json('error', {
      status: 500,
    });
  }
}
