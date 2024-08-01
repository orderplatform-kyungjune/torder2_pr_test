<template>
  <div class="product-detail-description-wrap">
    <div class="product-detail-name">
      {{ productName }}
    </div>
    <div
      v-if="hasProductDescription"
      class="product-detail-description"
    >
      {{ removeSymbol(productDescription) }}
    </div>
  </div>
</template>

<script setup lang='ts'>
import { removeSymbol } from '@torder/common/utils';

defineProps<{
  productName: string,
  productDescription: string,
  hasProductDescription: boolean,
}>();
</script>

<style scoped lang='scss'>
.product-detail-description-wrap {
  flex: 1;
  padding: 3.125vw 5vw;
  overflow: scroll;

  &.black {
    color: #fff;
    background-color: #222
  }

  .product-detail-name {
    font-family: 'Noto Serif KR',serif;
    font-size: 2.0313vw;
    font-weight: 500;
  }

  .product-detail-description {
    margin-top: 2vw;
    font-family: 'Pretendard', sans-serif;
    font-size: 1.9531vw;
    white-space: break-spaces;
  }
}
</style>
