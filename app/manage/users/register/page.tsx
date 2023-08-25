const dummyUsers = [
  {
    id: 1,
    company: '삼호타이어',
    phone: '010-1234-1234',
    email: 'alfkzmf@namver.com',
    address: '서울시 강남구'
  },
  {
    id: 2,
    company: '삼호타이어',
    phone: '010-1234-1234',
    email: 'alfkzmf@namver.com',
    address: '서울시 강남구'
  }
]

function Label({
  children,
  forName
}: {
  children: React.ReactNode
  forName?: string
}) {
  return (
    <label className='label'>
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

export default function UserRegisterPage() {
  return (
    <div className='container'>
      <h1 className='text-3xl font-bold mb-4'>회원 등록</h1>
      <div className='rounded bg-stone-100 sm:px-24 px-2 py-8 mb-2'>
        <Label forName='사업자명'>사업자명</Label>
        <Input name='사업자명' placeholder='사업자명' />

        <Label forName='대표자명'>대표자명</Label>
        <Input name='대표자명' placeholder='대표자명' />

        <Label forName='사업자명'>사업자명</Label>
        <Input name='사업자명' placeholder='사업자명' />

        <Label forName='사업자명'>사업자명</Label>
        <Input name='사업자명' placeholder='사업자명' />

        <Label forName='사업자명'>사업자명</Label>
        <Input name='사업자명' placeholder='사업자명' />

        <Label forName='사업자명'>사업자명</Label>
        <Input name='사업자명' placeholder='사업자명' />

        <Label forName='사업자명'>사업자명</Label>
        <Input name='사업자명' placeholder='사업자명' />
      </div>
      <div className="text-right">
        <button className='btn btn-primary w-full max-w-xs'>등록</button>
      </div>
    </div>
  )
}
