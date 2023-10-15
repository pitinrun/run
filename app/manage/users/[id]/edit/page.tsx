// app/manage/users/[id]/edit/page.tsx
'use client';

import { IUser } from '@/src/types';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DaumPostcodeEmbed, { type Address } from 'react-daum-postcode';
import { toast } from 'react-toastify';
import { getUserById, updateUser } from 'requests/user.api';

export default function UserEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [userData, setUserData] = useState<(IUser & { _id: string }) | null>(
    null
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserById(params.id);
      setUserData(data);
    };

    fetchUser();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData(prevState => {
      if (!prevState) return null;
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!userData) return;

    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        toast.error('비밀번호가 일치하지 않습니다.');
        return;
      }

      if (password.length < 4) {
        toast.error('비밀번호는 4자리 이상이어야 합니다.');
        return;
      }

      userData.password = password;
    }

    try {
      await updateUser(userData._id, userData);
      toast.success('성공적으로 수정되었습니다.');

      router.push('/manage/users');
    } catch (error) {
      console.error('!! ERROR', error);
      if (isAxiosError(error)) {
        toast.error(
          `에러 발생: ${error.response?.data.message || '알 수 없는 오류'}`
        );
      }
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className='container'>
      <h1 className='text-3xl font-bold mb-4'>회원 정보 수정</h1>
      <form onSubmit={handleSubmit}>
        <div className='rounded bg-stone-100 sm:px-24 px-2 py-8 mb-2'>
          <h6>사업자명</h6>
          <input
            type='text'
            name='businessName'
            className='input w-full max-w-xs p-4 border rounded-md'
            placeholder='사업자명 입력'
            required
            value={userData.businessName}
            onChange={handleChange}
          />

          <h6>대표자명</h6>
          <input
            type='text'
            className='input w-full max-w-xs p-4 border rounded-md'
            placeholder='대표자명 입력'
            name='ownerName'
            required
            value={userData.ownerName}
            onChange={handleChange}
          />

          <h6>사업자번호</h6>
          <input
            type='text'
            className='input w-full max-w-xs p-4 border rounded-md'
            placeholder={`'-' 없이 숫자만 입력`}
            name='userId'
            required
            value={userData.userId}
            onChange={handleChange}
          />

          <h6>담당자 휴대폰 번호</h6>
          <input
            type='tel'
            className='input w-full max-w-xs p-4 border rounded-md'
            placeholder={`'-' 없이 숫자만 입력`}
            name='tel'
            required
            value={userData.tel}
            onChange={handleChange}
          />

          <h6>이메일</h6>
          <input
            type='email'
            className='input w-full max-w-xs p-4 border rounded-md'
            placeholder={`이메일 입력`}
            name='email'
            required
            value={userData.email}
            onChange={handleChange}
          />

          <h6>비밀번호</h6>
          <input
            type='password'
            className='input w-full max-w-xs p-4 border rounded-md'
            placeholder='4자리 이상 (변경하려면 입력)'
            name='password'
            value={password}
            onChange={handleChangePassword}
            minLength={4}
          />
          <h6>비밀번호 확인</h6>
          <input
            type='password'
            className='input w-full max-w-xs p-4 border rounded-md'
            placeholder='비밀번호 재입력'
            name='confirmPassword'
            value={confirmPassword}
            onChange={handleChangePassword}
            minLength={4}
          />

          <h6>역할(Role)</h6>
          <select
            name='role'
            className='select select-bordered w-full max-w-xs mb-4'
            value={userData.role}
            onChange={handleChange}
          >
            <option value={0}>거래처</option>
            <option value={9}>일반 관리자</option>
            <option value={10}>마스터 관리자</option>
          </select>

          <div className='mb-4'>
            <h6>사업장 주소</h6>
            <input
              type='text'
              className='input w-full max-w-xs p-4 border rounded-md mr-4'
              placeholder={`사업장 주소 입력`}
              disabled
              required
              value={userData.businessAddress?.address || ''}
            />
            <input
              type='text'
              className='input w-full max-w-xs p-4 border rounded-md'
              placeholder={`상세 주소 입력`}
              name='businessAddressDetail'
              value={userData.businessAddressDetail}
              onChange={handleChange}
            />
          </div>
          <DaumPostcodeEmbed
            autoClose={false}
            className='h-96'
            onComplete={data => {
              if (!userData) return;

              setUserData(prev => {
                if (!prev) return null;

                return {
                  ...prev,
                  businessAddress: data,
                };
              });
            }}
          />

          <div className='text-right'>
            <button className='btn btn-primary w-full max-w-xs'>수정</button>
          </div>
        </div>
      </form>
    </div>
  );
}
