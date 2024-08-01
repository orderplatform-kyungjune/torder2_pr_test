<template>
  <teleport
    v-if="flag.customLang"
    to="#modal"
  >
    <div class="modal-select-language">
      <div class="custom-language-container">
        <div class="custom-language-header">
          <span class="custom-language-title">
            {{ t('언어설정') }}
          </span>
          <img
            class="custom-language-close-button"
            src="https://static.torder.co.kr/torder2/btn_small_black_close.svg"
            @click="closeModal(CUSTOM_LANGUAGE);"
          >
        </div>
        <div class="custom-language-body">
          <div
            v-for="language in storeLanguageList"
            :key="language.type"
            :class="{ 'active-style': locale === language.type }"
            class="custom-language-box"
            @click="changeLanguage(language.type)"
          >
            {{ language.lang }}
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { i18nLocaleChange } from '@utils/i18nUtils';
import { setStorage } from '@torder/common/utils';
import { LocaleType } from '@torder/common/interface/i18nLocale';
import {
  LANGUAGE,
  CUSTOM_LANGUAGE,
} from '@torder/common/constant';
import {
  languageListType,
  languageArrType,
} from '@torder/common';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';

const {
  t,
  locale,
} = useI18n();

const {
  getStoreInfo,
  categoryBackgroundColor,
} = storeToRefs(useInitStore());

const {
  flag,
  closeModal,
} = useModalStore();

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
      });
    }

    if (lang === 'zh_hans') {
      return ({
        type: 'chGan',
        lang: '简体',
      });
    }

    if (lang === 'zh_hant') {
      return ({
        type: 'chBun',
        lang: '繁體',
      });
    }

    if (lang === 'en') {
      return ({
        type: 'en',
        lang: 'English',
      });
    }

    if (lang === 'jp') {
      return ({
        type: 'jp',
        lang: '日本語',
      });
    }

    return ({
      type: 'ko',
      lang: '한국어',
    });
  };

  const convertLanguageList = languageList.map<languageArrType>(changeLanguageObject);

  return convertLanguageList;
});

const changeLanguage = (country: LocaleType): void => {
  i18nLocaleChange(country);
  setStorage(LANGUAGE, country);
  closeModal(CUSTOM_LANGUAGE);
};
</script>

<style lang='scss' scoped>
.modal-select-language {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 26;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  padding: 0;
  font-family: 'Pretendard', sans-serif;
  background-color: rgba(0,0,0,.8);

  .custom-language-container {
    display: flex;
    flex-direction: column;
    width: 64.6875vw;
    height: 40vw;
    background-color: #F8F8F8;
    border-radius: 1.5625vw;

    .custom-language-header {
      display: flex;
      justify-content: space-between;
      padding: 1.5625vw;

      .custom-language-title {
        font-size: 2.3438vw;
        font-weight: 700;
        line-height: 3.125vw;
        letter-spacing: -0.0469vw;
      }

      .custom-language-close-button {
        width: 3.125vw;
        height: 3.125vw;

        &.button-active {
          background-color: #EBEBEB;
          border-radius: 0.625vw;
        }
      }
    }

    .custom-language-body {
      display: flex;
      flex-direction: column;
      gap: 1.25vw;
      padding: 0 1.5625vw;

      .custom-language-box {
        padding: 1.5625vw;
        font-size: 1.5625vw;
        font-weight: 500;
        line-height: 1.875vw;
        color: #313131;
        letter-spacing: -0.0469vw;
        border: .0781vw solid #D5D5D5;
        border-radius: 0.7813vw;

        &.active-style {
          border: .0781vw solid v-bind(categoryBackgroundColor);
        }

        &.button-active {
          background-color: #EBEBEB;
        }
      }
    }
  }
}
</style>
