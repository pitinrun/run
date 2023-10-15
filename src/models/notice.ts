import mongoose, { Document, model, Model, Schema } from 'mongoose';
import { INotice } from '../types';

export interface INoticeDocument extends Document, INotice {}

const NoticeSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      require: true,
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Notice = (mongoose.models.Notice ||
  model('Notice', NoticeSchema)) as Model<INoticeDocument>;
