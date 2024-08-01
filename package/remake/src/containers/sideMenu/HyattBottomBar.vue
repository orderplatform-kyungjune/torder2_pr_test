<template>
  <div class="bottom-navbar">
    <div class="bottom-left-container">
      <div
        v-if="!IS_US_EAST"
        class="event-navbar-button"
        @click="bottomLeftContainerButtonClick"
      >
        <div
          class="event-navbar-button-wrap"
          :class="getDarkModeClass()"
        >
          {{ t('이벤트') }}
        </div>
      </div>
      <EventModuleButton
        v-if="getStoreInfo.driveCallHide === 1"
        :title="'대리운전'"
        :icon="eventModuleIcons()"
        :isHyattTheme="true"
        :onClickHandler="onClickCallDriverButton"
      />

      <div
        v-if="!isUseLanguages()"
        class="language-navbar-button"
        :class="{ 'canada-env': IS_US_EAST }"
        @click="openModal(CUSTOM_LANGUAGE)"
      >
        <div
          class="language-navbar-button-wrap"
          :class="getDarkModeClass()"
        >
          <LanguageIcon
            id="language-sub-element-icon"
            :fill="isDarkMode ? '#fff' : '#5B5B5B'"
          />
          <span
            id="language-sub-element-text"
            class="language-title"
          >
            {{ getCurrentLanguage }}
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="isShowButton && !isNonOrderTable"
      class="button-right-container"
    >
      <div class="button-order-history">
        <HyattBottomBarButton
          v-if="init.storeInfo?.recentOrderHide === 0"
          :text="t('주문내역')"
          @click="checkGotoOrderHistory"
        />
      </div>
      <div
        class="button-cart"
        @click="openCartModal"
      >
        <HyattBottomBarButton :text="t('장바구니')"/>
        <div
          v-if="!isZeroCartQuantity"
          class="cart-quantity"
          @click="openCartModal"
        >
          {{ cartQuantity }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { pushPage } from '@utils/route.helper';
import { nullishCheck } from '@torder/common/utils';
import { cartProductType } from '@torder/common/interface/cartProduct';
import {
  CART,
  CUSTOM_LANGUAGE,
} from '@torder/common/constant';
import { getSubPrimaryColor } from '@torder/common';
import useTableStore from '@store/storeTable';
import useOrderListStore from '@store/storeOrderList';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import {
  customOrderHistory,
  customEventListPage,
} from '@router/routePaths';
import eventModule from '@composables/eventModule';
import EventModuleButton from '@components/buttons/EventModuleButton.vue';
import { HyattBottomBarButton } from '@components';
import { IS_US_EAST } from '@common/mode';
import LanguageIcon from '@assets/icn_language_select.vue';
import { checkOrderExist } from '@apis/orderData';

const {
  isShowButton = true,
  isFull = false,
} = defineProps<{
  isShowButton?: boolean,
  isFull?: boolean,
}>();

const {
  t,
  locale,
} = useI18n();

const { cartProducts } = storeToRefs(useCartStore());
const { orderList } = storeToRefs(useOrderListStore());

const {
  openModal,
  openAlert,
} = useModalStore();

const { setOrderList } = useOrderListStore();

const { getDarkModeClass } = useInitStore();
const {
  init,
  isDarkMode,
  getStoreInfo,
  backgroundColor,
  buttonBackgroundColor,
} = storeToRefs(useInitStore());

const { moveEventModulePage } = eventModule();

const { tableInfo } = storeToRefs(useTableStore());

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
  if (await checkOrderExist(getStoreInfo.value.storeCode, tableInfo.value.tabletId, setOrderList)) {
    pushPage(customOrderHistory);
    return;
  }

  openAlert(t('주문내역이 없습니다.'));
};

const isNonOrderTable = computed(() => {
  if (nullishCheck(tableInfo.value.orderAble)) return false;
  if (tableInfo.value.orderAble === 1) return false;
  return true;
});

const getPressedButtonColor = () => getSubPrimaryColor(backgroundColor.value, 10, 'Y');

const isFullWidth = computed(() => (isFull ? '100%' : '81.6%'));

const getCurrentLanguage = computed(() => {
  if (locale.value === 'en') return 'English';
  if (locale.value === 'jp') return '日本語';
  if (locale.value === 'chGan') return '简体';
  if (locale.value === 'chBun') return '繁體';

  return '한국어';
});

// 선택한 언어가 1개 이하일 경우 언어 설정 버튼 숨김처리
const isUseLanguages = () => init.value?.storeInfo?.languageList?.length < 2;

const onClickCallDriverButton = (): void => {
  moveEventModulePage('KDRIVE', 'video', 1);
};

const eventModuleIcons = (): string => {
  const iconBaseURL = 'https://static.torder.co.kr/torder2/';
  const iconFileName = isDarkMode.value ? 'icon_car_white.svg' : 'icon_car_black.svg';
  return `${iconBaseURL}${iconFileName}`;
};

const bottomLeftContainerButtonClick = () => {
  pushPage(customEventListPage);
};

</script>

<style lang='scss' scoped>
.bottom-navbar {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: v-bind(isFullWidth);
  font-family: 'Pretendard', sans-serif;
  background-color: v-bind(backgroundColor);

  .bottom-left-container {
    display: flex;
    height: 6.7188vw;

    .event-navbar-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.7813vw 0.4688vw 0.7813vw 1.5625vw;

      .event-navbar-button-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.0156vw 1.875vw;
        font-size: 2.3438vw;
        font-weight: 700;
        line-height: 3.125vw;
        color: #5B5B5B;
        letter-spacing: -0.0469vw;
        background-color: v-bind(backgroundColor);
        border: 0.0781vw solid #5B5B5B;
        border-radius: 0.9375vw;

        &.button-active {
          background-color: v-bind(getPressedButtonColor);
        }

        &.dark-mode {
          color: #fff;
          border: 0.0781vw solid #7A7A7A;

          &.button-active {
            background-color: v-bind(getPressedButtonColor);
          }
        }
      }
    }

    .language-navbar-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.7813vw 1.5625vw 0.7813vw 0.4688vw;

      .language-navbar-button-wrap {
        display: flex;
        gap: 0.7813vw;
        align-items: center;
        justify-content: center;
        padding: 1.0156vw 1.5625vw;
        color: #5B5B5B;
        background-color: v-bind(backgroundColor);
        border: 0.0781vw solid #5B5B5B;
        border-radius: 0.9375vw;

        #language-sub-element-icon {
          width: 2.6641vw;
          height: 2.6641vw;
        }

        .language-title {
          font-size: 2.3438vw;
          font-weight: 700;
          line-height: 3.125vw;
          letter-spacing: -0.0469vw;
        }

        &.button-active {
          background-color: v-bind(getPressedButtonColor);
        }

        &.dark-mode {
          color: #fff;
          border: 0.0781vw solid #7A7A7A;

          &.button-active {
            background-color: v-bind(getPressedButtonColor);
          }
        }
      }
    }

    .canada-env {
      padding: 0.7813vw 1.5625vw;
    }
  }

  .button-right-container {
    display: flex;

    .button-order-history {
      padding: 0.7813vw 0.4688vw 0.9375vw 1.5625vw;
    }

    .button-cart {
      position: relative;
      padding: 0.7813vw 1.5625vw 0.9375vw 0.4688vw;

      .cart-quantity {
        position: absolute;
        top: -0.625vw;
        right: 2.8125vw;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.8906vw;
        height: 2.8125vw;
        padding: 0.625vw;
        font-family: 'Pretendard', sans-serif;
        font-size: 1.5625vw;
        font-weight: 700;
        line-height: 1.5625vw;
        color: v-bind(buttonBackgroundColor);
        background-color: #fff;
        border-radius: 0.625vw;
        box-shadow: 0 0 0.4688vw 0 rgba(0, 0, 0, 0.25);
      }
    }
  }
}
</style>
