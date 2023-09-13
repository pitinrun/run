import { Product } from '@/src/models/product';
import Validate from 'next-api-validation';
import { Post, IPost } from '@/src/models';
import { connectToDatabase } from 'src/utils';
import { NextResponse } from 'next/server';

connectToDatabase();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    // Query parameters
    const page = searchParams.get('page');
    const perPage = searchParams.get('perPage');
    const brand = searchParams.get('brand');
    const onlySpecialDiscount = searchParams.get('onlySpecialDiscount');
    const pattern = searchParams.get('pattern');

    // MongoDB filter object
    const filter: any = {};

    if (brand) {
      filter.brand = brand;
    }

    if (pattern) {
      filter.patternKr = pattern;
    }

    if (onlySpecialDiscount === 'true') {
      filter.specialDiscountRate = { $exists: true, $ne: null };
    } else {
      filter.$or = [
        { specialDiscountRate: { $exists: false } },
        { specialDiscountRate: 0 },
        { specialDiscountRate: null },
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(perPage);
    const limit = Number(perPage);

    // Fetch products with filter and pagination
    const products = await Product.find(filter)
      .sort({
        _id: -1,
      })
      .skip(skip)
      .limit(limit);

    // Fetch total product count with filter
    const total = await Product.countDocuments(filter);

    // Response
    return NextResponse.json({
      products: products,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('!! ERROR:', error);
    return NextResponse.json('error', {
      status: 500,
    });
  }
}
