import { storeToRefs } from 'pinia';
import useThemeStore from '@store/storeTheme';
import useInitStore from '@store/storeInit';
import { IS_ORIGIN } from '@common/mode';

type BusinessType = 'uplus' | 'torder' | 'torder_en' | 'brand1' ;
type AssetType = 'logo' | 'banner' | 'themeProduct' | 'customThemeProduct' ;
type ColorType = 'black' | 'white';
type GrayType = 'gray200' | 'gray400' | string;

type BusinessTypeAssets = {
  [Key in BusinessType]: {
    logo: {
      [ColorKey in ColorType]: string;
    },
    banner: string,
    themeProduct: string,
    customThemeProduct: {
      [ColorKey in GrayType]: string;
    },
  };
};

const businessTypeAssets: BusinessTypeAssets = {
  uplus: {
    logo: {
      black: 'https://static.torder.co.kr/torder2/icon_lg_logo_xs_color.svg',
      white: 'https://static.torder.co.kr/torder2/icon_lg_logo_xs_white.svg',
    },
    banner: 'https://static.torder.co.kr/torder2/icon_lg_logo_xs_white.svg',
    themeProduct: 'https://static.torder.co.kr/torder2/icon_lg_logo_white.svg',
    customThemeProduct: {
      gray400: 'https://static.torder.co.kr/torder2/icon_lg_logo_gray_400.svg',
      gray200: 'https://static.torder.co.kr/torder2/icon_lg_logo_gray_200.svg',
    },
  },
  torder: {
    logo: {
      black: 'https://static.torder.co.kr/torder2/icon_torder_logo_BI_color_black.svg',
      white: 'https://static.torder.co.kr/torder2/icon_torder_logo_BI_color_white.svg',
    },
    banner: 'https://static.torder.co.kr/torder2/icon_torder_logo_BI_color_white.svg',
    themeProduct: 'https://static.torder.co.kr/torder2/icon_torder_logo_BI_white.svg',
    customThemeProduct: {
      gray400: 'https://static.torder.co.kr/torder2/icon_torder_logo_BI_gray_400.svg',
      gray200: 'https://static.torder.co.kr/torder2/icon_torder_logo_BI_gray_200.svg',
    },
  },
  torder_en: {
    logo: {
      black: 'https://static.torder.co.kr/torder2/icon_torder_logo_CI_color_black.svg',
      white: 'https://static.torder.co.kr/torder2/icon_torder_logo_CI_color_white.svg',
    },
    banner: 'https://static.torder.co.kr/torder2/icon_torder_logo_CI_color_white.svg',
    themeProduct: 'https://static.torder.co.kr/torder2/icon_torder_logo_CI_white.svg',
    customThemeProduct: {
      gray400: 'https://static.torder.co.kr/torder2/icon_torder_logo_CI_gray_400.svg',
      gray200: 'https://static.torder.co.kr/torder2/icon_torder_logo_CI_gray_200.svg',
    },
  },
  // 저가 브랜드 assets
  brand1: {
    logo: {
      black: 'https://static.torder.co.kr/torder2/icon_brand1_logo_CI_color_black.svg',
      white: 'https://static.torder.co.kr/torder2/icon_brand1_logo_CI_color_white.svg',
    },
    banner: 'https://static.torder.co.kr/torder2/icon_brand1_logo_CI_color_white.svg',
    themeProduct: 'https://static.torder.co.kr/torder2/icon_brand1_logo_CI_white.svg',
    customThemeProduct: {
      gray400: 'https://static.torder.co.kr/torder2/icon_brand1_logo_CI_gray_400.svg',
      gray200: 'https://static.torder.co.kr/torder2/icon_brand1_logo_CI_gray_200.svg',
    },
  },
};

const getAssetUrl = (businessType: BusinessType, assetType: AssetType, color: ColorType | GrayType = 'white'): string => {
  if (!(businessType in businessTypeAssets)) return '';

  const assets = businessTypeAssets[businessType];

  if (!(assetType in assets)) return '';

  const asset = assets[assetType] as string;

  if (typeof asset === 'string') return asset;

  return asset[color] || '';
};
export const getMainLogoImage = (): string => {
  const { init } = storeToRefs(useInitStore());
  const { isThemeColorBlack } = useThemeStore();

  if (!IS_ORIGIN) {
    return isThemeColorBlack ? getAssetUrl('torder_en', 'logo', 'white') : getAssetUrl('torder_en', 'logo', 'black');
  }

  const { businessType } = init.value?.storeInfo;
  return isThemeColorBlack ? getAssetUrl(businessType as BusinessType, 'logo', 'white') : getAssetUrl(businessType as BusinessType, 'logo', 'black');
};

export const getBannerLogoImage = (): string => {
  const { getStoreInfo } = storeToRefs(useInitStore());
  if (!IS_ORIGIN) return getAssetUrl('torder_en', 'banner', 'white');

  const { businessType } = getStoreInfo.value;
  return getAssetUrl(businessType as BusinessType, 'banner', 'white');
};

export const getBasicThemeProductLogoImage = (): string => {
  const { getStoreInfo } = storeToRefs(useInitStore());
  if (!IS_ORIGIN) return getAssetUrl('torder_en', 'themeProduct', 'white');

  const { businessType } = getStoreInfo.value;
  return getAssetUrl(businessType as BusinessType, 'themeProduct', 'white');
};

export const getCustomThemeProductLogoImage = (): string => {
  const { isDarkMode } = useInitStore();
  const { getStoreInfo } = storeToRefs(useInitStore());

  if (!IS_ORIGIN) return isDarkMode ? getAssetUrl('torder_en', 'customThemeProduct', 'gray200') : getAssetUrl('torder_en', 'customThemeProduct', 'gray400');

  const { businessType } = getStoreInfo.value;
  return isDarkMode ? getAssetUrl(businessType as BusinessType, 'customThemeProduct', 'gray200') : getAssetUrl(businessType as BusinessType, 'customThemeProduct', 'gray400');
};
