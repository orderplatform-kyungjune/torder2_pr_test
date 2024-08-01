/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
export interface productLanguage {
  ko: string;
  en: string;
  jp: string;
  zh_hans: string;
  zh_hant: string;
}

// I 옵션아이템
export interface productOptionItemType {
  quantity: number;
  parentGroupIndex: number;
  code: string;
  name: string;
  price: number;
  limitQty: number;
  isSale: number;
  sort: number;
  checked: boolean;
  nameArray: productLanguage;
  isOrder: boolean;
  isProduct: boolean;
  isProductExist: boolean;
  isOptionExist: boolean;
  image: string;
  isOptionProduct: boolean;
  isPreSet: boolean;
  require: number;
  items: productOptionItemType[];
  options: productOptionItemType[];
  isDepthMenu?: boolean;
  parentName?: string;
}

// SG 상품그룹 또는 OG 옵션그룹
export interface productOptionType {
  name: string;
  image: string;
  nameArray: productLanguage;
  require: number;
  requireFlag: number;
  minLimitSelect: number;
  maxLimitSelect: number;
  minLimitQty: number;
  maxLimitQty: number;
  quantity: number;
  sort: number;
  checked: boolean;
  isOrder: boolean;
  isProduct: boolean;
  isProductExist: boolean;
  isOptionExist: boolean;
  isOptionProduct: boolean;
  items: (productOptionItemType | this)[];
  isType: string;
  isPreSet: boolean;
  isGroupSelected: boolean;
  limitQty: number;
}

export interface productGroupType<T> extends Omit<productOptionType, 'items'> {
  items: (T | this)[];
}

export interface productLabelType {
  typeBest: number;
  typeMd: number;
  typeSale: number;
  typeNew: number;
  typeHit: number;
  typeSpicy: number;
  typeVegan: number;
  typeSignature: number;
}

export interface allergyOptionType {
  id: string;
  allergy_name: string;
  allergy_content: string;
  allergy_image_url: string;
  allergy_view_type: string;
  allergy_use_yn: string;
  allergy_sort_number: string;
  T_order_store_good_code: string;
}

// S 상품
export interface productType {
  image: string;
  productCode: string;
  price: number;
  priceString: string;
  priceStringLanguage: productLanguage;
  productUse: number;
  productSale: number;
  maxOrderQty: number;
  minOrderQty: number;
  quantity: number;
  parentGroupIndex: number;
  confirm: number;
  html: string;
  htmlOpen: number;
  htmlArray: productLanguage;
  productLanguage: productLanguage;
  productLanguageShort: productLanguage;
  productLanguageDetail: productLanguage;
  label: productLabelType;
  option: (productOptionType | productOptionItemType)[];
  product: (productGroupType<this> | this)[];
  checked: boolean;
  isOrder: boolean;
  isProduct: boolean;
  isProductExist: boolean;
  isOptionExist: boolean;
  isOptionProduct: boolean;
  isPreSet: boolean;
  ogSelectAuto: boolean;
  countryOfOrigin: string;
  spicyRate: number;
  code?: string;
  name: string;
  retailPrice: number;
  retailPriceUse: string;
  allergy: allergyOptionType[];
  allergyUse: string;
}

export type getProductKeyType = (
  product: productType,
  index: number,
) => number | string;

export type productFuncType<T> = (product: productType) => T;

export type productOptionFuncType<T> = (option: productOptionType) => T;

export type productOptionItemFuncType<T> = (option: productOptionItemType) => T;

export type isProductImgType = (product: productType) => { empty: boolean };

export type validationImgType = (url: string) => string;

export type validationProductIdType = (
  product: productType,
  fn: (productId: string) => void,
) => void;
