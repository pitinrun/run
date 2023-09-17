// src/models/user.ts
import mongoose, { Document, model, Model, Schema } from 'mongoose';
import { IUser, Address } from '../types';

export interface IUserDocument extends Document, IUser {}

const UserSchema: Schema = new Schema(
  {
    businessName: {
      // 사업자 명
      type: String,
    },
    ownerName: {
      // 대표자 이름
      type: String,
    },
    password: {
      //비밀번호
      type: String,
    },
    userId: {
      // 사업자 번호
      type: String,
      unique: true,
    },
    tel: {
      // 담당자 휴대폰 번호
      type: String,
    },
    email: {
      // 이메일 
      type: String,
    },
    businessAddress: {
      // 사업장 주소
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

export const User = (mongoose.models.User ||
  model('User', UserSchema)) as Model<IUserDocument>;
