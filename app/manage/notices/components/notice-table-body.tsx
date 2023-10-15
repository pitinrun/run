'use client';
import { INotice } from '@/src/types';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import NoticeModalProvider from 'contexts/notice-modal.context';
import dayjs from 'dayjs';
import Link from 'next/link';

/**
 * @needs NoticeModalProvider가 필요합니다.
 */
export default function NoticeTableBody({
  notices,
}: {
  notices: (INotice & { _id: string })[];
}) {
  return (
    <tbody>
      {notices.map(notice => {
        return (
          <tr className='hover cursor-pointer'>
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
  );
}
