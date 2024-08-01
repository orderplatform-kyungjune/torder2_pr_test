import { useRoute } from 'vue-router';
import {
  computed,
  reactive,
  ref,
} from 'vue';
import { defineStore } from 'pinia';
import { modalType } from '@torder/common/interface/modal';
import { removeNewLine } from '@torder/common';
import { MODAL } from '@store/keys';
import {
  home,
  banner,
  logo,
} from '@router/routePaths';

const useModalStore = defineStore(MODAL, () => {
  const flag = reactive<modalType>({
    example: false,
    login: false,
    order: false,
    bill: false,
    event: false,
    staff: false,
    cart: false,
    cartConfirm: false,
    theme: false,
    lang: false,
    StaffCall: false,
    staffCallCheck: false,
    customStaffCallCheck: false,
    staffCallCompletion: false,
    secretLogin: false,
    secretMain: false,
    flash: false,
    notUse: false, // 서비스 점검중 모달
    visitPeople: false,
    visitConfirm: false,
    visitSelect: false,
    confirmAlertModal: false, // 확인버튼 알럿 모달
    paymentRefundAlarmModal: false, // 선결제 주문 실패 알림 모달
    bannerControl: false, // 배너 컨트롤
    pickUp: false, // 픽업 요청
    customLang: false, // 커스텀 테마 언어 변경 화면
    customVisitPeople: false, // 커스텀 테마 인원수 입력
    customCartConfirm: false, // 커스텀 테마 주문시 확인창
    customConfirm: false, // 커스텀 테마 상품 추가 확인창
    basicConfirm: false, // 기본 테마 상품 추가 확인창
    terminationOfContract: false, // 계약 상태가 해지, 양도양수, 요금미납, 폐업일 때 [라이센스 만료] 문구 모달
    callRobotConfirm: false, // 로봇호출 확인창
  });

  const route = useRoute();

  const alertContent = ref('');
  // 확인 모달창 내용
  const confirmAlertMessage = ref('');
  // 확인 모달창 버튼 문구
  const confirmButtonText = ref('');
  // 장바구니에 담긴 상품 추가시 확인창 장바구니 Index
  const additionalProductIndex = ref(0);

  /**
     * 인원수 기능 기본 테마, 필수 입력 미사용일 경우
     주문하기로 인원수 페이지로 진입했는지 (true)
     인원수 페이지로 바로 진입했는지 (false)
     판단해서 주문이 들어가야하는지 구분하는 로직
     */
  const isBeforeOrder = ref(false);
  const setBeforeOrder = () => {
    isBeforeOrder.value = true;
  };
  const resetBeforeOrder = () => {
    isBeforeOrder.value = false;
  };

  const setAdditionalProductIndex = (index: number) => {
    additionalProductIndex.value = index;
  };

  const openModal = (key: string) => {
    flag[key] = true;
  };

  const entryPoint = ref('');
  const updateEntryPoint = (point: string) => {
    entryPoint.value = point;
  };

  const openConfirmModal = (key: string, content: string, buttonText: string) => {
    flag[key] = true;
    confirmAlertMessage.value = removeNewLine(content);
    confirmButtonText.value = buttonText;
  };

  const openAlert = (content: string) => {
    flag.flash = true;
    alertContent.value = content;
  };

  const getAlertContent = computed(() => alertContent);

  const closeModal = (key: string) => {
    flag[key] = false;
    updateEntryPoint('');
  };

  const toggleModal = (key: string) => {
    const isFlagKey = flag[key];

    if (isFlagKey) {
      closeModal(key);
    } else {
      openModal(key);
    }
  };

  let clickConfirmButton: () => void;
  const openConfirmAlert = (message: string, active?: () => void) => {
    if (active) {
      clickConfirmButton = active;
    }
    confirmAlertMessage.value = message;
    flag.confirmAlertModal = true;
  };

  const closeConfirmAlert = () => {
    // 확인버튼의 함수가 존재하면 실행
    if (clickConfirmButton) {
      clickConfirmButton();
    }
    flag.confirmAlertModal = false;
  };

  // 선결제 주문 실패 알림 모달 관련
  const openPaymentRefundAlarmModal = () => {
    flag.paymentRefundAlarmModal = true;
  };

  const closePaymentRefundAlarmModal = () => {
    flag.paymentRefundAlarmModal = false;
  };

  // 타이머 메시지가 노출되는 조건을 확인하는 로직 (홈, 배너, 로고, flash 모달창)
  const isTimerMessageShow = () => {
    const modalFlagArray = Object.entries(flag);
    const isHaveModalOpenState = !modalFlagArray.some((flag) => flag[0] !== 'flash' && flag[1]);

    const checkRouterPath = route.path === home || route.path === banner || route.path === logo;

    return checkRouterPath && isHaveModalOpenState;
  };

  return {
    flag,
    entryPoint,
    openModal,
    updateEntryPoint,
    openConfirmModal,
    closeModal,
    toggleModal,
    getAlertContent,
    openAlert,
    confirmAlertMessage,
    confirmButtonText,
    additionalProductIndex,
    setAdditionalProductIndex,
    openConfirmAlert,
    closeConfirmAlert,
    openPaymentRefundAlarmModal,
    closePaymentRefundAlarmModal,
    isTimerMessageShow,
    isBeforeOrder,
    setBeforeOrder,
    resetBeforeOrder,
  };
});

export default useModalStore;
