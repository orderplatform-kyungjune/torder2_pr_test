<template>
  <div class="more-list-button">
    {{ content }}
  </div>
</template>

<script setup lang='ts'>
import { getSubPrimaryColor } from '@torder/common';

defineProps<{
  /** 추가기능 리스트의 버튼에 들어가는 텍스트입니다. */
  content: string,
}>();
const activeButtonColor = getSubPrimaryColor('#fafafa', 10, 'Y');
</script>

<style lang='scss' scoped>
.more-list-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 13vw;
  height: 4vw;
  margin-bottom: 1vw;
  font-size: 1.6vw;
  font-weight: 900;
  color: #202020;
  text-align: center;
  background-color: #fafafa;
  border-radius: 0.7813vw;

  &.button-active {
    background-color: v-bind(activeButtonColor);
  }
}
</style>
