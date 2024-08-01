<template>
  <div class="cart-confirm-modal-option-wrap">
    <span class="cart-confirm-modal-option-name">
      + {{ translateLanguage(option.nameArray, option.name) }}
    </span>
    <span class="cart-confirm-modal-option-quantity">
      {{ option.quantity }}
      {{ t('개') }}
    </span>
    <span class="cart-confirm-modal-option-price">
      {{ checkStandardPriceUnit(getProductOptionPrice(option)?.toLocaleString()) }}
    </span>
  </div>
</template>

<script setup lang='ts'>
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import {
  cartProductOptionFuncType,
  CartProductOptionType,
} from '@torder/common/interface/cartProduct';

defineProps<{
  option: CartProductOptionType,
  getProductOptionPrice: cartProductOptionFuncType<number>,
  t: (str: string) => string,
}>();
</script>

<style scoped lang='scss'>
.cart-confirm-modal-option-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.8vw;
  font-size: 1.875vw;
  color: #0080ff;
  letter-spacing: -0.0469vw;
  word-break: break-all;

  .cart-confirm-modal-option-name {
    width: 47%;
    font-weight: normal;
    line-height: 1.58;
  }

  .cart-confirm-modal-option-quantity {
    width: 9%;
    text-align: center;
  }

  .cart-confirm-modal-option-price {
    width: 18%;
    margin-right: calc(23% + 1.3vw);
    margin-left: 0.5vw;
    font-weight: normal;
    text-align: right;
  }
}
</style>
