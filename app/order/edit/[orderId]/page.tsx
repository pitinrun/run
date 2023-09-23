import { getOrderById } from '@/src/services/order';
import WishlistDashboardClient from './wishlist-dashboard-client';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getUser } from '@/src/services/user';
import ErrorAlert from 'components/common/error-alert';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function OrderEditPage({
  params: { orderId },
}: {
  params: { orderId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/403');
  }

  try {
    const userData = await getUser(session?.user.id);
    const orderData = await getOrderById(orderId);

    if (!userData) {
      throw new Error('사용자 정보를 불러올 수 없습니다.');
    }

    if (!orderData) {
      throw new Error('주문 정보를 불러올 수 없습니다.');
    }

    return (
      <div className='container'>
        <WishlistDashboardClient userData={userData} orderData={orderData} />
      </div>
    );
  } catch (error) {
    console.error('!! ERROR:', error);
    return <ErrorAlert statusCode={500}>{error.message}</ErrorAlert>;
  }
}
