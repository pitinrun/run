'use client';
// app/manage/components/manage-order-context.tsx
import React, { createContext, useState, useContext } from 'react';
import { ResponseGetOrdersForManager } from 'requests/manage/order.api';

type ModalType = 'stock' | 'delivered';

export const OrderModalContext = createContext<{
  modalType: ModalType | null;
  orderId: string | null;
  setOrderId: React.Dispatch<React.SetStateAction<string | null>>;
  openModal: (modalType: ModalType) => void;
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
  modalType: null,
  orderId: null,
  setOrderId: () => {},
  openModal: (modalType: string) => {},
  closeModal: () => {},
  products: [],
  setProducts: () => {},
  userData: null,
  setUserData: () => {},
});

export default function OrderModalProvider({ children }) {
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [products, setProducts] = useState<
    ResponseGetOrdersForManager['products'] | null
  >(null);
  const [userData, setUserData] = useState<
    ResponseGetOrdersForManager['userData'] | null
  >(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const openModal = (modalType: ModalType) => setModalType(modalType);
  const closeModal = () => setModalType(null);

  return (
    <OrderModalContext.Provider
      value={{
        modalType,
        orderId,
        setOrderId,
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
