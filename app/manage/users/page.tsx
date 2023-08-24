const dummyUsers = [
  {
    id: 1,
    name: '삼호타이어',
    phone: '010-1234-1234',
    email: 'alfkzmf@namver.com',
    address: '서울시 강남구'
  },
  {
    name: '삼호타이어',
    phone: '010-1234-1234',
    email: 'alfkzmf@namver.com',
    address: '서울시 강남구'
  }
]

export default function UserPage() {
  return (
    <div className='container'>
      <h1 className='text-3xl font-bold mb-2'>회원 관리</h1>
      <div className='text-right mb-4'>
        <input
          type='text'
          placeholder='사업자명'
          className='input input-bordered w-full max-w-xs'
        />
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
            {/* row 1 */}
            {dummyUsers.map(user => {
              return (
                <tr key={`user-${user.id}`}>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
