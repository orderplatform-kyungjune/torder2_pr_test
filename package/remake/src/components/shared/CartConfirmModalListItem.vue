<template>
  <div class="cart-modal-list">
    <div class="cart-modal-item-wrap">
      <span class="name">
        {{ removeNewLine(translateLanguage(product.productLanguageDetail, product.productLanguageDetail?.ko)) }}
      </span>
      <span class="quantity">
        {{ product.quantity }}
        {{ t('개') }}
      </span>
      <span class="price">
        {{ checkStandardPriceUnit(product.price?.toLocaleString()) }}
      </span>
      <span class="total-price">
        {{ checkStandardPriceUnit(getProductTotalPrice(product)?.toLocaleString()) }}
      </span>
    </div>
    <slot/>
  </div>
</template>

<script setup lang='ts'>
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { removeNewLine } from '@torder/common/utils';
import {
  cartProductFuncType,
  cartProductType,
} from '@torder/common/interface/cartProduct';

defineProps<{
  product: cartProductType,
  getProductTotalPrice: cartProductFuncType<number>,
  t: (str: string) => string,
}>();
</script>

<style scoped lang='scss'>
.cart-modal-list {
  display: flex;
  flex-direction: column;
  padding-bottom: 1.5625vw;
  margin-bottom: 1.5625vw;
  font-family: pretendard, sans-serif;
  border-bottom: .0781vw solid #aeabab;

  .cart-modal-item-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.875vw;
    letter-spacing: -0.0469vw;
    word-break: break-all;

    .name {
      width: 47%;
      font-weight: bold;
      line-height: 1.58;
    }

    .quantity {
      width: 9%;
      text-align: center;
    }

    .price {
      width: 18%;
      margin-right: 1.3vw;
      margin-left: 0.5vw;
      font-weight: 500;
      text-align: right;
    }

    .total-price {
      width: 23%;
      font-weight: 700;
      text-align: right;
    }
  }
}
</style>
