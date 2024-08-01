<template>
  <div
    class="cart-modal-container"
    :class="theme.type"
  >
    <div class="cart-header-wrap">
      <span class="title">
        {{ t('장바구니') }}
      </span>
      <RestaurantStoreInfo
        v-if="isForestTheme"
        :tableName="tableName"
        :goToSecret="goToSecret"
      />
    </div>
    <div class="cart-body-wrap">
      <ul class="cart-list">
        <slot/>
      </ul>
    </div>
    <div class="cart-footer-wrap">
      <div class="cart-info">
        <div class="total-count">
          {{ getProductsQuantityText }}
        </div>
        <div class="total-price">
          {{ checkStandardPriceUnit(getProductsTotalPrice?.toLocaleString()) }}
        </div>
      </div>
      <div class="cart-button">
        <div
          class="close"
          @click="closeCartModal"
        >
          {{ t('닫기') }}
        </div>
        <div
          class="order"
          @click="order"
        >
          {{ orderButtonText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { getSubPrimaryColor } from '@torder/common';
import useThemeStore from '@store/storeTheme';
import useInitStore from '@store/storeInit';
import { RestaurantStoreInfo } from '@components';

const { theme } = storeToRefs(useThemeStore());
const { init } = storeToRefs(useInitStore());

defineProps<{
  storeName: string,
  tableName: string,
  order: (e: Event, isConfirmOrder?: boolean) => void,
  closeCartModal: () => void,
  getProductsTotalPrice: number,
  getProductsQuantityText: string,
  isForestTheme: boolean,
  orderButtonText: string,
  t: (str: string) => string,
  goToSecret: () => void,
}>();

const getConfirmButtonBackgroundColor = () => {
  if (init.value?.storeInfo?.closeOrder === 1) {
    return '#cacaca';
  }
  return '#F91515';
};

const activeCloseButtonColor = getSubPrimaryColor('#636363', 10, 'Y');
const activeOrderButtonColor = getSubPrimaryColor(getConfirmButtonBackgroundColor(), 10, 'Y');
</script>

<style scoped lang='scss'>
.cart-modal-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 15;
  display: flex;
  flex-direction: column;
  width: 25vw;
  font-family: Pretendard, sans-serif;
  background-color: #fafafa;

  &.restaurant-horizontal,
  &.restaurant-horizontal-card {
    position: initial;
    width: 100%;
    height: 100%;
    font-family: Noto Serif Kr, sans-serif;
    border-top: none;
    box-shadow: 0 -0.7813vw 3.9063vw 0 rgba(0, 0, 0, 0.2);

    &:deep(.cart-body-wrap) {
      .delete {
        color: #999;
        border: solid .0781vw #999;
      }

      .price {
        color: #131313;
      }
    }

    &:deep(.cart-footer-wrap) {
      .order {
        color: #fff;
        background-color: #F91515;
      }

      .cart-info {
        .total-price {
          color: #2f2a26;
        }
      }
    }
  }

  .cart-header-wrap {
    padding: 2.5vw 0 3.5938vw 1.25vw;

    .title {
      font-size: 1.875vw;
      font-weight: 700;
      line-height: 1.5;
      letter-spacing: -0.0414vw;
    }
  }

  .cart-body-wrap {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: scroll;

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

  .cart-footer-wrap {
    display: flex;
    flex-direction: column;

    .cart-info {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 7.746478873vh;
      padding: 0 1.0156vw;

      .total-count {
        font-family: Pretendard, sans-serif;
        font-size: 1.5625vw;
        font-style: normal;
        font-weight: 400;
        font-stretch: normal;
        text-align: left;
        letter-spacing: normal;
      }

      .total-price {
        padding-bottom: 0.5vw;
        font-size: 1.875vw;
        font-style: normal;
        font-weight: 700;
        font-stretch: normal;
        color: #F91515;
        text-align: right;
      }
    }

    .cart-button {
      display: flex;
      height: 5.4688vw;
      font-weight: 600;

      .close {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        font-size: 2.3438vw;
        font-weight: 700;
        line-height: 2.9688vw;
        color: #fff;
        letter-spacing: -0.0469vw;
        background-color: #636363;

        &.button-active {
          background-color: v-bind(activeCloseButtonColor);
        }
      }

      .order {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 17.4219vw;
        font-size: 2.3438vw;
        font-weight: 700;
        line-height: 2.9688vw;
        color: #fff;
        text-align: center;
        letter-spacing: -0.0469vw;
        background-color: v-bind(getConfirmButtonBackgroundColor());

        &.button-active {
          background-color: v-bind(activeOrderButtonColor);
        }
      }
    }
  }
}

</style>
