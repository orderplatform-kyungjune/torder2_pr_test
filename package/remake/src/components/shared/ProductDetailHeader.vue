<template>
  <div class="menu-detail-header-wrap">
    <span class="title">
      {{ removeNewLine(productName) }}
    </span>
    <div
      class="close-wrap"
      @click="onNextRoot"
    >
      <img
        src="https://static.torder.co.kr/torder2/btn_close_white_26px.svg"
        alt="닫기버튼"
      >
      <span class="text">
        {{ t('닫기') }}
      </span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { removeNewLine } from '@torder/common/utils';

defineProps<{
  productName: string,
  onNextRoot: () => void,
  t: (str: string) => string,
}>();
</script>

<style scoped lang='scss'>
.menu-detail-header-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;

  .title {
    overflow: hidden;
    font-size: 2.5vw;
    font-weight: 300;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .close-wrap {
    display: flex;
    align-items: center;

    .text{
      margin-bottom: -0.3906vw;
      margin-left: 0.4vw;
      font-size: 2.3438vw;
    }
  }
}
</style>
