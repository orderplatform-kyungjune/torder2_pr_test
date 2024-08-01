<template>
  <teleport to="#modal">
    <div
      class="flash-modal"
      :class="[theme.type, isLogin]"
    >
      <span>
        {{ removeNewLine(content) }}
      </span>
    </div>
  </teleport>
</template>

<script setup lang='ts'>
import {
  onUpdated,
  watchEffect,
} from 'vue';
import { storeToRefs } from 'pinia';
import { FLASH } from '@torder/common/constant';
import { useModalTimer } from '@torder/common/composables';
import { removeNewLine } from '@torder/common';
import useThemeStore from '@store/storeTheme';
import useModalStore from '@store/storeModal';

defineProps<{
  content: string,
  isLogin?: string,
}>();

const { theme } = storeToRefs(useThemeStore());

const { closeModal } = useModalStore();

const {
  timer,
  time,
} = useModalTimer(2);
const timerId = timer();

onUpdated(() => {
  time.value = 2;
});

watchEffect(() => {
  const isZero = time.value === 0;
  if (isZero) {
    closeModal(FLASH);
    clearInterval(timerId);
  }
});

</script>

<style lang='scss' scoped>
.flash-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10000;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  max-width: 84.8438vw;
  padding: 2.5vw;
  color: #fff;
  background-color: #494949;
  border: 0.1563vw solid #5B5B5B;
  border-radius: 1.5625vw;
  transform: translate(-50%, -50%);

  &.vertical {
    padding: 2.5vw 2.8906vw 2.4219vw 2.9688vw;
    color: #fff;
    background-color: #F91515;
    border: none;
    box-shadow: 0 0 .3125vw 0 rgba(0, 0, 0, 0.4);
    opacity: 0.95;
  }

  &.horizontal {
    padding: 2.5vw 2.8906vw 2.4219vw 2.9688vw;
    color: #fff;
    background-color: #F91515;
    border: none;
    box-shadow: 0 0 .3125vw 0 rgba(0, 0, 0, 0.4);
    opacity: 0.95;
  }

  &.login {
    top: 20%;
  }

  span {
    font-family: Pretendard, sans-serif;
    font-size: 3.75vw;
    font-weight: 700;
    line-height: normal;
    text-align: center;
    word-break: break-all;
  }
}
</style>
