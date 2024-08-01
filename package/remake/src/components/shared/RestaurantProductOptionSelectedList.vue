<template>
  <li class="selected-option-item">
    <div class="option-item-top">
      <span class="name">+ {{ translateLanguage(item.nameArray, item.name) }}</span>
      <span class="price">+ {{ item.price?.toLocaleString() }}</span>
    </div>
    <div class="option-item-bottom">
      <div class="option-item-quantity-wrap">
        <img
          class="quantity-img"
          src="https://static.torder.co.kr/torder2/cart-increase-black-80x60.svg"
          @click="increaseOptionQuantity"
        >
        <div class="quantity">
          {{ item.quantity }}
          {{ t('개') }}
        </div>
        <img
          class="quantity-img"
          src="https://static.torder.co.kr/torder2/cart-decrease-black-80x60.svg"
          @click="decreaseOptionQuantity"
        >
      </div>
      <div class="text">
        {{ selectedOptionGroupName }}
      </div>
    </div>
  </li>
</template>

<script setup lang='ts'>
import { translateLanguage } from '@utils/langTransfer';
import { CartProductOptionType } from '@torder/common/interface/cartProduct';

defineProps<{
  item: CartProductOptionType,
  increaseOptionQuantity: () => void,
  decreaseOptionQuantity: () => void,
  selectedOptionGroupName: string,
  deleteOptionItemByIndex: () => void,
  t: (str: string) => string,
  customButtonBackgroundColor: string,
}>();
</script>

<style scoped lang='scss'>
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-option-item {
  display: flex;
  flex-direction: column;
  margin-top: 1vw;

  .option-item-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #0080ff;

    .name {
      font-size: 1.7188vw;
    }

    .price {
      font-size: 1.5625vw;
      font-weight: bold;
    }
  }

  .option-item-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1vw 0;

    .text {
      margin-left: 1vw;
      font-size: 1.5625vw;
      font-weight: 500;
      color: v-bind(customButtonBackgroundColor);
      word-break: break-all;
    }
  }
}

.option-item-quantity-wrap {
  display: flex;
  gap: 0.8vw;
  align-items: center;

  .quantity {
    width: 4.8vw;
    font-family: 'Pretendard', sans-serif;
    font-size: 2.0313vw;
    text-align: center;
  }
}
</style>
