'use client';

import { getNoticeById } from '@/app/manage/api';
import { isAxiosError } from 'axios';
import { createContext, useEffect, useState } from 'react';

export const NoticeModalContext = createContext<{
  openModal: () => void;
  closeModal: () => void;
  noticeId: string;
  setNoticeModalId: React.Dispatch<React.SetStateAction<string | null>>;
  open: boolean;
  content: string;
  title: string;
}>({
  openModal: () => {},
  closeModal: () => {},
  setNoticeModalId: () => {},
  open: false,
  noticeId: '',
  content: '',
  title: '',
});

export default function NoticeModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [noticeId, setNoticeId] = useState('');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const notice = await getNoticeById(noticeId);
        setContent(notice.content);
        setTitle(notice.title);
      } catch (e) {
        if (isAxiosError(e)) {
          console.error('!! ERROR: ', e.response?.data);
        }
      }
    };

    if (noticeId) fetchNotice();

    return () => {
      setContent('');
      setTitle('');
    };
  }, [noticeId]);

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
        content,
        title,
      }}
    >
      {children}
    </NoticeModalContext.Provider>
  );
}
