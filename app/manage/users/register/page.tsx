// app/manage/users/register/page.tsx
'use client';

import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function UserRegisterPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    password: '',
    confirmPassword: '',
    userId: '',
    tel: '',
    email: '',
    // businessAddress: '', // 주석 처리
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

    try {
      const response = await axios.post('/api/users', {
        ...formData,
      });
      toast.success('성공적으로 등록되었습니다.');
      console.log('Server Response:', response.data);
    } catch (error) {
      toast.error(`에러 발생: ${error.response?.data || '알 수 없는 오류'}`);
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
            className='w-full max-w-xs p-4 border rounded-md'
            placeholder='사업자명 입력'
            onChange={handleChange}
          />
          <h6>대표자명</h6>
          <input
            type='text'
            className='w-full max-w-xs p-4 border rounded-md'
            placeholder='사업자명 입력'
            name='ownerName'
            onChange={handleChange}
          />
          <h6>비밀번호</h6>
          <input
            type='password'
            className='w-full max-w-xs p-4 border rounded-md'
            placeholder='4자리 이상'
            name='password'
            onChange={handleChange}
          />
          <h6>비밀번호 확인</h6>
          <input
            type='password'
            className='w-full max-w-xs p-4 border rounded-md'
            placeholder='비밀번호 재입력'
            name='confirmPassword'
            onChange={handleChange}
          />
          <h6>사업자번호</h6>
          <input
            type='text'
            className='w-full max-w-xs p-4 border rounded-md'
            placeholder={`'-' 없이 숫자만 입력`}
            name='userId'
            onChange={handleChange}
          />
          <h6>담당자 휴대폰 번호</h6>
          <input
            type='tel'
            className='w-full max-w-xs p-4 border rounded-md'
            placeholder={`'-' 없이 숫자만 입력`}
            name='tel'
            onChange={handleChange}
          />
          <h6>이메일</h6>
          <input
            type='email'
            className='w-full max-w-xs p-4 border rounded-md'
            placeholder={`이메일 입력`}
            name='email'
            onChange={handleChange}
          />
          {/* <h6>사업장 주소</h6>
          <input
            type='text'
            className='w-full max-w-xs p-4 border rounded-md'
            placeholder={`이메일 입력`}
            name='businessAddress'
            onChange={handleChange}
          /> */}
        </div>
        <div className='text-right'>
          <button className='btn btn-primary w-full max-w-xs'>등록</button>
        </div>
      </form>
    </div>
  );
}
