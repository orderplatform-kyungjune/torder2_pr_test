<template>
  <div
    class="staff-call-button"
    :class="active"
  >
    <span>
      {{ newLineHelper(title) }}
    </span>
  </div>
</template>

<script setup lang='ts'>
import { newLineHelper } from '@torder/common/utils';

defineProps<{
  /** 직원 호출 페이지 요청 아이템 이름입니다. */
  title: string,
  /** 직원 호출 페이지 요청 아이템 선택 여부입니다. */
  active: string,
}>();
</script>

<style lang='scss' scoped>
.staff-call-button {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 1.25vw;
  overflow: hidden;
  font-family: pretendard, sans-serif;
  font-size: 1.7969vw;
  font-weight: 500;
  line-height: 1.22;
  text-align: center;
  letter-spacing: -0.0898vw;
  word-break: break-word;
  white-space: pre-wrap;
  border-radius: 0.7813vw;

  &.active {
    color: #fff;
    background-color: #F91515;

    &.button-active {
      background-color: #B20000;
    }
  }

  &.passive {
    color: #000;
    background-color: #fff;

    &.button-active {
      background-color: #EBEBEB;
    }
  }
}
</style>
