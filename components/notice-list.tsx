import { ChevronRightIcon } from '@heroicons/react/24/solid';
import HeadLabel from './head-label';
import { IProduct } from '@/src/models/product';

function NoticeItem() {
  return (
    <div className='px-6 py-4 border border-solid border-neutral-300 rounded-xl flex justify-between mb-4'>
      <h6>OOO타이어 명절 배송 휴무 공지</h6>
      <a className='text-neutral-500'>
        더보기 <ChevronRightIcon className='w-5 h-5 inline' />
      </a>
    </div>
  );
}

export default function NoticeList() {
  return (
    <div>
      <HeadLabel className='mb-4 text-neutral-600'>공지</HeadLabel>
      <NoticeItem />
      <NoticeItem />
    </div>
  );
}
