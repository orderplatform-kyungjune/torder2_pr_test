import {
  inject,
  ref,
  watch,
} from 'vue';
import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { orderInfoType } from '@torder/common';
import { QueryClient } from '@tanstack/vue-query';
import {
  OrderList,
  Review,
  ReviewAnswer,
  ReviewList,
} from '@containers/review/types';
import { reviewSort } from '@containers/review/reviewLib';
import useReviewSurvey from '@containers/review/modal/storeReviewSurvey';
import TimeSchedule from '@composables/TimeSchedule';
import { reviewQueryKeys } from '@apis/review/reviewQuery';
import { getUniqueKey } from '@apis/review/review';
import { ReviewData } from '@apis/review/queries/useReviewListQuery';
import {
  ReviewListRequest,
  useCreateReviewLogMutation,
  useReviewListQuery,
  useUpdateReviewMutation,
} from '@apis/review';

const schedule = new TimeSchedule();
schedule.startSchedule();

// TODO: 전역으로 관리해야하지 않을까??
const TOUCH_AFTEREFFECT_TIMEOUT = 30_000;
let touchAftereffectEndTime = 0;
const clearAftereffect = () => {
  touchAftereffectEndTime = 0;
};
window.addEventListener('touchstart', () => {
  touchAftereffectEndTime = Date.now() + TOUCH_AFTEREFFECT_TIMEOUT;
  schedule.updateScheduleContext(clearAftereffect, touchAftereffectEndTime);
});

/**
 * store 정의
 */
const useReviews = defineStore('useReviews', () => {
  const { mutate: createReviewLog } = useCreateReviewLogMutation();

  const orderListForReview = ref<OrderList>();

  const setOrderListForReview = (ol: OrderList): any => {
    const {
      triggerType,
      variables,
    } = ol;
    const {
      orderId,
      storeCode,
      orders,
    } = variables;

    if (!orderId || !storeCode || !orders || orders.length < 1) {
      createReviewLog({
        eventType: 'NO_REVIEWS',
        data: ol.variables,
      });
      orderListForReview.value = {
        triggerType,
        variables,
      };
      return;
    }
    createReviewLog({
      eventType: triggerType,
      data: variables,
    });

    orderListForReview.value = {
      triggerType,
      variables,
    };
  };

  /**
   * 서버에서 받은 설문조사의 결과
   */
  const reviewResult = ref<ReviewData>();

  const clearReviewResult = () => {
    reviewResult.value = undefined;
  };

  const onCreateLogAndMessage = (data?: Partial<ReviewListRequest>) => {
    createReviewLog({
      eventType: reviewResult.value?.isAllCompleted ? 'NO_REVIEWS' : 'EXIST_REVIEWS',
      data,
    });
  };

  const client = inject('queryClient') as QueryClient;
  const reviewListQuery = useReviewListQuery(client);
  const updateReviewMutation = useUpdateReviewMutation((req: ReviewAnswer, key?: ReviewListRequest) => {
    client.setQueryData<ReviewData>(reviewQueryKeys.list(key), (prevReviewData) => {
      if (!prevReviewData) return undefined;

      // Review -> ReviewData
      const idx = prevReviewData.reviewList.findIndex((review: Review) => getUniqueKey(review) === req.uniqueKey);

      const { totalCount } = prevReviewData;

      const reviewList = prevReviewData.reviewList.map((item, i) => ((i === idx) ? req : item));

      const completionCount = reviewList.filter((review) => review.completionType === 'COMPLETED').length;
      const remainingCount = totalCount - completionCount;
      const isAllCompleted = remainingCount < 1;

      reviewResult.value = {
        ...prevReviewData,
        completionCount,
        remainingCount,
        isAllCompleted,
        reviewList: reviewSort(reviewList),
      };

      return reviewResult.value;
    });
  });

  const onUpdateReview = (review: ReviewAnswer) => {
    if (updateReviewMutation.isPending.value) {
      return;
    }

    updateReviewMutation.mutate({
      updateReview: review,
      key: orderListForReview.value?.variables,
    });
  };

  /**
   * 리뷰를 기다리고 있는 항목 중 Review.vue 의 설문지(Modal)를 노출
   * 노출 우선순위 : 응답하지 않은 카드 > 1개 이상응답한 카드
   * @param ret 서버에서 받은 데이터를 1차 정제한 데이터
   */
  const waitForReviews = (ret: ReviewData) => {
    const list = reviewSort(ret.reviewList.filter((r) => r.completionType !== 'COMPLETED'));

    if (list.length > 0) {
      useReviewSurvey().setModalDisplayInfo({
        isEdit: false,
        displayReview: list,
      });
    }
  };

  type ReviewOption = {
    /**
     * 리뷰 창 타임아웃 시간
     */
    timeout?: number,
    /**
     * 리뷰 창의 z-index
     */
    zIndex?: number,
    /**
     * review 화면의 하위 modal 이 닫힐 때 review 화면 닫힐지 여부
     */
    delegateTerminal?: boolean,
  }

  type ReviewProps = ReviewOption & {
    /**
     * review popup 열림/닫힘
     */
    open: boolean,
    /**
     * Review popup 창의 닫힘 - 타임아웃으로 닫힐 경우
     * @param value null
     */
    resolve?: <T>(value?: (T | PromiseLike<T>)) => void,
    /**
     * Review popup 창 닫힘 - 사용자가 닫았을 경우
     * @param value
     */
    reject?: <T>(value?: (T | PromiseLike<T>)) => void,
  }

  const reviewProps = ref<ReviewProps>({ open: false });

  /**
   * 배너에서 평가하기를 보여주게 하기 위한 flag 값
   */
  const reviewNotify = ref(false);

  let resolveFunc: (data?: unknown) => void;
  let rejectFunc: (data?: unknown) => void;

  /**
   * 리뷰 팝업을 강제로 종료 한다.
   * @param param
   *  data(option) : review 팝업을 강제로 닫을 때(promise 종료) 전달되는 데이터 값
   *  direction('resolve'|'reject') : 강제로 닫을때 promise 의 resolve, reject 중 호출할 함수명
   */
  const reviewClose = (param?: {
    data?: unknown,
    direction?: 'resolve' | 'reject',
  }) => {
    if (param?.direction === 'resolve') resolveFunc?.(param?.data);
    else rejectFunc?.(param?.data);
  };

  /**
   * 평가 창 닫기
   */
  const reviewInit = () => {
    reviewProps.value = {
      open: false,
      timeout: undefined,
      zIndex: undefined,
      resolve: undefined,
      reject: undefined,
    };
  };

  type ReviewOpenOption = {
    /**
     * 이전에 열려 있는 review popup 를 강제로 닫고 새로 열지 여부<br>
     * default : false<br>
     * true : 이전 popup 를 강제로 닫고 새로 open<br>
     * false : 이전 popup 를 그대로 둠. reject 로 error 값 'alreadyOpened' 반환<br>
     */
    force?: boolean,
    /**
     * force 가 true 일 경우 종료 방향성을 결정한다.<br>
     * default 'reject'<br>
     */
    direction?: 'resolve' | 'reject',
    /**
     * resolve, reject 시 전달하는 데이터
     */
    data?: unknown,
  }

  /**
   * review 팝업 오픈
   * @param setting review popup 에 시 설정값
   * @param option popup 열려 있는 상태에 대해서 이전 popup 에 대한 처리 관련 옵션
   */
  const reviewOpen = (setting?: ReviewOption, option?: ReviewOpenOption): {
    promise: Promise<any>,
    abort?: (data?: unknown) => void,
  } => {
    reviewNotify.value = false;
    if (reviewProps.value.open) {
      if (option?.force) {
        if (option?.direction === 'resolve') {
          resolveFunc?.(option?.data);
        } else {
          rejectFunc?.(option?.data);
        }
      } else {
        // 새로 오픈하려는 곳에 new Error('alreadyOpened') 반환
        return { promise: Promise.reject(new Error('alreadyOpened')) };
      }
    }

    if (reviewResult.value) {
      waitForReviews(reviewResult.value);
    }

    const properties: ReviewProps = { open: true };
    if (setting) {
      properties.timeout = setting.timeout;
      properties.zIndex = setting.zIndex;
      properties.delegateTerminal = setting.delegateTerminal;
    }

    const promise = new Promise<any>((resolve, reject) => {
      resolveFunc = (data: unknown) => {
        resolve(data);
        reviewInit();
      };
      rejectFunc = (data: unknown) => {
        reject(data);
        reviewInit();
      };

      properties.resolve = resolveFunc;
      properties.reject = rejectFunc;
      reviewProps.value = properties;
    });

    return {
      promise,
      abort: rejectFunc,
    };
  };

  /**
   * 평가가 마무리 되었는지 확인 로직
   * remind review 시간이 되어도 화면을 터치 이후에 바로 review 화면이 보이지 않게 터치 후유 시간 이후에 동작
   * {@link TimeSchedule} 에서 호출되어지는 콜백 함수이다.
   * @return {@link TimeSchedule} 함수의 반환 값 확인
   */
  const remindReview = (): number | null => {
    if (touchAftereffectEndTime) return touchAftereffectEndTime + 1_000; // TimeSchedule 에서 후유증갱신과 remindReview 재호출 동시 발생을 피하기 위해 1초를 추가 지연한다.
    if (!reviewResult.value || reviewResult.value.reviewList.length === 0 || reviewResult.value.isAllCompleted) {
      // 리뷰가 없거나 완료 되었을 때 popupTimes 를 삭제한다.
      schedule.removeScheduleContext(remindReview);
      return null;
    }

    reviewNotify.value = true;
    return null;
  };

  // 주문에 대한 리뷰정보 서버에서 조회
  watch(() => orderListForReview.value, (orderList) => {
    if (!orderList) return;
    const { variables } = orderList;

    // TODO: isLoading = true; // 필요성 검토
    reviewListQuery(variables).then((ret) => {
      // TODO: isLoading = false; // 필요성 검토
      reviewResult.value = {
        ...ret,
        reviewList: reviewSort(ret.reviewList),
      };

      // 자동 팝업
      if (!ret.isAllCompleted && ret.popupTimes.length > 0) {
        const now = Date.now();
        const dates = ret.popupTimes.filter((date) => (new Date(date).getTime() > now + 1_000));
        schedule.updateScheduleContext(remindReview, dates);
      }
    });
  });

  /**
   * 평가될 주문의 정보를 저장한다.
   * @param originOrderList {orderInfoType[]} 주문 내역
   * @param storeCode
   * @param tableNo
   * @param orderId
   */
  const updateOrderList = (originOrderList: orderInfoType[], storeCode: string, tableNo: string, orderId: string) => {
    let orderList: orderInfoType[] = [];
    if (originOrderList) orderList = originOrderList;

    /**
     * 평가하기 웹으로 전달할 전문
     * @type {IncomingInterface}
     */
    const review: ReviewList = {} as ReviewList;

    /**
     * 평가하기 웹으로 전달할 주문 내역
     */
    const orders: Record<number, orderInfoType[]> = orderList
      .map((d) => d) // gecko 79 에서는 toSort 가 지원되지 않아 map 으로 값을 복사 후 sort 한다.
      .sort((a, b) => a.order_time - b.order_time) // 올림차순
      .reduce((acc, order) => {
        const { order_time: orderTime } = order;
        if (!acc[orderTime]) acc[orderTime] = [];
        acc[orderTime].push(order);
        return acc;
      }, {} as Record<number, orderInfoType[]>);

    review.orderId = orderId;
    review.storeCode = storeCode;
    review.orders = Object.entries(orders)
      .filter(([orderTime]) => !Number.isNaN(Number(orderTime)))
      .map(([
        orderTime,
        orders,
      ]) => ({
        orderKey: `${storeCode}-${tableNo}-${orderTime}`,
        orderTime: dayjs(Number(orderTime) * 1_000).format('YYYY-MM-DD HH:mm:ss'),
        itemCodes: orders.map((order) => ({
          itemCode: order.good_code,
          displayName: order.display_name,
          goodName: order.good_name,
          goodPrice: Number(order.good_price),
          imgUrl: order.img_url,
          langs: order.trans,
          itemQuantity: order.order_qty,
          options: order.option.map((option) => ({
            optionCode: option.good_code,
            optionName: option.display_name,
            quantity: option.order_qty,
            price: option.good_price,
            langs: option.langs,
            imgUrl: option.img_url,
          })),
        })),
      }));
    setOrderListForReview({
      variables: review,
      triggerType: 'UPDATE',
    });
  };

  return {
    reviewProps,
    reviewNotify,
    reviewResult,
    orderListForReview,
    onUpdateReview,
    reviewClose,
    onCreateLogAndMessage,
    updateOrderList,
    reviewOpen,
    clearReviewResult,
  };
});

export default useReviews;
