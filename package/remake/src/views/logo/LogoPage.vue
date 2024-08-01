<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="logo"
    :class="theme.type"
  >
    <div class="company-logo">
      <img
        class="company-logo-image"
        :src="getBannerLogoImage()"
        alt="로고 이미지"
      >
    </div>
    <!-- 세로, 가로 블랙 테마 -->
    <BasicLayoutStoreTableInfo
      v-if="isVertical || isHorizontal"
      class="table-container"
      :title="t('테이블명')"
      :tableName="getInitTableName()"
      :storeName="getStoreName()"
      :theme-color="BLACK"
      @click="onNextSecret"
    />
    <!-- 레스토랑 테마 -->
    <TableTagToSecret
      v-if="isRestaurantHorizontal || isRestaurantHorizontalCard || isRestaurantVertical"
      class="restaurant-theme-table"
    />
    <!-- 커스텀 테마 -->
    <CustomTableTag
      v-if="isHyatt"
      class="custom-theme-table"
      :storeInfo="getStoreName()"
      :tableInfo="getInitTableName()"
      @click="onNextSecret"
    />
    <SelectLanguage
      v-if="getStoreInfo.LanguageUse"
      class="language-select"
    />
    <div
      class="logo-image"
      @touchstart.prevent="clickLogo"
    >
      <img
        :src="getStoreInfo.logoUrl"
        alt="logo"
      >
    </div>
    <div
      v-if="isUseBannerText()"
      class="logo-text-wrap"
      @touchstart.prevent="clickLogo"
    >
      <div
        class="logo-text"
        v-html="changeBannerText()"
      />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { pushPage } from '@utils/route.helper';
import { getBannerLogoImage } from '@utils/logoUtils';
import {
  getStoreName,
  getInitTableName,
} from '@torder/common/utils';
import {
  VERTICAL,
  HORIZONTAL,
  RESTAURANT_HORIZONTAL_CARD,
  RESTAURANT_HORIZONTAL,
  RESTAURANT_VERTICAL,
  HYATT,
  BLACK,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useInitStore from '@store/storeInit';
import { home } from '@router/routePaths';
import {
  SelectLanguage,
  TableTagToSecret,
} from '@containers';
import { useSecret } from '@composables/secret';
import {
  BasicLayoutStoreTableInfo,
  CustomTableTag,
} from '@components';

const { onNextSecret } = useSecret();

const { t } = useI18n();
const { theme } = storeToRefs(useThemeStore());
const { getStoreInfo } = storeToRefs(useInitStore());

const { logoUrl = '' } = getStoreInfo.value;
const isLogoUrl = !logoUrl;

if (isLogoUrl) pushPage(home);

const clickLogo = () => {
  pushPage(home);
};

const changeBannerText = () => {
  let textInit = getStoreInfo.value.bannerText;

  if (!textInit) textInit = '';

  return textInit;
};

// 배너 텍스트가 없을 경우 미노출 처리
const isUseBannerText = () => (getStoreInfo.value.bannerText?.length > 0);

const isVertical = computed(() => {
  const isMatchedVertical = theme.value.type === VERTICAL;
  return isMatchedVertical;
});

const isHorizontal = computed(() => {
  const isMatchedHorizontal = theme.value.type === HORIZONTAL;
  return isMatchedHorizontal;
});

const isRestaurantHorizontalCard = computed(() => {
  const isMatchedRestaurant = theme.value.type === RESTAURANT_HORIZONTAL_CARD;
  return isMatchedRestaurant;
});

const isRestaurantHorizontal = computed(() => {
  const isMatchedRestaurant = theme.value.type === RESTAURANT_HORIZONTAL;
  return isMatchedRestaurant;
});

const isRestaurantVertical = computed(() => {
  const isMatchedRestaurant = theme.value.type === RESTAURANT_VERTICAL;
  return isMatchedRestaurant;
});

const isHyatt = computed(() => {
  const isMatchedHyatt = theme.value.type === HYATT;
  return isMatchedHyatt;
});

</script>

<style lang='scss' scoped>
.logo {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  font-family: 'Pretendard', sans-serif;
  background-color: #000;

  .company-logo {
    position: absolute;
    top: 1.5625vw;
    left: 1.5625vw;
    display: flex;
    align-items: center;
    justify-content: left;

    .company-logo-image {
      max-width: 16.328125vw;
      max-height: 3.75vw;
      object-fit: contain;
    }
  }

  .table-container {
    position: fixed;
    top: 0;
    right: 1.5625vw;
  }

  .logo-image {
    width: 100%;
    height: 100%;
  }

  &.restaurant-vertical {
    height: 160vw;

    .logo-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  .logo-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .logo-text-wrap {
    position: absolute;
    bottom: 1.5625vw;
    width: 100%;
    padding: 0 2.3438vw;

    .logo-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      max-height: 46.875vw;
      padding: 2.3438vw;
      overflow: hidden;
      font-size: 3.75vw;
      font-weight: 700;
      line-height: 4.2188vw;
      color: #FFF;
      text-align: center;
      text-shadow: 0 0 0.7813vw rgba(0, 0, 0, 0.25);
      word-break: break-all;
      white-space: pre-line;
      background-color: rgba(73, 73, 73, 0.80);
      border: 0.0781vw solid #313131;
      border-radius: 1.25vw;
    }
  }
}

.hyatt-theme-table, .restaurant-theme-table{
  position: absolute;
  right: 1.5625vw;
  z-index: 20;
  width: 15.625vw;
}

.custom-theme-table {
  position: absolute;
  top: 0;
  right: 1.5625vw;
  z-index: 20;
}

.language-select {
  position: absolute;
  top: .625vw;
  right: 50%;
  transform: translateX(50%);
}
</style>
