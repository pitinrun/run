import NoticeList from 'components/notice-list';
import ProductSearchBar from 'components/product-search-bar';
import ProductCardDashboard__V2 from 'components/product-card-dashboard-v2';
import NoticeModalProvider from 'contexts/notice-modal.context';
import { getNoticeList } from '@/src/services/notice';
import jsdom from 'jsdom';
import { INotice } from '@/src/types';

export default async function HomePage() {
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
        <div className='mb-4'>
          <h2 className='text-3xl	font-bold text-center'>
            <span
              style={{
                color: 'var(--run-red-1)',
              }}
            >
              사이즈
            </span>
            를 입력해주세요.
          </h2>
        </div>
        <ProductSearchBar className='mb-12 mx-auto' />
        <NoticeList notices={notices as (INotice & { _id: string })[]} />
        <ProductCardDashboard__V2 onlySpecialDiscount />
      </div>
    </NoticeModalProvider>
  );
}
