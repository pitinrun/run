'use client';
import { IOrder, UserType } from '@/src/types';
import { JSONToBase64 } from '@/src/utils';
import WishlistDashboard from '@/app/wishlist/components/wishlist-dashboard';
import { useWishlist } from 'hooks/use-wishlist';
import { useEffect } from 'react';
import { deleteOrderRequest } from 'requests/order';

/**
 * @note 해달 컴포넌트는 Order Edit 전용으로 만들어졌습니다.
 * @returns
 */
export default function WishlistDashboardClient({
  userData,
  orderData,
}: {
  userData: UserType;
  orderData: IOrder & {
    _id: string;
  };
}) {
  useEffect(() => {
    if (orderData) {
      localStorage.setItem(
        'wishlist-order-edit',
        JSONToBase64(orderData.products)
      );
    }
  }, [orderData]);

  const {
    wishlist,
    handleRemoveWishlistClick,
    handleQuantityChange,
    handleDiscountRateChange,
  } = useWishlist('wishlist-order-edit');

  async function handleConfirmOrder() {
    await deleteOrderRequest(orderData._id);
  }

  return (
    <WishlistDashboard
      wishlist={wishlist}
      handleRemoveWishlistClick={handleRemoveWishlistClick}
      handleQuantityChange={handleQuantityChange}
      handleDiscountRateChange={handleDiscountRateChange}
      onConfirmOrder={handleConfirmOrder}
      title='주문 수정하기'
      clearButtonText='주문 취소'
      confirmButtonText='수정하기'
      clearDialogText={{
        title: '주문 취소',
        content: '주문을 취소하시겠습니까?',
      }}
      userData={userData}
    />
  );
}
