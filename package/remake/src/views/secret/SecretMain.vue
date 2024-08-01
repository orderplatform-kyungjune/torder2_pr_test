<script lang='ts' setup>
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { getTime } from '@utils/timeUtils';
import { pushPage } from '@utils/route.helper';
import {
  getStorage,
  removeStorage,
} from '@torder/common/utils';
import {
  TABLE,
  SECRET_MAIN,
  BANNER,
  U_CODE,
  THEME,
  CACHE_DATA,
  STORE,
  TYPE,
  TABLE_CODE,
  CART,
} from '@torder/common/constant';
import useVisitPeopleStore from '@store/storeVisitPeople';
import useThemeStore from '@store/storeTheme';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import useBannerStore from '@store/storeBanner';
import {
  tableSelect,
  login,
  banner,
} from '@router/routePaths';
import { useReviews } from '@containers/review';
import servingRobot from '@composables/servingRobot';
import {
  CloseButton,
  LoginNumberButton,
} from '@components';
import { IS_LOCAL } from '@common/mode';

const { robotCall } = servingRobot();
const { t } = useI18n();

const {
  latestUpdateTime,
  getBannerList,
} = storeToRefs(useInitStore());

const { handleCurrentBannerIndex } = useBannerStore();
const { resetOccupiedTable } = useVisitPeopleStore();

const {
  flag,
  openModal,
  closeModal,
} = (useModalStore());

const { entryPoint } = storeToRefs(useModalStore());

const { theme } = useThemeStore();

const { deleteCartProductAll } = useCartStore();

const formatTimeStamp = (time: number) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const format = `${year}-${month}-${day}`;

  return `${format} ${getTime(date)}`;
};

const reloadPage = () => {
  window.location.reload();
};

const changeTable = () => {
  // 장바구니 초기화
  closeModal(CART);
  deleteCartProductAll();
  resetOccupiedTable();
  pushPage(tableSelect);
  closeModal(SECRET_MAIN);
};

const getLogOut = () => {
  // 장바구니 초기화
  closeModal(CART);
  deleteCartProductAll();
  resetOccupiedTable();
  useReviews().clearReviewResult();

  removeStorage(U_CODE);
  removeStorage(TABLE);
  removeStorage(CACHE_DATA);
  removeStorage(STORE);
  removeStorage(THEME);
  removeStorage(TYPE);
  removeStorage(TABLE_CODE);
  removeStorage('orderUniqueData');

  pushPage(login);
};

const goToBanner = () => {
  if (getBannerList.value.length > 0) {
    pushPage(banner);
  }
  closeModal(SECRET_MAIN);
};

const returnRobotCall = () => {
  robotCall();
  closeModal(SECRET_MAIN);
};

const getUCode = getStorage(U_CODE);

const goToSelectTheme = () => {
  openModal(THEME);
  closeModal(SECRET_MAIN);
};
</script>

<template>
  <Teleport
    v-if="flag.secretMain"
    to="#modal"
  >
    <div class="secret-main-container">
      <div class="secret-main-header">
        <CloseButton
          :background="'#fff'"
          :class="theme.type"
          :color="'#000'"
          :content="t('닫기')"
          :theme-type="theme.type"
          borderRadius="1.2500vw"
          class="secret-main-close-btn"
          route="https://static.torder.co.kr/torder2/btn_close_black_25.2px.svg"
          @click="closeModal(SECRET_MAIN)"
        />
      </div>
      <div class="secret-main-contents">
        <!-- 진입점이 logo라면 해당 메뉴 노출 -->
        <!-- TODO : Secret, hooks, teleport 엮여 있는 구조 전면 개편 -->
        <div
          v-if="entryPoint === 'logo'"
          :class="theme.type"
          class="secret-main-option-list"
        >
          <LoginNumberButton
            v-if="entryPoint === 'logo'"
            :background="'#FFFFFF'"
            :color="'#0A0A0A'"
            :text="t('로봇퇴식호출')"
            @click="returnRobotCall"
          />
        </div>

        <div
          v-else
          :class="theme.type"
          class="secret-main-option-list"
        >
          <LoginNumberButton
            :background="'#FFFFFF'"
            :color="'#0A0A0A'"
            :text="t('새로고침')"
            @click="reloadPage"
          />
          <LoginNumberButton
            :background="'#FFFFFF'"
            :color="'#0A0A0A'"
            :text="t('테이블변경')"
            @click="changeTable"
          />
          <LoginNumberButton
            :background="'#FFFFFF'"
            :color="'#0A0A0A'"
            :text="t('로그아웃')"
            @click="getLogOut"
          />
          <LoginNumberButton
            :background="'#FFFFFF'"
            :color="'#0A0A0A'"
            :text="t('배너')"
            @click="goToBanner"
          />
          <LoginNumberButton
            v-if="IS_LOCAL"
            :background="'#FFFFFF'"
            :color="'#0A0A0A'"
            :text="t('테마 변경')"
            @click="goToSelectTheme"
          />
          <!-- <LoginNumberButton
            :text="t('키오스크 모드')"
            :background="'#fafafa'"
            :color="'#202020'"
          />
          <LoginNumberButton
            :text="t('키오스크 기능')"
            :background="'#fafafa'"
            :color="'#202020'"
          />
          <LoginNumberButton
            :text="t('업데이트')"
            :background="'#fafafa'"
            :color="'#202020'"
          />
          <LoginNumberButton
            :text="t('물리적 세로 테마 변경')"
            :background="'#fafafa'"
            :color="'#202020'"
          /> -->
        </div>
      </div>
      <div class="secret-main-bottom">
        <div class="secret-main-code">
          Latest Updated: {{ formatTimeStamp(latestUpdateTime) }}
        </div>
        <div class="secret-main-code">
          Uniq Code: {{ getUCode }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang='scss' scoped>
.secret-main-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);

  .secret-main-header {
    display: flex;
    justify-content: flex-end;
    height: 4.8vw;
    margin: 1vw;

    &.restaurant-vertical {
      .secret-main-close-btn {
        border-radius: 6.25vw;
      }
    }

    .secret-main-title {
      flex-grow: 1;
      padding: 0;
      margin-right: 1vw;
      overflow: hidden;
      font-size: 3vw;
      font-weight: 100;
      color: #fff;
      border-bottom: 0.1vw solid #fff;

      &.restaurant-vertical {
        height: 7.5vw;
        padding-top: 1.875vw;
        font-size: 2.5vw;
      }
    }
  }

  .secret-main-contents {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    align-items: center;
    justify-content: center;
    padding: 0 1vw 1vw;

    .secret-main-option-list {
      display: flex;
      flex-wrap: wrap;
      gap: 1.7969vw;
      justify-content: center;
      font-weight: 900;

      &.restaurant-vertical {
        flex-direction: column;
        width: 50vw;
      }
    }
  }

  .secret-main-bottom {
    margin-bottom: 1.5625vw;

    .secret-main-code {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2500vw;
      font-weight: 400;
      line-height: 1.5625vw;
      color: rgba(255, 255, 255, 0.50);
      letter-spacing: -0.0375vw;
    }
  }
}
</style>
