<template>
  <div class="product-detail-button-wrap">
    <div
      class="close"
      @click="onNextRoot"
    >
      {{ t('뒤로가기') }}
    </div>
    <div
      class="addCard"
      @click="addCart"
    >
      {{ addCardButtonText }}
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  t: (str: string) => string,
  onNextRoot: () => void,
  addCart: () => void,
  addCardButtonText: string,
}>();
</script>

<style scoped lang='scss'>
.product-detail-button-wrap {
  display: flex;
  width: 100%;
  font-family: 'Pretendard', sans-serif;
  font-size: 2.8125vw;
  font-weight: 600;
  color: #fff;

  .close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28%;
    height: 13.75vw;
    background-color: #999;
  }

  .addCard {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72%;
    height: 13.75vw;
    background-color: #b51900;
  }
}
</style>
