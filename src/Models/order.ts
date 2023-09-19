// src/models/user.ts
import mongoose, { Document, model, Model, Schema } from 'mongoose';
import { IUser } from '../types';

export interface IUserDocument extends Document, IUser {}

const UserSchema: Schema = new Schema(
  {
    businessName: {
      // 사업자 명
      type: String,
      required: true,
    },
    ownerName: {
      // 대표자 이름
      type: String,
      required: true,
    },
    password: {
      //비밀번호
      type: String,
      required: true,
    },
    userId: {
      // 사업자 번호
      type: String,
      unique: true,
      required: true,
    },
    tel: {
      // 담당자 휴대폰 번호
      type: String,
      required: true,
    },
    email: {
      // 이메일
      type: String,
      required: true,
    },
    businessAddress: {
      // 사업장 주소
      type: Object,
      required: true,
    },
    businessAddressDetail: {
      // 사업장 상세 주소
      type: String,
    },
    role: {
      // 역할
      // 10: 관리자
      // 9: 매니저
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const User = (mongoose.models.User ||
  model('User', UserSchema)) as Model<IUserDocument>;
