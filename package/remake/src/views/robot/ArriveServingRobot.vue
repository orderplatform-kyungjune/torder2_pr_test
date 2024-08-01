<template>
  <div class="arrive-serving-robot-container">
    <div class="arrive-serving-robot-top-wrap">
      <CloseButton
        :background="'#fff'"
        :color="'#000'"
        :content="t('닫기')"
        :theme-type="theme.type"
        class="close-button"
        route="https://static.torder.co.kr/torder2/svg_closebutton_normal_black.svg"
        @click="pushPage(home)"
      />
      <div class="company-logo">
        <img
          :src="getBannerLogoImage()"
          alt="메인 로고"
          class="company-logo-image"
        >
      </div>
      <!-- 세로, 가로 블랙 테마 -->
      <BasicLayoutStoreTableInfo
        v-if="isVertical || isHorizontal"
        :storeName="getStoreName()"
        :tableName="getInitTableName()"
        :theme-color="BLACK"
        :title="t('테이블명')"
        class="table-container"
        @click="onNextSecret"
      />
      <!-- 커스텀 테마 -->
      <CustomTableTag
        v-if="isHyatt"
        :storeInfo="getStoreName()"
        :tableInfo="getInitTableName()"
        class="custom-theme-table"
        @click="onNextSecret"
      />
    </div>
    <div class="arrive-serving-robot-guide-area">
      <span class="guide-title">{{ t('로봇이 도착했어요!') }}</span>
      <span class="guide-text">{{ t('잘 받으셨으면 로봇을 돌려보내 주세요.') }}</span>
      <div
        class="go-back-robot-button"
        @click="robotGoBack"
      >
        {{ t('받기 완료') }}
      </div>
      <span class="time-text">
        {{ `${t('n초 후에 닫힙니다.', { time: second })}` }}
      </span>

      <div class="call-staff-wrap">
        <span class="call-staff-text">{{ t('도움이 필요하신가요?') }}</span>
        <button
          class="call-staff-button"
          @click="callStaffOnly"
        >
          {{ t('직원 호출') }}
        </button>
      </div>
    </div>
    <img
      :src="robotInfo?.robotArriveImg"
      alt="로봇 도착 광고이미지"
      class="arrive-serving-robot-advertisement-area"
    >
  </div>
</template>

<script lang='ts' setup>
import { useI18n } from 'vue-i18n';
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import { pushPage } from '@utils/route.helper';
import { getBannerLogoImage } from '@utils/logoUtils';
import { usePlayAosAudio } from '@utils/audio';
import {
  CUSTOM_STAFF_CALL_CHECK,
  STAFF_CALL_CHECK,
  HYATT,
  BLACK,
  VERTICAL,
  HORIZONTAL,
  SERVING_ROBOT_AUDIO,
} from '@torder/common/constant';

import {
  getInitTableName,
  getStoreName,
} from '@torder/common';
import useThemeStore from '@store/storeTheme';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import { home } from '@router/routePaths';
import servingRobot from '@composables/servingRobot';
import { useSecret } from '@composables/secret';
import {
  BasicLayoutStoreTableInfo,
  CloseButton,
  CustomTableTag,
} from '@components';

const { t } = useI18n();
const { getStoreInfo } = storeToRefs(useInitStore());
const { robotInfo } = getStoreInfo.value;
const { openModal } = useModalStore();

const { theme } = storeToRefs(useThemeStore());
const { onNextSecret } = useSecret();
const { robotGoBack } = servingRobot();

const isVertical = computed(() => theme.value.type === VERTICAL);
const isHorizontal = computed(() => theme.value.type === HORIZONTAL);
const isHyatt = computed(() => theme.value.type === HYATT);

// n초 후 자동 페이지 닫기 처리
const second = ref(robotInfo?.robotDelayTime ?? 120);
let interval: ReturnType<typeof setInterval>;

onBeforeMount(() => {
  interval = setInterval(() => {
    if (second.value > 1) {
      second.value -= 1;
    } else {
      pushPage(home);
    }
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(interval);
});

onMounted(() => {
  if (window.UUID) {
    if (getStoreInfo.value.businessType !== 'uplus') window.UUID.playOrderBell();
    else {
      const nativeFilePath = `audio/${SERVING_ROBOT_AUDIO[0].fileName}`;
      usePlayAosAudio(nativeFilePath, 100);
    }
  }
});

const callStaffOnly = () => {
  if (theme.value.type === HYATT) {
    openModal(CUSTOM_STAFF_CALL_CHECK);
  } else {
    openModal(STAFF_CALL_CHECK);
  }
};

</script>

<style lang='scss' scoped>
.arrive-serving-robot-container {
  position: absolute;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: 'Pretendard', sans-serif;

  .arrive-serving-robot-top-wrap {
    position: absolute;
    top: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;

    .close-button {
      position: fixed;
      top: 1.5625vw;
      left: 1.5625vw;
      z-index: 24;
    }

    .company-logo {
      position: absolute;
      top: 1.5625vw;
      left: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, 0%);

      .company-logo-image {
        max-width: 16.328125vw;
        max-height: 3.75vw;
        object-fit: contain;
        filter: drop-shadow(0 0.0781vw 0.5469vw rgba(0, 0, 0, 0.55));
      }
    }

    .table-container {
      position: fixed;
      top: 0;
      right: 1.5625vw;
    }

    .custom-theme-table {
      position: absolute;
      top: 0;
      right: 1.5625vw;
      z-index: 20;
    }
  }

  .arrive-serving-robot-guide-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 64.0625vw;
    height: 100%;
    padding-left: 3.1250vw;
    font-size: 2.6563vw;
    background-color: #fff;

    .guide-title {
      font-size: 5.4688vw;
      font-weight: 700;
      line-height: 6.5266vw;
    }

    .guide-text {
      margin-top: 0.9375vw;
      font-size: 2.5000vw;
      font-weight: 500;
      line-height: 3.1250vw;
      color: #5B5B5B;
      letter-spacing: -0.0500vw;

    }

    .go-back-robot-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40.7813vw;
      height: 7.9688vw;
      margin-top: 3.4375vw;
      font-size: 3.7500vw;
      font-weight: 700;
      line-height: 4.2188vw;
      color: #fff;
      background-color: #e30000;
      border-radius: 1.25vw;
    }

    .time-text {
      margin-top: 1.8750vw;
      font-size: 1.5625vw;
      font-weight: 600;
      line-height: 1.8750vw;
      color: #959595;
      letter-spacing: -0.0313vw;
    }

    .call-staff-wrap {
      position: absolute;
      bottom: 2.9688vw;
      display: flex;
      gap: 1.5625vw;
      align-items: center;

      .call-staff-text {
        font-size: 2.1875vw;
        font-weight: 600;
        line-height: 2.5000vw;
        color: #5b5b5b;
        letter-spacing: -0.0438vw;
      }

      .call-staff-button {
        width: 20.9375vw;
        height: 5.6250vw;
        font-size: 2.3438vw;
        font-weight: 700;
        line-height: 3.1250vw;
        color: #5b5b5b;
        letter-spacing: -0.0469vw;
        background-color: #fff;
        border: 0.0781vw solid #5b5b5b;
        border-radius: 0.7813vw;

        &.button-active {
          background-color: #EBEBEB;
        }
      }
    }
  }

  .arrive-serving-robot-advertisement-area {
    flex: 1;
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
  }
}
</style>
