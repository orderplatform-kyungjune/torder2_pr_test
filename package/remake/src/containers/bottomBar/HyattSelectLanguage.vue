<!-- <template>
  <ul
    class="language-list"
    :class="theme.type"
  >
    <li
      v-for="(language, languageIndex) in storeLanguageList"
      :key="language.type"
      class="language-item"
      :class="[checkLanguage(language.type), { 'first-lang': languageIndex === 0 }]"
      @click="changeLanguage(language.type)"
    >
      {{ language.lang }}
    </li>
  </ul>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';

import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { i18nLocaleChange } from '@utils/i18nUtils';
import { setStorage } from '@torder/common/utils';
import { LocaleType } from '@torder/common/interface/i18nLocale';
import {
  languageListType,
  languageArrType,
} from '@torder/common/interface';
import { LANGUAGE } from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useInitStore from '@store/storeInit';

defineProps<{
  customActiveFontColor: string,
  customFontColor: string,
}>();

const { getStoreInfo } = storeToRefs(useInitStore());

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

const { locale } = useI18n();
const { theme } = useThemeStore();

const changeLanguage = (country: LocaleType): void => {
  i18nLocaleChange(country);
  setStorage(LANGUAGE, country);
};

const checkLanguage = (lang: string) => ({ 'active-style': locale.value === lang });
</script>

<style lang='scss' scoped>
.language-list {
  display: flex;
  margin-top: .5469vw;

  .language-item {
    display: flex;
    height: 100%;
    padding: 0.7vw 0 0;
    margin: -0.525vw 1.875vw 0;
    font-family: "Noto Sans SC", sans-serif;
    font-size: 1.5625vw;
    font-weight: 500;
    color: v-bind(customFontColor);
    text-align: center;
    background-color: transparent;
    border-top: .2734vw solid transparent;
    border-bottom: .2734vw solid transparent;
  }

  .active-style {
    justify-content: center;
    padding: 1.45vw 0 0;
    margin-top: -1.25vw;
    font-family: "Noto Sans SC", sans-serif;
    font-weight: 700;
    color: v-bind(customActiveFontColor);
    border-top: .2734vw solid;
    border-bottom: .2734vw solid transparent;
  }

  .first-lang {
    margin-left: .3906vw;
  }
}
</style> -->
