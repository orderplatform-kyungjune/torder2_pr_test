<template>
  <div class="container-person-button">
    <div class="wrap-person-button">
      <div
        id="person-button-sub-element"
        :class="{ 'small-font': isChangeFontSize() }"
        class="person-count-text"
      >
        {{ content }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  withDefaults,
  computed,
} from 'vue';

const props = withDefaults(defineProps<{
  /** 총 인원 입력 버튼에 들어가는 문구입니다. */
  content: string,
  isChangeFontSize: () => boolean,
  getPersonBottomPosition?: () => string,
}>(), { getPersonBottomPosition: () => '7.5vw' });

const getPersonBottomPosition = computed(() => props.getPersonBottomPosition());

</script>

<style lang="scss" scoped>
.container-person-button {
  position: absolute;
  bottom: v-bind(getPersonBottomPosition);
  left: 1.5625vw;
  z-index: 22;
  display: flex;
  align-items: center;

  .wrap-person-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14.7656vw;
    padding: 0.9375vw 1.5625vw;
    background-color: #0A0A0A;
    border: 0.1563vw solid #F91515;
    border-radius: 0.7813vw;
    box-shadow: 0 .3125vw .3125vw 0 rgba(0, 0, 0, 0.25);

    &.button-active {
      background-color: #242424;
    }

    .person-count-text {
      font-size: 1.875vw;
      font-weight: 700;
      line-height: 2.5vw;
      color: #fff;
      letter-spacing: -0.0375vw;
    }

    .small-font {
      font-size: 1.6vw;
    }
  }
}
</style>
