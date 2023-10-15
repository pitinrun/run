import { Notice } from '../models/notice';

export const getNoticeList = () => {
  return Notice.find()
    .sort({
      _id: -1,
    })
    .lean();
};
