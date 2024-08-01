<template>
  <div
    class="staff-list-wrap"
    :class="[checked, theme]"
  >
    <div
      class="checkbox-wrap"
      :class="theme"
    >
      <img
        v-if="isActive() && isWhite()"
        src="https://static.torder.co.kr/torder2/icn_checkbox_white_checked.svg"
        alt="checkbox"
      >
      <img
        v-else-if="isWhite()"
        src="https://static.torder.co.kr/torder2/icn_checkbox_white.svg"
        alt="checkbox"
      >
      <img
        v-if="isActive() && isBlack()"
        src="https://static.torder.co.kr/torder2/icn_checkbox_black_checked.svg"
        alt="checkbox"
      >
      <img
        v-else-if="isBlack()"
        src="https://static.torder.co.kr/torder2/icn_checkbox_black.svg"
        alt="checkbox"
      >
      <span>{{ itemName }}</span>
    </div>
    <RestaurantVerticalScreenPlusMinusControl
      :count="count"
      :theme="theme"
      :t="t"
      :plusCount="plusCount"
      :minusCount="minusCount"
      :unit="'개'"
    />
  </div>
</template>

<script setup lang='ts'>
import {
  ACTIVE,
  BLACK,
  WHITE,
} from '@torder/common/constant';
import { RestaurantVerticalScreenPlusMinusControl } from '@components';

const props = defineProps<{
  itemName: string,
  count: number,
  theme: string,
  t: (str: string) => string,
  plusCount: () => void,
  minusCount: () => void,
  checked: string,
}>();

const isBlack = () => props.theme === BLACK;
const isWhite = () => props.theme === WHITE;
const isActive = () => props.checked === ACTIVE;
</script>

<style lang='scss' scoped>
.staff-list-wrap {
  display: flex;
  justify-content: space-between;
  padding: 1.9531vw 2.3438vw;
  margin: 1.25vw 0;
  border-radius: 1.25vw;

  &.white.passive {
    border: solid .1563vw #e8e8e8;
  }

  &.active.white {
    border: solid .1563vw #2f2a26;
  }

  &.black.passive {
    background-color: #303030;
    border: solid .1563vw transparent;
  }

  &.active.black {
    background-color: #111111;
    border: solid .1563vw #fff;
  }

  .checkbox-wrap {
    display: flex;
    gap: 2.5vw;
    align-items: center;
    font-family: 'Noto Serif KR', sans-serif;
    font-size: 1.7969vw;
    font-weight: bold;

    > span:nth-of-type(1) {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &.black {
      span {
        color: #fff;
      }
    }

    &.white{
      span {
        color: #000;
      }
    }
  }
}
</style>
