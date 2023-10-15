import { Notice } from '../models/notice';

export const getNoticeList = () => {
  return Notice.find()
    .sort({
      isImportant: -1,
      _id: -1,
    })
    .lean();
};
