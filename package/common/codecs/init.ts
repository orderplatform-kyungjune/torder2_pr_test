import * as t from 'io-ts';
import { excess } from './excess';

export const storeInfoCodec = excess(t.type({
  storeCode: t.string, // 상점 코드
  posMiddleWareCode: t.union([
    t.string,
    t.null,
  ]), // 미들웨어 코드
  franChiseCode: t.union([
    t.string,
    t.null,
  ]), // 프렌차이즈 코드
  storeStat: t.number, // 상점 상태 1: 대기 ----3: 운영 중 ---- 5: 블락
  storeName: t.string, // 상점 이름
  saupjaNumber: t.string, // 상점 사업자 번호
  staffPassWord: t.string, //
  logoUrl: t.string, // 로고
  storeClose: t.number, // 상점 계폐
  closeOrder: t.number, // 상점 주문 계폐
  theme: t.number, // 테마 번호
  recentOrderHide: t.number, // 최근 주문 여닫기
  bannerText: t.string, // 배너 텍스트
  serviceCategoryType: t.number, // 직원 호출 출력 유형
  MainRows: t.number, // 1페이지 출력 상품 수
  LanguageUse: t.number, // 언어 사용
  orderConfirm: t.number, // 주문 시 confirm 창 출력
  tabletVersion: t.string, // 테블릿 redirection URL
  registerUse: t.number, // 첫 주문 후 회원 가입 사용
  pointUse: t.number, // 첫 주문 후 포인트 적립 사용
  refreshTime: t.number, // 대기 화면 새로고침 주기
  cartRefreshTime: t.number, // 장바구니 삭제 주기
  minOrderPrice: t.number, // 최소 주문 금액
  maxOrderQty: t.number, // ??
  directTable: t.number, // 테블릿 번호 연타 기능
  bannerControl: t.number, // 배너 넘기기 다음 버튼
  apkVersion: t.union([
    t.string,
    t.null,
  ]), // APK 버전 ,
}));

export const tabletListCodec = excess(t.type({
  tabletId: t.string,
  TabletName: t.string,
  orderAble: t.number,
  credit: t.number,
  apkVersion: t.union([
    t.string,
    t.null,
  ]),
}));

export const themeList = excess(t.type({
  no: t.number,
  themeName: t.string,
  themeUrl: t.string,
  themeEx: t.null,
  defaultTheme: t.number,
}));

export const bannerCodec = excess(t.type({
  sort: t.number,
  url: t.string,
  bannerName: t.string,
  bannerType: t.string,
}));

export const productLabelCodec = excess(t.type({
  typeBest: t.number,
  typeMd: t.number,
  typeSale: t.number,
  typeNew: t.number,
  typeHit: t.number,
}));

export const productLanguageCodec = excess(t.type({
  ko: t.string,
  en: t.string,
  jp: t.string,
  zh_hans: t.string,
  zh_hant: t.string,
}));

export const productOptionItemCodec = excess(t.type({
  code: t.string,
  name: t.string,
  price: t.number,
  limitQty: t.number,
  img: t.string,
  isSale: t.number,
  sort: t.number,
}));

export const productOptionCodec = excess(t.type({
  name: t.string,
  require: t.number,
  limitSelect: t.number,
  requireFlag: t.number,
  sort: t.number,
  items: t.array(productOptionItemCodec),
}));

export const productCodec = excess(t.type({
  price: t.number,
  productUse: t.number,
  productSale: t.number,
  image: t.string,
  productCode: t.string,
  maxOrderQty: t.number,
  minOrderQty: t.number,
  confirm: t.number,
  html: t.string,
  htmlOpen: t.number,
  htmlArray: productLanguageCodec,
  label: productLabelCodec,
  option: t.array(productOptionCodec),
  productLanguage: productLanguageCodec,
  productLanguageShort: productLanguageCodec,
}));

export const childCategoryCodec = excess(t.type({
  childCategoryCode: t.string,
  childCategoryName: t.string,
  childCategorySort: t.number,
  childCategoryProductCount: t.number,
  childCategoryProductList: t.array(productCodec),
}));

export const categoryCodec = excess(t.type({
  categoryName: t.string,
  categoryCode: t.string,
  serviceUse: t.number,
  categorySort: t.number,
  childCategoryList: t.array(childCategoryCodec),
}));

export const initDataCodec = excess(t.type({
  result: t.boolean,
  storeInfo: storeInfoCodec,
  tabletList: t.array(tabletListCodec),
  goodList: t.array(categoryCodec),
  bannerList: t.array(bannerCodec),
  serviceList: categoryCodec,
  themeList: t.array(themeList),
}));
