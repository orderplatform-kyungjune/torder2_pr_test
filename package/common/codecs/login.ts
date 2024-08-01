import * as t from 'io-ts';
import { excess } from './excess';

export const storeInitCodec = excess(t.type({
  T_order_store_code: t.string,
  T_order_store_ipv4: t.string,
  T_order_store_name: t.string,
  T_order_store_Id: t.string,
  T_order_store_password: t.string,
  T_order_store_staff_password: t.string,
  T_order_store_Login_date: t.null,
  T_order_store_zipcode: t.string,
  T_order_store_address: t.string,
  T_order_store_address2: t.string,
  T_order_store_set_use: t.string,
  T_order_store_set_confim: t.string,
  T_order_store_logo: t.string,
  T_order_store_close: t.number,
  T_order_store_close_order: t.number,
  T_order_store_Theme: t.string,
  T_order_store_Tablet_defalut_menu: t.string,
  T_order_store_banner_text: t.string,
  T_order_store_Popup_time: t.string,
  T_order_store_service_use: t.number,
  T_order_store_empCall_use: t.string,
  T_order_store_setting_code: t.string,
  T_order_store_Main_rows: t.string,
  T_order_store_Tables: t.string,
  T_order_store_detail_open: t.string,
  T_order_store_language: t.string,
  T_order_store_language_use: t.number,
  T_order_store_Empolyee: t.string,
  T_order_store_cart_point_type: t.string,
  T_order_store_cart_point: t.string,
  T_order_store_login_point: t.string,
  T_order_store_register_point: t.string,
  T_order_store_orderView_version: t.string,
  T_order_store_tablet_version: t.string,
  T_order_stote_register_use: t.string,
  T_order_store_point_use: t.string,
  T_order_store_Adv_viewFlag: t.number,
  T_order_store_Adv_use: t.number,
  T_order_store_tablet_open: t.number,
  T_order_min_order_price: t.string,
  T_order_recent_order_hide: t.number,
}));

export const tabletDataCodec = excess(t.type({
  Ta_id: t.string,
  orderId: t.string,
  seatPeople: t.number,
  Tablet_name: t.string,
  Tablet_number: t.string,
  seatPeopleArray: t.array(t.union([
    t.string,
    t.undefined,
  ])),
}));

export const loginCodec = excess(t.type({
  result: t.boolean,
  store_init: storeInitCodec,
  table_data: t.array(tabletDataCodec),
}));

export default { loginCodec };
