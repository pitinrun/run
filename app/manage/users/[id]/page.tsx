const dummyUser = {
  businessNum: '0000-00-00000',
  owner: '홍길동',
  phone: '010-1234-1234',
  email: 'alfkzmf@namver.com',
  address: '서울특별시 용산구 한남대로 2973-1'
}

function Label({
  children,
  className,
  htmlFor
}: {
  children: React.ReactNode
  className?: string
  htmlFor?: string
}) {
  return (
    <label className={`label px-0 ${className}`} htmlFor={htmlFor}>
      <span className='label-text'>{children}</span>
    </label>
  )
}

const Input = ({
  placeholder,
  name
}: {
  placeholder: string
  name?: string
}) => {
  return (
    <input
      type='text'
      placeholder={placeholder}
      className='input input-bordered w-full max-w-lg'
    />
  )
}

export default function UserPage() {
  return (
    <div className='container'>
      <h1 className='text-3xl font-bold mb-4'>{dummyUser.owner}</h1>
      <div className='rounded bg-stone-100 sm:px-24 px-2 py-8 mb-2'>
        <div className='py-3'>
          <Label htmlFor='사업자번호'>사업자번호</Label>
          <h1>{dummyUser.businessNum}</h1>
        </div>

        <div className='py-3'>
          <Label htmlFor='대표자명'>대표자명</Label>
          <h1>{dummyUser.owner}</h1>
        </div>

        <div className='py-3'>
          <Label htmlFor='사업자번호'>담당자 휴대폰 번호</Label>
          <h1>{dummyUser.phone}</h1>
        </div>

        <div className='py-3'>
          <Label htmlFor='이메일'>이메일</Label>
          <h1>{dummyUser.email}</h1>
        </div>

        <div className='py-3'>
          <Label htmlFor='사업장 주소'>사업장 주소</Label>
          <h1>{dummyUser.address}</h1>
        </div>
      </div>
      <div className='flex justify-end gap-4'>
        <button className='btn btn-primary w-full max-w-xs'>
          비밀번호 재설정
        </button>
        <button className='btn btn-secondary w-full max-w-xs'>수정하기</button>
      </div>
    </div>
  )
}
