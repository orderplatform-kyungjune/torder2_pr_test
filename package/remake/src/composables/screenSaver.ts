// 스크린세이버 관련 코드
import {
  ref,
  watch,
} from 'vue';
import { storeToRefs } from 'pinia';
import useInitStore from '@store/storeInit';
import {
  banner,
  errorPage,
  logo,
  arriveServingRobot,
} from '@router/routePaths';
import useOrderConfig from '@composables/useOrderConfig';

const { pushWaitingPage } = useOrderConfig();

const element = {
  touchElement: document.body,
  scrollElement: document.body,
};

const screenSaver = (target = element, time = 120) => {
  const timer = ref(time);

  // eslint-disable-next-line no-undef
  const currentIntervalId = ref<undefined | NodeJS.Timeout>(undefined);

  const {
    touchElement = document.body,
    scrollElement = document.body,
  } = target;

  // 스크린세이버 미작동 주소
  const notScreenSaverPath = [
    banner,
    logo,
    errorPage,
    arriveServingRobot,
  ];

  const callTimer = () => {
    const { getStoreInfo } = storeToRefs(useInitStore());

    const handleTimer = setInterval((): void => {
      const isTimerZero = timer.value === 0;

      const checkPath = notScreenSaverPath.some((word) => window.location.href.includes(word));
      if (checkPath) {
        // eslint-disable-next-line no-use-before-define
        resetInterval();
        return;
      }

      if (isTimerZero) {
        clearInterval(handleTimer);

        if (getStoreInfo.value.storeClose || getStoreInfo.value.storeStat === 4 || getStoreInfo.value.storeStat === 5 || getStoreInfo.value.storeStat === 6 || getStoreInfo.value.storeStat === 7) {
          // 서비스 점검중, 계약 상태가 해지, 양도양수, 요금미납, 폐업인 경우를 제외한 경우는 배너/로고 노출함.
        } else {
          pushWaitingPage();
        }
        return;
      }

      timer.value -= 1;
    }, 1000);
    return handleTimer;
  };

  if (!currentIntervalId.value) currentIntervalId.value = callTimer();

  const changedScreenSaverTime = (changedTime: number) => {
    // eslint-disable-next-line no-param-reassign
    time = changedTime;
    timer.value = changedTime;
  };

  function resetInterval() {
    clearInterval(currentIntervalId.value);
    currentIntervalId.value = callTimer();
    timer.value = time;
  }

  if (window.location) {
    watch(() => window.location.hash, () => {
      const checkPath = notScreenSaverPath.some((word) => window.location.href.includes(word));
      if (checkPath) return;
      resetInterval();
    });
  }

  touchElement.addEventListener('touchstart', () => {
    resetInterval();
  });

  touchElement.addEventListener('touchend', () => {
    resetInterval();
  });

  scrollElement.addEventListener('scroll', () => {
    resetInterval();
  });

  return {
    timer,
    callTimer,
    currentIntervalId,
    changedScreenSaverTime,
  };
};

export default screenSaver;
