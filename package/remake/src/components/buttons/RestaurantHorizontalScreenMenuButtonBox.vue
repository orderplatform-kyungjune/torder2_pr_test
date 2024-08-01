<template>
  <div class="menu-button-box-container">
    <div class="menu-button-box-wrapper">
      <div class="menu-button-box-image">
        <img src="https://static.torder.co.kr/torder2/icn_orderlist_restaurant_black_32px.svg">
      </div>
      <div
        class="menu-button-box-title"
        @click="openOrderHistory"
      >
        {{ orderList }}
      </div>
    </div>
    <div class="menu-button-box-wrapper">
      <div class="menu-button-box-image">
        <img src="https://static.torder.co.kr/torder2/icn_event_restaurant_black_32px.svg">
      </div>
      <div class="menu-button-box-title">
        {{ event }}
      </div>
    </div>
    <div class="menu-button-box-wrapper">
      <div class="menu-button-box-image">
        <img src="https://static.torder.co.kr/torder2/icn_bill_restaurant_black_32px.svg">
      </div>
      <div
        class="menu-button-box-title"
        @click="openBills"
      >
        {{ bill }}
      </div>
    </div>
    <div
      class="menu-button-box-wrapper"
      @click="openCartModal"
    >
      <div
        v-if="isZeroCartQuantity"
        class="menu-button-box-image"
      >
        <img src="https://static.torder.co.kr/torder2/icn_cart_restaurant_black_32px.svg">
      </div>
      <div
        v-else
        class="tool-box-cart-quantity"
      >
        {{ cartQuantity }}
      </div>
      <div class="menu-button-box-title">
        {{ cart }}
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  /** 주문내역 텍스트 입니다. */
  orderList: string,
  /** 이벤트 텍스트 입니다. */
  event: string,
  /** 계산서 텍스트 입니다. */
  bill: string,
  /** 장바구니 텍스트 입니다. */
  cart: string,
  openOrderHistory: () => void,
  openBills: () => void,
  openCartModal: () => void,
  cartQuantity: number,
  isZeroCartQuantity: boolean,
}>();
</script>

<style lang='scss' scoped>
.menu-button-box-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1.3281vw;
  padding: 1.7969vw 5.7031vw 1.3281vw 1.25vw;
  background-color: #fff;
  border-radius: 1.1719vw;
  box-shadow: 0.3906vw 0.3906vw 1.1719vw 0 rgba(0, 0, 0, 0.05);

  .menu-button-box-wrapper {
    display: flex;
    gap: 0.4688vw;
    align-items: center;

    .menu-button-box-image {
      width: 2.5vw;
      height: 2.5vw;
    }

    .menu-button-box-title {
      font-family: 'Pretendard',sans-serif;
      font-size: 1.5625vw;
      font-weight: 500;
      color: #2f2a26;
      letter-spacing: -0.0313vw;
    }

    .tool-box-cart-quantity {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.0313vw;
      height: 2.0313vw;
      font-size: 1.1719vw;
      font-weight: 500;
      color: #fff;
      letter-spacing: 0.0586vw;
      background-color: #ab240f;
      border-radius: 0.3906vw;
    }
  }
}
</style>
