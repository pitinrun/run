import { getNoticeList } from '@/src/services/notice';
import { PencilIcon, PencilSquareIcon } from '@heroicons/react/20/solid';
import dayjs from 'dayjs';
import jsdom from 'jsdom';

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
        <table className='table'>
          <thead>
            <tr>
              <th>게시일</th>
              <th>제목</th>
              <th>내용</th>
              <th>수정</th>
            </tr>
          </thead>
          {noticesForDom.map(notice => {
            return (
              <tr>
                <td>{dayjs(notice.createdAt).format('YYYY-MM-DD')}</td>
                <td className='w-32'>{notice.title}</td>
                <td>{notice.content}</td>
                <td>
                  <button className='btn btn-sm'>
                    <PencilSquareIcon className='w-4 h-4 md:w-5 md:h-5' />
                  </button>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
}
