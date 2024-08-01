<template>
  <div class="bill-total-sum-container">
    <div class="bill-text">
      {{ sumTitle }}
    </div>
    <div class="bill-price">
      {{ checkStandardPriceUnit(totalPrice) }}
    </div>
  </div>
</template>

<script setup lang='ts'>
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';

defineProps<{
  /** 총합을 나타내는 텍스트입니다. */
  totalPrice: string,
  /** 합계 텍스트입니다. */
  sumTitle: string,
}>();
</script>

<style lang='scss' scoped>
.bill-total-sum-container {
  display: flex;
  justify-content: space-between;
  font-family: Pretendard, sans-serif;

  .bill-text {
    font-size: 1.875vw;
    font-style: normal;
    font-weight: 500;
    font-stretch: normal;
    line-height: 1.58;
    color: #F91515;
    letter-spacing: -0.0469vw;
  }

  .bill-price {
    font-size: 2.9688vw;
    font-style: normal;
    font-weight: 900;
    font-stretch: normal;
    line-height: normal;
    color: #F91515;
    letter-spacing: -0.0742vw;
  }
}
</style>
