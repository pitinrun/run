'use client';
import { UserType } from '@/src/types';
import WishlistDashboard from 'components/wishlist/wishlist-dashboard';
import { useWishlist } from 'hooks/use-wishlist';

export default function WishlistDashboardClient({
  userData,
}: {
  userData: UserType | null;
}) {
  const {
    wishlist,
    handleRemoveWishlistClick,
    handleQuantityChange,
    handleDiscountRateChange,
  } = useWishlist('wishlist'); // 여기서 원하는 키를 전달하면 됩니다.

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
