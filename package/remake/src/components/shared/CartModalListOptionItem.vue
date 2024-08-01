<template>
  <div class="cart-item-options">
    <ul class="option-list">
      <li class="option-name ellipsis-text-2">
        +{{ translateLanguage(option.nameArray, option.name) }}
      </li>
      <li class="option-quantity">
        {{ option.quantity }}
        {{ t('개') }}
      </li>
      <li class="option-price">
        {{ checkStandardPriceUnit(getProductOptionPrice(option)?.toLocaleString()) }}
      </li>
    </ul>
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
.cart-item-options {
  margin-top: 1vw;
  font-size: 1.4063vw;
  color: #0080ff;

  .option-list {
    display: flex;
    gap: 0.78125vw;
    justify-content: space-between;
    margin-bottom: 0.5vw;
    font-size: 1.5625vw;
    word-break: break-all;

    .option-name {
      flex: 1;
      font-size: 1.40625vw;
      font-weight: 600;
      line-height: 2.03125vw;
      letter-spacing: -0.028125vw;
    }

    .option-quantity {
      width: 16%;
      font-size: 1.40625vw;
      font-weight: 600;
      line-height: 2.03125vw;
      text-align: center;
      letter-spacing: -0.028125vw;
      white-space: nowrap;
    }

    .option-price {
      width: 30%;
      font-size: 1.40625vw;
      font-weight: 600;
      line-height: 2.03125vw;
      text-align: right;
      letter-spacing: -0.028125vw;
      white-space: nowrap;
    }
  }
}
</style>
