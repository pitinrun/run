import OrderList from '@/app/order/components/order-list';

export default function OrderPage() {
  return (
    <div className='container'>
      <h1 className='text-lg sm:text-2xl font-bold mb-3 sm:mb-6'>주문내역</h1>
      <OrderList />
    </div>
  );
}
