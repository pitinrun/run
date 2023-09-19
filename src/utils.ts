import mongoose, { connect, mongo } from 'mongoose';
import { IProduct } from './types';

const {
  // Attempts to connect to MongoDB and then tries to connect locally:)
  // MONGO_URI = 'mongodb://localhost:27017/next_test'
  MONGO_URI = '',
} = process.env;

const options: any = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log('=> using existing database connection');
    return;
  }

  if (process.env.NODE_ENV === 'development') mongoose.set('debug', true);

  if (MONGO_URI) {
    const db = await mongoose.connect(MONGO_URI, options);
    // connection.isConnected = db.connections[0].readyState;
    console.log('=> using new database connection');
  }
};

export const getTotalStock = (storages: IProduct['storages']) =>
  storages.reduce((acc, currentValue) => {
    return acc + currentValue.stock;
  }, 0);

export const convertNumberToKRW = (price: number) => {
  // 10원 단위로 올림 처리
  price = Math.ceil(price / 100) * 100;

  return `${price.toLocaleString()}`;
};
