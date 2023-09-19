// src/models/user.ts
import mongoose, { Document, model, Model, Schema } from 'mongoose';
import { IOrder } from '../types';

export interface IOrderDocument extends Document, IOrder {}
// createdAt: Date;
//   state: 1 | 2 | 3 | 4; // 1: 주문 확인중, 2: 배송 대기, 3: 배송중, 4: 배송완료
//   products: {
//     productCode: string;
//     quantity: number;
//   }[]
const OrderSchema: Schema = new Schema(
  {
    state: {
      type: Number, // 1: 주문 확인중, 2: 배송 대기, 3: 배송중, 4: 배송완료
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
