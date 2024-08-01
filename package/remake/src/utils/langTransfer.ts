import { productLanguage } from '@torder/common/interface/product';
import i18n from '@i18n';

// eslint-disable-next-line import/prefer-default-export
export const translateLanguage = (languageObject: productLanguage, fallback: string) => {
  const { locale } = i18n.global;

  if (locale.value === 'ko') return languageObject?.ko ? String(languageObject?.ko ?? '') : fallback ?? '';
  if (locale.value === 'en') return languageObject?.en ? String(languageObject?.en ?? '') : fallback ?? '';
  if (locale.value === 'jp') return languageObject?.jp ? String(languageObject?.jp ?? '') : fallback ?? '';
  if (locale.value === 'chGan') return languageObject?.zh_hans ? String(languageObject?.zh_hans ?? '') : fallback ?? '';
  if (locale.value === 'chBun') return languageObject?.zh_hant ? String(languageObject?.zh_hant ?? '') : fallback ?? '';

  return fallback;
};
