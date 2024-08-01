<template>
  <slot/>
  <BasicConfirmModal/>
  <ModalSelectLanguage/>
  <ModalSelectTheme/>
  <SecretLogin/>
  <SecretMain/>
  <StaffCallCheck/>
  <VisitResetConfirm/>
  <VisitSelectConfirm/>
  <TimerMessageModal v-if="timerFlag && isTimerMessageShow()"/>
  <div
    :class="themeColor"
    class="main-layout-container"
  >
    <div
      class="main-layout-menu-logo"
      @click="onNextSecretReturnRobot"
    >
      <img
        :src="getMainLogoImage()"
        alt="티오더 메인 로고"
        class="main-logo-img"
      >
    </div>
    <div class="main-layout-header-wrap">
      <div
        v-if="!isActiveCart && isVisitPeopleUse"
        class="total-person-container"
      >
        <div class="total-person-title">
          {{ t('총 인원 입력') }}
        </div>
        <div class="total-person-count-wrap">
          <span class="total-person-count">
            {{ totalVisitPeople }}
          </span>
          <span class="total-person-text">
            {{ t('명') }}
          </span>
        </div>
      </div>
      <BasicLayoutStoreTableInfo
        :cartActive="isActiveCart"
        :storeName="getStoreName()"
        :tableName="getInitTableName()"
        :theme-color="themeColor"
        :title="t('테이블명')"
        @click="onNextSecret"
      />
    </div>
    <BasicCategoryFirstList/>
    <BasicCategorySubList/>
    <ProductContainer/>
    <div
      v-if="masterStaffCallOption === 0"
      :class="{
        vertical: scrollDirection === 'vertical',
        horizontal: scrollDirection === 'horizontal',
      }"
      class="call-staff-button"
      @click="openStaffCallCheckModal"
    >
      {{ t('직원 호출') }}
    </div>
    <div
      v-else-if="masterStaffCallOption === 1"
      :class="{
        vertical: scrollDirection === 'vertical',
        horizontal: scrollDirection === 'horizontal',
      }"
      class="call-staff-button"
      @click="openStaffCall"
    >
      {{ t('직원 호출') }}
    </div>
    <div v-else/>
    <BasicLayoutPersonButton
      v-if="isVisitPeopleUse"
      :content="totalVisitPeople > 0 ? t('방문 인원 변경') : t('총 인원 입력')"
      :getPersonBottomPosition="getPersonBottomPosition"
      :isChangeFontSize="isChangeFontSize"
      @click="openModal(VISIT_PEOPLE)"
    />
    <div
      v-if="robotUse === 1"
      class="robot-call-button"
      @click="robotHealCheck()"
    >
      {{ t('로봇 호출') }}
    </div>
    <DefaultBottomNavBar/>
    <img
      v-if="init.storeInfo.backgroundImgUrl"
      :src="init.storeInfo.backgroundImgUrl"
      alt="상점 배경 이미지"
      class="backImgLogo-background"
    >
    <img
      v-else-if="isBlack()"
      :src="MAIN_BACKGROUND_URL"
      alt="다크 테마 상점 배경이미지"
      class="backImgLogo-background"
    >
    <div
      v-else
      :class="themeColor"
      class="backImgLogo-background"
    />
    <LayoutFloatingList/>
    <CartContainer/>
  </div>
</template>

<script lang="ts" setup>
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
  VisitResetConfirm,
  VisitSelectConfirm,
} from '@views';
import { scrollCloseCartModal } from '@utils/scrollUtils';
import { pushPage } from '@utils/route.helper';
import { afterMountedScreenSaver } from '@utils/mountScreenSaver';
import { getMainLogoImage } from '@utils/logoUtils';
import {
  getStorage,
  getStoreName,
  getInitTableName,
} from '@torder/common/utils';
import {
  BLACK,
  CACHE_DATA,
  STAFF_CALL_CHECK,
  MAIN_BACKGROUND_URL,
  VISIT_PEOPLE,
} from '@torder/common/constant';
import useVisitPeopleStore from '@store/storeVisitPeople';
import useThemeStore from '@store/storeTheme';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import { staffCall } from '@router/routePaths';
import CartContainer from '@containers/cart/CartContainer.vue';
import DefaultBottomNavBar from '@containers/bottomBar/DefaultBottomNavBar.vue';
import {
  BasicCategoryFirstList,
  BasicCategorySubList,
  ModalSelectTheme,
  ProductContainer,
  ModalSelectLanguage,
  LayoutFloatingList,
  BasicConfirmModal,
  TimerMessageModal,
} from '@containers';
import servingRobot from '@composables/servingRobot';
import { useSecret } from '@composables/secret';
import {
  BasicLayoutPersonButton,
  BasicLayoutStoreTableInfo,
} from '@components';

const {
  t,
  locale,
} = useI18n();

const {
  openModal,
  isTimerMessageShow,
} = useModalStore();

const {
  init,
  getStoreInfo,
  timerFlag,
} = storeToRefs(useInitStore());

const {
  onNextSecret,
  onNextSecretReturnRobot,
} = useSecret();

const { isActiveCart } = storeToRefs(useCartStore());
const { robotHealCheck } = servingRobot();

const { theme } = storeToRefs(useThemeStore());

const { totalVisitPeople } = storeToRefs(useVisitPeopleStore());

const openStaffCallCheckModal = () => {
  openModal(STAFF_CALL_CHECK);
};

const themeType = computed(() => theme.value?.type);

const scrollDirection = computed(() => {
  if (themeType.value === 'horizontal') return 'horizontal';

  return 'vertical';
});

const themeColor = computed(() => (theme.value?.color));

const isBlack = () => themeColor.value === BLACK;

const storeInfo = getStorage(CACHE_DATA) as string;

const isServiceItem = computed(() => {
  const serviceItemLength = init.value.serviceList?.childCategoryList.length;

  return serviceItemLength > 0;
});

const openStaffCall = () => {
  if (!isServiceItem.value) {
    openModal(STAFF_CALL_CHECK);
    return;
  }

  pushPage(staffCall);
};

const masterStaffCallOption = computed(() => {
  const staffCallOption = getStoreInfo.value?.serviceCategoryType;

  if (!staffCallOption) {
    return JSON.parse(storeInfo).storeInfo?.serviceCategoryType;
  }

  return staffCallOption;
});

const robotUse = computed(() => {
  const { robotUse } = getStoreInfo.value.robotInfo;
  return robotUse;
});

// 인원수 관련
const isVisitPeopleUse = computed(() => {
  const isVisitPeople = getStoreInfo.value.visitconfig?.visitBookUse;

  return isVisitPeople === 1;
});

// 방문 인원수 변경 버튼 영어 번역일 경우 텍스트 길이가 길어져 줄바꿈 관련 로직
const isChangeFontSize = () => locale.value === 'en' && totalVisitPeople.value > 0;

// 인원 수 버튼 위치 동적 클래스
const getPersonBottomPosition = () => {
  if (robotUse.value === 1) {
    return '14.2188vw';
  }
  return '7.5vw';
};

onMounted(() => {
  const guideElement = document.querySelector('.initial-guide-container') as HTMLElement;
  guideElement.style.display = 'none';

  const product = document.querySelector('.product-container') as HTMLElement;

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
.main-layout-container {
  display: flex;
  max-height: 75vw;
  font-family: 'Pretendard', sans-serif;

  .main-layout-menu-logo {
    position: fixed;
    top: 0;
    left: 1.5625vw;
    z-index: 24;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 16.328125vw;
    height: 5vw;
  }

  .main-logo-img {
    max-width: 15.3125vw;
    max-height: 3.75vw;
    object-fit: contain;
  }

  .main-layout-header-wrap {
    position: fixed;
    top: 0;
    right: 1.5625vw;
    z-index: 20;
    display: flex;
    gap: 1.25vw;
    align-items: flex-start;

    .total-person-container {
      display: flex;
      flex-direction: column;
      gap: 0.3125vw;
      align-items: center;
      justify-content: flex-end;
      padding: 0.625vw 0.9375vw 0.4688vw 0.9375vw;
      background: linear-gradient(103deg, #B400FF -0.64%, #005DFF 110.52%);
      border-radius: 0 0 0.9375vw 0.9375vw;
      box-shadow: 0 -0.1172vw 0.0781vw 0 rgba(0, 0, 0, 0.25) inset, 0 0.1563vw 0.3125vw 0 rgba(0, 0, 0, 0.25);

      .total-person-title {
        font-size: 1.0938vw;
        font-weight: 500;
        line-height: 1.7188vw;
        color: #fff;
        letter-spacing: -0.0219vw;
      }

      .total-person-count-wrap {
        display: flex;
        align-items: baseline;
        justify-content: center;
        min-width: 6.5625vw;

        .total-person-count {
          font-size: 3.75vw;
          font-weight: 700;
          color: #fff;
          text-align: center;
          letter-spacing: -0.075vw;
        }

        .total-person-text {
          font-size: 1.4063vw;
          font-weight: 600;
          line-height: normal;
          color: #fff;
          text-align: center;
          letter-spacing: -0.0281vw;
        }
      }
    }
  }

  .container-bottom-menu {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 10;
    box-sizing: border-box;
    min-width: 100vw;
    height: 5.4688vw;
    padding-left: 16.375vw;
    background-color: #000;

    ul {
      display: flex;
      gap: 1.5625vw;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0;
      margin: auto 0;
      list-style: none;

      .wrap-left-menu {
        display: flex;
        flex: 0.65;
        align-items: center;
        justify-content: flex-start;

        .button {
          position: relative;
          display: flex;
          align-items: center;
          height: 3.75vw;
          margin-left: 1.5vw;

          &.event {
            font-weight: 700;
          }

          &.drive {

            &::before {
              display: block;
              width: .1563vw;
              height: 50%;
              content: '';
              background-color: rgba($color: #fff, $alpha: 0.6);
            }
          }

          .icon {
            flex: 1;
            margin-top: 0.5vw;
          }

          .text {
            flex: 1;
            margin: 0 0.3906vw 0 2vw;
            font-size: 1.875vw;
            line-height: 1.5;
            color: #fff;
          }

          .dot-icon {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;

            .dot {
              width: .3906vw;
              height: .3906vw;
              background-color: #fff;
              border-radius: 50%;

              &:nth-child(1) {
                margin: 0 0 .1563vw;
              }

              &:nth-child(2) {
                margin: .1563vw 0;
              }

              &:nth-child(3) {
                margin: .1563vw 0 0;
              }
            }
          }

          .red-highlight {
            position: absolute;
            top: 0.3906vw;
            right: -0.5vw;
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
        flex: 1;
        align-items: center;
        justify-content: flex-end;
        color: #fff;

        .button {
          position: relative;
          display: flex;
          align-items: center;
          line-height: 1.7;

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
            width: 2.8vw;
            height: 2.8vw;
            font-size: 1.5625vw;
            font-weight: 700;
            color: #fff;
            letter-spacing: 0.0586vw;
            background-color: #F91515;
            border-radius: 0.7813vw;
            animation: buttonCount 0.8s 0s infinite ease-in-out alternate;
          }

          .icon {
            flex: 1;
            margin-top: 0.5vw;
          }

          .text {
            margin: 0 3.5vw 0 0.7031vw;
            font-size: 1.875vw;
            line-height: 1.5;
          }
        }
      }
    }
  }

  .robot-call-button {
    position: absolute;
    bottom: 7.5000vw;
    left: 1.5625vw;
    z-index: 22;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14.6875vw;
    height: 5.4688vw;
    font-size: 2.3438vw;
    font-weight: 700;
    line-height: 2.9688vw;
    color: #fff;
    letter-spacing: -0.0469vw;
    background: linear-gradient(103deg, #B400FF -0.64%, #005DFF 110.52%);
    border-radius: 0.7813vw;

    &.button-active {
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(103deg, #B400FF -0.64%, #005DFF 110.52%);
    }
  }

  .call-staff-button {
    position: fixed;
    bottom: .7813vw;
    left: 1.5625vw;
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14.7656vw;
    height: 5.4688vw;
    font-size: 2.3438vw;
    font-weight: 700;
    color: #fff;
    text-align: center;
    letter-spacing: -0.0469vw;
    background-color: #F91515;
    border-radius: 0.7813vw;

    &.button-active {
      background-color: #D60505;
    }
  }
}

.backImgLogo-background {
  position: absolute;
  box-sizing: border-box;
  width: 100vw;
  height: 62.5vw;
  background-repeat: repeat;
  background-position: 50%;
  background-size: cover;

  &.white {
    background-color: #f3f3f3;
  }
}
</style>
