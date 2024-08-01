<template>
  <Teleport
    v-if="modalState"
    to="#modal"
  >
    <div class="banner-control">
      <div
        class="banner-control-container"
        @click="closeModal(BANNER_CONTROL)"
      >
        <div class="banner-control-wrap">
          <div
            class="banner-control-close-button"
            @click="clickCloseButton"
          >
            <img
              class="banner-control-close-image"
              src="https://static.torder.co.kr/torder2/svg_closebutton_normal_white.svg"
              alt="닫기 아이콘"
            >
            <p>
              닫기
            </p>
          </div>
          <div class="banner-control-button">
            <div
              class="banner-control-button-prev"
              @click="clickPrevButton"
            >
              <img
                class="banner-control-button-prev-image"
                src="https://static.torder.co.kr/torder2/prev_arrow_white.svg"
                alt="왼쪽 화살표 이미지"
              >
              <p>
                이전
              </p>
            </div>
            <div
              class="banner-control-button-next"
              @click="clickNextButton"
            >
              <p>
                다음
              </p>
              <img
                class="banner-control-button-next-image"
                src="https://static.torder.co.kr/torder2/next_arrow_white.svg"
                alt="오른쪽 화살표 이미지"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { pushPage } from '@utils/route.helper';
import { BANNER_CONTROL } from '@torder/common/constant/string';
import useModalStore from '@store/storeModal';
import { home } from '@router/routePaths';

const props = defineProps<{
  prevBanner: () => void,
  nextBanner: () => void,
}>();

const {
  flag,
  closeModal,
} = useModalStore();

const modalState = computed(() => flag.bannerControl);

const clickCloseButton = () => {
  closeModal(BANNER_CONTROL);
  pushPage(home);
};

const clickPrevButton = () => {
  closeModal(BANNER_CONTROL);
  props.prevBanner();
};

const clickNextButton = () => {
  closeModal(BANNER_CONTROL);
  props.nextBanner();
};
</script>

<style lang="scss" scoped>
.banner-control {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10000;

  .banner-control-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    font-family: 'Pretendard', sans-serif;
    background-color: rgba(0, 0, 0, 0.7);

    .banner-control-wrap {
      display: flex;
      gap: 1vw;

      .banner-control-close-button {
        display: flex;
        gap: 1vw;
        align-items: center;
        justify-content: center;
        height: 12vw;
        padding: 0 6vw;
        margin-right: 1vw;
        font-size: 3vw;
        font-weight: 600;
        line-height: 1.3;
        color: #fafafa;
        background-color: #202020;
        border-radius: 100vw;

        .banner-control-close-image {
          z-index: 10;
          width: 3vw;
        }
      }

      .banner-control-button {
        display: flex;
        align-items: center;

        .banner-control-button-prev {
          display: flex;
          gap: 1vw;
          align-items: center;
          height: 12vw;
          padding: 0 6vw;
          font-size: 3vw;
          font-weight: 600;
          color: #fafafa;
          background-color: red;
          border-top-left-radius: 100vw;
          border-bottom-left-radius: 100vw;

          .banner-control-button-prev-image {
            width: auto;
            height: 3vw;
          }
        }

        .banner-control-button-next {
          display: flex;
          gap: 1vw;
          align-items: center;
          height: 12vw;
          padding: 0 6vw;
          font-size: 3vw;
          font-weight: 600;
          color: #fafafa;
          background-color: red;
          border-top-right-radius: 100vw;
          border-bottom-right-radius: 100vw;

          .banner-control-button-next-image {
            width: auto;
            height: 3vw;
          }
        }
      }
    }
  }
}
</style>
