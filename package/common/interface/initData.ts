/* eslint-disable camelcase */
import { productType } from './product';
import { LocaleType } from './i18nLocale';
import { categoryType } from './category';

export interface Font {
  color: string,
  activeColor: string,
}

export interface Button {
  fontColor: string,
  backgroundColor: string,
}

export interface SubCategory {
  fontColor: string,
  activeFontColor: string,
  backgroundColor: string,
  backgroundActiveColor: string,
}

export interface MainCategory {
  fontColor: string,
  activeFontColor: string,
  backgroundColor: string,
  backgroundActiveColor: string,
}

export interface Category {
  subCategory: SubCategory,
  mainCategory: MainCategory,
  backgroundImg: string,
  backgroundColor: string,
}

export interface TableNum {
  fontColor: string,
  backgroundColor: string,
}

export interface StaffCallButton {
  fontColor: string,
  backgroundColor: string,
}

interface Background {
  backgroundColor: string,
}

interface bottomNavbar {
  backgroundColor: string,
}

export interface StoreTabletCustomStyle {
  font: Font,
  useYn: string,
  button: Button,
  category: Category,
  staffCallButton: StaffCallButton,
  tableNum: TableNum,
  background: Background,
  bottomNavbar: bottomNavbar,
  mode: string,
}

export type languageListType = 'kr' | 'en' | 'jp' | 'zh_hans' | 'zh_hant';

export type languageArrType = {
  type: LocaleType,
  lang: string,
  icon?: string,
}

export interface visitConfigType {
  visitBookUse: number, // 인원수 입력 기능 사용
  visitOrderAble: number, // 인원수 미입력시 주문 불가
  peoplesGroupUse: number, // 인원 그룹 사용
  peopleGroup: string[], // 인원 그룹명
  directOrderAlble: number, // 전자출입명부 아님 (미사용)
  visitGroupOpenType: string, // 인원수 입력 방식 (order: 주문시, storeLogo: 첫화면 사용자 인터렉션시)
}

export interface storeInfoType {
  storeAddress: string, //  도로명 주소
  storeAddress2: string, // 지번 주소
  driveCallHide: number,
  visitconfig: visitConfigType, // 인원 수 입력 정보
  visitBookUse: number,
  visitOrderAble: number,
  languageList: languageListType[],
  checkoutAdUse: number,
  bannerWaitingTime: number, // 배너 노출 시간
  LanguageDefault: LocaleType,
  storeCode: string, // 상점 코드
  posMiddleWareCode: string, // 미들웨어 코드
  franChiseCode: string, // 프렌차이즈 코드
  storeStat: number, // 상점 상태 1: 대기 ----3: 운영 중 ---- 5: 블락
  storeName: string, // 상점 이름
  saupjaNumber: string, // 상점 사업자 번호
  staffPassWord: number, // 시크릿메뉴 비밀번호
  logoUrl: string, // 로고
  storeClose: number, // 상점 계폐
  closeOrder: number, // 상점 주문 계폐
  theme: number | string, // 테마 번호
  recentOrderHide: number, // 주문내역 on off
  tabletBillsOnOff: number, // 계산서 on off
  bannerText: string, // 배너 텍스트
  bannerUse: number, // 배너 사용 여부
  tabletLogo: string,
  serviceCategoryType: number, // 직원 호출 출력 유형
  MainRows: number, // 1페이지 출력 상품 수
  LanguageUse: number, // 언어 사용
  orderConfirm: number, // 주문 시 confirm 창 출력
  tabletVersion: string, // 테블릿 redirection URL
  registerUse: number, // 첫 주문 후 회원 가입 사용
  pointUse: number, // 첫 주문 후 포인트 적립 사용
  posSerialNumber: string, // 포스 시리얼 넘버
  prePaymentUse: string, // 매장 선결제 사용 여부
  vanInfo: string, // 매장 벤사 정보
  refreshTime: number, // 대기 화면 새로고침 주기
  cartRefreshTime: number, // 장바구니 삭제 주기
  minOrderPrice: number, // 최소 주문 금액
  maxOrderQty: number, // 최대 주문 갯수
  directTable: number, // 테블릿 번호 연타 기능
  bannerControl: number, // 배너 넘기기 다음 버튼
  apkVersion: string, // APK 버전 ,
  storeTabletCustomStyle: StoreTabletCustomStyle, // 커스텀테마 css 객체
  optionLayout: string, // 옵션페이지 유형(이미지, 텍스트)
  optionCartOpenUse: string, // 옵션페이지 장바구니 버튼 및 장바구니 UI 노출, 미노출 (Y, N)
  standardPriceUnit: string, // 기본 화폐 단위
  chatingAble: number, // 채팅 사용
  gameAble: number, // 대전게임 사용
  auctionAble: number, // 경매 사용
  storeVanTid: string, // 단말기 TID
  storeTel: string, // 상점 전화번호
  storeCpName: string, // 상점 사장님 성함,
  cartPageOverride: number, // 장바구니 덮어보이기
  backgroundImgUrl: string, // 배경 이미지,
  businessType: string, // 사업체 구분 (티오더, LG U+)
  robotInfo: { // 서빙로봇
    robotArriveImg: string, // 로봇 도착화면 내 광고영역 이미지
    robotDelayTime: number, // 로봇 도착화면 내 자동 닫힘 시간
    robotUse: number, // 로봇호출 버튼 사용여부
  },
  noGoodsNotifyUse: string, // '등록된 메뉴가 없습니다.' 분류 상품 미존재 안내문구 여부
  storeSurveyUse?: 'Y' | 'N', // 리뷰참여 기능 활성화 여부, 'Y': 활성화, undefined|'N' : 비활성화
}

export interface tabletListType {
  tabletId: string,
  TabletName: string,
  orderAble: number,
  credit: number,
  apkVersion: string,
  TabletNumber: string,
  creditSerialNumber: string,
  creditWayArray: string[],
  tablePosCode: string,
  van: string,
}

export interface bannerType {
  sort: number,
  url: string,
  bannerName: string,
  bannerType: string,
  btn_code: number,
  id: string,
  link: string,
  listType: string,
  time: number,
  adCode: string,
}

export interface serviceListType extends Omit<categoryType, 'childCategoryList'> {
  childCategoryList: productType[],
}

export interface checkoutListType {
  checkout_key: string,
  name: string,
  thumbnail_url: string,
  url: string,
}

export interface initStoreType {
  T_order_store_tablet_version: string,
}

export interface themeListType {
  api_version1_yn: 'N' | 'Y',
  api_version2_yn: 'N' | 'Y',
  defaultTheme: number | string,
  idx: number,
  no: number | string,
  themeEx: null | string,
  themeName: string,
  themeUrl: string,
}

export interface eventListType {
  active: true,
  buttonUrl: string,
  endDate: string,
  eventGoodsExist: number,
  eventPage: string,
  eventPath: string,
  eventProduct: string,
  imgUrl: string,
  name: string,
  startDate: string,
}

export interface timerType {
  message: {
    base: string,
    end: string,
  },
  time: string | number,
  sendtime: string | number,
}

export interface initDataType {
  init?: initStoreType,
  result: boolean,
  storeInfo: storeInfoType,
  tabletList: tabletListType[],
  goodList: categoryType[],
  bannerList: bannerType[],
  serviceList: serviceListType,
  checkoutList: checkoutListType[],
  themeList: themeListType[],
  eventList: eventListType[],
  timer: timerType,
}
