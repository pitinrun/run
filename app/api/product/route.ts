import { Product } from '@/src/models/product';
import { connectToDatabase } from 'src/utils';
import { NextResponse } from 'next/server';

connectToDatabase();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    // Query parameters
    const page = searchParams.get('page');
    const perPage = searchParams.get('perPage');
    const brands = searchParams.get('brands');
    const onlySpecialDiscount = searchParams.get('onlySpecialDiscount');
    const pattern = searchParams.get('pattern');
    const season = searchParams.get('season');
    const sizeSearchKeyword = searchParams.get('sizeSearchKeyword');

    // MongoDB filter object
    const filter: any = {};

    if (brands) {
      filter.brand = { $in: brands.split(',') };
    }

    if (pattern) {
      filter.patternKr = pattern;
    }

    if (season) {
      filter.season = season;
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

    if (sizeSearchKeyword) {
      filter.sizeSearchKeyword = sizeSearchKeyword;
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
