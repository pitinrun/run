'use client';
// hooks/use-wishlist.ts
import { useState, useEffect } from 'react';
import { IProduct, IWishListItem } from '@/src/types';
import { JSONToBase64, base64ToJSON } from '@/src/utils';
import axios, { isAxiosError } from 'axios';

type WishListItemWithProduct = IWishListItem & {
  product?: IProduct;
};

export const useWishlist = (key: string) => {
  const [wishlist, setWishlist] = useState<WishListItemWithProduct[]>([]);

  const getLocalStorageWishlist = (): WishListItemWithProduct[] => {
    const wishlistBase64 = localStorage.getItem(key);
    return wishlistBase64 ? base64ToJSON(wishlistBase64) : [];
  };

  const updateLocalStorageWishlist = (wishlist: WishListItemWithProduct[]) => {
    localStorage.setItem(key, JSONToBase64(wishlist));
  };

  const injectProduct = (
    wishList: WishListItemWithProduct[],
    products: IProduct[]
  ) => {
    wishList.forEach(item => {
      const product = products.find(
        product => product.productCode === item.productCode
      );
      item.product = product;
    });
  };

  useEffect(() => {
    const localStorageWishlist = getLocalStorageWishlist();
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
    fetchWishlist();
  }, [key]);

  const handleRemoveWishlistClick = (productCode: string) => {
    if (productCode === 'all') {
      localStorage.removeItem(key);
      setWishlist([]);
      return;
    }

    const newWishlist = getLocalStorageWishlist().filter(
      item => item.productCode !== productCode
    );
    updateLocalStorageWishlist(newWishlist);
    injectProduct(
      newWishlist,
      wishlist.map(item => item.product!) as IProduct[]
    );
    setWishlist(newWishlist);
  };

  const handleQuantityChange = (productCode: string, quantity: number) => {
    const localStorageWishlist = getLocalStorageWishlist();
    const newWishlist = localStorageWishlist.map(item => {
      if (item.productCode === productCode) {
        item.quantity = quantity;
      }
      return item;
    });
    updateLocalStorageWishlist(newWishlist);
    injectProduct(
      newWishlist,
      wishlist.map(item => item.product!) as IProduct[]
    );
    setWishlist(newWishlist);
  };

  const handleDiscountRateChange = (
    productCode: string,
    discountRate: number
  ) => {
    const localStorageWishlist = getLocalStorageWishlist();
    const newWishlist = localStorageWishlist.map(item => {
      if (item.productCode === productCode) {
        item.discountRate = discountRate / 100;
      }
      return item;
    });
    updateLocalStorageWishlist(newWishlist);
    injectProduct(
      newWishlist,
      wishlist.map(item => item.product!) as IProduct[]
    );
    setWishlist(newWishlist);
  };

  return {
    wishlist,
    handleRemoveWishlistClick,
    handleQuantityChange,
    handleDiscountRateChange,
  };
};
