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
  '페더럴',
  '사일룬',
  '트라이앵글',
  'BFG',
  '라우펜',
  '',
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
