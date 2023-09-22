import { User } from '@/src/models/user';
import { IUser } from '@/src/types';

export default async function UserPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { businessName: string };
}) {
  const getUser = async () => {
    let users = [] as IUser[];
    if (searchParams.businessName) {
      users = await User.find({
        businessName: {
          $regex: searchParams.businessName,
        },
      }).lean();
    } else users = await User.find({});

    return users;
  };

  const users = await getUser();

  return (
    <div className='container'>
      <h1 className='text-3xl font-bold mb-2'>회원 관리</h1>
      <div className='text-right mb-4'>
        <form action='/manage/users' method='GET'>
          <input
            type='text'
            placeholder='사업자명'
            className='input input-bordered w-full max-w-xs mr-2'
            name='businessName'
            defaultValue={searchParams?.businessName ?? ''}
            autoFocus
          />
          <input type='submit' value='검색' className='btn btn-primary' />
        </form>
      </div>
      <div className='overflow-x-auto'>
        <table className='table w-full'>
          {/* head */}
          <thead>
            <tr>
              <th>사업자명</th>
              <th>담당자 휴대폰 번호</th>
              <th>이메일</th>
              <th>사업장 주소</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              return (
                <tr key={`user-${user}`}>
                  <td>{user.businessName}</td>
                  <td>{user.tel}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.businessAddress?.address +
                      (user.businessAddressDetail ?? '')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
