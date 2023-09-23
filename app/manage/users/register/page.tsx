// app/manage/users/register/page.tsx
'use client';

import { createUserRequest } from 'requests/user';
import { IUser } from '@/src/types';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DaumPostcodeEmbed, { type Address } from 'react-daum-postcode';
import { toast } from 'react-toastify';

export default function UserRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<
    IUser & {
      confirmPassword: string;
    }
  >({
    businessName: '',
    ownerName: '',
    password: '',
    confirmPassword: '',
    userId: '',
    tel: '',
    email: '',
    businessAddress: null, // 주석 처리
    businessAddressDetail: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 4) {
      toast.error('비밀번호는 4자리 이상이어야 합니다.');
      return;
    }

    try {
      await createUserRequest(formData);
      toast.success('성공적으로 등록되었습니다.');

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

  return (
    <div className='container'>
      <h1 className='text-3xl font-bold mb-4'>회원 등록</h1>
      <form onSubmit={handleSubmit}>
        <div className='rounded bg-stone-100 sm:px-24 px-2 py-8 mb-2'>
          <h6>사업자명</h6>
          <input
            type='text'
            name='businessName'
            className='input w-full max-w-xs p-4 border rounded-md'
            placeholder='사업자명 입력'
            required
            onChange={handleChange}
          />
          <h6>대표자명</h6>
          <input
            type='text'
            className='input w-full max-w-xs p-4 border rounded-md'
            placeholder='사업자명 입력'
            name='ownerName'
            required
            onChange={handleChange}
          />
          <h6>비밀번호</h6>
          <input
            type='password'
            className='input w-full max-w-xs p-4 border rounded-md'
            placeholder='4자리 이상'
            name='password'
            required
            onChange={handleChange}
          />
          <h6>비밀번호 확인</h6>
          <input
            type='password'
            className='input w-full max-w-xs p-4 border rounded-md'
            placeholder='비밀번호 재입력'
            name='confirmPassword'
            required
            onChange={handleChange}
          />
          <h6>사업자번호</h6>
          <input
            type='text'
            className='input w-full max-w-xs p-4 border rounded-md'
            placeholder={`'-' 없이 숫자만 입력`}
            name='userId'
            required
            onChange={handleChange}
          />
          <h6>담당자 휴대폰 번호</h6>
          <input
            type='tel'
            className='input w-full max-w-xs p-4 border rounded-md'
            placeholder={`'-' 없이 숫자만 입력`}
            name='tel'
            required
            onChange={handleChange}
          />
          <h6>이메일</h6>
          <input
            type='email'
            className='input w-full max-w-xs p-4 border rounded-md'
            placeholder={`이메일 입력`}
            name='email'
            required
            onChange={handleChange}
          />
          <div className='mb-4'>
            <h6>사업장 주소</h6>
            <input
              type='text'
              className='input w-full max-w-xs p-4 border rounded-md mr-4'
              placeholder={`사업장 주소 입력`}
              disabled
              required
              value={formData.businessAddress?.address || ''}
            />
            <input
              type='text'
              className='input w-full max-w-xs p-4 border rounded-md'
              placeholder={`상세 주소 입력`}
              name='businessAddressDetail'
              onChange={handleChange}
            />
          </div>
          <DaumPostcodeEmbed
            autoClose={false}
            className='h-96'
            onComplete={data => {
              setFormData(prev => ({
                ...prev,
                businessAddress: data,
              }));
            }}
          />
        </div>
        <div className='text-right'>
          <button className='btn btn-primary w-full max-w-xs'>등록</button>
        </div>
      </form>
    </div>
  );
}
