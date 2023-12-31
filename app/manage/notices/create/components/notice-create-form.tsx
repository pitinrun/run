'use client';

import { useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export default function NoticeCreateForm() {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  );

  const router = useRouter();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      // eventDate: '',
      content: '',
      link: '',
    },
  });

  const onSubmit = async data => {
    try {
      await axios.post('/api/notices', data);
      toast.success('공지사항이 생성되었습니다.');
      router.push('/manage/notices');
    } catch (error) {
      toast.error('공지사항 생성 도중 에러가 발생하였습니다. ' + error.message);
      console.error(error);
    }
  };

  const content = watch('content');

  return (
    <div className='container mx-auto p-4'>
      <header>
        <h1 className='text-2xl font-bold my-4'>공지 생성</h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='title'
          >
            제목
          </label>
          <input
            {...register('title', { required: true })}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='title'
            type='text'
            required
          />
        </div>

        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='content'
          >
            내용
          </label>
          <ReactQuill
            value={content || ''}
            onChange={value =>
              setValue('content', value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />
        </div>

        <button className='btn' type='submit'>
          공지 생성
        </button>
      </form>
    </div>
  );
}
