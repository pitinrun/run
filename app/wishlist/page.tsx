// app/wishlist/page.tsx
'use client';

import { IProduct, IWishListItem } from '@/src/types';
import { JSONToBase64, base64ToJSON } from '@/src/utils';
import axios, { isAxiosError } from 'axios';
import ConfirmDialog from 'components/common/confirm-dialog';
import ProductCard from 'components/product-card';
import { set } from 'mongoose';
import { useEffect, useState } from 'react';

/**
 * NOTE: 상품 지우기를 눌렀을 때, 해당 상품의 productCode를 저장합니다. Why?: Not for rendering
 */
let focusProductCode = '';

type WishListItemWithProduct = IWishListItem & {
  product?: IProduct;
};
/**
 *
 * @param wishList injected
 * @param products inject items
 * @returns
 */
const injectProduct = (
  wishList: WishListItemWithProduct[],
  products: IProduct[]
) => {
  wishList.forEach(item => {
    const product = products.find(
      (product: IProduct) => product.productCode === item.productCode
    );
    item.product = product;
  });
};

export default function WishListPage({}) {
  const [wishlist, setWishlist] = useState<WishListItemWithProduct[]>([]);
  const [openRemoveItemDialog, setOpenRemoveItemDialog] = useState(false);
  const [openRemoveAllDialog, setOpenRemoveAllDialog] = useState(false);

  useEffect(() => {
    const wishlistBase64 = localStorage.getItem('wishlist');
    const localStorageWishlist = (
      wishlistBase64 ? base64ToJSON(wishlistBase64) : []
    ) as WishListItemWithProduct[];
    const productCodes = localStorageWishlist.map(item => item.productCode);
    const encodedProductCodes = JSONToBase64(productCodes);

    async function fetchWishlist() {
      try {
        const { data } = await axios.get(`/api/product/${encodedProductCodes}`);
        injectProduct(localStorageWishlist, data);
        setWishlist(localStorageWishlist);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error('$$ error.response', error.response);
        }
      }
    }
    console.log('$$ run useEffect');
    fetchWishlist();
  }, []);

  const handleRemoveWishlistClick = (productCode: string) => {
    const wishlistBase64 = localStorage.getItem('wishlist');
    const localStorageWishlist = (
      wishlistBase64 ? base64ToJSON(wishlistBase64) : []
    ) as WishListItemWithProduct[];

    // 새로운 배열을 생성
    const newWishlist = localStorageWishlist.filter(
      item => item.productCode !== productCode
    );

    localStorage.setItem('wishlist', JSONToBase64(newWishlist));

    const products = wishlist.map(item => item.product) as IProduct[]; // NOTE: product가 undefined일 수 있으므로, 타입 단언을 해줍니다.
    injectProduct(localStorageWishlist, products);

    // 새로운 배열로 상태를 업데이트
    setWishlist(newWishlist);
  };

  return (
    <div className='container'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg sm:text-2xl font-bold'>장바구니</h2>
        <button
          className='btn btn-sm sm:btn-md btn-outline-neutral'
          onClick={() => {
            setOpenRemoveAllDialog(true);
          }}
        >
          장바구니 비우기
        </button>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {wishlist.map(wishlistItem => {
          if (!wishlistItem.product) return null;
          return (
            <ProductCard
              key={wishlistItem.productCode}
              onRemoveWishlistClick={() => {
                focusProductCode = wishlistItem.productCode;
                setOpenRemoveItemDialog(true);
              }}
              {...wishlistItem.product}
            />
          );
        })}
      </div>
      <ConfirmDialog
        title='장바구니 상품 지우기'
        open={openRemoveItemDialog}
        onClose={() => {
          setOpenRemoveItemDialog(false);
        }}
        onConfirm={() => {
          handleRemoveWishlistClick(focusProductCode);
          setOpenRemoveItemDialog(false);
        }}
      >
        장바구니에서 상품을 지우시겠습니까?
      </ConfirmDialog>
      <ConfirmDialog
        title='장바구니 비우기'
        onConfirm={() => {
          localStorage.removeItem('wishlist');
          setWishlist([]);
        }}
        open={openRemoveAllDialog}
        onClose={() => {
          setOpenRemoveAllDialog(false);
        }}
      >
        장바구니에 등록된 모든 상품을 비우시겠습니까?
      </ConfirmDialog>
    </div>
  );
}
