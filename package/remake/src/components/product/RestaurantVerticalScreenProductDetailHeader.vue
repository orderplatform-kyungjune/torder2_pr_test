<template>
  <div
    class="product-detail-header-wrap"
    :class="isProductImg"
  >
    <img
      src="https://static.torder.co.kr/torder2/btn_left_arrow_white_40x27.svg"
      class="product-detail-back-btn"
      @click="onNextRoot"
    >
    <img
      :src="productImg"
      class="product-detail-background-img"
    >
    <div class="back"/>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  onNextRoot: () => void,
  productImg: string,
  isProductImg: { empty: boolean },
}>();
</script>

<style scoped lang='scss'>
.product-detail-header-wrap {
  position: relative;
  flex-shrink: 0;
  width: 100%;
  height: 47.5vw;
  background-color: #fff;

  &.black {
    background-color: #222;
  }

  .product-detail-back-btn {
    position: absolute;
    top: 4vw;
    left: 4vw;
    z-index: 5;
  }

  &.empty {
    background-color: #eee;

    .product-detail-background-img {
      width: 30%;
      margin: auto;
    }
  }

  .product-detail-background-img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }

  .back {
    position: absolute;
    top: 0;
    width: 100%;
    height: 45%;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(126, 126, 126, 0));
  }
}
</style>
