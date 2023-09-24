'use client';

import { IProduct, IWishListItem, UserType } from '@/src/types';
import { convertNumberToKRW, roundUpToHundred } from '@/src/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ProductCard from 'components/product-card';
import ConfirmDialog from 'components/common/confirm-dialog';
import { useState } from 'react';
import { createOrderRequest } from 'requests/order';

let selectedProductCode: string | null = null;

type WishlistDashboardProps = {
  wishlist: (IWishListItem & { product?: IProduct })[];
  handleRemoveWishlistClick: (productCode: string) => void;
  handleQuantityChange: (productCode: string, quantity: number) => void;
  handleDiscountRateChange: (productCode: string, discountRate: number) => void;
  onConfirmOrder: () => void;
  title?: string;
  clearButtonText?: string;
  confirmButtonText?: string;
  clearDialogText?: {
    title: string;
    content: string;
  };
  userData: UserType | null;
};

export default function WishlistDashboard({
  wishlist,
  handleRemoveWishlistClick,
  handleQuantityChange,
  handleDiscountRateChange,
  onConfirmOrder,
  title = '장바구니',
  clearButtonText = '장바구니 비우기',
  confirmButtonText = '주문하기',
  clearDialogText = {
    title: '장바구니 비우기',
    content: '장바구니를 비우시겠습니까?',
  },
  userData,
}: WishlistDashboardProps) {
  const router = useRouter();
  const [openRemoveItemDialog, setOpenRemoveItemDialog] = useState(false);
  const [openRemoveAllDialog, setOpenRemoveAllDialog] = useState(false);
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);

  const getTotalPrice = () => {
    return wishlist.reduce((acc, cur) => {
      if (!cur.product) return acc;
      const value = roundUpToHundred(
        cur.quantity * (cur.product?.factoryPrice * (1 - cur.discountRate))
      );
      return acc + value;
    }, 0);
  };

  const handleConfirmOrder = async () => {
    try {
      const response = await createOrderRequest({
        products: wishlist.map(item => {
          return {
            productCode: item.productCode,
            quantity: item.quantity,
            discountRate: item.discountRate,
          };
        }),
      });

      if (response) {
        toast.success('주문이 완료되었습니다.');
        handleRemoveWishlistClick('all');
        onConfirmOrder && onConfirmOrder();

        router.push('/order');
      }
    } catch (error) {
      console.error('!! ERROR', error);
      toast.error('주문 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg sm:text-2xl font-bold'>{title}</h2>
        <button
          className='btn btn-sm sm:btn-md btn-outline-neutral'
          onClick={() => setOpenRemoveAllDialog(true)}
        >
          {clearButtonText}
        </button>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {wishlist.map(wishlistItem => {
          if (!wishlistItem.product) return null;
          return (
            <ProductCard
              key={wishlistItem.productCode}
              defaultQuantity={wishlistItem.quantity}
              defaultDiscountRate={wishlistItem.discountRate}
              onChangeQuantity={handleQuantityChange}
              onChangeDiscountRate={handleDiscountRateChange}
              onRemoveWishlistClick={() => {
                setOpenRemoveItemDialog(true);
                selectedProductCode = wishlistItem.productCode;
              }}
              {...wishlistItem.product}
            />
          );
        })}
      </div>

      <div className='divider' />
      <div className='flex justify-between md:items-center flex-col md:flex-row'>
        <div className='md:block flex justify-between'>
          <span className='mr-4'>
            <span className='text-md lg:text-lg text-neutral-400 font-semibold mr-2'>
              총 수량
            </span>
            <span className='text-xl lg:text-3xl text-neutral-800 font-semibold'>
              {wishlist.reduce((acc, cur) => {
                return acc + cur.quantity;
              }, 0)}
            </span>
          </span>
          <span>
            <span className='text-md lg:text-lg text-neutral-400 font-semibold mr-2'>
              예상 매입가
            </span>
            <span className='text-xl md:text-3xl text-neutral-800 font-semibold'>
              {convertNumberToKRW(getTotalPrice())} 원
            </span>
          </span>
        </div>
        <button
          className='btn btn-md btn-neutral md:max-w-xs w-full'
          onClick={() => setOpenPurchaseDialog(true)}
          disabled={wishlist.length === 0}
        >
          {confirmButtonText}
        </button>
      </div>

      <ConfirmDialog
        title='상품 지우기'
        open={openRemoveItemDialog}
        onClose={() => setOpenRemoveItemDialog(false)}
        onConfirm={() => {
          handleRemoveWishlistClick(selectedProductCode!);
          setOpenRemoveItemDialog(false);
        }}
      >
        상품을 지우시겠습니까?
      </ConfirmDialog>

      <ConfirmDialog
        title={clearDialogText.title}
        onConfirm={() => {
          handleRemoveWishlistClick('all');
          setOpenRemoveAllDialog(false);
        }}
        open={openRemoveAllDialog}
        onClose={() => setOpenRemoveAllDialog(false)}
      >
        {clearDialogText.content}
      </ConfirmDialog>

      <ConfirmDialog
        title='주문 확인'
        onConfirm={handleConfirmOrder}
        confirmText='주문하기'
        cancelText='취소'
        open={openPurchaseDialog}
        onClose={() => setOpenPurchaseDialog(false)}
      >
        거래명세서를 받을 연락처와 배송지를 확인해주세요.
        <br />
        정보 변경이 필요한 경우 담당자에게 연락주시기 바랍니다.
        <br />
        <br />
        <strong>{userData?.tel}</strong>
        <br />
        <strong>
          {userData?.businessAddress?.address} {userData?.businessAddressDetail}
        </strong>
      </ConfirmDialog>
    </div>
  );
}
