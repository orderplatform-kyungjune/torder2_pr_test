<template>
  <div
    class="staff-call-item"
    :class="[active, getDarkModeClass()]"
  >
    {{ title }}
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import useInitStore from '@store/storeInit';

const { getDarkModeClass } = useInitStore();
const { categoryBackgroundColor } = storeToRefs(useInitStore());

defineProps<{
  itemIndex: number,
  title: string,
  active: string,
  isNewLineWord?: boolean,
}>();
</script>

<style lang='scss' scoped>
.staff-call-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25vw;
  font-family: 'Pretendard', sans-serif;
  font-size: 2.1875vw;
  font-weight: 700;
  line-height: 2.5vw;
  color: #313131;
  text-align: center;
  letter-spacing: -0.0438vw;
  word-break: break-all;
  white-space: pre-wrap;
  border: 0.1172vw solid #D5D5D5;
  border-radius: 0.9375vw;

  &.active {
    background-color: #fff;
    border: 0.1172vw solid v-bind(categoryBackgroundColor);

    &.dark-mode {
      color: #fff;
      background-color: #181818;
    }
  }

  &.passive {
    color: #000;
    background-color: #fff;

    &.dark-mode {
      color: #fff;
      background-color: #181818;
    }
  }

  &.button-active {
    background-color: #EBEBEB;

    &.dark-mode {
      background-color: #494949;
    }
  }
}
</style>
