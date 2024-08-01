<template>
  <slot/>
  <ModalSelectTheme/>
  <div class="total-wrap">
    <aside class="left-container">
      <div class="top-side-wrap">
        <div class="main-layout-menu-wrap vertical">
          <div class="main-layout-hamburger-btn">
            <img src="https://static.torder.co.kr/torder2/svg_menu_normal_white_57px.svg">
          </div>
          <div class="main-layout-menu-logo">
            <img src="https://static.torder.co.kr/torder2/svg_torderlogo_all_white_82px.svg">
          </div>
        </div>
        <RestaurantCategoryFirstList class="layout-main-category"/>
      </div>
      <div
        v-if="!isCardType"
        class="bottom-side-wrap"
      >
        <!-- 총인원입력 임시주석 -->
        <!-- <div class="total-people-count">
          <TablePeopleCount
            :peopleCount="5"
            :totalPeople="translatedTotalPeople"
            :people="translatedPeople"
          />
        </div> -->
        <div class="staff-call-wrap">
          <div
            v-if="masterStaffCallOption === 0"
            class="toolbox-advertise-count-staff-call"
            @click="openStaffCallCheckModal"
          >
            {{ t('직원 호출') }}
          </div>
          <div
            v-else-if="masterStaffCallOption === 1"
            class="toolbox-advertise-count-staff-call"
            @click="openStaffCall"
          >
            {{ t('직원 호출') }}
          </div>
          <div
            v-else
            class="toolbox-advertise-count-staff-call-hidden"
          >
            {{ t('직원 호출') }}
          </div>
        </div>
      </div>
    </aside>
    <main class="middle-container">
      <div class="middle-header">
        <RestaurantCategorySubList/>
      </div>
      <div class="middle-body">
        <ProductContainer/>
      </div>
      <div
        v-if="!isCardType"
        class="middle-tool-box"
        :class="isActiveCartBind"
      >
        <RestaurantToolBoxSimple/>
      </div>
    </main>
    <aside
      class="right-container"
      :class="[RESTAURANT_HORIZONTAL_CARD, isActiveCartBind]"
    >
      <RestaurantToolBox v-if="isCardType"/>
      <CartContainer/>
    </aside>
  </div>
  <SecretLogin/>
  <SecretMain/>
  <StaffCallCheck/>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import {
  computed,
  onMounted,
  onUnmounted,
} from 'vue';
import { storeToRefs } from 'pinia';

import {
  SecretLogin,
  SecretMain,
  StaffCallCheck,
} from '@views';
import { pushPage } from '@utils/route.helper';
import { afterMountedScreenSaver } from '@utils/mountScreenSaver';
import { getStorage } from '@torder/common/utils';
import {
  CACHE_DATA,
  STAFF_CALL_CHECK,
  RESTAURANT_HORIZONTAL_CARD,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import { staffCall } from '@router/routePaths';
import RestaurantCategorySubList from '@containers/category/RestaurantCategorySubList.vue';
import CartContainer from '@containers/cart/CartContainer.vue';
import {
  ProductContainer,
  RestaurantCategoryFirstList,
  RestaurantToolBoxSimple,
  ModalSelectTheme,
  RestaurantToolBox,
} from '@containers';
// 임시주석
// import { TablePeopleCount } from '@components';

const { t } = useI18n();

const { openModal } = useModalStore();

const {
  getStoreInfo,
  init,
  categoryBackgroundColor,
  categoryBackgroundImage,
  staffCallBackgroundColor,
  staffCallFontColor,
} = storeToRefs(useInitStore());

const { isActiveCart } = storeToRefs(useCartStore());

const { theme } = useThemeStore();

const isActiveCartBind = computed(() => {
  const activeCart = { 'active-cart': isActiveCart.value };

  return activeCart;
});

const storeInfo = getStorage(CACHE_DATA) as string;

// 총인원입력 임시주석
// const translatedTotalPeople = t('총 인원');
// const translatedPeople = t('명');

const masterStaffCallOption = computed(() => {
  const { serviceCategoryType: staffCallOption } = getStoreInfo.value;

  if (staffCallOption === undefined) {
    return JSON.parse(storeInfo).storeInfo?.serviceCategoryType;
  }

  return staffCallOption;
});

const isServiceItem = computed(() => {
  const serviceItemLength = init.value.serviceList?.childCategoryList.length;

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

const openStaffCallCheckModal = () => {
  openModal(STAFF_CALL_CHECK);
};

// 카드 테마인지 확인
const isCardType = computed(() => theme.type === RESTAURANT_HORIZONTAL_CARD);

onMounted(() => {
  const guideElement = document.querySelector('.initial-guide-container') as HTMLElement;
  guideElement.style.display = 'none';

  const product = document.querySelector('.middle-body') as HTMLElement;

  const {
    screenDisplayTimer,
    cartResetTimer,
  } = afterMountedScreenSaver(product, init);

  onUnmounted(() => {
    clearInterval(screenDisplayTimer.value);
    clearInterval(cartResetTimer.value);
  });
});
</script>

<style lang='scss' scoped>
.total-wrap {
  display: flex;
  width: 100vw;
  height: 100vh;

  .left-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 18.5%;
    background-color: v-bind(categoryBackgroundColor);
    background-image: v-bind(categoryBackgroundImage);
    // background-image: url('https://static.torder.co.kr/torder2/img_background_black_1280px.svg');
    background-position: center center;
    background-size: cover;
    border-radius: 0 2.34375vw 0 0 ;

    .top-side-wrap {
      height: 75%;
    }

    .bottom-side-wrap {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 20%;
    }

    .main-layout-menu-wrap {
      display: flex;
      align-items: center;
      height: 7%;
      margin-top: 2.734375vw;
      margin-bottom: 0.78125vw;
    }

    .layout-main-category {
      height: 90%;
    }

    .total-people-count {
      margin: 1.5625vw;
      margin-bottom: 0;
    }

    .staff-call-wrap {
      margin: 1.5625vw;
    }

    .toolbox-advertise-count-staff-call {
      padding: 1.1719vw 0;
      font-family: 'Noto Serif KR', sans-serif;
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
      font-family: 'Noto Serif KR', sans-serif;
      font-size: 2.0313vw;
      font-weight: 600;
      color: v-bind(staffCallFontColor);
      text-align: center;
      letter-spacing: -0.0406vw;
      background-color: v-bind(staffCallBackgroundColor);
      border-radius: 1.1719vw
    }
  }

  .middle-container {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 2.7344vw 2.3438vw 0;
    overflow: auto;

    .middle-header {
      height: 10%;
      margin-bottom: 1vw;
    }

    .middle-body {
      flex-grow: 1;
      overflow-y: auto;
    }

    .middle-tool-box {
      position: absolute;
      right: 0.7813vw;
      bottom: 0.7813vw;
    }
  }

  .right-container {
    display: none;

    &.restaurant-horizontal-card {
      display: block;
    }

    &.active-cart {
      position: relative;
      display: block;
      width: 23.5%;
    }
  }
}
</style>
