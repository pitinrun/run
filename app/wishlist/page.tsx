// app/wishlist/page.tsx
'use client';
import { IProduct, IWishListItem, UserType } from '@/src/types';
import { JSONToBase64, base64ToJSON } from '@/src/utils';
import axios, { isAxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getUserMy } from '../requests/user';
import { toast } from 'react-toastify';
import WishlistDashboard from 'components/wishlist/wishlist-dashboard';

type WishListItemWithProduct = IWishListItem & {
  product?: IProduct;
};

const updateLocalStorageWishlist = (wishlist: WishListItemWithProduct[]) => {
  localStorage.setItem('wishlist', JSONToBase64(wishlist));
};

const getLocalStorageWishlist = (): WishListItemWithProduct[] => {
  const wishlistBase64 = localStorage.getItem('wishlist');
  return wishlistBase64 ? base64ToJSON(wishlistBase64) : [];
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

export default function WishListPage() {
  const [wishlist, setWishlist] = useState<WishListItemWithProduct[]>([]);
  const [userData, setUserData] = useState<UserType | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserMy = async () => {
      try {
        const userData = await getUserMy();
        setUserData(userData);
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data.message);
        }
      }
    };

    fetchUserMy();
  }, [session]);

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
  }, []);

  const handleRemoveWishlistClick = (productCode: string) => {
    if (productCode === 'all') {
      localStorage.removeItem('wishlist');
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

  return (
    <WishlistDashboard
      wishlist={wishlist}
      handleRemoveWishlistClick={handleRemoveWishlistClick}
      handleQuantityChange={handleQuantityChange}
      handleDiscountRateChange={handleDiscountRateChange}
      userData={userData}
    />
  );
}
