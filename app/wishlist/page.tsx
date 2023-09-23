// app/wishlist/page.tsx
'use client';
import { UserType } from '@/src/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import WishlistDashboard from 'components/wishlist/wishlist-dashboard';
import { isAxiosError } from 'axios';
import { useWishlist } from 'hooks/use-wishlist';
import { getUserMy } from 'requests/user';

export default function WishListPage() {
  const [userData, setUserData] = useState<UserType | null>(null);

  const { data: session } = useSession();

  const {
    wishlist,
    handleRemoveWishlistClick,
    handleQuantityChange,
    handleDiscountRateChange,
  } = useWishlist('wishlist'); // 여기서 원하는 키를 전달하면 됩니다.

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

  return (
    <div className='container'>
      <WishlistDashboard
        wishlist={wishlist}
        handleRemoveWishlistClick={handleRemoveWishlistClick}
        handleQuantityChange={handleQuantityChange}
        handleDiscountRateChange={handleDiscountRateChange}
        userData={userData}
      />
    </div>
  );
}
