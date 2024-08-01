import { productLanguage } from './product';

/* eslint-disable camelcase */
export interface orderListType {
  id: number,
  title: string,
  price: number,
  options: {
    name: string,
    quantity: number,
    price: number,
  }[],
  quantity: number,
}

export interface orderInfoOptionType {
  cart_show: number | null,
  display_name: string,
  good_code: string,
  good_price: number,
  img_url: null | string,
  order_qty: number,
  pos_code: string,
  pos_name: string,
  pos_price: string,
  option: this[],
  langs: productLanguage,
}

export interface orderInfoType {
  cart_show: number | null,
  display_name: string,
  good_code: string,
  good_name: string,
  good_price: string,
  img_url: string,
  option: orderInfoOptionType[],
  order_qty: number,
  order_time: number,
  pos_code: string,
  pos_price: string,
  trans: productLanguage,
  eventProduct: number,
}

export interface billsArrayOptionType {
  optionName: string,
  optionOrderPrice: number,
  optionUnitPrice: number,
  order_qty: number,
  langs: productLanguage,
}

export interface billsArrayType {
  creditPrice: number,
  goodName: string,
  goodPrice: number,
  option: billsArrayOptionType[],
  optionTotalPrice: number,
  orderPrice: number,
  orderQty: number,
  point: number,
  posOrderId: string,
  salePrice: number,
  trans: productLanguage,
}

export interface billsType {
  billsArray: billsArrayType[],
  totalCreditPrice: number,
  totalOrderPrice: number,
}

export interface empRatingType {
  code: string,
  confirmFlag: number,
  id: string,
  img_url: string,
  name: string,
  price: string,
  rating: number,
  reviews: [],
}

export interface userInfoType {
  user_hp: string,
  user_no: string,
}

export interface OrderInfoType {
  good_qty: number,
  pos_code: string,
}

export interface VisitOrderType {
  Table_no: string,
  order_key: string,
  shop_code: string,
  order_info: OrderInfoType[],
  order_pos_table_name: string,
}

export interface visitPeopleArrayType {
  total: number,
  groupInfo: {
    [key: string]: string,
  },
}

export interface getCartListType {
  Table_no: string,
  bills: billsType,
  empRatingList: empRatingType[],
  is_first_order: boolean,
  menuRatingList: [],
  mode: string,
  order_cnt: number,
  order_id: string,
  orderKey: string,
  order_info: orderInfoType[],
  order_tablet_ID: string,
  quickMenuList: [],
  result: boolean,
  shop_code: string,
  user_info: userInfoType,
  visitInfoSendPos: boolean,
  visitPeople: number,
  visitPeopleArray: visitPeopleArrayType,
  isOrderExist: boolean,
}
