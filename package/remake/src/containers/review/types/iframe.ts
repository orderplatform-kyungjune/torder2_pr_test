import { productLanguage } from '@torder/common';
import {
  Option,
  SupportedLanguage,
} from '@containers/review/types/review';

type ItemCode = {
  itemCode: string,
  itemQuantity: number,
  displayName: string,
  goodName: string,
  goodPrice: number,
  imgUrl: string,
  langs: productLanguage,
  options: Option[],
}

export type Order = {
  orderKey: string,
  itemCodes: ItemCode[],
  orderTime: string,
}
export type ReviewList = {
  orderId: string,
  storeCode: string,
  orders: Order[],
}
/**
 *  'CLICK': 리뷰 남기기(or 리뷰 수정하기) 버튼 클릭을 통해 데이터를 전달하는 경우
 *  'UPDATE': 오더2 서비스에서 주문 정보 데이터가 변경(주문완료, 주문취소, 결제, 화면 refresh)되어 전달하는 경우
 */
const TRIGGER_TYPES = [
  'CLICK',
  'UPDATE',
] as const;
export type TriggerType = (typeof TRIGGER_TYPES)[number];
export type IncomingInterface = ReviewList & { triggerType: TriggerType };

/**
 *  'EXIST_REVIEWS': 리뷰 평가할 데이터가 존재하는 경우
 *  'NO_REVIEWS': 리뷰 평가할 데이터가 없는 경우
 *  'CLOSE_POPUP': '닫기','리뷰 완료','다음에 하기' 버튼을 누르는 경우
 *  'DETECT_ACTION': 터치 이벤트를 감지한 경우
 *  'OPEN_POPUP': 타이머 시간이 되었을 때, 리뷰할 데이터가 존재하는 경우
 */
const POPUP_STATUS = [
  'EXIST_REVIEWS',
  'NO_REVIEWS',
  'CLOSE_POPUP',
  'DETECT_ACTION',
  'OPEN_POPUP',
] as const;
export type PopupStatus = (typeof POPUP_STATUS)[number];
export type OutgoingInterface = { status: PopupStatus };

export type OrderList = {
  triggerType: TriggerType,
  variables: ReviewList,
};
