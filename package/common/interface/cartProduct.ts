/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import {
  productType,
  productLanguage,
  productOptionType,
  productOptionItemType,
  productGroupType,
  allergyOptionType,
} from './product';

export type CartProductOptionType = productOptionItemType;

// G 옵션그룹
export interface CartProductOptionGroupType
  extends Omit<productOptionType | productGroupType<productType>, 'items'> {
  items: (CartProductOptionType | this | productType)[];
  id: string;
  parentGroupId: string;
  index: string;
  code?: string;
  options?: [];
}

// 상품 하나의 객체
export interface cartProductType {
  productCode: string | number;
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  options: cartProductType[];
  products: (CartProductOptionGroupType | productType)[];
  productLanguage: productLanguage;
  productLanguageShort: productLanguage;
  productLanguageDetail: productLanguage;
  description: string;
  descriptionLanguage: productLanguage;
  isOrder: boolean;
  isProduct: boolean;
  isProductExist: boolean;
  isOptionExist: boolean;
  countryOfOrigin: string;
  allergy: allergyOptionType[];
  allergyUse: string;
  items: cartProductType[];
  checked?: boolean;
  code: string;
  isDepthMenu?: boolean;
  parentName?: string;
  require: number;
  nameArray: productLanguage;
  requireFlag: number;
  minLimitSelect: number;
  maxLimitSelect: number;
  minLimitQty: number;
  maxLimitQty: number;
  sort: number;
  isOptionProduct: boolean;
  isType: string;
  isPreSet: boolean;
  isGroupSelected: boolean;
  limitQty: number;
  isSale: number;
}

/**
  - UI 렌더링할 때 쓰이는 상품 타입
  convertedItems는 options 또는 products에서 선택된 상품 또는
  옵션아이템만을 필터링해서 담은 배열
* */
export interface convertedCartProductType extends cartProductType {
  convertedItems: (productOptionItemType | productType)[];
}

export interface OrderProductOptionType {
  code: string;
  name: string;
  qty: number;
  options?: this[];
}

export interface StoreInfoType {
  storeCode?: string | null;
  tableNumber?: string | null;
}

export interface OrderProductType {
  good_code: string;
  good_qty: number;
  order_options?: this[];
}

export interface OrderDataType {
  storeCode: string;
  tabletId: string;
  orders: OrderProductType[];
}

export interface OrderItemsType {
  goods_id: string;
  goods_qty: number;
  options: OrderItemsType[];
}
// v/1/0/21 부터 변경된 주문 스펙 (모든 주문 포함)
export interface OrderSpecType {
  store_code: string;
  tablet_id: string;
  orders: OrderItemsType[];
}
// eslint-disable-next-line vue/max-len
export type getCartProductKeyType = (
  product: productType | productOptionType,
  index: number,
) => number | string;

export type cartProductFuncType<T> = (product: cartProductType) => T;

export type cartProductTypeFuncType<T> = (product: cartProductType) => T;

export type cartProductOptionFuncType<T> = (option: CartProductOptionType) => T;
