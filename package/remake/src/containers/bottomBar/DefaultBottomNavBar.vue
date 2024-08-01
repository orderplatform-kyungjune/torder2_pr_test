<template>
  <div class="container-bottom-menu">
    <div class="bottom-menu-wrapper">
      <div class="wrap-left-menu">
        <BasicLayoutEventButton
          v-if="IS_ORIGIN"
          :content="t('이벤트')"
          @click="bottomLeftContainerButtonClick"
        />
        <div
          class="left-button"
          @click="toggleOptionalFeature"
        >
          <img
            class="left-icon"
            alt="더보기 아이콘"
            src="https://static.torder.co.kr/torder2/icon_3dot_white.svg"
          >
          <div class="left-text">
            {{ t('추가기능') }}
          </div>
          <div class="red-highlight"/>
        </div>
        <!--driveCallHide : 1 노출 / 0 미노출  -->
        <EventModuleButton
          v-if="getStoreInfo.driveCallHide === 1"
          :title="'대리운전'"
          :icon="eventModuleIcons()"
          :isHyattTheme="isHyattTheme()"
          :onClickHandler="onClickCallDriverButton"
        />
      </div>
      <div class="wrap-right-menu">
        <!-- recentOrderHide : 1 미노출 / 0 노출 -->
        <div
          v-if="getStoreInfo.recentOrderHide === 0"
          class="right-button"
          :class="{ 'no-order': !orderList.isOrderExist }"
        >
          <img
            class="right-icon"
            alt="주문내역 아이콘"
            src="https://static.torder.co.kr/torder2/svg_orderhistory_normal_white.svg"
          >

          <div
            class="right-text"
            @click="checkGotoOrderHistory"
          >
            {{ t('주문내역') }}
          </div>
        </div>
        <!-- tabletBillsOnOff : 1 미노출 / 0 노출 -->
        <div
          v-show="getStoreInfo.tabletBillsOnOff === 0"
          class="right-button"
          :class="{ 'no-order': !orderList.isOrderExist }"
        >
          <img
            class="right-icon"
            alt="계산서 아이콘"
            src="https://static.torder.co.kr/torder2/svg_bill_normal_white.svg"
          >

          <div
            class="right-text"
            @click="checkGotoBillOrder"
          >
            {{ t('계산서') }}
          </div>
        </div>
        <div
          class="right-button"
          :class="{ 'no-order': !isHaveCartProduct }"
        >
          <img
            v-if="isZeroCartQuantity"
            class="right-icon"
            alt="장바구니 아이콘"
            src="https://static.torder.co.kr/torder2/svg_cart_normal_white.svg"
          >
          <div
            v-else
            class="button-quantity"
            @click="openCartModal"
          >
            {{ cartQuantity }}
          </div>
          <div
            class="right-text"
            @click="openCartModal"
          >
            {{ t('장바구니') }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 추가기능 팝업 모달 -->
  <LayoutMoreList
    v-if="isOpenOptionalFeature"
    :close-flag-show-more-list="toggleOptionalFeature"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  computed,
  ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import { pushPage } from '@utils/route.helper';
import {
  CART,
  type cartProductType,
} from '@torder/common';
import useThemeStore from '@store/storeTheme';
import useTableStore from '@store/storeTable';
import useOrderListStore from '@store/storeOrderList';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import {
  billOrder,
  eventListPage,
  orderHistory,
} from '@router/routePaths';
import LayoutMoreList from '@containers/shared/LayoutMoreList.vue';
import eventModule from '@composables/eventModule';
import BasicLayoutEventButton from '@components/shared/BasicLayoutEventButton.vue';
import EventModuleButton from '@components/buttons/EventModuleButton.vue';
import { IS_ORIGIN } from '@common/mode';
import {
  checkBillExist,
  checkOrderExist,
} from '@apis/orderData';

const { t } = useI18n();
const { theme } = storeToRefs(useThemeStore());
const { tableInfo } = storeToRefs(useTableStore());
const { setOrderList } = useOrderListStore();
const { orderList } = storeToRefs(useOrderListStore());
const {
  openModal,
  openAlert,
} = useModalStore();
const {
  cartProducts,
  isHaveCartProduct,
} = storeToRefs(useCartStore());
const { getStoreInfo } = storeToRefs(useInitStore());
const { moveEventModulePage } = eventModule();

const isHyattTheme = () => theme?.value.type === 'hyatt';

const eventModuleIcons = (): string => 'https://static.torder.co.kr/torder2/icon_car_white.svg';

const cartQuantity = computed(() => cartProducts.value.reduce((cur, next: cartProductType) => cur + next.quantity, 0));
const isZeroCartQuantity = computed(() => cartProducts.value?.length === 0);

const openCartModal = () => {
  if (isZeroCartQuantity.value) {
    openAlert(t('장바구니가 비었습니다.'));
    return;
  }

  openModal(CART);
};

const checkGotoOrderHistory = async () => {
  const checkAlreadyOrder = await checkOrderExist(getStoreInfo.value.storeCode, tableInfo.value.tabletId, setOrderList);

  if (checkAlreadyOrder) {
    pushPage(orderHistory);
    return;
  }

  openAlert(t('주문내역이 없습니다.'));
};

const checkGotoBillOrder = async () => {
  const checkAlreadyBill = await checkBillExist(getStoreInfo.value.storeCode, tableInfo.value.tabletId, setOrderList);

  if (checkAlreadyBill) {
    pushPage(billOrder);
    return;
  }

  openAlert(t('계산된 내역이 없습니다.'));
};

const onClickCallDriverButton = () => {
  moveEventModulePage('KDRIVE', 'video', 1);
};

const isOpenOptionalFeature = ref(false);

const toggleOptionalFeature = () => {
  isOpenOptionalFeature.value = !isOpenOptionalFeature.value;
};

const bottomLeftContainerButtonClick = () => {
  pushPage(eventListPage);
};

</script>

<style scoped lang="scss">
.container-bottom-menu {
  position: absolute;
  bottom: 0;
  z-index: 9;
  box-sizing: border-box;
  min-width: 100vw;
  height: 5.4688vw;
  padding-left: 16.375vw;
  background-color: #000;

  .bottom-menu-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0;
    margin: 0 1.5625vw;

    .wrap-left-menu {
      display: flex;
      gap: 0.9375vw;
      align-items: center;

      .left-button {
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 0.9375vw;

        .left-icon {
          width: 2.5vw;
          height: 2.5vw;
        }

        .left-text {
          flex: 1;
          font-size: 1.875vw;
          line-height: 1.5;
          color: #fff;
        }

        .red-highlight {
          position: absolute;
          top: 0.3906vw;
          right: 0;
          z-index: 1;
          width: 0.625vw;
          height: 0.625vw;
          background-color: red;
          border-radius: 2.3438vw;
          object-fit: contain;
        }
      }
    }

    .wrap-right-menu {
      display: flex;
      gap: 1.25vw;
      align-items: center;
      color: #fff;

      .right-button {
        position: relative;
        display: flex;
        gap: 0.6250vw;
        align-items: center;
        padding: 0 1.5625vw;
        line-height: 1.7;

        .right-icon {
          width: 2.5vw;
          height: 2.5vw;
        }
        &.no-order {
          opacity: 0.7;
        }

        @keyframes buttonCount {
          0% {
            color: #ffffff;
          }
          100% {
            color: #F91515;
          }
        }

        .button-quantity {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5vw;
          height: 2.5vw;
          font-size: 1.5625vw;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.0586vw;
          background-color: #F91515;
          border-radius: 0.7813vw;
          animation: buttonCount 0.8s 0s infinite ease-in-out alternate;
        }

        .right-text {
          font-size: 1.875vw;
          line-height: 1.5;
        }
      }
    }
  }
}

</style>
