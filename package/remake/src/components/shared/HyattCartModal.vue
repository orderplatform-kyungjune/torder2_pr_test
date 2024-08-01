<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { cartProductType, getSubPrimaryColor } from '@torder/common';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';

const { cartProducts } = storeToRefs(useCartStore());

const { init, buttonBackgroundColor, buttonFontColor } =
  storeToRefs(useInitStore());
const { getDarkModeClass } = useInitStore();

const getActiveButtonColor = (color: string) => {
  if (init.value?.storeInfo?.closeOrder === 1) {
    return '#EBEBEB';
  }
  return getSubPrimaryColor(color, 10, 'Y');
};

const getCloseButtonActiveColor = () => getSubPrimaryColor('#494949', 10, 'Y');

defineProps<{
  storeName: string;
  tableName: string;
  order: (e: Event, isConfirmOrder?: boolean) => void;
  closeCartModal: () => void;
  getProductsQuantityText: string;
  orderButtonText: string;
  t: (str: string) => string;
  goToSecret: () => void;
  tabletLogoImage: string;
  getProductsTotalPrice: number;
}>();

const getConfirmButtonBackgroundColor = () => {
  if (init.value?.storeInfo?.closeOrder === 1) {
    return '#EBEBEB';
  }
  return buttonBackgroundColor.value;
};

// 주문하기 버튼 내 장바구니 상품 수량 표시에 대한 함수
const cartQuantity = computed(() =>
  cartProducts.value.reduce(
    (cur, next: cartProductType) => cur + next.quantity,
    0,
  ),
);
</script>

<template>
  <div
    class="custom-cart-modal-container"
    :class="getDarkModeClass()"
  >
    <div class="custom-cart-modal-wrap">
      <div class="custom-cart-top-container">
        <div class="custom-cart-top-title">
          {{ t('장바구니') }}
        </div>
        <div>
          <img
            class="custom-cart-top-close-button"
            src="https://static.torder.co.kr/torder2/icn_arrow_down.svg"
            alt="닫기 버튼"
            @click="closeCartModal"
          />
        </div>
      </div>
      <div
        class="custom-cart-modal-body-container"
        :class="getDarkModeClass()"
      >
        <div class="custom-cart-modal-body-wrap">
          <ul class="cart-list">
            <slot></slot>
          </ul>
        </div>
      </div>
      <div
        class="custom-cart-footer-container"
        :class="getDarkModeClass()"
      >
        <div
          class="custom-cart-footer-close"
          @click="closeCartModal"
        >
          <div class="custom-cart-footer-close-button">
            {{ t('장바구니 닫기') }}
          </div>
        </div>
        <div
          class="custom-cart-footer-confirm"
          @click="order"
        >
          <div class="custom-cart-footer-confirm-button">
            <div class="custom-cart-footer-confirm-button-text-wrap">
              <span class="custom-cart-footer-confirm-button-text">
                {{
                  checkStandardPriceUnit(
                    getProductsTotalPrice?.toLocaleString(),
                  )
                }}
              </span>
              <span class="custom-cart-footer-confirm-button-text">
                {{ orderButtonText }}
              </span>
            </div>
            <div class="custom-cart-footer-confirm-button-qty">
              <span class="custom-cart-footer-confirm-button-qty-text">
                {{ cartQuantity }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-cart-modal-container {
  z-index: 21;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-family: pretendard, sans-serif;
  background-color: transparent;
  border-top: none;
  border-top-left-radius: 1.25vw;
  box-shadow: 0 1.875vw 2.34375vw 0 rgba(0, 0, 0, 0.7);

  &.dark-mode {
    border-right: 0.078125vw solid #494949;
    border-left: 0.078125vw solid #494949;
  }

  .custom-cart-modal-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    height: 100%;

    .custom-cart-top-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 1.25vw 0.78125vw 1.25vw 1.25vw;
      background-color: #494949;
      border-top-left-radius: 1.25vw;

      .custom-cart-top-title {
        font-size: 1.71875vw;
        font-weight: 600;
        line-height: 2.1875vw;
        color: #ebebeb;
        letter-spacing: -0.03437vw;
      }

      .custom-cart-top-close-button {
        width: 1.5625vw;
        height: 1.5625vw;

        &.button-active {
          background-color: #494949;
          border-radius: 0.625vw;
        }
      }
    }

    .custom-cart-modal-body-container {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      overflow-y: scroll;
      background-color: #fff;

      &.dark-mode {
        background-color: #181818;
      }

      .custom-cart-modal-body-wrap {
        display: flex;
        flex-direction: column;
        padding-top: 1.5625vw;

        .cart-list {
          position: relative;
          display: flex;
          flex-direction: column-reverse;
          flex-shrink: 0;
          width: 100%;
          padding: 0;
          list-style: none;
        }
      }
    }

    .custom-cart-footer-container {
      display: flex;
      width: 81.5625vw;
      background-color: #fff;

      &.light-mode {
        box-shadow: 0 0.3125vw 2.5vw 0 rgba(0, 0, 0, 0.2);
      }

      &.dark-mode {
        background-color: #181818;
        box-shadow: 0 0.3125vw 2.5vw 0 rgba(255, 255, 255, 0.2);
      }

      .custom-cart-footer-close {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        padding: 0.7813vw 0.625vw 0.7813vw 1.5625vw;

        .custom-cart-footer-close-button {
          width: 100%;
          padding: 1.25vw 1.875vw;
          font-size: 2.1875vw;
          font-weight: 700;
          line-height: 2.5vw;
          color: #fff;
          text-align: center;
          letter-spacing: -0.0469vw;
          background-color: #5b5b5b;
          border-radius: 0.9375vw;

          &.button-active {
            background-color: v-bind(getCloseButtonActiveColor());
          }
        }
      }

      .custom-cart-footer-confirm {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 63.2031vw;
        padding: 0.7813vw 1.5625vw 0.7813vw 0.625vw;

        .custom-cart-footer-confirm-button {
          display: flex;
          gap: 0.7813vw;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 1.0156vw 1.875vw;
          background-color: v-bind(getConfirmButtonBackgroundColor());
          border-radius: 0.9375vw;

          &.button-active {
            background-color: v-bind(
              getActiveButtonColor(buttonBackgroundColor)
            );
          }

          .custom-cart-footer-confirm-button-text-wrap {
            display: flex;
            gap: 1.25vw;
            align-items: center;

            .custom-cart-footer-confirm-button-text {
              font-size: 2.1875vw;
              font-weight: 700;
              line-height: 2.5vw;
              color: v-bind(buttonFontColor);
              text-align: center;
              letter-spacing: -0.0469vw;
              white-space: pre-wrap;
            }
          }

          .custom-cart-footer-confirm-button-qty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0.625vw 0.7813vw;
            background-color: v-bind(buttonFontColor);
            border-radius: 0.625vw;
            box-shadow: 0 0 0.4688vw 0 rgba(0, 0, 0, 0.25);

            .custom-cart-footer-confirm-button-qty-text {
              min-width: 1.7969vw;
              font-size: 1.5625vw;
              font-style: normal;
              font-weight: 700;
              line-height: 1.875vw;
              color: v-bind(buttonBackgroundColor);
              text-align: center;
              letter-spacing: -0.0313vw;
            }
          }
        }
      }
    }
  }
}
</style>
