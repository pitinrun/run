import { getOrderById } from '@/src/services/order';
import WishlistDashboardClient from '../../components/wishlist-dashboard-client';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getUser } from '@/src/services/user';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ErrorAlert from 'components/error-alert';

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
      throw new Error('401');
    }

    if (!orderData) {
      throw new Error('404');
    }

    const isAdmin = userData.role && userData.role >= 9;
    const isOwner = userData.userId === orderData.userId;

    if (!isOwner && !isAdmin) {
      throw new Error('403');
    }

    return (
      <div className='container'>
        <WishlistDashboardClient userData={userData} orderData={orderData} />
      </div>
    );
  } catch (error) {
    console.error('!! ERROR:', error);
    return <ErrorAlert statusCode={error.message ?? 500} />;
  }
}
