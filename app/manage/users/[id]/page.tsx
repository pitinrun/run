import { getUser, getUserById } from '@/src/services/user';
import Link from 'next/link';

function Label({
  children,
  className,
  htmlFor,
}: {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <label className={`label px-0 ${className}`} htmlFor={htmlFor}>
      <span className='label-text'>{children}</span>
    </label>
  );
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id);

  if (!user) return <div>유저를 찾을 수 없습니다.</div>;

  return (
    <div className='container'>
      <h1 className='text-3xl font-bold mb-4'>{user.businessName}</h1>
      <div className='rounded bg-stone-100 sm:px-24 px-2 py-8 mb-2'>
        <div className='py-3'>
          <Label htmlFor='사업자번호'>사업자번호</Label>
          <h1>{user.userId}</h1>
        </div>

        <div className='py-3'>
          <Label htmlFor='대표자명'>대표자명</Label>
          <h1>{user.ownerName}</h1>
        </div>

        <div className='py-3'>
          <Label htmlFor='사업자번호'>담당자 휴대폰 번호</Label>
          <h1>{user.tel}</h1>
        </div>

        <div className='py-3'>
          <Label htmlFor='이메일'>이메일</Label>
          <h1>{user.email}</h1>
        </div>

        <div className='py-3'>
          <Label htmlFor='사업장 주소'>사업장 주소</Label>
          <h1>
            {user.businessAddress?.address} {user.businessAddressDetail}
          </h1>
        </div>
      </div>
      <div className='flex md:justify-end gap-4'>
        {/* <button className='btn btn-primary flex-1 md:w-full md:max-w-xs'>
          비밀번호 재설정
        </button> */}
        <Link
          className='flex-1 md:w-full md:max-w-xs'
          href={`/manage/users/${user._id}/edit`}
        >
          <button className='btn btn-primary w-full'>수정하기</button>
        </Link>
      </div>
    </div>
  );
}
