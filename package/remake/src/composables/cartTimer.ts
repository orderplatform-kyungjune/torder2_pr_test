// 장바구니 초기화 관련 코드
import {
  computed,
  ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import {
  CART,
  CUSTOM_VISIT_PEOPLE,
  CUSTOM_CART_CONFIRM,
  VISIT_PEOPLE,
} from '@torder/common/constant';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import i18n from '@i18n';

const cartTimer = (time = 60) => {
  const timer = ref(time);

  const { getStoreInfo } = storeToRefs(useInitStore());

  const { deleteCartProductAll } = useCartStore();
  const {
    cartProducts,
    cartTimeId,
  } = storeToRefs(useCartStore());

  const {
    closeModal,
    openAlert,
  } = useModalStore();

  if (getStoreInfo.value?.cartRefreshTime) timer.value = getStoreInfo.value?.cartRefreshTime;

  // 스크린세이버 미작동 주소
  const notCartResetPage = [
    'detail', // 기본 테마 상품 상세
    'option', // 기본 테마 옵션 레이아웃
    'staffCall', // 기본 테마 직원 호출
    'bill', // 기본 테마 계산서
    'History', // 기본 테마 주문 내역
    'customProductDetail', // 커스텀 테마 상품 상세
    'internationalTextOption', // 커스텀 테마 텍스트형 옵션 레이아웃
    'internationalImageOption', // 커스텀 테마 이미지형 옵션 레이아웃
    'internationalStaffCall', // 커스텀 테마 직원호출
    'customOrderHistory', // 커스텀 테마 주문내역
  ];

  const isCartEmpty = computed(() => cartProducts.value.length === 0);

  const callTimer = () => {
    const handleTimer = setInterval((): void => {
      const isTimerZero = timer.value === 0;
      const checkPath = notCartResetPage.some((word) => window.location.hash.includes(word));
      if (isTimerZero) {
        // 장바구니 비어있으면 비움 로직 실행 x
        if (checkPath || isCartEmpty.value) return;

        deleteCartProductAll();
        closeModal(CART);
        closeModal(VISIT_PEOPLE);
        closeModal(CUSTOM_VISIT_PEOPLE);
        closeModal(CUSTOM_CART_CONFIRM);
        return;
      }
      timer.value -= 1;
      if (!checkPath && timer.value === 10 && !isCartEmpty.value) openAlert(`${i18n.global.t('10초 후 장바구니가 비워집니다.')}`);
    }, 1000);

    return handleTimer;
  };

  const changedCartTimerTime = (changedTime: number) => {
    // eslint-disable-next-line no-param-reassign
    time = changedTime;
    timer.value = changedTime;
  };

  const resetInterval = () => {
    timer.value = time;
  };

  window.removeEventListener('touchstart', resetInterval);

  window.removeEventListener('touchend', resetInterval);

  window.removeEventListener('touchmove', resetInterval);

  clearInterval(cartTimeId.value);

  cartTimeId.value = callTimer();

  window.addEventListener('touchstart', resetInterval);

  window.addEventListener('touchend', resetInterval);

  window.addEventListener('touchmove', resetInterval);

  return {
    timer,
    callTimer,
    resetInterval,
    changedCartTimerTime,
  };
};

export default cartTimer;
