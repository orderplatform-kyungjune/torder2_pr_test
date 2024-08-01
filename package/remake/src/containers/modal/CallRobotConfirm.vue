<template>
  <teleport
    v-if="flag.callRobotConfirm"
    to="#modal"
  >
    <div class="call-robot-confirm-container">
      <span class="call-robot-question-text">{{ t('로봇을 호출하시겠습니까?') }}</span>
      <div class="call-robot-button-wrap">
        <div
          class="no button"
          @click="closeModal(CALL_ROBOT_CONFIRM)"
        >
          {{ t('아니요') }}
        </div>
        <div
          class="yes button"
          @click="yesRobotCall"
        >
          {{ t('호출하기') }}
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { CALL_ROBOT_CONFIRM } from '@torder/common';
import useModalStore from '@store/storeModal';
import servingRobot from '@composables/servingRobot';

const { t } = useI18n();
const {
  flag,
  closeModal,
} = useModalStore();

const { robotCall } = servingRobot();

const yesRobotCall = () => {
  robotCall();
  closeModal(CALL_ROBOT_CONFIRM);
};
</script>

<style lang="scss" scoped>
.call-robot-confirm-container {
  position: absolute;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);

  .call-robot-question-text {
    font-size: 5.4688vw;
    font-weight: 700;
    line-height: 6.5266vw;
    color: #fff;
  }

  .call-robot-button-wrap {
    display: flex;
    gap: 1.5625vw;
    margin-top: 3.1250vw;

    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 9.2188vw;
      font-family: 'Pretendard', sans-serif;
      font-size: 3.7500vw;
      font-weight: 700;
      line-height: 4.2188vw;
      color: #FFF;
      border-radius: 1.25vw;
    }

    .no {
      width: 16.0156vw;
      background-color: #5B5B5B;
    }

    .yes {
      width: 38.6719vw;
      background-color: #E30000;
    }
  }
}
</style>
