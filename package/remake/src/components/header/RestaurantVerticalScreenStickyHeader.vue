<template>
  <div class="sticky-header-container">
    <img
      :src="isThemeColorBlack ? 'https://static.torder.co.kr/torder2/btn_left_arrow_white_40x27.svg' : 'https://static.torder.co.kr/torder2/svg_left_arrow_black.svg'"
      class="product-detail-back-btn"
      @click="onNextRoot"
    >
    <div>{{ name }}</div>
  </div>
</template>

<script setup lang='ts'>

defineProps<{
  onNextRoot: () => void,
  name: string,
  isThemeColorBlack: boolean,
}>();
</script>

<style scoped lang='scss'>
.sticky-header-container {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 11vw;
  font-family: 'Noto Serif KR', serif;
  font-size: 2.5vw;
  background-color: #fff;

  &.black {
    color: #fff;
    background-color: #222;
  }

  .product-detail-back-btn {
    position: absolute;
    top: 4vw;
    left: 4vw;
  }
}
</style>
