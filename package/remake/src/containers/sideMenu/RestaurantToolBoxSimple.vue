<template>
  <ModalSelectLanguage/>
  <div class="tool-box-simple-container">
    <div @click="openSelectLanguage">
      <img src="https://static.torder.co.kr/torder2/icn_world_restaurant_white_32px.svg">
    </div>
    <div @click="checkGotoOrderHistory">
      <img src="https://static.torder.co.kr/torder2/icn_orderlist_restaurant_white_32px.svg">
    </div>
    <div @click="checkGotoBillOrder">
      <img src="https://static.torder.co.kr/torder2/icn_bill_restaurant_white_32px.svg">
    </div>
    <div
      v-if="isZeroCartQuantity"
      @click="openCartModal"
    >
      <img src="https://static.torder.co.kr/torder2/icn_cart_restaurant_white_32px.svg">
    </div>
    <div
      v-else
      class="tool-box-cart-quantity"
      @click="openCartModal"
    >
      {{ cartQuantity }}
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { pushPage } from '@utils/route.helper';
import { cartProductType } from '@torder/common/interface/cartProduct';
import {
  CART,
  LANGUAGE,
} from '@torder/common/constant';
import useTableStore from '@store/storeTable';
import useOrderListStore from '@store/storeOrderList';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import {
  billOrder,
  orderHistory,
} from '@router/routePaths';
import { ModalSelectLanguage } from '@containers';
import {
  checkOrderExist,
  checkBillExist,
} from '@apis/orderData';

const { t } = useI18n();

const { cartProducts } = storeToRefs(useCartStore());

const { getStoreInfo } = useInitStore();

const { tableInfo } = storeToRefs(useTableStore());

const {
  openModal,
  openAlert,
} = useModalStore();

const { setOrderList } = useOrderListStore();

const openSelectLanguage = () => {
  openModal(LANGUAGE);
};

const cartQuantity = computed(() => cartProducts.value.reduce((cur, next: cartProductType) => cur + next.quantity, 0));
const isZeroCartQuantity = computed(() => cartProducts.value.length === 0);

const openCartModal = () => {
  if (isZeroCartQuantity.value) {
    openAlert(t('장바구니가 비었습니다.'));
    return;
  }

  openModal(CART);
};

const checkGotoOrderHistory = async () => {
  if (await checkOrderExist(getStoreInfo.storeCode, tableInfo.value.tabletId, setOrderList)) {
    pushPage(orderHistory);
    return;
  }

  openAlert(t('주문내역이 없습니다.'));
};

const checkGotoBillOrder = async () => {
  if (await checkBillExist(getStoreInfo.storeCode, tableInfo.value.tabletId, setOrderList)) {
    pushPage(billOrder);
    return;
  }

  openAlert(t('계산된 내역이 없습니다.'));
};
</script>

<style lang='scss' scoped>
.tool-box-simple-container {
  display: inline-flex;
  flex-direction: column;
  gap: 1.0156vw;
  align-items: center;
  justify-content: center;
  width: 4.8438vw;
  padding: 1.7188vw 0 1.6406vw;
  text-align: center;
  background-color: #2f2a26;
  border-radius: 2.4219vw;
  opacity: 0.95;

  div {
    width: 100%;
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
</style>
