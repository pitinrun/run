'use client';

import { createContext, useState } from 'react';

export const NoticeModalContext = createContext<{
  openModal: () => void;
  closeModal: () => void;
  noticeId: string;
  setNoticeModalId: React.Dispatch<React.SetStateAction<string | null>>;
  open: boolean;
}>({
  openModal: () => {},
  closeModal: () => {},
  noticeId: '',
  setNoticeModalId: () => {},
  open: false,
});

export default function NoticeModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [noticeId, setNoticeId] = useState('');

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  const setNoticeModalId = (id: string) => setNoticeId(id);

  return (
    <NoticeModalContext.Provider
      value={{
        openModal,
        closeModal,
        noticeId,
        setNoticeModalId,
        open,
      }}
    >
      {children}
    </NoticeModalContext.Provider>
  );
}
