<template>
  <teleport
    v-if="flag.lang"
    to="#modal"
  >
    <div class="modal-select-language">
      <ModalHead
        :content="'언어'"
        :button-text="t('닫기')"
        @click="closeModal(LANGUAGE)"
      />
      <div class="modal-body">
        <ul
          class="lang-list"
          :class="theme.type"
        >
          <li
            v-for="language in storeLanguageList"
            :key="language.type"
            class="lang-item"
            :class="theme.type"
            @click="changeLanguage(language.type)"
          >
            {{ language.lang }}
          </li>
        </ul>
      </div>
    </div>
  </teleport>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { i18nLocaleChange } from '@utils/i18nUtils';
import {
  setStorage,
  getSubPrimaryColor,
} from '@torder/common/utils';
import { LocaleType } from '@torder/common/interface/i18nLocale';
import { LANGUAGE } from '@torder/common/constant';
import {
  languageListType,
  languageArrType,
} from '@torder/common';
import useThemeStore from '@store/storeTheme';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import { ModalHead } from '@components';

const { t } = useI18n();

const { getStoreInfo } = storeToRefs(useInitStore());

const {
  flag,
  closeModal,
} = useModalStore();

const { theme } = useThemeStore();

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
  closeModal(LANGUAGE);
};

const activeLanguageButtonColor = getSubPrimaryColor('#fafafa', 10, 'Y');
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
  flex-direction: column;
  justify-content: center;
  padding: 0;
  background-color: rgba(0,0,0,.8);

  .modal-body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    padding: 0 1vw 1vw;
    overflow: hidden;

    .lang-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0;

      &.restaurant-horizontal {
        width: 25vw;
        padding: 3.75vw;
        background-color: #fff;
        border-radius: 1.5625vw;
      }

      .lang-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 4.8vw;
        padding: 0 2vw;
        margin-bottom: 0.8vw;
        font-size: 2vw;
        color: #202020;
        text-align: center;
        background-color: #fafafa;
        border-radius: .7813vw;

        &.button-active {
          background-color: v-bind(activeLanguageButtonColor);
        }

        &.restaurant-horizontal {
          font-family: Noto Serif Kr, sans-serif;
          background-color: #fff;

          &.ko, &.jp, &.en, &.chGan, &.chBun {
            width: 17.5vw;
            color: #ab240f;
            border: 0.1172vw solid #ab240f;
            border-radius: 2.4219vw
          }
        }
      }
    }
  }
}
</style>
