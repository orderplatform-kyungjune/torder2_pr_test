import { storeToRefs } from 'pinia';
import {
  SECRET_LOGIN,
  SECRET_MAIN,
} from '@torder/common/constant';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';

export const useSecret = () => {
  const {
    openModal,
    updateEntryPoint,
  } = useModalStore();
  const { getStoreInfo } = storeToRefs(useInitStore());

  let timer: ReturnType<typeof setTimeout>;
  let clickCount = 0;

  const onNextSecret = () => {
    clearTimeout(timer);

    // 태블릿 설정 접근 방식 사용
    if (getStoreInfo.value.directTable === 1) {
      openModal(SECRET_MAIN);
    } else {
      timer = setTimeout(() => {
        clickCount = 0;
      }, 1000);

      clickCount += 1;

      if (clickCount > 4) {
        openModal(SECRET_LOGIN);
      }
    }
  };

  let returnRobotTimer: ReturnType<typeof setTimeout>;
  let returnRobotClickCount = 0;

  const onNextSecretReturnRobot = () => {
    clearTimeout(returnRobotTimer);

    returnRobotTimer = setTimeout(() => {
      returnRobotClickCount = 0;
    }, 1000);

    returnRobotClickCount += 1;

    if (returnRobotClickCount > 4) {
      updateEntryPoint('logo');
      openModal(SECRET_MAIN);
    }
  };

  return {
    onNextSecret,
    onNextSecretReturnRobot,
  };
};

export default useSecret;
