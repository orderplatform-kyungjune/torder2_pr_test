<template>
  <div class="restaurant-vertical-cart-container">
    <div
      v-if="masterStaffCallOption !== 2"
      class="staff-call"
      @click="openStaffCall"
    >
      <img src="https://static.torder.co.kr/torder2/staff_call_white_82x83.svg">
    </div>
    <div
      v-if="!isSpread"
      class="spread"
      @click="spreadOut"
    >
      {{ t('펼쳐보기') }}
    </div>
    <div
      v-else
      class="spread"
      @click="spreadIn"
    >
      {{ t('접기') }}
    </div>
    <div class="cart-header">
      <div class="title">
        {{ t('장바구니') }}
      </div>
      <div
        class="delete-all-btn"
        @click="deleteProductAll"
      >
        {{ t('전체 삭제') }} X
      </div>
    </div>
    <div class="cart-item-container">
      <slot/>
    </div>
    <div class="cart-bottom">
      <div class="cart-bottom-price-wrap">
        <div class="total">
          {{ getProductsQuantityText }}
        </div>
        <div class="price">
          {{ checkStandardPriceUnit(getProductsTotalPrice?.toLocaleString()) }}
        </div>
      </div>
      <div class="cart-bottom-btn-wrap">
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

<script setup lang="ts">
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import useInitStore from '@store/storeInit';

const { init } = useInitStore();

defineProps<{
  spreadIn: () => void,
  spreadOut: () => void,
  isSpread: boolean,
  order: (e: Event, isConfirmOrder?: boolean) => void,
  closeCartModal: () => void,
  getProductsTotalPrice: number,
  getProductsQuantityText: string,
  orderButtonText: string,
  deleteProductAll: () => void,
  openStaffCall: () => void,
  masterStaffCallOption: number,
  t: (str: string) => string,
}>();

const getConfirmButtonBackgroundColor = () => {
  if (init.storeInfo?.closeOrder === 1) {
    return '#cacaca';
  }
  return '#b51900';
};
</script>

<style lang="scss" scoped>
.restaurant-vertical-cart-container {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  padding-top: 4.625vw;
  padding-bottom: 3.125vw;
  padding-left: 3.75vw;
  background-color: #fff;
  border-radius: 2.3438vw;
  box-shadow: 0 -0.7813vw 2.3438vw 0 rgba(0, 0, 0, 0.16);

  &.black {
    background-color: #111;

    .spread {
      color: #fff;
      background-color: #111;
    }

    .cart-header {
      .title {
        color: #fff;
      }

      .delete-all-btn {
        color: #fff;
        border: 0.0781vw solid #fff;
      }
    }

    .cart-bottom .cart-bottom-price-wrap {
      .total {
        color: #fff;
      }

      .price {
        color: #f33619;
      }
    }
  }

  .staff-call {
    position: absolute;
    top: -20vw;
    right: 3vw;
    padding: 2.3828vw 2.1094vw 1.8750vw;
    background-color: #b51900;
    border-radius: 2.3438vw;
    box-shadow: 0 0 0.7813vw 0 rgba(0, 0, 0, 0.5);
  }

  &.spread .cart-item-container {
    flex-direction: column;
    height: 80.875vw;
    padding-right: 3.75vw;
  }

  .cart-item-container {
    display: flex;
    gap: 2.5vw;
    padding-top: 2.5vw;
    padding-bottom: 3.625vw;
    overflow: scroll;
  }

  .spread {
    position: absolute;
    top: -4.4vw;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10.1563vw;
    height: 3.5156vw;
    font-family: 'Pretendard', sans-serif;
    font-size: 1.1719vw;
    text-shadow: 0 -0.7813vw 2.3438vw rgba(0, 0, 0, 0.16);
    background-color: #fff;
    border-radius: .7813vw .7813vw 0 0;
    transform: translate(-50%, 0);
  }

  .cart-header {
    display: flex;
    justify-content: space-between;

    .title {
      font-family: 'Noto Serif KR', serif;
      font-size: 2.0313vw;
      font-weight: 500;
    }

    .delete-all-btn {
      padding: 1.3vw 2vw;
      margin-right: 4.375vw;
      font-family: 'Pretendard', sans-serif;
      font-size: 1.5625vw;
      font-weight: 500;
      border: .0781vw solid #444;
      border-radius: .7813vw;
    }
  }

  .cart-bottom {
    margin-right: 3.75vw;

    .cart-bottom-price-wrap {
      display: flex;
      justify-content: space-between;
      margin-top: 1.8vw;
      margin-bottom: 1.8vw;

      .total {
        font-family: 'Pretendard', sans-serif;
        font-size: 2.0313vw;
        font-weight: 700;
      }

      .price {
        font-family: 'Noto Serif KR', serif;
        font-size: 2.3438vw;
        font-weight: 700;
        color: #b51900;
      }
    }

    .cart-bottom-btn-wrap {
      display: flex;
      gap: 1vw;
      justify-content: space-between;
      font-family: 'Pretendard', sans-serif;
      font-weight: bold;

      .close {
        padding: 3.5vw 5.625vw 2.75vw;
        font-size: 2.6563vw;
        color: #fff;
        background-color: #999;
        border-radius: .7813vw;
      }

      .order {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        font-size: 2.6563vw;
        color: #fff;
        background-color: v-bind(getConfirmButtonBackgroundColor());
        border-radius: .7813vw;
      }
    }
  }
}
</style>
