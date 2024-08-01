<template>
  <StaffCallCheck/>
  <SecretLogin/>
  <SecretMain/>
  <div
    v-show="!isActiveCart"
    class="toolbox-container"
  >
    <TableTagToSecret/>
    <div class="toolbox-advertise">
      <div class="toolbox-advertise-count">
        <div class="toolbox-advertise-count-current">
          1
        </div>
        <div>&nbsp;/&nbsp;</div>
        <div>5</div>
      </div>
    </div>
    <div>
      <RestaurantHorizontalScreenTablePeopleCount
        :peopleCount="5"
        :totalPeople="translatedTotalPeople"
        :people="translatedPeople"
      />
    </div>
    <div>
      <RestaurantHorizontalScreenMenuButtonBox
        :orderList="translatedOrderList"
        :event="translatedEvent"
        :bill="translatedBill"
        :cart="translatedCart"
        :openCartModal="openCartModal"
        :openOrderHistory="()=>checkGotoOrderHistory()"
        :openBills="()=>checkGotoBillOrder()"
        :cartQuantity="cartQuantity"
        :isZeroCartQuantity="isZeroCartQuantity"
      />
    </div>
    <div
      v-if="masterStaffCallOption === 0"
      class="toolbox-advertise-count-staff-call"
      @click="openStaffCallCheckModal"
    >
      {{ translatedStaffCall }}
    </div>
    <div
      v-else-if="masterStaffCallOption === 1"
      class="toolbox-advertise-count-staff-call"
      @click="openStaffCall"
    >
      {{ translatedStaffCall }}
    </div>
    <div
      v-else
      class="toolbox-advertise-count-staff-call-hidden"
    >
      {{ translatedStaffCall }}
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import {
  SecretLogin,
  SecretMain,
  StaffCallCheck,
} from '@views';
import { pushPage } from '@utils/route.helper';
import { getStorage } from '@torder/common/utils';
import { cartProductType } from '@torder/common/interface/cartProduct';
import {
  CACHE_DATA,
  CART,
  STAFF_CALL_CHECK,
} from '@torder/common/constant';
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
import { TableTagToSecret } from '@containers';
import {
  RestaurantHorizontalScreenTablePeopleCount,
  RestaurantHorizontalScreenMenuButtonBox,
} from '@components';
import {
  checkOrderExist,
  checkBillExist,
} from '@apis/orderData';

const { t } = useI18n();

const translatedStaffCall = t('직원 호출');
const translatedTotalPeople = t('총 인원');
const translatedPeople = t('명');
const translatedOrderList = t('주문내역');
const translatedEvent = t('이벤트');
const translatedBill = t('계산서');
const translatedCart = t('장바구니');

const {
  openModal,
  openAlert,
} = useModalStore();

const openStaffCallCheckModal = () => {
  openModal(STAFF_CALL_CHECK);
};

const {
  cartProducts,
  isActiveCart,
} = storeToRefs(useCartStore());

const { tableInfo } = storeToRefs(useTableStore());

const { setOrderList } = useOrderListStore();

// get cart list api 호출
const {
  getStoreInfo,
  init,
} = useInitStore();
const {
  staffCallBackgroundColor,
  staffCallFontColor,
} = storeToRefs(useInitStore());

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
  const { serviceCategoryType: staffCallOption } = getStoreInfo;

  if (staffCallOption === undefined) {
    return JSON.parse(storeInfo).storeInfo?.serviceCategoryType;
  }

  return staffCallOption;
});
</script>

<style lang='scss' scoped>
.toolbox-container {
  z-index: 300;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 18.3594vw;
  height: 100vh;
  padding: 0vw 1.5625vw 1.5625vw 1.5625vw;
  background-color: #f6f6f6;

  .toolbox-advertise {
    position: relative;
    width: 100%;
    height: 20.7031vw;
    background-color: #dbdbdb;
    border-radius: 1.1719vw;

    .toolbox-advertise-count {
      position: absolute;
      right: 1.25vw;
      bottom: 1.0156vw;
      display: flex;
      font-family: 'Pretendard' ,sans-serif;
      font-size: 1.1719vw;
      color: #fff;

      .toolbox-advertise-count-current {
        font-weight: bold;
      }
    }
  }

  .toolbox-advertise-count-staff-call {
    padding: 1.1719vw 0;
    font-family: 'Pretendard', sans-serif;
    font-size: 2.0313vw;
    font-weight: 600;
    color: v-bind(staffCallFontColor);
    text-align: center;
    letter-spacing: -0.0406vw;
    background-color: v-bind(staffCallBackgroundColor);
    border-radius: 1.1719vw;
  }

  .toolbox-advertise-count-staff-call-hidden {
    /* visibility:hidden; */
    display: none;
    padding: 1.1719vw 0;
    font-family: 'Pretendard', sans-serif;
    font-size: 2.0313vw;
    font-weight: 600;
    color: v-bind(staffCallFontColor);
    text-align: center;
    letter-spacing: -0.0406vw;
    background-color: v-bind(staffCallBackgroundColor);
    border-radius: 1.1719vw
  }
}
</style>
