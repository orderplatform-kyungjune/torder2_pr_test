<template>
  <div class="cart-confirm-modal-container">
    <div class="cart-modal-wrap">
      <p
        v-if="isEnglish"
        class="cart-modal-header"
      >
        {{ t('확인하셨습니까?') }}
        <strong class="bold">
          {{ t('상품과 수량을') }}
        </strong>
        {{ t('장바구니의') }}
      </p>
      <p
        v-else
        class="cart-modal-header"
      >
        {{ t('장바구니의') }}
        <strong class="bold">
          {{ t('상품과 수량을') }}
        </strong>
        {{ t('확인하셨습니까?') }}
      </p>
      <div class="cart-modal-body">
        <slot/>
      </div>
      <div class="cart-modal-footer">
        <div class="cart-modal-footer-price">
          <span class="cart-modal-footer-total-text">
            {{ t('합계') }}
          </span>
          <div class="cart-modal-footer-price-wrap">
            <span class="cart-modal-footer-quantity">
              {{ getProductsQuantityText }}
            </span>
            <span class="cart-modal-footer-price">
              {{ checkStandardPriceUnit(getProductsTotalPrice?.toLocaleString()) }}
            </span>
          </div>
        </div>
        <div class="cart-modal-button-wrap">
          <div
            class="cart-modal-cancel-button"
            @click="closeCartConfirmModal"
          >
            {{ t('취소') }}
          </div>
          <div
            class="cart-modal-confirm-button"
            @click="order"
          >
            {{ confirmOrderButtonText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { getSubPrimaryColor } from '@torder/common';

defineProps<{
  getProductsTotalPrice: number,
  getProductsQuantityText: string,
  orderCartConfirm: () => void,
  closeCartConfirmModal: () => void,
  confirmOrderButtonText: string,
  order: (e: Event, isConfirmOrder?: boolean) => void,
  t: (str: string) => string,
  isEnglish: boolean,
}>();

const activeNoButtonColor = getSubPrimaryColor('#999999', 10, 'Y');
</script>

<style scoped lang='scss'>
.cart-confirm-modal-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
}

.cart-modal-wrap {
  display: flex;
  flex-direction: column;
  width: 62.2813vw;
  height: 44vw;
  padding: 1.9531vw 1.5625vw;
  font-family: Pretendard, serif;
  background-color: #fff;
  border-radius: 1.5625vw;

  .cart-modal-header {
    margin-bottom: 3vw;
    font-size: 2.1094vw;
    color: #F91515;
    text-align: center;

    .bold {
      font-weight: bold;
    }
  }

  .cart-modal-body {
    flex: auto;
    margin-right: 0.7925vw;
    margin-left: 0.7925vw;
    overflow-y: scroll;
  }

  .cart-modal-footer {
    display: flex;
    flex-direction: column;

    .cart-modal-footer-price {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.7vw;
      margin-bottom: 0.5938vw;

      .cart-modal-footer-total-text {
        font-size: 1.875vw;
        color: #666;
      }

      .cart-modal-footer-price-wrap {
        display: flex;
        align-items: center;
        color: #F91515;

        .cart-modal-footer-quantity {
          font-size: 1.875vw;
          font-weight: 500;
        }

        .cart-modal-footer-price {
          margin-left: 1.7969vw;
          font-size: 2.1875vw;
          font-weight: 700;
        }
      }
    }

    .cart-modal-button-wrap {
      display: flex;
      color: #fff;

      .cart-modal-cancel-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24%;
        height: 4.6875vw;
        font-size: 1.875vw;
        font-weight: 500;
        background-color: #999;
        border-radius: .7813vw;

        &.button-active {
          background-color: v-bind(activeNoButtonColor);
        }
      }

      .cart-modal-confirm-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 76%;
        height: 4.6875vw;
        margin-left: .7813vw;
        font-size: 1.875vw;
        font-weight: 500;
        background-color: #F91515;
        border-radius: .7813vw;

        &.button-active {
          background-color: #D60505;
        }
      }
    }
  }

}

</style>
