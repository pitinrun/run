import { getNoticeList } from '@/src/services/notice';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import Header from 'components/Header';
import dayjs from 'dayjs';
import jsdom from 'jsdom';
import Link from 'next/link';
import NoticeTable from './components/notice-table';
import { INotice } from '@/src/types';
import NoticeModalProvider from 'contexts/notice-modal.context';

export default async function NoticesPage() {
  const noticesOrigin = await getNoticeList();

  const notices = noticesOrigin.map(notice => {
    return {
      ...notice,
      _id: notice._id.toString(),
      content: new jsdom.JSDOM(
        notice.content
      ).window.document.body.textContent?.slice(0, 50),
    };
  });

  return (
    <NoticeModalProvider>
      <div className='container'>
        <div className='overflow-x-auto'>
          <Header>공지사항</Header>
          <div className='text-right'>
            <Link href='/manage/notices/create'>
              <button className='btn'>공지사항 작성</button>
            </Link>
          </div>
          <NoticeTable notices={notices as (INotice & { _id: string })[]} />
        </div>
      </div>
    </NoticeModalProvider>
  );
}
