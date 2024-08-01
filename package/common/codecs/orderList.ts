import * as t from 'io-ts';
import { excess } from './excess';

/* eslint-disable camelcase */

export const orderListOptionCodec = excess(t.type({
  name: t.string,
  quantity: t.number,
  price: t.number,
}));

export const orderListCodec = excess(t.type({
  id: t.number,
  title: t.string,
  price: t.number,
  options: t.array(orderListOptionCodec),
  quantity: t.number,
}));

export const orderInfoOptionCodec = excess(t.type({
  cart_show: t.union([
    t.number,
    t.null,
  ]),
  display_name: t.string,
  good_code: t.string,
  good_price: t.union([
    t.string,
    t.number,
  ]),
  img_url: t.union([
    t.null,
    t.string,
  ]),
  order_qty: t.number,
  pos_code: t.string,
  pos_name: t.string,
  pos_price: t.union([
    t.string,
    t.number,
  ]),
}));

export const orderInfoCodec = excess(t.type({
  cart_show: t.union([
    t.number,
    t.null,
  ]),
  display_name: t.string,
  good_code: t.string,
  good_name: t.string,
  good_price: t.union([
    t.string,
    t.number,
  ]),
  img_url: t.union([
    t.string,
    t.null,
  ]),
  option: t.array(orderInfoOptionCodec),
  order_qty: t.number,
  order_time: t.number,
  pos_code: t.string,
  pos_price: t.union([
    t.string,
    t.number,
  ]),
  eventProduct: t.union([
    t.undefined,
    t.number,
  ]),
}));

export const billsArrayOptionCodec = excess(t.type({
  optionName: t.string,
  optionOrderPrice: t.number,
  optionUnitPrice: t.number,
  order_qty: t.number,
}));

export const billsArrayCodec = excess(t.type({
  creditPrice: t.number,
  goodName: t.string,
  goodPrice: t.number,
  option: t.array(billsArrayOptionCodec),
  optionTotalPrice: t.number,
  orderPrice: t.number,
  orderQty: t.number,
  point: t.number,
  posOrderId: t.string,
  salePrice: t.number,
}));

export const billsCodec = excess(t.type({
  // 타입을 몰라서 임시로 지정..
  billsArray: t.array(t.unknown),
  totalCreditPrice: t.number,
  totalOrderPrice: t.number,
}));

export const rewordCodec = excess(t.type({
  reword_score: t.number,
  reword_goods_code: t.string,
  reword_goods_name: t.string,
  reword_type: t.string,
  reword_url: t.string,
}));

export const empRatingCodec = excess(t.type({
  code: t.string,
  confirmFlag: t.number,
  id: t.string,
  img_url: t.string,
  name: t.string,
  price: t.string,
  rating: t.number,
  reword: rewordCodec,
  // 타입을 몰라서 임시로 지정..
  reviews: t.array(t.unknown),
}));

export const userInfoCodec = excess(t.type({
  user_hp: t.string,
  user_no: t.string,
}));

export const getCartListCodec = excess(t.type({
  Table_no: t.string,
  bills: billsCodec,
  empRatingList: t.array(empRatingCodec),
  is_first_order: t.boolean,
  // 타입을 몰라서 임시로 지정..
  menuRatingList: t.array(t.unknown),
  mode: t.union([
    t.string,
    t.undefined,
  ]),
  order_cnt: t.number,
  orderKey: t.string,
  order_id: t.string,
  order_info: t.array(orderInfoCodec),
  order_tablet_ID: t.string,
  // 타입을 몰라서 임시로 지정..
  quickMenuList: t.array(t.unknown),
  result: t.boolean,
  shop_code: t.string,
  user_info: userInfoCodec,
  visitInfoSendPos: t.boolean,
  visitPeople: t.number,
  // 타입을 몰라서 임시로 지정..
  visitPeopleArray: t.array(t.unknown),
  isOrderExist: t.boolean,
}));

export default { getCartListCodec };
