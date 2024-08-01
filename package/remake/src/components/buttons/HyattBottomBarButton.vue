<template>
  <button
    type="button"
    class="bottom-bar-button"
  >
    {{ text }}
  </button>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { getSubPrimaryColor } from '@torder/common';
import useInitStore from '@store/storeInit';

const {
  buttonBackgroundColor,
  buttonFontColor,
} = storeToRefs(useInitStore());

const getActiveButtonColor = (color: string) => getSubPrimaryColor(color, 10, 'Y');

defineProps<{
  text: string,
}>();
</script>

<style scoped lang='scss'>
.bottom-bar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15.625vw;
  height: 4.6875vw;
  font-family: 'Pretendard', sans-serif;
  font-size: 2.3438vw;
  font-weight: 700;
  line-height: 2.5vw;
  color: v-bind(buttonFontColor);
  letter-spacing: -0.0375vw;
  white-space: nowrap;
  background-color: v-bind(buttonBackgroundColor);
  border: none;
  border-radius: 0.9375vw;

  &.button-active {
    background-color: v-bind(getActiveButtonColor(buttonBackgroundColor));
  }
}
</style>
