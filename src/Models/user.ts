import mongoose, { Document, model, Model, Schema } from 'mongoose';
import { IUser, Address } from '../types';

export interface IUserDocument extends Document, IUser {}

const UserSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    businessName: {
      type: String,
    },
    businessAddress: {
      type: Object,
    },
    tel: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = (mongoose.models.User ||
  model('User', UserSchema)) as Model<IUserDocument>;
