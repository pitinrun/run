import { Product } from '@/src/models/product';
import { connectToDatabase } from 'src/utils';
import { NextResponse } from 'next/server';
import { getStorages } from '@/src/services/metadata';

export async function GET(req: Request) {
  try {
    const storageNames = await getStorages();
    return NextResponse.json({
      storageNames,
    });
  } catch (error) {
    return NextResponse.json('error', {
      status: 500,
    });
  }
}
