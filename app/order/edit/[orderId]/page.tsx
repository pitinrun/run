import { getOrderById } from '@/src/services/order';
import WishlistDashboard from 'components/wishlist/wishlist-dashboard';

export default async function OrderEditPage({
  params: { orderId },
}: {
  params: { orderId: string };
}) {
  try {
    const orderData = await getOrderById(orderId);
  } catch (error) {
    console.error(error);
  }

  return <div className='container'>{/* <WishlistDashboard /> */}</div>;
}
