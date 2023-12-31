import ManageOrderContainer from '../components/manage-order-container';
import ManageOrderList from '../components/manage-order-list';

export default function ManageOrderPage({}) {
  return (
    <div className='container'>
      <h1 className='text-lg sm:text-2xl font-bold mb-3 sm:mb-6'>
        관리자 주문 관리
      </h1>
      <ManageOrderContainer />
    </div>
  );
}
