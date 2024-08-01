<template>
  <div class="cart-option-item-wrap">
    <div class="name">
      + {{ option.name }}
    </div>
    <div class="quantity-wrap">
      <div>{{ option.quantity }}개</div>
      <div class="price">
        {{ getProductOptionPrice(option)?.toLocaleString() }}
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {
  CartProductOptionType,
  cartProductOptionFuncType,
} from '@torder/common/interface/cartProduct';

defineProps<{
  option: CartProductOptionType,
  getProductOptionPrice: cartProductOptionFuncType<number>,
  t: (str: string) => string,
}>();
</script>

<style scoped lang='scss'>
.cart-option-item-wrap {
  display: flex;
  justify-content: space-between;
  margin-bottom: .75vw;
  font-family: 'Pretendard', sans-serif;
  font-size: 1.7188vw;
  color: #0080ff;
  word-break: break-all;

  .name {
    width: 55%;
  }

  .quantity-wrap {
    display: flex;
    gap: 6vw;

    .price {
      min-width: 18vw;
      font-weight: 700;
      text-align: right;
    }
  }
}
</style>
