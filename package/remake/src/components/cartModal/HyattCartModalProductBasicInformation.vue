<script setup lang="ts">
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import useInitStore from '@store/storeInit';

const { getDarkModeClass } = useInitStore();

defineProps<{
  basicPrice: number;
  basicQuantity: number;
  t: (str: string) => string;
}>();
</script>

<template>
  <div class="product-basic-information">
    <span
      class="product-basic-info-text"
      :class="getDarkModeClass()"
    >
      {{ t('기본') }} :
      {{ checkStandardPriceUnit(basicPrice?.toLocaleString()) }}
    </span>
    <div class="product-price-info">
      <span class="list-price-quantity">
        {{ `${basicQuantity}${t('개')}` }}
      </span>
      <span
        class="product-basic-info-price"
        :class="getDarkModeClass()"
      >
        {{ checkStandardPriceUnit(basicPrice?.toLocaleString()) }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-basic-information {
  display: flex;
  flex-direction: column;
  gap: 0.78125vw;
  justify-content: space-between;

  .product-basic-info-text {
    font-size: 1.25vw;
    font-weight: 400;
    color: #246ff4;
    letter-spacing: -0.0375vw;

    &.dark-mode {
      color: #ebebeb;
    }
  }

  .product-price-info {
    display: flex;
    flex-direction: row;
    gap: 0.625vw;
    justify-content: flex-end;

    .list-price-quantity {
      font-size: 1.5625vw;
      font-weight: 500;
      line-height: 1.875vw;
      color: #afafaf;
    }

    .product-basic-info-price {
      font-size: 1.5625vw;
      font-weight: 500;
      line-height: 1.875vw;
      color: #313131;
      text-align: right;
      letter-spacing: -0.046875vw;

      &.dark-mode {
        color: #ebebeb;
      }
    }
  }
}
</style>
