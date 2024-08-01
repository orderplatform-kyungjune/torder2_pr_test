<template>
  <StaffCallCheck/>
  <div
    class="menubar-container"
    :class="theme.color"
  >
    <RestaurantVerticalScreenIconCard
      v-bind="returnProps(iconBlackOrWhite(theme.color, HISTORY), t('주문내역'))"
      :theme="theme.color"
      @click.stop="checkGotoOrderHistory"
    />
    <RestaurantVerticalScreenIconCard
      v-bind="returnProps(iconBlackOrWhite(theme.color, BILL), t('계산서'))"
      :theme="theme.color"
      @click.stop="checkGotoBillOrder"
    />
    <div class="staff-call-space">
      <img
        v-if="masterStaffCallOption === 0"
        class="staff-call"
        src="https://static.torder.co.kr/torder2/staff_call_white_82x83.svg"
        @click.stop="openStaffCallCheckModal"
      >
      <img
        v-else-if="masterStaffCallOption === 1"
        class="staff-call"
        src="https://static.torder.co.kr/torder2/staff_call_white_82x83.svg"
        @click.stop="openStaffCall"
      >
      <img
        v-else
        :class="['staff-call', 'no-staff-call']"
        src="https://static.torder.co.kr/torder2/staff_call_white_82x83.svg"
      >
    </div>

    <RestaurantVerticalScreenIconCard
      v-bind="returnProps(iconBlackOrWhite(theme.color, EVENT), t('이벤트'))"
      :theme="theme.color"
    />
    <RestaurantVerticalScreenIconCard
      v-if="isZeroCartQuantity"
      v-bind="returnProps(iconBlackOrWhite(theme.color, CART), t('장바구니'))"
      :theme="theme.color"
      @click.stop="openCartModal"
    />
    <div
      v-else
      class="cart-info-wrap"
      :class="theme.color"
      @click.stop="openCartModal"
    >
      <div class="cart-quantity">
        {{ cartQuantity }}
      </div>
      <span>{{ t('장바구니') }}</span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { StaffCallCheck } from '@views';
import { pushPage } from '@utils/route.helper';
import { getStorage } from '@torder/common/utils';
import { cartProductType } from '@torder/common/interface/cartProduct';
import {
  BLACK,
  CACHE_DATA,
  CART,
  STAFF_CALL_CHECK,
  HISTORY,
  EVENT,
  BILL,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useTableStore from '@store/storeTable';
import useOrderListStore from '@store/storeOrderList';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import {
  billOrder,
  orderHistory,
  staffCall,
} from '@router/routePaths';
import { RestaurantVerticalScreenIconCard } from '@components';
import {
  checkOrderExist,
  checkBillExist,
} from '@apis/orderData';

const { theme } = useThemeStore();

const returnProps = (imgUrl: string, text: string) => ({
  imageUrl: imgUrl,
  fontSize: '1.4063vw',
  text,
});

const iconBlackOrWhite = (color: string, iconName: string) => {
  if (color === BLACK) {
    const icons: {[index: string]: string} = {
      history: 'https://static.torder.co.kr/torder2/icn_orderlist_restaurant_white_32px.svg',
      bill: 'https://static.torder.co.kr/torder2/icn_bill_restaurant_white_32px.svg',
      event: 'https://static.torder.co.kr/torder2/icn_event_restaurant_white_32px.svg',
      cart: 'https://static.torder.co.kr/torder2/icn_cart_restaurant_white_32px.svg',
    };

    return icons[iconName];
  }

  const icons: {[index: string]: string} = {
    history: 'https://static.torder.co.kr/torder2/icn_orderlist_restaurant_black_32px.svg',
    bill: 'https://static.torder.co.kr/torder2/icn_bill_restaurant_black_32px.svg',
    event: 'https://static.torder.co.kr/torder2/icn_event_restaurant_black_32px.svg',
    cart: 'https://static.torder.co.kr/torder2/icn_cart_restaurant_black_32px.svg',
  };

  return icons[iconName];
};

const { t } = useI18n();

const {
  openModal,
  openAlert,
} = useModalStore();

const openStaffCallCheckModal = () => {
  openModal(STAFF_CALL_CHECK);
};

const { cartProducts } = storeToRefs(useCartStore());

// get cart list api 호출
const {
  getStoreInfo,
  init,
} = useInitStore();

const isServiceItem = computed(() => {
  const serviceItemLength = init.serviceList?.childCategoryList.length;

  if (serviceItemLength > 0) return true;

  return false;
});

const openStaffCall = () => {
  if (isServiceItem.value === false) {
    openModal(STAFF_CALL_CHECK);
    return;
  }

  pushPage(staffCall);
};

const { tableInfo } = storeToRefs(useTableStore());

const { setOrderList } = useOrderListStore();

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

const storeInfo = getStorage(CACHE_DATA) as string;

const masterStaffCallOption = computed(() => {
  const { getStoreInfo } = useInitStore();
  const { serviceCategoryType: staffCallOption } = getStoreInfo;

  if (staffCallOption === undefined) {
    return JSON.parse(storeInfo).storeInfo?.serviceCategoryType;
  }

  return staffCallOption;
});
</script>

<style lang='scss' scoped>
.menubar-container {
  display: flex;
  gap: 3.75vw;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-top-left-radius: 3.75vw;
  border-top-right-radius: 3.75vw;
  border-color: transparent;
  box-shadow: 0 -1.25vw 3.75vw 0 rgba(0, 0, 0, 0.05);

  &.white {
    background-color: #fff;
  }

  &.black {
    background-color: #111111;
  }

  .staff-call-space {
    position: relative;
    width: 10.6250vw;
    height: 100%;
  }

  .staff-call {
    position: absolute;
    top: 10%;
    left: 50%;
    padding: 2.3828vw 2.1094vw 1.8750vw;
    background-color: #b51900;
    border-radius: 2.3438vw;
    box-shadow: 0 0 0.7813vw 0 rgba(0, 0, 0, 0.5);
    transform: translate(-50%,-50%);
  }

  .no-staff-call {
    opacity: 0;
  }

  .cart-info-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.3906vw;
    align-items: center;
    font-size: 1.4063vw;

    &.white {
      color: #2f2a26;
    }

    &.black {
      color: #fff;
    }

    .cart-quantity {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1vw 1.625vw;
      margin-bottom: 0.625vw;
      font-family: 'Pretendard', sans-serif;
      font-size: 1.4063vw;
      font-weight: 500;
      color: #fff;
      letter-spacing: 0.0586vw;
      background-color: #ab240f;
      border-radius: 0.3906vw;
    }
  }
}
</style>
