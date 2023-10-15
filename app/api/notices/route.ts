// app/api/events/route.ts
import { INoticeDocument, Notice } from '@/src/models/notice';
import { NextResponse } from 'next/server';
import { connectToDatabase } from 'src/utils';

connectToDatabase();

export async function POST(req: Request) {
  try {
    const body: INoticeDocument = await req.json();
    const newNotice = new Notice(body);
    const saved = await newNotice.save();
    return NextResponse.json(saved);
  } catch (error) {
    console.error('!! ERROR:', error);
    return NextResponse.json('error', {
      status: 500,
    });
  }
}
