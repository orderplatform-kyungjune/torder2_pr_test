import { storeToRefs } from 'pinia';
import { getRoutePath, pushPage } from '@utils/route.helper';
import { getInitTableId, getStorage, getStoreCode } from '@torder/common/utils';
import {
  OrderItemsType,
  OrderSpecType,
  StaffCallItemType,
  TABLE,
  cartProductType,
  getCartListType,
} from '@torder/common';
import useVisitPeopleStore from '@store/storeVisitPeople';
import useOrderListStore from '@store/storeOrderList';
import useInitStore from '@store/storeInit';
import { banner, errorPage, home, logo } from '@router/routePaths';
import { useReviews } from '@containers/review';
import { checkOrderExist, requestOrderList } from '@apis/orderData';

/**
 * 주문내역 여부 판단 함수
 */
const setIsHaveOrderExist = () => {
  const { setOrderList } = useOrderListStore();
  return checkOrderExist(getStoreCode(), getInitTableId(), setOrderList);
};

/**
 * 페이지 초기 로딩 되었을 때 주문정보를 읽어오는 로직
 */
const initIsHaveOrderExist = async (): Promise<getCartListType> => {
  const { setOrderList } = useOrderListStore();
  const storeCode = getStoreCode();
  const tableId = getInitTableId();

  const res = await requestOrderList(storeCode, tableId);
  const { data }: { data: getCartListType } = res;
  const { setTotalVisitPeople } = useVisitPeopleStore();
  setTotalVisitPeople(data?.visitPeopleArray?.total ?? 0);
  setOrderList(data);

  return new Promise((resolve) => {
    resolve(data);
  });
};

/**
 * 평가하기 서버스의 주문은 프론트에서 받지 않고 BE 에서 받아 처리해야하나 프론트에서 주문을 받는 식으로 개발이 되어 해당 함수 사용
 * 평가하기 대상이 되는 주문을 BE 간 이루어 질 경우 해당 기능 삭제.
 * @param data 서버에서 받은 주문 내용
 */
export const updateReviews = (data: getCartListType) => {
  const { getStoreInfo } = storeToRefs(useInitStore());
  if (getStoreInfo.value?.storeSurveyUse !== 'Y') return;

  useReviews().updateOrderList(
    data.order_info ?? [],
    getStoreCode(),
    getInitTableId(),
    data.order_id,
  );
};

/** 페이지 처음 진입 시 배너/로고/메인 판단 함수 */
const pushFirstPage = async () => {
  const data = await initIsHaveOrderExist();

  updateReviews(data);

  // 상품리스트 최상단 이동
  document.querySelector('.middle-body')?.scrollTo({ top: 0 });

  // 에러페이지일 경우 아무 동작 안함
  if (getRoutePath() === errorPage) return null;

  // 주문내역 여부 ? 배너 : 로고
  // 배너 사용 ? 배너 : 메인
  if (data.isOrderExist) {
    const { getStoreInfo, getBannerList } = storeToRefs(useInitStore());
    return getStoreInfo.value?.bannerUse && getBannerList.value?.length > 0
      ? pushPage(banner)
      : pushPage(home);
  }
  return pushPage(logo);
};

// 주문완료 광고영상 실행중에는 페이지 이동시키지 않도록 하는 로직
const isHaveStopRedirectPath = () => {
  const path = window.location.hash.split('/')[1];
  return ['orderComplete'].includes(path);
};

/** 대기 중 배너/로고 판단 함수 */
const pushWaitingPage = async () => {
  const { getBannerList } = useInitStore();
  const { getStoreInfo } = storeToRefs(useInitStore());
  const isHaveOrder = await setIsHaveOrderExist();

  // 상품리스트 최상단 이동
  document.querySelector('.middle-body')?.scrollTo({ top: 0 });

  if (isHaveStopRedirectPath()) return;

  // 주문내역 여부
  if (!isHaveOrder) {
    pushPage(logo);
    return;
  }

  if (getStoreInfo.value.bannerUse && getBannerList.length > 0) {
    pushPage(banner);
    return;
  }

  pushPage(home);
};

const getStoreInformation = () => {
  const { init } = storeToRefs(useInitStore());

  const { storeCode } = init.value.storeInfo;
  const isStoreCode = storeCode === undefined;
  const tableString = getStorage(TABLE);
  const isTableString = tableString === null;

  if (isTableString || isStoreCode) {
    return {
      storeCode: undefined,
      tableNumber: null,
    };
  }

  const table = JSON.parse(tableString);
  const tableNumber = table.tabletId;
  const storeInfo = {
    storeCode,
    tableNumber,
  };

  return storeInfo;
};

// 미들웨어 v0.8.0주문 호환을 위한 스펙 변경
const extractOrderData = (
  items: cartProductType[],
  parentChecked: boolean = true,
): OrderItemsType[] =>
  items.flatMap((item) => {
    if (!parentChecked) {
      return [];
    }

    let nestedOptions: OrderItemsType[] = [];
    if (item.items && item.items.length > 0) {
      nestedOptions = extractOrderData(item.items, item.checked);
    }

    if (item.code && item.checked && item.code !== 'not_select') {
      const result: OrderItemsType = {
        goods_id: item.code,
        goods_qty: item.quantity!,
        options: [],
      };

      if (nestedOptions.length > 0) {
        result.options = nestedOptions;
      } else {
        result.options = [];
      }

      return [result];
    }

    return nestedOptions;
  });

const extractStallCallData = (staffItems: StaffCallItemType[]) =>
  staffItems.map((item) => ({
    goods_id: item.productCode,
    goods_qty: item.count,
    options: [],
  }));

const convertOrderData = (optionOrder: any[]): OrderItemsType[] =>
  optionOrder.map((item) => ({
    goods_id: item.id,
    goods_qty: item.quantity,
    options: extractOrderData(item.options),
  }));

const orderPayload = (orderPayload: any[]): OrderSpecType => {
  const { storeCode, tableNumber } = getStoreInformation();

  return {
    store_code: storeCode ?? '',
    tablet_id: tableNumber ?? '',
    orders: convertOrderData(orderPayload),
  };
};

const staffCallOrderPayload = (
  orderPayload: StaffCallItemType[],
): OrderSpecType => {
  const { storeCode, tableNumber } = getStoreInformation();

  return {
    store_code: storeCode ?? '',
    tablet_id: tableNumber ?? '',
    orders: extractStallCallData(orderPayload),
  };
};

const useOrderConfig = () => ({
  pushFirstPage,
  initIsHaveOrderExist,
  pushWaitingPage,
  setIsHaveOrderExist,
  extractOrderData,
  convertOrderData,
  orderPayload,
  staffCallOrderPayload,
});

export default useOrderConfig;
