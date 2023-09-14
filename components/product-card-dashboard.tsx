'use client';
import { useEffect, useState } from 'react';
import ProductCard from './product-card';
import axios from 'axios';
import { IProduct } from '@/src/types';

export default function ProductCardDashboard({
  products,
}: {
  products: IProduct[];
}) {
  return (
    <div>
      <div className='grid grid-cols-2 gap-4'>
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
}
