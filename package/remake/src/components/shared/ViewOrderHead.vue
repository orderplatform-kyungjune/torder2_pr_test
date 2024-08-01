<template>
  <div
    class="order-head"
    :class="{ restaurant: isRestaurant }"
  >
    <div class="order-head-title">
      <span>
        {{ title }}
      </span>
    </div>
    <div class="close-wrap">
      <div class="close-timer">
        <span>
          {{ `${t('n초 후에 닫힙니다.', { time: time })}` }}
        </span>
      </div>
      <div
        class="modal-close-button"
        @click="onClick"
      >
        <img
          class="close-img"
          src="https://static.torder.co.kr/torder2/svg_closebutton_normal_white.svg"
        >
        <span>
          {{ buttonText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  /** 제목 텍스트입니다. */
  title: string,
  /** 설정할 시간입니다. */
  time: number,
  /** 클릭시 발생시킬 이벤트입니다. */
  onClick: () => void,
  /** 버튼 텍스트입니다. */
  buttonText: string,
  /** 테마 */
  isRestaurant: boolean,
}>();
</script>

<style lang='scss' scoped>
.order-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 82.125vw;

  &.restaurant{
    width: 77.125vw;
  }

  .order-head-title {
    width: 18.6875vw;
    height: 3.5938vw;
    font-size: 2.5vw;
    font-style: normal;
    font-weight: bold;
    font-stretch: normal;
    line-height: normal;
    color: #fff;
    text-align: left;
    letter-spacing: normal;

    span{
      font-size: 2.5vw;
    }
  }

  .close-wrap {
    display: flex;
    align-items: center;

    .close-timer {
      display: flex;
      align-items: center;
      width: 20vw;
      height: 3.5156vw;
      font-family: Pretendard, sans-serif;
      font-size: 2.0313vw;
      font-style: normal;
      font-weight: normal;
      font-stretch: normal;
      line-height: normal;
      color: #fff;
      text-align: left;
      letter-spacing: -0.0508vw;

      span {
        font-size: 1.875vw;
        font-weight: bold;
        color: #fc0000;
      }
    }

    .modal-close-button {
      display: flex;
      align-items: center;

      span {
        display: flex;
        align-items: center;
        height: 3.5156vw;
        margin: 0 0 0 0.7813vw;
        font-size: 2.3438vw;
        font-style: normal;
        font-weight: bold;
        font-stretch: normal;
        line-height: normal;
        color: #fff;
        text-align: center;
        letter-spacing: normal;
      }
    }
  }
}
</style>
