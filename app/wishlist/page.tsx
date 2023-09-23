// app/wishlist/page.tsx
import { getServerSession } from 'next-auth';
import { getUser } from '@/src/services/user';
import { redirect } from 'next/navigation';
import WishlistDashboardClient from './wishlist-dashboard-client';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function WishListPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/sign-in');
  }

  const userData = await getUser(session?.user.id);

  if (!userData) {
    redirect('/auth/sign-in');
  }

  return (
    <div className='container'>
      <WishlistDashboardClient userData={userData} />
    </div>
  );
}
