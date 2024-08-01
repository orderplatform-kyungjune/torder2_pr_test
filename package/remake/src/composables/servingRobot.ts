import { useI18n } from 'vue-i18n';
import { pushPage } from '@utils/route.helper';
import { CALL_ROBOT_CONFIRM } from '@torder/common/constant';
import {
  getInitTableName,
  getStoreCode,
} from '@torder/common';
import useModalStore from '@store/storeModal';
import { home } from '@router/routePaths';
import { RequestRobotParamsType } from '@interface/robot';
import {
  requestRobotCall,
  requestRobotGoBack,
  requestRobotHealCheck,
} from '@apis/robot';

export const servingRobot = () => {
  const {
    openAlert,
    openModal,
    closeModal,
  } = useModalStore();
  const { t } = useI18n();

  const storeCode = getStoreCode();
  const tableName = getInitTableName();

  /**
     * '로봇이 도착했어요!; 화면 내 로봇 돌려보내기(받기 완료) 버튼 눌렀을 때
     * true, false : res.data.message 토스트 메세지 노출
     */

  const robotGoBack = async () => {
    const params: RequestRobotParamsType = {
      storeCode,
      tabletNumber: tableName,
    };
    const res = await requestRobotGoBack(params);

    openAlert(res.data.message);

    if (res.status === 200) {
      pushPage(home);
    }
  };

  /**
     * 직원호출 위 로봇호출 버튼 눌렀을 때 로봇 상태 체크
     * true : 로봇을 호출하시겠습니까? 팝업 노출
     * false : res.message (호출 실패 사유) (예시: 로봇이 도착할 수 없는 테이블입니다.)
     */
  const robotHealCheck = async () => {
    const params: RequestRobotParamsType = {
      storeCode,
      tableName,
    };
    const res = await requestRobotHealCheck(params);

    if (res.data.result) {
      openModal(CALL_ROBOT_CONFIRM);
    } else {
      openAlert(res.data.message);
    }
  };

  /**
     * 로봇을 호출하시겠습니까? 팝업에서 '예'를 누른 경우 or 퇴식 호출
     * true : 메뉴판으로 이동 및 토스트 메세지 노출 ("로봇을 호출하였습니다." 정적 텍스트)
     * false: res.message, 메뉴판으로 이동 및 토스트 메세지 노출
     */

  const robotCall = async () => {
    const params: RequestRobotParamsType = {
      storeCode,
      tableName,
    };
    const res = await requestRobotCall(params);

    if (res.status !== 200) {
      openAlert(t('로봇 호출에 실패했습니다.'));
    }

    if (res.data.result) {
      openAlert(t('로봇을 호출했습니다.'));
    } else {
      openAlert(res.data.message);
    }
  };

  return {
    robotGoBack,
    robotHealCheck,
    robotCall,
  };
};

export default servingRobot;
