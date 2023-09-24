import OrderList from '@/app/order/components/order-list';

export default function ManageOrderPage({}) {
  return (
    <div className='container'>
      <h1 className='text-lg sm:text-2xl font-bold mb-3 sm:mb-6'>주문 관리</h1>
      <OrderList />
    </div>
  );
}
