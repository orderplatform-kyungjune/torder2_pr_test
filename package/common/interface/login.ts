/* eslint-disable camelcase */
export interface tableInfo {
  Ta_id: string,
  Tablet_name: string,
  Tablet_number: string,
  Tablet_orderAble: number,
  orderId: string,
  seatPeople: number,
  seatPeopleArray: string[],
}

export interface initTableInfoType {
  TabletName: string,
  TabletNumber: string,
  credit: number,
  creditWayArray: string[],
  orderAble: number,
  tablePosCode: string,
  tabletId: string,
  van: string,
  creditSerialNumber: string,
}

export interface storeInit {
  T_order_min_order_price: string,
  T_order_recent_order_hide: number,
  T_order_store_Adv_use: number,
  T_order_store_Adv_viewFlag: number,
  T_order_store_Empolyee: string,
  T_order_store_Id: string,
  T_order_store_Login_date: null,
  T_order_store_Main_rows: string,
  T_order_store_Popup_time: string,
  T_order_store_Tables: string,
  T_order_store_Tablet_defalut_menu: string,
  T_order_store_Theme: string,
  T_order_store_address: string,
  T_order_store_address2: string,
  T_order_store_banner_text: string,
  T_order_store_cart_point: string,
  T_order_store_cart_point_type: string,
  T_order_store_close: number,
  T_order_store_close_order: number,
  T_order_store_code: string,
  T_order_store_detail_open: string,
  T_order_store_empCall_use: string,
  T_order_store_ipv4: string,
  T_order_store_language: string,
  T_order_store_language_use: number,
  T_order_store_login_point: string,
  T_order_store_logo: string,
  T_order_store_name: string,
  T_order_store_orderView_version: string,
  T_order_store_password: string,
  T_order_store_point_use: string,
  T_order_store_register_point: string,
  T_order_store_service_use: number,
  T_order_store_set_confim: string,
  T_order_store_set_use: string,
  T_order_store_setting_code: string,
  T_order_store_staff_password: string,
  T_order_store_tablet_open: number,
  T_order_store_tablet_version: string,
  T_order_store_zipcode: string,
  T_order_stote_register_use: string,
}

export interface loginType {
  result: boolean,
  store_init: storeInit,
  table_data: tableInfo[],
}
