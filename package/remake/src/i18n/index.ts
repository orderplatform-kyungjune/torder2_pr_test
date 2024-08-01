import { createI18n } from 'vue-i18n';
import { LocaleType } from '@torder/common/interface/i18nLocale';
import {
  DEV_LANG_CH_BUN_ORIGIN,
  DEV_LANG_CH_GAN_ORIGIN,
  DEV_LANG_EN_ORIGIN,
  DEV_LANG_JP_ORIGIN,
  DEV_LANG_KR_ORIGIN,
  LANG_CH_BUN_ORIGIN,
  LANG_CH_GAN_ORIGIN,
  LANG_EN_ORIGIN,
  LANG_JP_ORIGIN,
  LANG_KR_ORIGIN,
} from '@torder/common/constant';
import {
  ko,
  en,
  jp,
  chGan,
  chBun,
} from '@locales';
import { IS_DEV } from '@common/mode';

const messages = {
  ko,
  en,
  jp,
  chGan,
  chBun,
};

const i18n = createI18n({
  legacy: false,
  allowComposition: true,
  locale: 'ko',
  fallbackLocale: 'en',
  messages,
});

// Fetch locale.
function loadLocale(url: string, tryCount: number) {
  return fetch(url, { headers: { 'Cache-Control': 'no-cache' } })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error('Something went wrong!');
    })
    .catch((error) => {
      if (tryCount > 0) {
        loadLocale(url, tryCount - 1);
      } else {
        console.error(error);
      }
    });
}

// Set new locale.
export async function setLocale(locale: LocaleType) {
  let url = '';

  if (locale === 'ko') url = IS_DEV ? DEV_LANG_KR_ORIGIN : LANG_KR_ORIGIN;
  if (locale === 'en') url = IS_DEV ? DEV_LANG_EN_ORIGIN : LANG_EN_ORIGIN;
  if (locale === 'jp') url = IS_DEV ? DEV_LANG_JP_ORIGIN : LANG_JP_ORIGIN;
  if (locale === 'chGan') url = IS_DEV ? DEV_LANG_CH_GAN_ORIGIN : LANG_CH_GAN_ORIGIN;
  if (locale === 'chBun') url = IS_DEV ? DEV_LANG_CH_BUN_ORIGIN : LANG_CH_BUN_ORIGIN;

  const messages = await loadLocale(url, 5);

  // fetch() error occurred.
  if (messages === undefined) {
    return;
  }

  // Add locale.
  i18n.global.setLocaleMessage(locale, messages);
}

export default i18n;
