<template>
  <div class="dutch-price-container">
    <div class="dutch-person">
      {{ person }}
    </div>
    <div class="dutch-price">
      {{ checkStandardPriceUnit(price) }}
    </div>
  </div>
</template>

<script setup lang='ts'>
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';

defineProps<{
  /** 가격을 나타내는 인자입니다. */
  price: string,
  /** 더치페이 문구입니다. */
  person: string,
}>();
</script>

<style lang='scss' scoped>
.dutch-price-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 8.4375vw;
  font-family: Pretendard, sans-serif;
  text-align: center;

  .dutch-person {
    font-size: 2.3438vw;
    font-style: normal;
    font-weight: normal;
    font-stretch: normal;
    line-height: normal;
    color: #000;
    letter-spacing: normal;
  }

  .dutch-price {
    font-size: 3.75vw;
    font-style: normal;
    font-weight: bold;
    font-stretch: normal;
    line-height: normal;
    color: #F91515;
    letter-spacing: normal;
  }
}
</style>
