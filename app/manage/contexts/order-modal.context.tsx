'use client'
// app/manage/components/manage-order-context.tsx
import React, { createContext, useState, useContext } from 'react';
import { ResponseGetOrdersForManager } from 'requests/manage/order.api';

export const OrderModalContext = createContext<{
  isVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
  products: ResponseGetOrdersForManager['products'] | null;
  setProducts: React.Dispatch<
    React.SetStateAction<ResponseGetOrdersForManager['products']>
  >;
  userData: ResponseGetOrdersForManager['userData'] | null;
  setUserData: React.Dispatch<
    React.SetStateAction<ResponseGetOrdersForManager['userData']>
  >;
}>({
  isVisible: false,
  openModal: () => {},
  closeModal: () => {},
  products: [],
  setProducts: () => {},
  userData: null,
  setUserData: () => {},
});

export default function OrderModalProvider({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState<
    ResponseGetOrdersForManager['products'] | null
  >(null);
  const [userData, setUserData] = useState<
    ResponseGetOrdersForManager['userData'] | null
  >(null);

  const openModal = () => setIsVisible(true);
  const closeModal = () => setIsVisible(false);

  return (
    <OrderModalContext.Provider
      value={{
        isVisible,
        openModal,
        closeModal,
        products,
        setProducts,
        userData,
        setUserData,
      }}
    >
      {children}
    </OrderModalContext.Provider>
  );
}
