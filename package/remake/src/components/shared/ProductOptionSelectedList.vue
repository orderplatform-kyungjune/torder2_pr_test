<template>
  <li
    class="selected-option-item"
    :class="{
      'not-basic': optionLayout.type !== BASIC,
      black: optionLayout.color === BLACK,
      white: optionLayout.color === WHITE,
    }"
  >
    <span
      v-if="optionLayout.type !== BASIC"
      class="group-title"
    >
      {{ optionGroupName }}
    </span>
    <div class="option-item-top">
      <span class="name">
        {{ `${optionLayout.type !== BASIC ? '' : '+ '}${translateLanguage(item.nameArray, item.name)}` }}
      </span>
      <span
        v-if="item.limitQty !== 1"
        class="qty"
      >
        <span class="qty-number">
          {{ item.quantity }}
        </span>
        {{ t('개') }}
      </span>
      <span
        v-if="optionLayout.type !== BASIC && item.price !== 0"
        class="price"
      >
        {{ checkStandardPriceUnit(getItemTotalPrice(item)?.toLocaleString()) }}
      </span>
      <span
        v-if="optionLayout.type === BASIC"
        class="price"
      >
        {{ checkStandardPriceUnit(item.price?.toLocaleString()) }}
      </span>
    </div>
    <div class="option-item-bottom">
      <span
        v-if="isOptionMaxQuantity && optionLayout.type === BASIC"
        class="delete"
        @click="deleteOptionItemByIndex"
      >
        {{ t('삭제') }}
      </span>
      <div
        v-else
        v-show="item.limitQty !== 1"
        class="option-item-quantity-wrap"
        :class="{ 'not-basic': optionLayout.type !== BASIC }"
      >
        <img
          v-if="optionLayout.type !== BASIC && optionLayout.color === BLACK"
          class="count-button"
          src="https://static.torder.co.kr/torder2/icon_plus_long_button_gray.svg"
          @click="increaseOptionQuantity"
        >
        <img
          v-else-if="optionLayout.type !== BASIC && optionLayout.color === WHITE"
          class="count-button"
          src="https://static.torder.co.kr/torder2/icon_plus_long_button_black.svg"
          @click="increaseOptionQuantity"
        >
        <img
          v-else
          class="quantity-img"
          src="https://static.torder.co.kr/torder2/goods-increase-black-42x42.svg"
          @click="increaseOptionQuantity"
        >
        <div
          v-if="optionLayout.type === BASIC"
          class="quantity"
        >
          {{ item.quantity }}
          {{ t('개') }}
        </div>
        <img
          v-if="optionLayout.type !== BASIC && optionLayout.color === BLACK"
          class="count-button"
          src="https://static.torder.co.kr/torder2/icon_minus_long_button_gray.svg"
          @click="decreaseOptionQuantity"
        >
        <img
          v-else-if="optionLayout.type !== BASIC && optionLayout.color === WHITE"
          class="count-button"
          src="https://static.torder.co.kr/torder2/icon_minus_long_button_black.svg"
          @click="decreaseOptionQuantity"
        >
        <img
          v-else
          class="quantity-img"
          src="https://static.torder.co.kr/torder2/goods-decrease-black-42x42.svg"
          @click="decreaseOptionQuantity"
        >
      </div>
      <span
        v-if="optionLayout.type === BASIC"
        class="text"
      >
        {{ selectedOptionGroupName }}
      </span>
    </div>

    <span
      v-if="optionLayout.type !== BASIC"
      class="delete-button"
      @click="deleteOptionItemByIndex"
    >
      <img
        class="delete-img"
        src="https://static.torder.co.kr/torder2/icon_delete_background_red_button.svg"
        alt="close"
      >
    </span>
  </li>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { CartProductOptionType } from '@torder/common/interface/cartProduct';
import {
  BASIC,
  BLACK,
  WHITE,
} from '@torder/common/constant';
import { getSubPrimaryColor } from '@torder/common';
import useInitStore from '@store/storeInit';

const { activeFontColor } = storeToRefs(useInitStore());

defineProps<{
  item: CartProductOptionType,
  isOptionMaxQuantity: boolean,
  increaseOptionQuantity: () => void,
  decreaseOptionQuantity: () => void,
  selectedOptionGroupName: string,
  optionGroupName: string,
  deleteOptionItemByIndex: () => void,
  t: (str: string) => string,
  optionLayout: {type: string; color: string},
  getItemTotalPrice: (item: CartProductOptionType) => number,
}>();

const activeDeleteButtonColor = getSubPrimaryColor('#ffffff', 5, 'Y');

</script>

<style scoped lang='scss'>
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-option-item {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 1vw;
  border-bottom: .0781vw solid gray;

  .option-item-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.7188vw;
    color: #0080ff;

    .price {
      min-width: 3.125vw;
      font-weight: 700;
      text-align: center;
    }
  }

  .option-item-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1vw 0;

    .delete {
      @include flex-center();
      width: 6vw;
      height: 3vw;
      font-weight: 1.5vw;
      font-weight: 500;
      color: v-bind(activeFontColor);
      white-space: nowrap;
      border: .0781vw solid v-bind(activeFontColor);
      border-radius: 0.3906vw;

      &.button-active {
        background-color: v-bind(activeDeleteButtonColor);
      }
    }

    .text {
      margin-left: 0.625vw;
      font-size: 1.5625vw;
      font-weight: 700;
      color: v-bind(activeFontColor);
    }
  }

  &.not-basic{
    gap: 1.5625vw;
    padding: 1.1719vw;
    margin-top: 0;
    background-color: #362c2c;
    border-bottom: none;
    border-radius: .7813vw;

    &.black{
      background-color: #362c2c;
      border: solid .0781vw #000;
      .option-item-top{
        color: #fff;
      }
    }

    &.white{
      background-color: #f5f5f5;
      border: solid .0781vw #b9b9b9;
      .option-item-top{
        color: #000;
      }

      .group-title{
        color: #666;
      }
    }

    .group-title{
      font-size: 1.25vw;
      color: #ccc;
    }

    .option-item-bottom{
      padding: 0;
    }

    .option-item-top{
      font-size: 2.25vw;
      font-weight: 900;

      .qty-number{
        color: v-bind(activeFontColor);
      }
    }
  }

  .delete-button{
    position: absolute;
    top: 0;
    right: 0;
    border-radius: .7813vw;
    transform: translate(20%, -20%);

    .delete-img {
      &.button-active {
        filter: brightness(0.8);
      }
    }
  }
}

.option-item-quantity-wrap {
  display: flex;
  gap: 0.7vw;
  align-items: center;

  .quantity-img {
    width: 3.2813vw;
    height: 3.2813vw;

    &.button-active {
      filter: brightness(0.8);
    }
  }

  .quantity {
    width: 5.1vw;
    font-size: 1.75vw;
    text-align: center;
  }

  .count-button {
    width: 14.375vw;
    height: 3.9063vw;

    &.button-active {
      filter: brightness(0.8);
    }
  }
}
</style>
