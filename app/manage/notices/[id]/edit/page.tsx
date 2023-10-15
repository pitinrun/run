import mongoose from 'mongoose';
import ErrorAlert from 'components/error-alert';
import { Notice } from '@/src/models/notice';
import NoticeEditForm from './components/notice-edit-form';

export default async function EventDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const ObjectId = mongoose.Types.ObjectId;
  if (!ObjectId.isValid(id)) return <ErrorAlert statusCode={400} />;
  const notice = await Notice.findById(id).lean();
  if (!notice) return <ErrorAlert statusCode={404} />;

  return <NoticeEditForm initNoticeData={notice} />;
}
