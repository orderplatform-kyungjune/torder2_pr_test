<template>
  <FlashModal
    v-if="flag.flash"
    :content="getAlertContent"
  />
  <div
    class="table-container"
    :class="theme.type"
  >
    <div
      class="table-header"
      :class="theme.type"
    >
      <div
        class="table-header-title"
        :class="theme.type"
      >
        {{ t('테이블 선택') }}
      </div>
      <CloseButton
        class="close-btn"
        :theme-type="theme.type"
        :color="isRestaurantVertical ? '#fff' : '#000'"
        :background="isRestaurantVertical ? '#000' : '#fff'"
        :route="getImageURL()"
        :content="t('닫기')"
        @click="clickCloseButton"
      />
    </div>
    <div class="table-contents">
      <div class="table-contents-function-layout">
        <template v-if="!isRestaurantVertical">
          <RestaurantHorizontalScreenTableButton
            :title="t('테이블 정보 다시 불러오기')"
            :active="'passive'"
            :theme="theme.type"
            @click="getRecallTableInfo()"
          />
          <RestaurantHorizontalScreenTableButton
            :title="t('로그아웃')"
            :active="'passive'"
            :theme="theme.type"
            @click="getLogout"
          />
        </template>
      </div>
      <div
        class="table-button-grid"
        :class="theme.type"
      >
        <div
          v-for="(table, index) in tableData"
          :key="getTableKey(table, index)"
        >
          <RestaurantHorizontalScreenTableButton
            :title="getTableTitle(table)"
            :active="getPaymentTableStyle(table.credit)"
            :theme="theme.type"
            @click="getInitData(table)"
          />
        </div>
      </div>
    </div>
    <div
      v-if="isRestaurantVertical"
      class="table-control-bar"
    >
      <button @click="getLogout">
        로그아웃
      </button>
      <button @click="getRecallTableInfo()">
        테이블 정보 다시 불러오기
      </button>
    </div>
  </div>
  <div class="web-version">
    {{ currentWebVersion }}
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import {
  computed,
  onMounted,
  ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import { pushPage } from '@utils/route.helper';
import {
  setStorage,
  getStoreCode,
  removeStorage,
  getStorage,
} from '@torder/common/utils';
import { initTableInfoType } from '@torder/common/interface/login';
import {
  RESTAURANT_VERTICAL,
  TABLE,
  SECRET_MAIN,
  STOP_EXPOSURE,
  STORE,
  TABLE_CODE,
  U_CODE,
  CACHE_DATA,
  THEME,
  TYPE,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useTableStore from '@store/storeTable';
import useModalStore from '@store/storeModal';
import useBannerStore from '@store/storeBanner';
import {
  home,
  login,
} from '@router/routePaths';
import { FlashModal } from '@containers';
import {
  RestaurantHorizontalScreenTableButton,
  CloseButton,
} from '@components';
import { requestSelectInit } from '@apis/tabletData';

const {
  flag,
  getAlertContent,
  openAlert,
  closeModal,
} = useModalStore();

const { setTableInfo } = useTableStore();

const { t } = useI18n();

const { theme } = storeToRefs(useThemeStore());

const currentWebVersion = window.location.pathname === '/' ? '/v' : window.location.pathname;

const isRestaurantVertical = computed(() => theme.value?.type === RESTAURANT_VERTICAL);

const { handleCurrentBannerIndex } = useBannerStore();

const getImageURL = () => {
  if (!isRestaurantVertical.value) {
    return 'https://static.torder.co.kr/torder2/btn_close_black_25.2px.svg';
  }

  return 'https://static.torder.co.kr/torder2/btn_close_white_25.2px.svg';
};

const tableData = ref<initTableInfoType[]>([]);

// init 테이블리스트 조회
const getSelectInitTableList = async () => {
  try {
    const res = await requestSelectInit(getStoreCode(), 'tabletList');
    tableData.value = res.data?.tabletList;
  } catch (error) {
    console.log(error);
  }
};

const setTableInformation = (table: initTableInfoType) => {
  const tableJson = JSON.stringify(table);
  setStorage(TABLE, tableJson);
  setTableInfo(table);
};

const getInitData = async (table: initTableInfoType) => {
  // 테이블 변경시 영상배너 다시보지않기 배너 리스트 제거
  removeStorage(STOP_EXPOSURE);
  setStorage(TABLE_CODE, table.tabletId);
  setTableInformation(table);
  // 테이블 선택 시 LayoutHub로 이동하고 배너/로고/메인 판단은 LayoutHub에서 판단
  pushPage(home);
  closeModal(SECRET_MAIN);

  handleCurrentBannerIndex(0);
};

// 선결제 사용하는 테이블 보라색 적용
const getPaymentTableStyle = (credit: number) => (credit ? 'passive active' : 'passive');

// 테이블 정보 다시 불러오기
const getRecallTableInfo = () => {
  getSelectInitTableList();
  openAlert(t('테이블 정보를 불러왔습니다.'));
};

const getLogout = () => {
  removeStorage(U_CODE);
  removeStorage(TABLE);
  removeStorage(CACHE_DATA);
  removeStorage(STORE);
  removeStorage(THEME);
  removeStorage(TYPE);
  removeStorage(TABLE_CODE);

  pushPage(login);
};

const clickCloseButton = () => {
  const table = getStorage(TABLE);
  if (!table) {
    openAlert(t('테이블을 선택해주세요.'));
    return;
  }
  pushPage(home);
};

const getTableKey = (table: initTableInfoType, index: number) => {
  const key = table.tabletId;

  if (key) return key;
  const defaultKey = `table${index}`;

  return defaultKey;
};

const getTableTitle = (item: initTableInfoType) => {
  const title = item.TabletName;

  if (title) return title;
  const message = t('정보가 없습니다.');

  return message;
};

onMounted(() => {
  const guideElement = document.querySelector('.initial-guide-container') as HTMLElement;
  guideElement.style.display = 'none';
});

getSelectInitTableList();
</script>

<style lang='scss' scoped>
.table-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 62.5vw;
  font-family: "Noto Sans SC", sans-serif;
  background-color: rgba(0, 0, 0, 0.8);

  &.restaurant-vertical {
    height: 160vw;
    background-color: #000;
  }

  .table-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    height: 4.8vw;
    margin: 1vw;

    &.restaurant-vertical {
      margin-top: 3.75vw;

      .close-btn {
        position: absolute;
        top: 0;
        left: 0;
      }
    }

    .table-header-title {
      flex-grow: 1;
      padding: 0;
      margin-right: 1vw;
      overflow: hidden;
      font-size: 3vw;
      font-weight: 100;
      color: #fff;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-bottom: 0.1vw solid #fff;

      &.restaurant-vertical {
        height: 7.5vw;
        padding-top: 1.875vw;
        font-size: 2.5vw;
        font-weight: bold;
        text-align: center;
        border: none;
      }
    }
  }

  .table-contents {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 1vw 1vw;
    overflow: hidden;

    .table-contents-function-layout {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .table-button-grid {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      overflow: scroll;

      &.restaurant-vertical {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
      }
    }
  }

  .table-control-bar {
    display: grid;
    grid-template-columns: 1fr 2fr;

    button {
      height: 13.75vw;
      font-family: 'Pretendard', sans-serif;
      font-size: 2.6563vw;
      font-weight: bold;
      color: #fff;
      border: none;

      &:first-child {
        background-color: #999999;
      }

      &:last-child {
        background-color: #ab240f;
      }
    }
  }
}

.web-version {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 99999;
  font-size: 0.9375vw;
  font-weight: 500;
  color: #fff;
  letter-spacing: -0.0187vw;
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
