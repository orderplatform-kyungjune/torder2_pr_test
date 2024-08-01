import {
  computed,
  ComputedRef,
  Ref,
  ref,
} from 'vue';
import {
  defineStore,
  storeToRefs,
} from 'pinia';
import { isNullish } from '@utils/isNullish';
import isEmptyString from '@utils/isEmptyString';
import { getStorage } from '@torder/common/utils';
import {
  bannerType,
  checkoutListType,
  initDataType,
  serviceListType,
  storeInfoType,
  StoreTabletCustomStyle,
  tabletListType,
  themeListType,
  timerType,
} from '@torder/common/interface/initData';
import defaultThemeStyles from '@styles/defaultThemeStyle';
import useThemeStore from '@store/storeTheme';
import { INIT } from '@store/keys';

const useInitStore = defineStore(INIT, () => {
  const { theme } = storeToRefs(useThemeStore());
  const init: Ref<initDataType> = ref({} as initDataType);
  const initLatestUpdateTime = Number(getStorage('latestUpdatedTime') || 0);
  const latestUpdateTime: Ref<number> = ref(initLatestUpdateTime);
  const MACAddr = ref('');
  const timerFlag = ref(false);

  const defaultThemeStyle = computed(() => defaultThemeStyles[theme.value.type][theme.value.color]);
  const customThemeStyle = computed(() => init.value?.storeInfo?.storeTabletCustomStyle);

  const currentThemeStyle = computed(() => {
    const theme = customThemeStyle.value?.mode ? customThemeStyle.value : defaultThemeStyle.value;
    return theme as StoreTabletCustomStyle;
  });

  // 테마 관련
  const categoryBackgroundColor = computed(() => currentThemeStyle.value.category.backgroundColor);
  const categoryBackgroundImage = computed(() => currentThemeStyle.value.category.backgroundImg);
  const staffCallBackgroundColor = computed(() => currentThemeStyle.value.staffCallButton.backgroundColor);
  const staffCallFontColor = computed(() => currentThemeStyle.value.staffCallButton.fontColor);
  const mainCategoryFontColor = computed(() => currentThemeStyle.value.category.mainCategory.fontColor);
  const mainCategoryActiveFontColor = computed(() => currentThemeStyle.value.category.mainCategory.activeFontColor);
  const mainCategoryBackgroundColor = computed(() => currentThemeStyle.value.category.mainCategory.backgroundColor);
  const mainCategoryActiveBackgroundColor = computed(() => currentThemeStyle.value.category.mainCategory.backgroundActiveColor);
  const subCategoryFontColor = computed(() => currentThemeStyle.value.category.subCategory.fontColor);
  const subCategoryActiveFontColor = computed(() => currentThemeStyle.value.category.subCategory.activeFontColor);
  const subCategoryBackgroundColor = computed(() => currentThemeStyle.value.category.subCategory.backgroundColor);
  const subCategoryActiveBackgroundColor = computed(() => currentThemeStyle.value.category.subCategory.backgroundActiveColor);
  const tableNumBackgroundColor = computed(() => currentThemeStyle.value.tableNum.backgroundColor);
  const tableNumFontColor = computed(() => currentThemeStyle.value.tableNum.fontColor);
  const buttonFontColor = computed(() => currentThemeStyle.value.button.fontColor);
  const buttonBackgroundColor = computed(() => currentThemeStyle.value.button.backgroundColor);
  const fontColor = computed(() => currentThemeStyle.value.font.color);
  const activeFontColor = computed(() => currentThemeStyle.value.font.activeColor);
  const backgroundColor = computed(() => currentThemeStyle.value.background.backgroundColor);
  const bottomNavbarBackgroundColor = computed(() => currentThemeStyle.value.bottomNavbar.backgroundColor);

  // MAC address관련
  const updateMACAddr = (updateData: string) => {
    MACAddr.value = updateData;
  };

  // init data 관련
  const fetchInitStore = (data: initDataType) => {
    init.value = data;
  };

  // last update time 관련
  const setLatestUpdateTime = (time: number) => {
    latestUpdateTime.value = time;
  };

  // tableList 관련
  const getTabletList: ComputedRef<tabletListType[]> = computed(() => init.value.tabletList);

  // store info 관련
  const getStoreInfo: ComputedRef<storeInfoType> = computed(() => init.value.storeInfo);

  // 방문 인원 관련
  const getVisitConfig = computed(() => init.value.storeInfo.visitconfig);

  // checkout 관련
  const getCheckoutList: ComputedRef<checkoutListType[]> = computed(() => init.value.checkoutList);

  // custom style 관련
  const checkCustomStyleUse = computed(() => currentThemeStyle.value.mode !== '');

  const isDarkMode = computed(() => currentThemeStyle.value?.mode === 'dark');

  const getDarkModeClass = () => {
    if (isDarkMode.value) return 'dark-mode';

    return 'light-mode';
  };

  // timer info 관련
  const getTimerMessageInfo = computed(() => init.value?.timer);

  const updateTimerMessage = (updatedData: timerType) => {
    const timerData = init.value.timer;

    if (!updatedData?.time || updatedData?.time === 0) {
      timerFlag.value = false;
    } else {
      timerFlag.value = true;
      timerData.message = updatedData.message;
      timerData.sendtime = updatedData.sendtime; // 타이머가 설정된 시간
      timerData.time = updatedData.time; // 메시지가 노출되는 설정 시간
    }
  };

  // 배너 리스트 관련
  const getBannerList: ComputedRef<bannerType[]> = computed(() => init.value?.bannerList);

  const setBannerList = (banners: bannerType[]) => {
    init.value.bannerList = banners;
  };

  // theme 관련
  const getThemeList: ComputedRef<themeListType[]> = computed(() => init.value?.themeList);

  // service 리스트 관련
  const getServiceList: ComputedRef<serviceListType> = computed(() => init.value?.serviceList);

  // 직원 호출 관련
  const isHaveStaffCallItem = computed(() => getServiceList.value?.childCategoryList?.some((item) => item.productCode === '99999'));

  return {
    init,
    fetchInitStore,
    getStoreInfo,
    getVisitConfig,
    getCheckoutList,
    getBannerList,
    setBannerList,
    getThemeList,
    getServiceList,
    isHaveStaffCallItem,
    getTimerMessageInfo,
    checkCustomStyleUse,
    latestUpdateTime,
    setLatestUpdateTime,
    categoryBackgroundColor,
    categoryBackgroundImage,
    staffCallBackgroundColor,
    staffCallFontColor,
    mainCategoryFontColor,
    mainCategoryActiveFontColor,
    mainCategoryBackgroundColor,
    mainCategoryActiveBackgroundColor,
    subCategoryFontColor,
    subCategoryActiveFontColor,
    subCategoryBackgroundColor,
    subCategoryActiveBackgroundColor,
    tableNumBackgroundColor,
    tableNumFontColor,
    buttonFontColor,
    buttonBackgroundColor,
    fontColor,
    activeFontColor,
    backgroundColor,
    bottomNavbarBackgroundColor,
    isDarkMode,
    getDarkModeClass,
    getTabletList,
    updateMACAddr,
    MACAddr,
    timerFlag,
    updateTimerMessage,
    currentThemeStyle,
  };
});

export default useInitStore;
