import { setStorage } from '@torder/common/utils';
import { LocaleType } from '@torder/common/interface/i18nLocale';
import { LANGUAGE } from '@torder/common/constant';
import i18n from '@i18n';

export const i18nLocaleChange = (locale: LocaleType): void => {
  i18n.global.locale.value = locale;
  setStorage(LANGUAGE, locale);
};

export default { i18nLocaleChange };
