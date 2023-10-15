'use client';
import { INotice } from '@/src/types';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { NoticeDetailModal } from 'components/notice-detail-modal';
import { NoticeModalContext } from 'contexts/notice-modal.context';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useContext } from 'react';

/**
 * @needs 상위 컴포넌트에 `NoticeModalProvider`가 필요합니다.
 */
export default function NoticeTable({
  notices,
}: {
  notices: (INotice & { _id: string })[];
}) {
  const { setNoticeModalId, openModal } = useContext(NoticeModalContext);

  return (
    <div>
      <table className='table'>
        <thead>
          <tr>
            <th>게시일</th>
            <th>제목</th>
            <th>내용</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {notices.map(notice => {
            return (
              <tr
                className='hover cursor-pointer'
                key={`notice-${notice._id}`}
                onClick={() => {
                  setNoticeModalId(notice._id);
                  openModal();
                }}
              >
                <td>{dayjs(notice.createdAt).format('YYYY-MM-DD')}</td>
                <td className='w-32'>{notice.title}</td>
                <td>{notice.content}</td>
                <td>
                  <Link href={`/manage/notices/${notice._id}/edit`}>
                    <button className='btn btn-sm'>
                      <PencilSquareIcon className='w-4 h-4 md:w-5 md:h-5' />
                    </button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <NoticeDetailModal />
    </div>
  );
}
