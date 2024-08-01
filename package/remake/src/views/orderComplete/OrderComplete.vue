<template>
  <div class="order-complete-container">
    <div
      v-if="isVideoShow"
      class="video-controller"
    >
      <img
        :src="isSoundOn ? 'https://static.torder.co.kr/torder2/ico_sound_on.png' : 'https://static.torder.co.kr/torder2/ico_sound_off.png'"
        alt="soundIco"
        @click="permuteSound"
      >
      <div>
        <slider
          v-if="isSoundOn"
          v-model="volume"
          color="#403cff"
          track-color="#FEFEFE"
          width="15.625vw"
          :height="50"
          :max="100"
          :min="0"
          :step="1"
          :orientation="'vertical'"
          tooltip
          @change="controlVolume"
        />
      </div>
    </div>
    <div
      v-if="isVideoShow"
      class="video-wrapper"
    >
      <video
        class="video"
        :autoplay="autoplay"
        :muted="muted"
        :poster="randomThumbnail"
        @ended="onNextRoot"
      >
        <source
          :src="randomVideo"
          type="video/webm"
        >
      </video>
      <div class="orderComplete-info-wrapper">
        <div class="orderComplete-info">
          <!-- 선결제 매장이면서 선결제 테이블일 경우 메세지 -->
          <div
            v-if="getInitTableCreditUse() && getStoreInfo.prePaymentUse === 'Y'"
            class="text"
          >
            주문 확인 중이니 잠시만 기다려주세요.
          </div>
          <div
            v-else
            class="text"
          >
            {{ getOrderCompleteMessage(getStoreInfo.businessType) }}
          </div>
          <div
            class="button"
            :class="theme.type"
            @click="onNextRoot"
          >
            {{ t('확인') }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="order-complete-not-ad-container"
    >
      <div class="order-complete-not-ad-text">
        {{ getOrderCompleteMessage(getStoreInfo.businessType) }}
      </div>
      <div
        class="order-complete-not-ad-button"
        :class="theme.type"
        @click="onNextRoot"
      >
        {{ t('확인') }}
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import slider from 'vue3-slider';
import { useI18n } from 'vue-i18n';
import {
  computed,
  onMounted,
  ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import { pushPage } from '@utils/route.helper';
import { getOrderCompleteMessage } from '@utils/businessTypeText';
import {
  getInitTableCreditUse,
  getSubPrimaryColor,
} from '@torder/common/utils';
import useThemeStore from '@store/storeTheme';
import useInitStore from '@store/storeInit';
import { home } from '@router/routePaths';

const { theme } = storeToRefs(useThemeStore());

const { t } = useI18n();

const onNextRoot = (): void => {
  pushPage(home);
};

const defaultVideoThumbnail = 'https://d25d5hdteapulp.cloudfront.net/img/230111_thumnail_cf_owner_1280x720.png';
const defaultVideoSource = 'https://d25d5hdteapulp.cloudfront.net/video/cf/230127_owner_30A_HD_1280x720.webm';

const {
  getStoreInfo,
  getCheckoutList,
  buttonBackgroundColor,
  buttonFontColor,
} = storeToRefs(useInitStore());

const randomIndex = Math.floor(Math.random() * getCheckoutList.value.length);

const randomVideo = computed(() => {
  if (getCheckoutList.value.length === 0) return defaultVideoSource;

  return getCheckoutList.value[randomIndex]?.url ?? defaultVideoSource;
});

const randomThumbnail = computed(() => {
  if (getCheckoutList.value.length === 0) return defaultVideoThumbnail;

  return getCheckoutList.value[randomIndex]?.thumbnail_url ?? defaultVideoThumbnail;
});

const isVideoShow = computed(() => getStoreInfo.value.checkoutAdUse === 0);

const isSoundOn = ref<boolean>(false);
const volume = ref<number>(50);

// 주문 후 영상 노출 로직
const permuteSound = () => {
  const videoElement = document.querySelector('.video') as HTMLVideoElement;
  videoElement.muted = !videoElement.muted;
  isSoundOn.value = !isSoundOn.value;
  videoElement.play();
};

const controlVolume = () => {
  const videoElement = document.querySelector('.video') as HTMLVideoElement;
  videoElement.volume = volume.value / 100;
};

const autoplay = ref<boolean>(true);
const muted = ref<boolean>(true);

const play = () => {
  if (!autoplay.value || !muted.value) {
    autoplay.value = true;
    muted.value = true;
  }
  const videoElement = document.querySelector('.video') as HTMLVideoElement;
  videoElement.play();
};

const getActiveButtonColor = () => getSubPrimaryColor(buttonBackgroundColor.value, 10, 'Y');

onMounted(() => {
  if (!isVideoShow.value) return;
  play();
});
</script>

<style lang='scss' scoped>
.order-complete-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 70;
  display: flex;
  flex-direction: column;
  gap: 3vw;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard', sans-serif;
  color: #fff;
  text-align: center;
  word-break: break-all;
  background-color: rgba(0, 0, 0, 0.6);

  .video-wrapper {
    position: relative;
    width: 100%;
    height: 100%;

    .video {
      width: 100%;
      height: 100%;
      object-fit: fill;
      background-color: #000;
    }

    .orderComplete-info-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: end;
      width: 100%;
      height: 23.4375vw;
      padding-bottom: 3.9063vw;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.40) 100%);

      .orderComplete-info {
        display: flex;
        flex-direction: column;
        gap: 3.125vw;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .text {
          font-size: 5.4688vw;
          font-weight: 700;
          line-height: normal;
          color: #fff;
          text-align: center;
        }

        .button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 31.25vw;
          height: 5vw;
          font-size: 1.875vw;
          font-weight: 700;
          line-height: 2.5vw;
          color: #fff;
          letter-spacing: -0.0375vw;
          background-color: #F91515;
          border-radius: 1.1719vw;

          &.button-active {
            background-color: #D60505;
          }

          &.hyatt {
            color: v-bind(buttonFontColor);
            background-color: v-bind(buttonBackgroundColor);

            &.button-active {
              background-color: v-bind(getActiveButtonColor());
            }
          }
        }
      }
    }
  }
  .video-controller {
    position: absolute;
    top: 5%;
    right: 5%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5625vw;
    align-items: center;

    img {
      width: 4.4250vw;
      height: 4.4250vw;
      padding: 0.7813vw;
      background-color: #666666;
      border-radius: 50%;
      box-shadow: .7813vw .7813vw 1.5625vw 0 rgba(1, 0, 49, 0.38);
    }

    &:deep(.tooltip){
      justify-content: center;
      width: 2.3438vw;
      padding: .2344vw;
    }
  }
}

.order-complete-not-ad-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 70;
  display: flex;
  flex-direction: column;
  gap: 3.125vw;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard', sans-serif;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);

  .order-complete-not-ad-text {
    font-size: 5.625vw;
    font-weight: 700;
    line-height: normal;
    color: #FFF;
    text-align: center;
  }

  .order-complete-not-ad-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35.1563vw;
    padding: 1.25vw 1.5625vw;
    font-size: 3.2813vw;
    font-weight: 700;
    line-height: 4.375vw;
    color: #FFF;
    letter-spacing: -0.0656vw;
    background-color: #F91515;
    border-radius: 0.9375vw;

    &.button-active {
      background-color: #D60505;
    }

    &.hyatt {
      color: v-bind(buttonFontColor);
      background-color: v-bind(buttonBackgroundColor);

      &.button-active {
        background-color: v-bind(getActiveButtonColor());
      }
    }

  }
}
</style>
