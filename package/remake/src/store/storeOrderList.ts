import {
  Ref,
  computed,
  ref,
} from 'vue';
import { defineStore } from 'pinia';
import { getCartListType } from '@torder/common/interface/orderList';
import { ORDER_LIST } from '@store/keys';

const useOrderListStore = defineStore(ORDER_LIST, () => {
  const orderList: Ref<getCartListType> = ref({} as getCartListType);
  const setOrderList = (data: getCartListType) => {
    orderList.value = data;
    /* 로컬스토리지에 orderKey, orderId 저장하기
      - LayoutHub.vue mount될 때마다 get_cart_list를 호출하는데
      - route 구조 상 LayoutHub.vue의 자식 컴포넌트에서 전역상태 데이터(주문내역)를 사용할 때
      - 간헐적으로 호출 응답되기 전에 데이터를 의존해버리는 시점 문제때문에 로컬스토리지로도 관리하기 위함.
      - 요약: 배너페이지에서 주문내역 데이터 쓰고 싶어요 -> LayoutHub.vue에서 아직 응답 기다리는 중이에요. = 배너페이지는 응답속도에 따라 데이터가 undefined 일 수도 있어요.
    */
    const orderUniqueData = {
      orderKey: data.orderKey,
      orderId: data.order_id,
    };
    localStorage.setItem('orderUniqueData', JSON.stringify(orderUniqueData));
  };

  const isHaveOrderList = computed(() => orderList.value?.order_info?.length !== 0);

  return {
    orderList,
    setOrderList,
    isHaveOrderList,
  };
});

export default useOrderListStore;
