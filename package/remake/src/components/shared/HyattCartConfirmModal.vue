<template>
  <div>
    <div class="cart-modal-wrap">
      <p
        v-if="isEnglish"
        class="cart-modal-header"
      >
        {{ t('확인하셨습니까?') }}
        {{ t('상품과 수량을') }}
        {{ t('장바구니의') }}
      </p>
      <p
        v-else
        class="cart-modal-header"
      >
        {{ t('장바구니의') }}
        {{ t('상품과 수량을') }}
        {{ t('확인하셨습니까?') }}
      </p>
      <div class="cart-modal-body">
        <div class="cart-modal-scroll">
          <slot/>
        </div>
      </div>
      <div class="cart-modal-footer">
        <div class="cart-footer-wrap">
          <div class="cart-modal-price">
            <div class="text-wrap">
              <span class="total-text">
                {{ t('합계') }}
              </span>
            </div>
            <div class="price-wrap">
              <span class="price">
                {{ getProductsTotalPrice?.toLocaleString() }}
              </span>
            </div>
          </div>
          <div class="cart-modal-button">
            <div
              class="no"
              @click="closeCartConfirmModal"
            >
              {{ t('아니요') }}
            </div>
            <div
              class="yes"
              @click="(e) => order(e, true)"
            >
              {{ confirmOrderButtonText }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  getProductsTotalPrice: number,
  getProductsQuantityText: string,
  orderCartConfirm: () => void,
  closeCartConfirmModal: () => void,
  confirmOrderButtonText: string,
  order: (e: Event, isConfirmOrder?: boolean) => void,
  t: (str: string) => string,
  customFontColor: string,
  customButtonBackgroundColor: string,
  customButtonFontColor: string,
  isEnglish: boolean,
}>();
</script>

<style scoped lang='scss'>
.cart-modal-container {
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
  background-color: #fff;
  border-radius: 1.5625vw;

  .cart-modal-header {
    margin-bottom: 3vw;
    font-family: "Noto Sans SC", sans-serif;
    font-size: 2.1094vw;
    color: v-bind(customButtonBackgroundColor);
    text-align: center;
  }

  .cart-modal-footer {
    display: flex;
    justify-content: center;

    .cart-footer-wrap {
      display: flex;
      flex-direction: column;
      gap: .3906vw;
      width: 48%;
    }
  }
}

.cart-modal-body {
  flex: auto;
  margin-right: 0.7925vw;
  margin-left: 0.7925vw;
  overflow-y: scroll;

  .cart-modal-scroll {
    display: flex;
    flex: auto;
    flex-direction: column-reverse;
    justify-content: flex-end;
  }
}

.cart-modal-price {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .7813vw;

  .text-wrap {
    display: flex;
    justify-content: center;
    font-family: "Noto Sans SC", sans-serif;
    font-size: 1.875vw;
  }

  .price-wrap {
    margin-right: .9375vw;

    .quantity {
      font-family: "Noto Sans SC", sans-serif;
      font-size: 1.875vw;
    }

    .price {
      display: flex;
      justify-content: flex-end;
      font-size: 2.1875vw;
    }
  }
}

.cart-modal-button {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .7813vw;
  color: v-bind(customButtonFontColor);

  .no {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 4.8vw;
    font-family: "Noto Sans SC", sans-serif;
    font-size: 1.875vw;
    font-weight: 500;
    background-color: #999;
    border-radius: .7813vw;
  }

  .yes {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 4.8vw;
    font-family: "Noto Sans SC", sans-serif;
    font-size: 1.875vw;
    font-weight: 500;
    background-color: v-bind(customButtonBackgroundColor);
    border-radius: .7813vw;
  }
}
</style>
