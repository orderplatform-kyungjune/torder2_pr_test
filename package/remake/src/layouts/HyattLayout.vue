<template>
  <slot/>
  <CustomConfirmModal/>
  <ModalSelectTheme/>
  <HyattSecretLogin/>
  <CustomStaffCallCheck/>
  <CustomModalSelectLanguage/>
  <TimerMessageModal v-if="timerFlag && isTimerMessageShow()"/>
  <!-- 시크릿 메인은 하얏트 전용 x -->
  <SecretMain/>
  <div class="total-wrap">
    <aside class="left-container">
      <div
        :style="{ 'background-image': 'url(' + categoryBackgroundImage + ')' }"
        class="left-part-background"
      />
      <div class="main-layout-menu-container">
        <div
          class="main-layout-logo"
          @click="onNextSecretReturnRobot"
        >
          <img
            :src="getMainLogoImage()"
            alt="메인 로고 이미지"
            class="main-layout-logo-image"
          >
        </div>
        <div class="main-layout-table-name">
          <!-- 커스텀 테마의 상점명이 길어지면 줄바꿈처리 되지 않고 하단 영역으로 늘어난다. -->
          <span class="main-layout-table-name-text">
            {{ getStoreInfo.storeName }}
          </span>
        </div>
      </div>
      <HyattCategoryFirstList/>
      <!--      TODO 운영망 배포 전으로 인해 테스트 robotInfo?.robotUse-->
      <div
        v-if="robotInfo?.robotUse === 1"
        class="staff-call-button-wrap robot"
        @click="robotHealCheck"
      >
        <img
          id="robot-call-button-sub-element-icon"
          alt="로봇호출 아이콘"
          src="https://static.torder.co.kr/torder2/icn_robot_call_face.svg"
        >
        <span class="staff-call-only-text">{{ t('로봇 호출') }}</span>
      </div>
      <div
        v-if="masterStaffCallOption() !== 2"
        :class="getDarkModeClass()"
        class="staff-call-button-wrap"
        @click="staffCallFunction"
      >
        <img
          id="staff-call-button-sub-element-icon"
          alt="종 아이콘"
          src="https://static.torder.co.kr/torder2/icn_staff_call_bell.svg"
        >
        <span
          id="staff-call-button-sub-element-text"
          class="staff-call-only-text"
        >
          {{ t('직원 호출') }}
        </span>
      </div>
    </aside>
    <main class="middle-container">
      <CustomTableTag
        :tableInfo="getInitTableName()"
        @click="onNextSecret"
      />
      <HyattCategorySubList/>
      <HyattProductContainer
        @touchstart="scrollStart"
        @touchend="scrollEnd"
      />
      <div>
        <HyattBottomBar
          :isFull="bottomBarConfig.isFull"
          :isShowButton="bottomBarConfig.isShowButton"
        />
      </div>

      <CustomThemeFloatingList class="floating-list"/>
    </main>
    <aside
      v-if="isActiveCartBind"
      :class="isActiveCartBind"
      class="right-container"
    >
      <HyattCartContainer/>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import {
  HyattSecretLogin,
  SecretMain,
  CustomStaffCallCheck,
} from '@views';
import { scrollCloseCartModal } from '@utils/scrollUtils';
import { pushPage } from '@utils/route.helper';
import { afterMountedScreenSaver } from '@utils/mountScreenSaver';
import { getMainLogoImage } from '@utils/logoUtils';
import {
  getStorage,
  getInitTableName,
  getSubPrimaryColor,
} from '@torder/common/utils';
import {
  CACHE_DATA,
  CUSTOM_STAFF_CALL_CHECK,
} from '@torder/common/constant';
import useTableStore from '@store/storeTable';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import useBottomNavBarStore from '@store/storeBottomBar';
import { internationalStaffCall } from '@router/routePaths';
import CustomThemeFloatingList from '@containers/shared/CustomThemeFloatingList.vue';
import {
  HyattCartContainer,
  HyattCategoryFirstList,
  HyattCategorySubList,
  HyattProductContainer,
  HyattBottomBar,
  ModalSelectTheme,
  CustomModalSelectLanguage,
  CustomConfirmModal,
  TimerMessageModal,
} from '@containers';
import servingRobot from '@composables/servingRobot';
import { useSecret } from '@composables/secret';
import TimeSchedule from '@composables/TimeSchedule';
import { CustomTableTag } from '@components';

const { robotHealCheck } = servingRobot();
const { t } = useI18n();

const {
  onNextSecret,
  onNextSecretReturnRobot,
} = useSecret();

const { bottomBarConfig } = useBottomNavBarStore();

const { isActiveCart } = storeToRefs(useCartStore());

const {
  getStoreInfo,
  init,
  timerFlag,
  checkCustomStyleUse,
  categoryBackgroundColor,
  categoryBackgroundImage,
  backgroundColor,
} = storeToRefs(useInitStore());

/// [[[ float list 에 대한 Control
const floatListOpacity = ref<number>(1);
const countScrollEnd = () => {
  floatListOpacity.value = 1;
};
const timeSchedule = new TimeSchedule();
const scrollStart = () => {
  floatListOpacity.value = 0;
  timeSchedule.removeScheduleContext(countScrollEnd);
};
const scrollEnd = () => {
  timeSchedule.updateScheduleContext(countScrollEnd, [Date.now() + 2_000]);
};
onMounted(() => {
  timeSchedule.startSchedule();
  onUnmounted(() => {
    timeSchedule.endSchedule();
  });
});

const { getDarkModeClass } = useInitStore();

const { tableInfo } = storeToRefs(useTableStore());
const { robotInfo } = getStoreInfo.value;

const {
  openModal,
  isTimerMessageShow,
} = useModalStore();

const storeInfo = getStorage(CACHE_DATA) as string;

const isOrderTable = () => tableInfo.value.orderAble && tableInfo.value.orderAble === 1;

// 직원 호출 버튼 설정 (1: 직원만 호출, 2: 서비스 상품 노출, 3: 직원호출 미사용)
const masterStaffCallOption = () => {
  const { serviceCategoryType: staffCallOption } = getStoreInfo.value;

  if (staffCallOption === undefined) {
    return JSON.parse(storeInfo).storeInfo?.serviceCategoryType;
  }

  return staffCallOption;
};

const staffCallFunction = () => {
  if (masterStaffCallOption() === 0 && isOrderTable()) {
    openModal(CUSTOM_STAFF_CALL_CHECK);
  } else if (masterStaffCallOption() === 1 && isOrderTable()) {
    pushPage(internationalStaffCall);
  }
};

const getSubCategoryColor = computed(() => getSubPrimaryColor(categoryBackgroundColor.value, 14, checkCustomStyleUse.value ? 'Y' : 'N'));

const isActiveCartBind = computed(() => ({ 'active-cart': isActiveCart.value }));

onMounted(() => {
  const guideElement = document.querySelector('.initial-guide-container') as HTMLElement;
  guideElement.style.display = 'none';

  const product = document.querySelector('.middle-body') as HTMLElement;

  const {
    screenDisplayTimer,
    cartResetTimer,
  } = afterMountedScreenSaver(product, init);

  scrollCloseCartModal(true);

  onUnmounted(() => {
    clearInterval(screenDisplayTimer.value);
    clearInterval(cartResetTimer.value);
    scrollCloseCartModal(false);
  });
});
</script>

<style lang="scss" scoped>
.total-wrap {
  display: flex;
  width: 100vw;
  height: 100vh;
  font-family: 'Pretendard', sans-serif;

  .left-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 18.4375vw;

    .left-part-background {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-color: v-bind(categoryBackgroundColor);
      background-image: url(v-bind((categoryBackgroundImage)));
      background-position: center;
      background-size: cover;
    }

    .main-layout-menu-container {
      display: flex;
      flex-direction: column;
      gap: 1.25vw;
      padding: 1.25vw 1.5625vw 0.7813vw 1.5625vw;

      .main-layout-logo {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .main-layout-logo-image {
          z-index: 20;
          object-fit: contain;
          max-width: 15.3125vw;
          max-height: 3.75vw;
          filter: drop-shadow(0 0.0781vw 0.5469vw rgba(0, 0, 0, 0.55));
        }
      }

      .main-layout-table-name {
        display: flex;
        align-items: center;
        padding: 0.7813vw;
        background-color: v-bind(getSubCategoryColor);
        border-radius: 0.625vw;
        box-shadow: -0.0781vw 0.1563vw 0.2344vw 0 rgba(0, 0, 0, 0.25) inset;

        .main-layout-table-name-text {
          width: 13.75vw;
          font-size: 1.25vw;
          font-weight: 700;
          line-height: 1.5625vw;
          color: #FFF;
          letter-spacing: -0.0562vw;
          word-break: break-all;
        }
      }
    }

    .staff-call-button-wrap {
      display: flex;
      gap: 0.7813vw;
      align-items: center;
      justify-content: center;
      padding: 1.7188vw 1.5625vw 1.875vw 0.7813vw;
      background-color: #313131;

      .staff-call-only-text {
        font-size: 2.3438vw;
        font-weight: 700;
        line-height: 3.125vw;
        color: #FFF;
        letter-spacing: -0.0469vw;
      }

      &.button-active {
        background-color: #494949;
      }

      &.dark-mode {
        background-color: #454545;

        &.button-active {
          background-color: #5B5B5B;
        }
      }

    }

    .robot {
      background-color: #5B5B5B;

      &.button-active {
        background-color: #7A7A7A;
      }
    }
  }

  .middle-container {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 1.25vw 1.5625vw;
    overflow: auto;
    background-color: v-bind(backgroundColor);
  }

  .right-container {
    z-index: 20;
    display: none;

    &.active-cart {
      position: absolute;
      right: 0;
      display: block;
      width: 25vw;
      height: 100%;
    }
  }
}

.floating-list {
  opacity: v-bind(floatListOpacity);
  -moz-transition: opacity .25s ease-in-out;
  -webkit-transition: opacity .25s ease-in-out;
  transition: opacity .25s ease-in-out;
}
</style>
