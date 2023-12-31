import { type Address } from 'react-daum-postcode';

export const BRANDS = [
  '',
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
  '페더럴',
  '사일룬',
  '트라이앵글',
  'BFG',
  '라우펜',
  '브레데스타인',
] as const;
export type BrandType = (typeof BRANDS)[number];

export const SEASONS = ['winter', 'summer', 'all-weathers', 'ERROR'] as const;
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

export interface IWishListItem {
  productCode: string;
  quantity: number;
  discountRate: number;
}

/**
 * @note 배송 대기(status: 1)는 deprecated 되었습니다.
 */
export interface IOrder {
  createdAt: Date;
  status: 1 | 2 | 3 | 4; // 1: 주문 확인중, 2: 배송 대기, 3: 배송중, 4: 배송완료
  userId: string;
  products: {
    productCode: string;
    quantity: number;
    discountRate: number;
  }[];
  deliveryStartedAt?: Date;
  deliveredAt?: Date;
  deliveryInfo?: string;
}

export interface IUser {
  businessName: string;
  ownerName: string;
  password: string;
  userId: string; // NOTE: 기본적으로 사업자 번호
  tel: string;
  email: string;
  businessAddress: Address | null;
  businessAddressDetail: string;
  role?: 10 | 9; // NOTE: 10: 관리자, 9: 매니저
}

export type UserType = Omit<IUser, 'password'>;

export type ProductShipmentEntry = {
  productCode: string;
  discountRate: number;
  quantity: number;
  shipmentEntries: [string, number][];
};

export type INotice = {
  title: string;
  content: string;
  isImportant: boolean;
  createdAt: Date;
  updatedAt: Date;
};
