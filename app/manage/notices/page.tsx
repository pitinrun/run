import { getNoticeList } from '@/src/services/notice';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import Header from 'components/Header';
import dayjs from 'dayjs';
import jsdom from 'jsdom';
import Link from 'next/link';
import NoticeTableBody from './components/notice-table-body';
import { INotice } from '@/src/types';

export default async function NoticesPage() {
  const noticesOrigin = await getNoticeList();

  const notices = noticesOrigin.map(notice => {
    return {
      ...notice,
      content: new jsdom.JSDOM(
        notice.content
      ).window.document.body.textContent?.slice(0, 50),
    };
  });

  return (
    <div className='container'>
      <div className='overflow-x-auto'>
        <Header>공지사항</Header>
        <div className='text-right'>
          <Link href='/manage/notices/create'>
            <button className='btn'>공지사항 작성</button>
          </Link>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>게시일</th>
              <th>제목</th>
              <th>내용</th>
              <th>수정</th>
            </tr>
          </thead>
          <NoticeTableBody notices={notices as (INotice & { _id: string })[]} />
        </table>
      </div>
    </div>
  );
}
