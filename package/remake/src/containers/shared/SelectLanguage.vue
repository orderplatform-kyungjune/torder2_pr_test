<template>
  <div
    v-if="showLanguageFlag()"
    class="language-list"
  >
    <div
      v-for="(language) in storeLanguageList"
      :key="language.type"
      class="language-button"
      :class="{ custom: isCustomTheme }"
      @click="changeLanguage(language.type)"
    >
      <span
        id="logo-language-sub-element"
        class="language-text"
        :class="{ custom: isCustomTheme }"
      >
        {{ language.lang }}
      </span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { pushPage } from '@utils/route.helper';
import { i18nLocaleChange } from '@utils/i18nUtils';
import { setStorage } from '@torder/common/utils';
import {
  languageArrType,
  languageListType,
  LocaleType,
} from '@torder/common/interface';
import {
  KOREA_ICON,
  JAPAN_ICON,
  AMERICA_ICON,
  CHINA_GAN_ICON,
  CHINA_BUN_ICON,
  LANGUAGE,
  HYATT,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useInitStore from '@store/storeInit';
import { home } from '@router/routePaths';

const { theme } = storeToRefs(useThemeStore());

const isCustomTheme = computed(() => {
  const isMatchedHyatt = theme.value.type === HYATT;
  return isMatchedHyatt;
});

const {
  getStoreInfo,
  buttonBackgroundColor,
} = storeToRefs(useInitStore());

const storeLanguageList = computed(() => {
  const {
    languageList = [
      'ko',
      'en',
      'jp',
      'zh_hans',
      'zh_hant',
    ] as languageListType[],
  } = getStoreInfo.value;

  const changeLanguageObject = (lang: languageListType): languageArrType => {
    if (lang === 'kr') {
      return ({
        type: 'ko',
        lang: '한국어',
        icon: KOREA_ICON,
      });
    }

    if (lang === 'zh_hans') {
      return ({
        type: 'chGan',
        lang: '简体',
        icon: CHINA_GAN_ICON,
      });
    }

    if (lang === 'zh_hant') {
      return ({
        type: 'chBun',
        lang: '繁體',
        icon: CHINA_BUN_ICON,
      });
    }

    if (lang === 'en') {
      return ({
        type: 'en',
        lang: 'English',
        icon: AMERICA_ICON,
      });
    }

    if (lang === 'jp') {
      return ({
        type: 'jp',
        lang: '日本語',
        icon: JAPAN_ICON,
      });
    }

    return ({
      type: 'ko',
      lang: '한국어',
      icon: KOREA_ICON,
    });
  };

  const convertLanguageList = languageList.map<languageArrType>(changeLanguageObject);

  return convertLanguageList;
});

const showLanguageFlag = () => storeLanguageList.value?.length > 1;

const changeLanguage = (country: LocaleType): void => {
  i18nLocaleChange(country);
  setStorage(LANGUAGE, country);
  pushPage(home);
};

</script>

<style lang='scss' scoped>
.language-list {
  display: flex;
  gap: 0.7813vw;
  align-items: center;
  font-family: 'Pretendard', sans-serif;
}

.language-button {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25vw 1.875vw;
  background-color: #fff;
  border: 0.0781vw solid #F91515;
  border-radius: 0.7813vw;
  box-shadow: 0.0781vw 0.1563vw 0.2344vw 0 rgba(0, 0, 0, 0.25);

  &.custom {
    border: 0.0781vw solid v-bind(buttonBackgroundColor);
  }

  &.button-active {
    background-color: #EBEBEB;
  }

  .language-text {
    font-size: 2.3438vw;
    font-style: normal;
    font-weight: 700;
    line-height: 3.125vw;
    color: #F91515;
    letter-spacing: -0.0469vw;

    &.custom {
      color: v-bind(buttonBackgroundColor);
    }
  }
}
</style>
