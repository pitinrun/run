// app/wishlist/page.tsx
'use client';

import { IProduct, IWishListItem } from '@/src/types';
import { JSONToBase64, base64ToJSON } from '@/src/utils';
import axios, { isAxiosError } from 'axios';
import ProductCard from 'components/product-card';
import { useEffect, useState } from 'react';

type WishListItemWithProduct = IWishListItem & {
  product?: IProduct;
};

export default function WishListPage({}) {
  const [wishlist, setWishlist] = useState<WishListItemWithProduct[]>([]);

  useEffect(() => {
    const wishlistBase64 = localStorage.getItem('wishlist');
    const wishlist = (
      wishlistBase64 ? base64ToJSON(wishlistBase64) : []
    ) as WishListItemWithProduct[];
    const productCodes = wishlist.map(item => item.productCode);
    const encodedProductCodes = JSONToBase64(productCodes);

    async function fetchWishlist() {
      try {
        const { data } = await axios.get(`/api/product/${encodedProductCodes}`);
        wishlist.forEach(item => {
          const product = data.find(
            (product: IProduct) => product.productCode === item.productCode
          );
          item.product = product;
        });
        setWishlist(wishlist);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error('$$ error.response', error.response);
        }
      }
    }

    fetchWishlist();
  }, []);

  return (
    <div className='container'>
      <h2 className='text-lg sm:text-2xl font-bold mb-2'>장바구니</h2>
      {/* <ProductCard  */}
    </div>
  );
}
