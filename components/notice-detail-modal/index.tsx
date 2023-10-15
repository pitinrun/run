'use client';
import { NoticeModalContext } from 'contexts/notice-modal.context';
import dayjs from 'dayjs';
import { useContext } from 'react';
import './style.css';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function NoticeDetailModal() {
  const { closeModal, open, content, title, noticeId } = useContext(NoticeModalContext);
  const { data: session, status } = useSession();
  const { role, id } = session?.user ?? {};

  const isAdmin = role === 10 || role === 9;

  const modalClass = open ? 'modal modal-open' : 'modal';

  return (
    <dialog className={modalClass}>
      <div className='modal-box text-center'>
        <h3 className='font-bold text-lg'>{title}</h3>
        {isAdmin && (
          <div className='text-right'>
            <button className='btn btn-sm mr-2'>
              <Link href={`/manage/notices/${noticeId}/edit`}>수정</Link>
            </button>
            <button className='btn btn-sm'>
              <a href={`/manage/notices/${id}/edit`}>삭제</a>
            </button>
          </div>
        )}
        <div
          className='text-base mb-4 break-keep overflow-y-auto max-h-96'
          dangerouslySetInnerHTML={{ __html: content ?? '' }}
        />
        <div className='modal-action w-full'>
          {/* if there is a button in form, it will close the modal */}
          <button className='btn flex-1' onClick={closeModal}>
            {'닫기'}
          </button>
        </div>
      </div>
      <form method='dialog' className='modal-backdrop' onClick={closeModal}>
        <button>close</button>
      </form>
    </dialog>
  );
}
