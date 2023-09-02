import { google } from 'googleapis'
import { client_email, private_key } from '.meta/google-credentials.json'
export default function ProductPage() {
  return (
    <div>
      <h1 className='text-3xl font-bold mb-4'>상품 관리</h1>
      <p>
        {
          client_email
        }
      </p>
      <button onClick={() => {
        
      }}>스프레드시트 데이터 연동</button>
    </div>
  )
}
