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

export interface IOrder {
  createdAt: Date;
  state: 1 | 2 | 3 | 4; // 1: 주문 확인중, 2: 배송 대기, 3: 배송중, 4: 배송완료
  products: {
    productCode: string;
    quantity: number;
    discountRate: number;
  }[];
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

// export interface IAddress {
//   zonecode: { type: String; required: false };
//   address: { type: String; required: false };
//   addressEnglish: { type: String; required: false };
//   addressType: { type: String; required: false };
//   userSelectedType: { type: String; required: false };
//   noSelected: { type: String; required: false };
//   roadAddress: { type: String; required: false };
//   roadAddressEnglish: { type: String; required: false };
//   jibunAddress: { type: String; required: false };
//   jibunAddressEnglish: { type: String; required: false };
//   autoRoadAddress: { type: String; required: false };
//   autoRoadAddressEnglish: { type: String; required: false };
//   autoJibunAddress: { type: String; required: false };
//   autoJibunAddressEnglish: { type: String; required: false };
//   buildingCode: { type: String; required: false };
//   buildingName: { type: String; required: false };
//   apartment: { type: String; required: false };
//   sido: { type: String; required: false };
//   sigungu: { type: String; required: false };
//   sigunguCode: { type: String; required: false };
//   bname: { type: String; required: false };
//   bcode: { type: String; required: false };
//   roadname: { type: String; required: false };
//   roadnameCode: { type: String; required: false };
//   // zoneNo: { type: String; required: false };
// }
