<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { newLineHelper, getSubPrimaryColor } from '@torder/common/utils';
import {
  cartProductFuncType,
  cartProductType,
} from '@torder/common/interface/cartProduct';
import useInitStore from '@store/storeInit';
import Trash from '@assets/btn_darkgray_trash.vue';
import Plus from '@assets/btn_darkgray_plus.vue';
import Minus from '@assets/btn_darkgray_minus.vue';

const { buttonBackgroundColor } = storeToRefs(useInitStore());
const { getDarkModeClass } = useInitStore();

defineProps<{
  product: cartProductType;
  productIndex: number;
  getProductTotalPrice: cartProductFuncType<number>;
  deleteProduct: (productIndex: number) => void;
  increaseProductQuantity: (productIndex: number) => void;
  decreaseProductQuantity: (productIndex: number) => void;
  isSingleProduct: boolean;
  hasNotOptionChangeButton: boolean;
  t: (str: string) => string;
  changeOptions: (product: cartProductType, targetIndex: number) => void;
  getChangeOptionButtonText: string;
  minQuantity: number;
  isLastItem: boolean;
  isFirstItem: boolean;
  isTotalPrice: number;
}>();

const activeWhiteButtonColor = getSubPrimaryColor('#ffffff', 10, 'Y');
</script>

<template>
  <li>
    <div class="cart-item">
      <div
        v-if="isLastItem"
        class="cart-item-recently-tag-wrap"
      >
        <span class="cart-item-recently-tag-text">
          {{ t('최근 추가됨') }}
        </span>
      </div>
      <div class="cart-item-container">
        <div class="cart-item-top">
          <div
            class="cart-item-name ellipsis-text-3"
            :class="getDarkModeClass()"
          >
            {{
              newLineHelper(
                translateLanguage(
                  product.productLanguage,
                  product.productLanguage?.ko,
                ),
              )
            }}
          </div>
          <div
            class="cart-item-delete-button"
            :class="getDarkModeClass()"
            @click="deleteProduct(productIndex)"
          >
            {{ t('삭제') }}
          </div>
        </div>
        <slot></slot>
        <div
          v-if="!isSingleProduct"
          class="cart-item-bottom"
        >
          <div class="cart-item-control">
            <Trash
              v-if="product.quantity === 1"
              class="cart-item-control-button"
              @click="decreaseProductQuantity(productIndex)"
            />
            <Minus
              v-else
              class="cart-item-control-button"
              @click="decreaseProductQuantity(productIndex)"
            />
          </div>
          <div
            class="cart-item-quantity"
            :class="getDarkModeClass()"
          >
            {{ product.quantity }}{{ t('개') }}
          </div>
          <div class="cart-item-control">
            <Plus
              class="cart-item-control-button"
              @click="increaseProductQuantity(productIndex)"
            />
          </div>
        </div>
      </div>
      <div
        class="cart-item-divider"
        :class="getDarkModeClass()"
      ></div>
      <div
        class="cart-item-total-price-wrap"
        :class="{ 'is-first': isFirstItem }"
      >
        <span
          class="cart-item-total-price-text"
          :class="getDarkModeClass()"
        >
          {{ t('총 합계') }}
        </span>
        <span
          class="cart-item-total-price"
          :class="getDarkModeClass()"
        >
          {{ checkStandardPriceUnit(isTotalPrice.toLocaleString()) }}
        </span>
      </div>
    </div>
    <div
      v-if="!isFirstItem"
      class="cart-product-divider"
      :class="getDarkModeClass()"
    ></div>
  </li>
</template>

<style scoped lang="scss">
.cart-item {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 1.5625vw;

  .cart-item-recently-tag-wrap {
    width: max-content;
    padding: 0.3125vw 0.7813vw;
    background-color: #f91515;
    border-radius: 0.78125vw;
    animation: fadeInOut 3.5s ease infinite;

    .cart-item-recently-tag-text {
      font-size: 1.40625vw;
      font-weight: 700;
      line-height: 2.1875vw;
      color: #fff;
      letter-spacing: -0.05625vw;
    }
  }

  @keyframes fadeInOut {
    0% {
      background-color: #f91515;
    }

    50% {
      background-color: #fc7979;
    }

    100% {
      background-color: #f91515;
    }
  }

  .cart-item-container {
    display: flex;
    flex-direction: column;
    gap: 0.9375vw;

    .cart-item-top {
      display: flex;
      gap: 0.7813vw;
      align-items: center;
      justify-content: space-between;

      .cart-item-name {
        font-size: 1.875vw;
        font-weight: 700;
        line-height: 2.1875vw;
        color: #313131;
        letter-spacing: -0.0313vw;
        white-space: pre-line;

        &.dark-mode {
          color: #fff;
        }
      }

      .cart-item-delete-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.625vw 1.25vw;
        font-size: 1.7188vw;
        font-weight: 600;
        line-height: 2.1875vw;
        color: v-bind(buttonBackgroundColor);
        letter-spacing: -0.0344vw;
        background-color: #fff;
        border: 0.1172vw solid v-bind(buttonBackgroundColor);
        border-radius: 0.7813vw;

        &.button-active {
          background-color: v-bind(activeWhiteButtonColor);
        }

        &.dark-mode {
          background-color: #1f1f1f;

          &.button-active {
            background-color: #313131;
          }
        }
      }
    }

    .cart-item-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .cart-item-control {
        display: flex;
        align-items: center;
        justify-content: center;

        .cart-item-control-button {
          width: 5.46875vw;
          height: 4.6875vw;
        }
      }

      .cart-item-quantity {
        font-size: 2.8125vw;
        font-weight: 700;
        line-height: 3.75vw;
        color: #313131;
        letter-spacing: -0.0562vw;

        &.dark-mode {
          color: #fff;
        }
      }
    }
  }

  .cart-item-divider {
    height: 0.1563vw;
    margin-top: 1.5625vw;
    background-color: #ebebeb;

    &.dark-mode {
      background-color: #494949;
    }
  }

  .cart-item-total-price-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.9375vw;

    .cart-item-total-price-text {
      font-size: 1.5625vw;
      font-weight: 500;
      line-height: 1.875vw;
      color: #5b5b5b;
      letter-spacing: -0.04687vw;

      &.dark-mode {
        color: #fff;
      }
    }

    .cart-item-total-price {
      font-size: 1.875vw;
      font-weight: 700;
      line-height: 2.34375vw;
      color: #313131;
      letter-spacing: -0.05625vw;

      &.dark-mode {
        color: #fff;
      }
    }

    &.is-first {
      margin-bottom: 1.5625vw;
    }
  }
}

.cart-product-divider {
  width: 100%;
  height: 1.25vw;
  margin: 1.5625vw 0;
  background-color: #ebebeb;
  border-top: 0.078125vw solid #d5d5d5;

  &.dark-mode {
    background-color: #313131;
    border-top: 0.078125vw solid #494949;
  }
}
</style>
