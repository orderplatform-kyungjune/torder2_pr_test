<template>
  <li class="cart-item">
    <div
      v-if="isLastItem"
      class="cart-item-recently-container"
    >
      <div class="cart-item-recently-wrap">
        <div class="cart-item-recently-text-box">
          {{ t('최근 추가됨') }}
        </div>
        <img src="https://static.torder.co.kr/torder2/icn_triangle_parts.svg">
      </div>
    </div>
    <div class="cart-item-top">
      <div class="name">
        {{ newLineHelper(translateLanguage(product.productLanguageDetail, product.productLanguageDetail?.ko)) }}
      </div>
      <div
        class="delete"
        @click="deleteProduct(productIndex)"
      >
        {{ t('삭제') }}
      </div>
    </div>
    <slot/>
    <div class="cart-item-mid">
      <div
        v-if="isSingleProduct"
        class="quantity"
      >
        {{ product.quantity }}
        {{ t('개') }}
      </div>
      <div class="price">
        {{ checkStandardPriceUnit(getProductTotalPrice(product)?.toLocaleString()) }}
      </div>
    </div>
    <div
      v-if="!isSingleProduct"
      class="cart-item-bottom"
    >
      <img
        class="cart-item-bottom-button"
        src="https://static.torder.co.kr/torder2/cart-decrease-black-80x60.svg"
        @click="decreaseProductQuantity(productIndex)"
      >
      <div class="quantity">
        {{ product.quantity }}
        {{ t('개') }}
      </div>
      <img
        class="cart-item-bottom-button"
        src="https://static.torder.co.kr/torder2/cart-increase-black-80x60.svg"
        @click="increaseProductQuantity(productIndex)"
      >
    </div>
  </li>
</template>

<script setup lang='ts'>
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { newLineHelper } from '@torder/common/utils';
import {
  cartProductFuncType,
  cartProductType,
} from '@torder/common/interface/cartProduct';

defineProps<{
  product: cartProductType,
  productIndex: number,
  getProductTotalPrice: cartProductFuncType<number>,
  deleteProduct: (productIndex: number) => void,
  increaseProductQuantity: (productIndex: number) => void,
  decreaseProductQuantity: (productIndex: number) => void,
  isSingleProduct: boolean,
  t: (str: string) => string,
  isLastItem: boolean,
}>();
</script>

<style scoped lang='scss'>
.cart-item {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 1.5625vw;
  margin: 0;
  border-bottom: 0.14084507vh solid #ccc;

  .cart-item-recently-container {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 0.3125vw;

    .cart-item-recently-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;

      .cart-item-recently-text-box {
        padding: 0.3125vw 0.625vw;
        font-size: 1.4063vw;
        font-weight: 700;
        line-height: 2.0313vw;
        color: #fff;
        letter-spacing: -0.0281vw;
        background-color: #F91515;
        border: 0.0781vw solid #F91515;
        border-radius: 0.3125vw;
      }
    }
  }

  .cart-item-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .name {
      flex-shrink: 1;
      max-width: 72%;
      font-size: 1.875vw;
      font-style: normal;
      font-weight: 400;
      font-stretch: normal;
      line-height: 1.45;
      text-align: left;
      letter-spacing: -0.0859vw;
      word-break: break-all;
      white-space: pre-wrap;
    }

    .delete {
      padding: 0.985915493vh 1.0156vw;
      font-size: 1.4844vw;
      font-weight: 500;
      color: #F91515;
      letter-spacing: -0.0375vw;
      border: 0.15625vw solid #F91515;
      border-radius: 0.78125vw;

      &.button-active {
        background-color: #EBEBEB;
      }
    }
  }

  .cart-item-mid {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.78125vw;
    word-break: break-all;

    .quantity {
      font-size: 2.0313vw;
    }

    .price {
      max-width: 77%;
      font-size: 2.0313vw;
      font-weight: 600;
      line-height: 1.5;
      color: #F91515;
      text-align: right;
    }
  }

  .cart-item-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 0.78125vw;

    .cart-item-bottom-button {
      width: 6.25vw;
      height: 4.6875vw;

      &.button-active {
        filter: opacity(0.7);
      }
    }

    .quantity {
      font-size: 2.0313vw;
      font-style: normal;
      font-weight: 400;
      font-stretch: normal;
      line-height: 1.62;
      text-align: center;
      letter-spacing: -0.1015625vw;
    }
  }
}
</style>
