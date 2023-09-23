// app/wishlist/page.tsx
import { getServerSession } from 'next-auth';
import { getUser } from '@/src/services/user';
import { redirect } from 'next/navigation';
import WishlistDashboardClient from './wishlist-dashboard-client';

export default async function WishListPage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/403');
  }

  const userData = await getUser(session?.user.id);

  return (
    <div className='container'>
      <WishlistDashboardClient userData={userData} />
    </div>
  );
}
