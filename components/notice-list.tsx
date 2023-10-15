'use client';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Header from './Header';
import { INotice } from '@/src/types';
import { NoticeDetailModal } from './notice-detail-modal';
import { useContext, useState } from 'react';
import { NoticeModalContext } from 'contexts/notice-modal.context';

function NoticeItem({
  title,
  onClick,
}: {
  title?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className='px-6 py-4 border border-solid border-neutral-300 rounded-xl flex justify-between mb-4 cursor-pointer'
      onClick={onClick}
    >
      <h6 className='text-sm sm:text-lg'>{title}</h6>
      <a className='text-sm sm:text-lg text-neutral-500'>
        더보기 <ChevronRightIcon className='w-5 h-5 inline' />
      </a>
    </div>
  );
}

const MAXIMUM = 6;

export default function NoticeList({
  notices,
}: {
  notices: (INotice & { _id: string })[];
}) {
  const { setNoticeModalId, openModal } = useContext(NoticeModalContext);
  const [onMore, setOnMore] = useState(false);

  return (
    <div>
      <Header>공지</Header>
      {notices.map((notice, index) => {
        if (!onMore && index === MAXIMUM) return;
        return (
          <NoticeItem
            title={notice.title}
            key={`notice-${notice._id}`}
            onClick={() => {
              setNoticeModalId(notice._id);
              openModal();
            }}
          />
        );
      })}
      {!onMore && notices.length > MAXIMUM && (
        <div className='flex justify-end'>
          <button
            className='underline text-sm sm:text-lg text-neutral-500'
            onClick={() => {
              setOnMore(true);
            }}
          >
            공지 전체 보기
            <ChevronRightIcon className='w-5 h-5 inline' />
          </button>
        </div>
      )}
      <NoticeDetailModal />
    </div>
  );
}
