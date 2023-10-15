import { getNoticeList } from '@/src/services/notice';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import Header from 'components/Header';
import dayjs from 'dayjs';
import jsdom from 'jsdom';
import Link from 'next/link';

export default async function NoticesPage() {
  const notices = await getNoticeList();

  const noticesForDom = notices.map(notice => {
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
          <tbody>
            {noticesForDom.map(notice => {
              return (
                <tr>
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
      </div>
    </div>
  );
}
