// src/models/user.ts
import mongoose, { Document, model, Model, Schema } from 'mongoose';
import { IOrder } from '../types';

export interface IOrderDocument extends Document, IOrder {}
const OrderSchema: Schema = new Schema(
  {
    status: {
      type: Number, // 1: 주문 확인중, 2: 배송 대기, 3: 배송중, 4: 배송완료
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    products: {
      type: [
        {
          productCode: String,
          quantity: Number,
          discountRate: Number,
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = (mongoose.models.Order ||
  model('Order', OrderSchema)) as Model<IOrderDocument>;
