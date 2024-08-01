<template>
  <div class="cart-item-wrap">
    <img
      :src="isThemeColorBlack ? 'https://static.torder.co.kr/torder2/cart_delete_black_87x87.svg' : 'https://static.torder.co.kr/torder2/cart_delete_white_87x87.svg'"
      class="cart-item-delete"
      @click="deleteProduct(productIndex)"
    >
    <div>
      <div class="cart-item-name ellipsis-text-2">
        {{ translateLanguage(product.productLanguageDetail, product.productLanguageDetail?.ko) }}
      </div>
      <slot v-if="isSpread"/>
      <div
        v-else-if="isProductOption"
        class="cart-item-option"
        @click="onNextProductOptionView(product)"
      >
        {{ t('옵션보기') }}
      </div>
    </div>
    <div class="cart-item-bottom">
      <div class="cart-item-price">
        {{ getProductTotalPrice(product)?.toLocaleString() }}
      </div>
      <div class="cart-item-quantity-wrap">
        <img
          :src="isThemeColorBlack ? 'https://static.torder.co.kr/torder2/goods-increase-black-42x42.svg' : 'https://static.torder.co.kr/torder2/goods-increase-white-46x46.svg'"
          class="quantity-img"
          @click="increaseProductQuantity(productIndex)"
        >
        <div class="quantity">
          {{ product.quantity }}
          {{ t('개') }}
        </div>
        <img
          :src="isThemeColorBlack ? 'https://static.torder.co.kr/torder2/goods-decrease-black-42x42.svg' : 'https://static.torder.co.kr/torder2/goods-decrease-black-42x42.svg'"
          class="quantity-img"
          @click="decreaseProductQuantity(productIndex)"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { translateLanguage } from '@utils/langTransfer';
import {
  cartProductFuncType,
  cartProductType,
} from '@torder/common/interface/cartProduct';

defineProps<{
  isSpread: boolean,
  product: cartProductType,
  productIndex: number,
  isProductOption: boolean,
  isThemeColorBlack: boolean,
  getProductTotalPrice: cartProductFuncType<number>,
  deleteProduct: (productIndex: number) => void,
  increaseProductQuantity: (productIndex: number) => void,
  decreaseProductQuantity: (productIndex: number) => void,
  onNextProductOptionView: (cartProduct: cartProductType) => void,
  t: (str: string) => string,
}>();
</script>

<style scoped lang='scss'>
.cart-item-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: space-between;
  width: 27.5vw;
  height: 30vw;
  padding: 4.125vw 2.75vw 2.75vw;
  background-color: #f5f3f2;
  border-radius: 1.5625vw;

  &.black {
    color: #fff;
    background-color: #303030;
  }

  &.spread {
    width: 100%;
    height: initial;

    .cart-item-bottom {
      display: flex;
      flex-direction: row;
      gap: 0;
      align-items: center;
      justify-content: space-between;

      .cart-item-quantity-wrap {
        gap: 2.5vw;
        font-size: 2.1875vw;

        .quantity {
          min-width: 10vw;
          text-align: center;
        }
      }
    }

    > div .cart-item-name {
      min-height: auto;
    }
  }

  .cart-item-delete {
    position: absolute;
    top: -1.2vw;
    right: -1.2vw;
  }

  > div {
    .cart-item-name {
      min-height: 5.625vw;
      margin-bottom: 1vw;
      font-family: 'Noto Serif KR', serif;
      font-size: 1.7188vw;
      font-weight: 500;
    }

    .cart-item-option {
      margin-bottom: 2vw;
      font-size: 1.4844vw;
      color: #0080ff;
      text-decoration: underline;
    }
  }

  .cart-item-bottom {
    display: flex;
    flex-direction: column;
    gap: 1.5vw;

    .cart-item-price {
      font-family: 'Noto Serif KR', serif;
      font-size: 1.7969vw;
      font-weight: 500;
    }

    .cart-item-quantity-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: 'Noto Serif KR', serif;
      font-size: 1.9375vw;

      .quantity-img {
        width: 3.5938vw;
        height: 3.5938vw;
      }
    }
  }
}
</style>
