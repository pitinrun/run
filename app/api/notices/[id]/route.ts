// app/api/notices/[_id]/route.ts
import { INoticeDocument, Notice } from '@/src/models/notice';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from 'src/utils';

connectToDatabase();

export async function PUT(req: NextRequest, { params }) {
  try {
    const { id } = params;
    const body: Partial<INoticeDocument> = await req.json();
    const noticeToUpdate = await Notice.findById(id);

    if (!noticeToUpdate) {
      return NextResponse.json(
        { message: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Merge old data with new data
    const updatedNotice = await Notice.findByIdAndUpdate(id, body, {
      new: true, // return the updated document
    });

    return NextResponse.json(updatedNotice);
  } catch (error) {
    console.error('!! ERROR', error);

    return NextResponse.json('error', {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest, { params }) {
  try {
    const { id } = params;
    const deletedNotice = await Notice.findByIdAndDelete(id);

    if (!deletedNotice) {
      return NextResponse.json(
        { message: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedNotice);
  } catch (error) {
    console.error('!! ERROR', error);

    return NextResponse.json('error', {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest, { params }) {
  try {
    const { id } = params;
    const notice = await Notice.findById(id);

    if (!notice) {
      return NextResponse.json(
        { message: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(notice);
  } catch (error) {
    console.error('!! ERROR', error);

    return NextResponse.json('error', {
      status: 500,
    });
  }
}
