'use client';
import { UserType } from '@/src/types';
import WishlistDashboard from 'components/wishlist/wishlist-dashboard';
import { useWishlist } from 'hooks/use-wishlist';

export default function WishlistDashboardClient({
  userData,
  localStorageKey = 'wishlist',
}: {
  userData: UserType | null;
  localStorageKey?: string;
}) {
  const {
    wishlist,
    handleRemoveWishlistClick,
    handleQuantityChange,
    handleDiscountRateChange,
  } = useWishlist(localStorageKey);

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
