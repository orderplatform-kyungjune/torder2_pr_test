<template>
  <div class="product-detail-quantity-wrap">
    <div class="price-wrap">
      <div class="text">
        {{ t('가격') }}
      </div>
      <div class="price">
        {{ productPrice?.toLocaleString() }}
      </div>
    </div>
    <div class="quantity-wrap">
      <div class="text">
        {{ t('수량') }}
      </div>
      <div class="quantity-btn-wrap">
        <img
          :src="isThemeColorBlack ? 'https://static.torder.co.kr/torder2/goods-increase-black-42x42.svg' : 'https://static.torder.co.kr/torder2/goods-increase-white-46x46.svg'"
          @click="increaseProductQuantity"
        >
        <div class="quantity">
          {{ productQuantity }}
          {{ t('개') }}
        </div>
        <img
          :src="isThemeColorBlack ? 'https://static.torder.co.kr/torder2/goods-decrease-black-42x42.svg' : 'https://static.torder.co.kr/torder2/goods-decrease-black-42x42.svg'"
          @click="decreaseProductQuantity"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>

defineProps<{
  t: (str: string) => string,
  productPrice: string | number,
  productQuantity: number,
  isThemeColorBlack: boolean,
  increaseProductQuantity: () => void,
  decreaseProductQuantity: () => void,
}>();
</script>

<style scoped lang='scss'>
.product-detail-quantity-wrap {
  display: flex;
  flex-direction: column;
  gap: 2.3vw;
  width: 100%;
  padding-top: 3.25vw;
  padding-right: 5vw;
  padding-bottom: 4.8vw;
  padding-left: 5vw;
  font-family: 'Noto Serif KR', serif;

  &.black {
    color: #fff;
    background-color: #222;
  }

  .price-wrap, .quantity-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .text {
      font-size: 2.0313vw;
    }
  }

  .quantity-wrap .quantity-btn-wrap {
    display: flex;
    gap: 1.2vw;
    align-items: center;

    .quantity {
      min-width: 8.5vw;
      font-size: 2.1875vw;
      text-align: center;
    }
  }

  .price-wrap .price {
    font-size: 2.1875vw;
    font-weight: 600;
  }
}
</style>
