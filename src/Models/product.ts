import mongoose, { Document, model, Model, Schema } from 'mongoose';

export const BRANDS = [
  '금호',
  '한국',
  '넥센',
  '미쉐린',
  '콘티넨탈',
  '피렐리',
  '던롭',
  '브릿지스톤',
  '굿이어',
  '요코하마',
  '패더럴',
  '사일룬',
  '트라이앵글',
  'BFG',
  '라우펜',
  '',
] as const;
export type BrandType = (typeof BRANDS)[number];

export const SEASONS = ['winter', 'summer', 'all-weathers'] as const;
export type SeasonType = (typeof SEASONS)[number];

export interface IProduct {
  brand: BrandType;
  pattern: string;
  patternKr: string;
  productCode: string;
  size: string;
  sizeSearchKeyword: string;
  speedSymbolLoadIndex: string;
  marking?: string;
  origin?: string;
  season?: string;
  special?: string;
  etc?: string;
  specialDiscountRate?: number;
  factoryPrice: number;
  storages: {
    name: string;
    stock: number;
    dot: Array<string>;
  }[];
}

export interface IProductDocument extends Document, IProduct {}

const ProductSchema: Schema = new Schema({
  brand: {
    type: String,
    enum: BRANDS, // ["금호", "한국", "넥센", "미쉐린", "콘티넨탈", "피렐리", "던롭", "브릿지스톤", "굿이어", "요코하마", "패더럴", "사일룬", "트라이앵글", "BFG", "라우펜", ""]
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
