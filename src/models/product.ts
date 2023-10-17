import mongoose, { Document, model, Model, Schema } from 'mongoose';
import { BRANDS, type IProduct, SEASONS } from '../types';

export interface IProductDocument extends Document, IProduct {}

const ProductSchema: Schema = new Schema({
  brand: {
    type: String,
    enum: BRANDS, // ["금호", "한국", "넥센", "미쉐린", "콘티넨탈", "피렐리", "던롭", "브릿지스톤", "굿이어", "요코하마", "페더럴", "사일룬", "트라이앵글", "BFG", "라우펜", "브레데스타인", ""
    require: true,
  },
  pattern: {
    type: String,
    require: true,
  },
  patternKr: {
    type: String,
    require: true,
  },
  productCode: {
    type: String,
    require: true,
  },
  size: {
    type: String,
    require: true,
  },
  sizeSearchKeyword: {
    type: String,
    require: true,
  },
  speedSymbolLoadIndex: {
    type: String,
    require: true,
  },
  marking: {
    type: String,
  },
  origin: {
    type: String,
  },
  season: {
    type: String,
    enum: SEASONS, // ['winter', 'summer', 'all-weathers']
  },
  special: {
    type: String,
  },
  etc: {
    type: String,
  },
  specialDiscountRate: {
    type: Number,
  },
  factoryPrice: {
    type: Number,
    require: true,
  },
  storages: {
    type: [
      {
        name: String,
        stock: Number,
        dot: Array,
      },
    ],
    require: true,
  },
});

export const Product = (mongoose.models.Product ||
  model('Product', ProductSchema)) as Model<IProductDocument>;
