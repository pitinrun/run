'use client';
import { useEffect, useState } from 'react';
import ProductCard from './product-card';
import axios from 'axios';
import { IProduct } from '@/src/models/product';

const PER_PAGE = 10;

export default function ProductCardDashboard({
  onlySpecialDiscount = false,
}: {
  onlySpecialDiscount?: boolean;
}) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [brand, setBrand] = useState('');

  console.log('$$ page >= maxPage', page, maxPage);

  useEffect(() => {
    // Replace with your actual API endpoint
    axios
      .get(
        `/api/product?page=${page}&perPage=${PER_PAGE}&brand=${brand}${
          onlySpecialDiscount ? '&onlySpecialDiscount=true' : ''
        }`
      )
      .then(response => {
        setProducts([...products, ...response.data.products]);
        setTotal(response.data.pagination.total);
        setMaxPage(response.data.pagination.pages);
      })
      .catch(error => {
        console.error('There was an error fetching data', error);
      });
  }, [page, brand]);

  return (
    <div>
      <div className='grid grid-cols-2 gap-4'>
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
      {page < maxPage && (
        <button
          className='btn btn-outline w-full btn-ghost btn-block text-2xl my-4'
          onClick={() => setPage(page + 1)}
        >
          + 더보기
        </button>
      )}
    </div>
  );
}
