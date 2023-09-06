import { Product } from '@/src/models/product';
import { connectToDatabase } from 'src/utils';
import { NextResponse } from 'next/server';
import { getStorageNames } from '@/src/services/metadata';

export async function GET(req: Request) {
  try {
    const storageNames = await getStorageNames();
    return NextResponse.json({
      storageNames,
    });
  } catch (error) {
    return NextResponse.json('error', {
      status: 500,
    });
  }
}
