<script lang='ts' setup>
import {
  RouterView,
  useRoute,
  useRouter,
} from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';
import { storeToRefs } from 'pinia';
import md5 from 'md5';
import {
  VisitPeople,
  NotUseService,
  TerminationOfContract,
} from '@views';
import { setSentryStoreLogWhenProduction } from '@utils/sentryUtil';
import {
  pushPage,
  getRoutePath,
} from '@utils/route.helper';
import { i18nLocaleChange } from '@utils/i18nUtils';
import { useSyncAudioAOS } from '@utils/audio';
import {
  getStorage,
  setStorage,
  getStoreCode,
  getStoreName,
  getInitTableId,
  getInitTableName,
  getInitTableCreditUse,
  getCreditSerialNumber,
  getCreditFunctionArray,
  getInitTableNumber,
  getInitTableOrderAble,
  getTablePosCode,
  removeStorage,
} from '@torder/common/utils';
import {
  colorType,
  typeType,
} from '@torder/common/interface/theme';
import {
  RobotInfo,
  torderResType,
  torderUpdatedTabletResType,
} from '@torder/common/interface/socket';
import {
  initTableInfoType,
  tableInfo,
} from '@torder/common/interface/login';
import {
  initDataType,
  initStoreType,
  tabletListType,
} from '@torder/common/interface/initData';
import {
  SERVING_ROBOT_AUDIO,
  HORIZONTAL,
  VERTICAL,
  CACHE_DATA,
  STORE,
  BEEP,
  EVENT,
  TORDER,
  U_CODE,
  NOT_USE,
  TERMINATION_OF_CONTRACT,
  BLACK,
  TYPE,
  THEME,
  WHITE,
  RESTAURANT_HORIZONTAL_CARD,
  RESTAURANT_HORIZONTAL,
  RESTAURANT_VERTICAL,
  LATEST_UPDATED_TIME,
  HYATT,
  TABLE,
  KOREAN,
  STOP_EXPOSURE,
  CART,
  PICK_UP,
  TABLE_CODE,
  CUSTOM_VISIT_PEOPLE,
  VISIT_PEOPLE,
  LOADING_IMAGE,
  COLOR,
  GRAY,
} from '@torder/common/constant';

import useVisitPeopleStore from '@store/storeVisitPeople';
import useThemeStore from '@store/storeTheme';
import useTableStore from '@store/storeTable';
import usePaymentStore from '@store/storePayment';
import useOrderListStore from '@store/storeOrderList';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import useBannerStore from '@store/storeBanner';
import {
  orderComplete,
  home,
  logo,
  banner,
  movingServingRobot,
  arriveServingRobot,
  errorPage,
} from '@router/routePaths';
import { useSocket } from '@plugins/socket';
import { EventConfigUpdateResponseDataType } from '@interface/torderEvent';
import Review from '@containers/review';
import ModalWaypoint from '@containers/modals';
import {
  PickUpItemModal,
  PaymentRefundAlarmModal,
  FlashModal,
  ConfirmAlertModal,
  CustomVisitPeople,
  CallRobotConfirm,
} from '@containers';
import useOrderConfig, { updateReviews } from '@composables/useOrderConfig';
import useDynamicLayout from '@composables/useDynamicLayout';
import postCreditWebLogs from '@composables/creditLog';
import TimeSchedule from '@composables/TimeSchedule';
import {
  IS_PROD,
  IS_LOCAL,
} from '@common/mode';
import { requestEventConfigUpdate } from '@apis/torderEvent';
import {
  requestInit,
  requestSelectInit,
} from '@apis/tabletData';
import { checkOrderExist } from '@apis/orderData';

const {
  flag,
  getAlertContent,
  openAlert,
  openModal,
  closeModal,
  openPaymentRefundAlarmModal,
} = useModalStore();

const {
  fetchInitStore,
  setLatestUpdateTime,
  updateMACAddr,
  updateTimerMessage,
} = useInitStore();
const {
  getStoreInfo,
  getTabletList,
  MACAddr,
  getVisitConfig,
  init,
} = storeToRefs(useInitStore());

const {
  theme,
  changeThemeColor,
  changeThemeType,
} = useThemeStore();

const {
  setCartConfirmStatus,
  deleteCartProductAll,
} = useCartStore();

const { tableInfo: tableConfig } = storeToRefs(useTableStore());
const { setTableInfo } = useTableStore();

const { isOccupied } = storeToRefs(useVisitPeopleStore());
const { resetOccupiedTable } = useVisitPeopleStore();

const { setOrderList } = useOrderListStore();
const { isHaveOrderList } = storeToRefs(useOrderListStore());

const { updatePaymentOrderKey } = usePaymentStore();
const { handleCurrentBannerIndex } = useBannerStore();
const socket = useSocket();
const route = useRoute();
const router = useRouter();

const { t } = useI18n();

const type = computed(() => theme.type);

const deviceUsage = ref({});

const currentWebVersion = window.location.pathname === '/' ? '/v' : window.location.pathname;

const storeCode = getStorage(STORE) as string;
const tabletInfo = JSON.parse(getStorage(TABLE) as string) as initTableInfoType;
const localTableCode = getStorage(TABLE_CODE);

let {
  isComponentsLoading,
  layoutComponent,
} = useDynamicLayout(type.value);

// type이 바뀌면 재로드
watch(() => type.value, (newValue) => {
  isComponentsLoading.value = true;

  const {
    isComponentsLoading: reComponentLoading,
    layoutComponent: newLayoutComponents,
  } = useDynamicLayout(newValue);
  isComponentsLoading = reComponentLoading;
  layoutComponent = newLayoutComponents;
}, { immediate: true });

// 로컬스토리지에 tableCode로 table정보 저장
if (localTableCode) {
  const res = await requestSelectInit(storeCode, 'tabletList');
  const selectedTable = res.data?.tabletList?.find((table: tabletListType) => table.tabletId === localTableCode);

  if (selectedTable) {
    setStorage(TABLE, JSON.stringify(selectedTable));
  }
}

const setTheme = (themeColor: colorType, themeType: typeType) => {
  const isHorizontalToVertical = !theme.type.includes(RESTAURANT_VERTICAL) && themeType.includes(RESTAURANT_VERTICAL);
  const isVerticalToHorizontal = theme.type.includes(RESTAURANT_VERTICAL) && !themeType.includes(RESTAURANT_VERTICAL);

  try {
    if ((isHorizontalToVertical || isVerticalToHorizontal) && window?.UUID) {
      if (window.UUID?.setOrientationToHorizontal && isVerticalToHorizontal) {
        window.UUID.setOrientationToHorizontal();
      }

      if (window.UUID?.setOrientationToVertical && isHorizontalToVertical) {
        window.UUID.setOrientationToVertical();
      }
    } else {
      console.log('안드로이드 인터페이스 없습니다.');
    }
  } catch (error) {
    console.log(error);
  }

  setStorage(TYPE, themeType);
  setStorage(THEME, themeColor);
  changeThemeColor(themeColor);
  changeThemeType(themeType);
};

const setStoreTheme = (themeId: number | string) => {
  switch (themeId) {
    case 9:
    case '9':
      setTheme(WHITE, VERTICAL);
      setStorage(LOADING_IMAGE, COLOR);
      break;

    case 10:
    case '10':
      setTheme(WHITE, HORIZONTAL);
      setStorage(LOADING_IMAGE, COLOR);
      break;

    case 11:
    case '11':
      setTheme(BLACK, VERTICAL);
      setStorage(LOADING_IMAGE, COLOR);
      break;

    case 12:
    case '12':
      setTheme(BLACK, HORIZONTAL);
      setStorage(LOADING_IMAGE, COLOR);
      break;

    case HYATT:
      setTheme(BLACK, HYATT);
      setStorage(LOADING_IMAGE, GRAY);
      break;

    case 14:
    case '14':
      setTheme(WHITE, RESTAURANT_HORIZONTAL);
      setStorage(LOADING_IMAGE, GRAY);
      break;

    case 15:
    case '15':
      setTheme(WHITE, RESTAURANT_HORIZONTAL_CARD);
      setStorage(LOADING_IMAGE, GRAY);
      break;

    case 16:
    case '16':
      setTheme(BLACK, RESTAURANT_VERTICAL);
      setStorage(LOADING_IMAGE, GRAY);
      break;

    case 17:
    case '17':
      setTheme(WHITE, RESTAURANT_VERTICAL);
      setStorage(LOADING_IMAGE, GRAY);
      break;

    default:
      setTheme(BLACK, HYATT);
      setStorage(LOADING_IMAGE, GRAY);
      break;
  }
};

// 새로고침 방지 테이블 스토어 코드
if (!tableConfig.value?.tabletId) {
  const tableInformation = JSON.parse(getStorage(TABLE) as string) as initTableInfoType;
  setTableInfo(tableInformation);
}

const tableInformation = JSON.parse(getStorage(TABLE) as string) as initTableInfoType & tableInfo;
const tableCode = tableInformation?.Ta_id;

// init 테이블리스트 조회
const getSelectInitTableList = async () => {
  try {
    const res = await requestSelectInit(getStoreCode(), 'tabletList');

    if (tableCode) {
      const selectedTable = res.data?.tabletList.value?.find((table: initTableInfoType) => table?.tabletId === tableCode);

      if (selectedTable) {
        setStorage(TABLE, JSON.stringify(selectedTable));
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// 티오더2 로컬스토리지에서 init table 변경 전 데이터 (table.Ta_id)가 잔존되어 있으면 강제로 새 스펙으로 치환 (추후 제거해도 될 듯)
// table.Ta_id : API 1.0 스펙 / table.tableId : API 2.0 스펙
if (!tableInformation?.tabletId) {
  getSelectInitTableList();
}

const handleCartConfirm = (data: initDataType): void => {
  const cartConfirmStatus = data.storeInfo?.orderConfirm === 1;

  setCartConfirmStatus(cartConfirmStatus);
};

const updateLatestUpdateTime = () => {
  const updateDate = +new Date();

  setStorage(LATEST_UPDATED_TIME, String(updateDate));
  setLatestUpdateTime(updateDate);
};

/**
 onunmounted is called when there is no active component instance to be associated with.
 lifecycle injection apis can only be used during execution of setup(). if you are using async setup(),
 make sure to register lifecycle hooks before the first await statement.
 위와 같은 warning 때문에 unMounted 라이프 사이클 suspense 하위 첫 await 로직 전으로 이관
 */
// beep interval time id
// eslint-disable-next-line no-undef
const beepLoop = ref<number | NodeJS.Timeout>(0);
onUnmounted(() => clearInterval(beepLoop.value));
// eslint-disable-next-line no-undef
const reloadInterval = ref<number | NodeJS.Timeout>(0);
onUnmounted(() => clearInterval(reloadInterval.value));

if (storeCode) {
  if (window.UUID && window.UUID.setStoreCode && tabletInfo) {
    const storeCodeObj = {
      storeCode,
      tableCode: tableConfig.value.tabletId,
      orderAble: tableConfig.value.orderAble === 1,
    };
    window.UUID.setStoreCode(JSON.stringify(storeCodeObj));
  }
  // 캐싱 처리
  const cacheInitData = getStorage(CACHE_DATA);

  if (cacheInitData === null) {
    const res = await requestInit(storeCode);
    const { data }: { data: initDataType } = res;

    if (data.result) {
      fetchInitStore(data);
      updateLatestUpdateTime();
      handleCartConfirm(data);
      updateTimerMessage(data.timer);

      const { storeInfo } = data;

      // 안드로이드 접근 URL 저장
      if (window.UUID && window.UUID.setHomeUrl) {
        window.UUID.setHomeUrl(storeInfo.tabletVersion);
      }

      // init 데이터 캐시
      setStorage(CACHE_DATA, JSON.stringify(data));
      setStoreTheme(data.storeInfo?.theme);
      i18nLocaleChange(data.storeInfo?.LanguageDefault ?? KOREAN);
    } else {
      throw new Error('init 데이터를 불러오지 못했습니다.');
    }
  } else {
    const cachedData: initDataType = JSON.parse(cacheInitData as string);
    const { storeInfo } = cachedData;

    // 안드로이드 접근 URL 저장
    if (window.UUID && window.UUID.setHomeUrl) {
      window.UUID.setHomeUrl(storeInfo.tabletVersion);
    }

    fetchInitStore(cachedData);
    updateTimerMessage(cachedData?.timer);
    handleCartConfirm(cachedData);
    setStoreTheme(cachedData.storeInfo?.theme);
    i18nLocaleChange(storeInfo?.LanguageDefault ?? KOREAN);
  }
  setSentryStoreLogWhenProduction();
} else {
  throw new Error('상점 정보가 없습니다.');
}

const layoutHubTimeSchedule = ref(new TimeSchedule());
const webReload = () => {
  window.location.reload();
};

// 소켓 관련 코드
// eslint-disable-next-line consistent-return
watch(getStoreInfo, async () => {
  clearInterval(reloadInterval.value);

  // 새로고침 리셋 주기 관련 코드
  layoutHubTimeSchedule.value.updateScheduleContext(webReload, Date.now() + getStoreInfo.value.refreshTime * 1000);

  // 계약 상태가 해지, 양도양수, 요금미납, 폐업일 때 [라이센스 만료] 문구 모달 노출
  if (getStoreInfo.value.storeStat === 4 || getStoreInfo.value.storeStat === 5 || getStoreInfo.value.storeStat === 6 || getStoreInfo.value.storeStat === 7) {
    openModal(TERMINATION_OF_CONTRACT);
  } else {
    closeModal(TERMINATION_OF_CONTRACT);
  }

  // 서비스 점검중 모달 노출
  if (getStoreInfo.value.storeClose) {
    openModal(NOT_USE);
    pushPage(home);
  } else {
    closeModal(NOT_USE);
  }
});

const uCode = getStorage(U_CODE);

const getMatchedTablet = (data: torderResType) => {
  try {
    const isSameStoreCode = getStoreCode() === data.store?.code;
    const isSameTableId = tableConfig.value.tabletId === data.table?.code;

    if (isSameStoreCode && isSameTableId) return true;

    const isSameUCode = uCode === data.uCode;

    if (isSameUCode) return true;

    return false;
  } catch (error) {
    console.log(error, '에러');
    return false;
  }
};

// Beep 요청
const generationBeepData = () => {
  const nowDate = new Date();
  const nowTimeStamp = nowDate.getTime();
  const getInitData = getStorage(CACHE_DATA) as string;
  const getUCode = getStorage(U_CODE);
  const getConfigHash = () => {
    try {
      return md5(getInitData);
    } catch {
      return null;
    }
  };

  const data = {
    type: BEEP,
    uCode: getUCode,
    MACAddr: MACAddr.value,
    deviceUsage: deviceUsage.value,
    location: window.location,
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    store: { code: storeCode },
    table: { code: tableConfig.value.tabletId },
    initTime: nowTimeStamp,
    time: nowTimeStamp,
    path: route.path,
    datetime: nowDate,
    resetCount: 0,
    configHash: getConfigHash(),
    /* 1. useDiff = false (false 경우 신규 업데이트 로직을 수행함)
      2. shopInfoIncluded = false (false 일 경우 beep 응답인 'torder' 의 'changeConfig' 상점정보를 내려주지 않는다.)
      3. useEventApi = true (true 일 경우, beep 응답 메세지 자체를 내려주지 않는다.)
      [3이 정상 동작한다면 1,2는 서버로 보내지지 않음.]
    */
    useDiff: false,
    shopInfoIncluded: false,
    useEventApi: true,
  };
  return data;
};

// const sendAndroidSetStoreCode = () => {
//   try {
//     if (window.UUID) {
//       const data = {
//         storeCode: getStoreCode() ?? '',
//         tableCode: getInitTableId() ?? '',
//       };
//       window.UUID.setStoreCode(JSON.stringify(data));
//     }
//   } catch (error) {
//     console.log('안드로이드 setStoreCode 메서드 전송');
//   }
// };

// 맥주소 전송하기
const sendAndroidMACAddress = () => {
  try {
    if (window.UUID) {
      window.UUID.getMacAddress();
    } else {
      console.log('안드로이드 getMacAddress 메서드 전송');
    }
  } catch (error) {
    console.log(error);
  }
};

const sendAndroidTableJSON = () => {
  try {
    if (window.UUID) {
      const data = {
        code: getInitTableId() ?? '',
        name: getInitTableName() ?? '',
        targetPaymentTableInfo: {
          Ta_id: getInitTableId() ?? '',
          Tablet_name: getInitTableName() ?? '',
          tablePosCode: getTablePosCode() ?? '',
          Tablet_number: getInitTableNumber() ?? '',
          van: getStoreInfo.value.vanInfo ?? '',
          Tablet_credit_use: getInitTableCreditUse() ?? 0,
          Tablet_credit_serialnumber: getCreditSerialNumber() ?? '',
          Tablet_credit_functionArray: getCreditFunctionArray() ?? [],
          Tablet_orderAble: getInitTableOrderAble() ?? 0,
        },
      };

      window.UUID.writeFile(JSON.stringify(data), '/torder/json/table.json');
    } else {
      console.log('안드로이드 table json 메서드 전송');
    }
  } catch (error) {
    // 오류 케이스 정의 필요
    console.log('에러', error);
  }
};

const sendAndroidConfigJSON = () => {
  const convertedTableListName = getTabletList.value?.map((table) => ({
    Ta_id: table.tabletId,
    Tablet_name: table.TabletName,
    tablePosCode: table.tablePosCode,
    Tablet_number: table.TabletNumber,
    van: table.van,
    Tablet_credit_use: table.credit,
    Tablet_credit_serialnumber: table.creditSerialNumber,
    Tablet_credit_functionArray: table.creditWayArray,
    Tablet_orderAble: table.orderAble,
  }));

  try {
    if (window.UUID) {
      const data = {
        init: {
          T_order_store_code: getStoreCode() ?? '',
          T_order_store_name: getStoreName() ?? '',
          storeVanTid: getStoreInfo.value.storeVanTid ?? '',
          saupNumber: getStoreInfo.value.saupjaNumber ?? '',
          storeCpName: getStoreInfo.value.storeCpName ?? '',
          storeTel: getStoreInfo.value.storeTel ?? '',
          storeAddress: getStoreInfo.value.storeAddress ?? '',
          storeAddress2: getStoreInfo.value.storeAddress2 ?? '',
          preCreditTableUse: getInitTableCreditUse() ?? 0,
          storeSerialNumber: getStoreInfo.value.posSerialNumber ?? '',
          auctionAble: getStoreInfo.value.auctionAble ?? 0,
          chatingAble: getStoreInfo.value.chatingAble ?? 0,
          vanInfo: getStoreInfo.value.vanInfo ?? '',
        },
        goods: [{ dummy_key: 'dummy_value' }],
        table_list: convertedTableListName ?? [],

      };

      window.UUID.writeFile(JSON.stringify(data), '/torder/json/config.json');
    } else {
      console.log('안드로이드 config json 메서드 전송');
    }
  } catch (error) {
    // 오류 케이스 정의 필요
    console.log('에러', error);
  }
};

// Event API 요청
const requestEventAPI = async () => {
  const getInitData = getStorage(CACHE_DATA) as string;
  const getUCode = getStorage(U_CODE);
  const storeCode = getStorage(STORE) ?? '';

  const eventAPIPayload = {
    MACAddr: MACAddr.value,
    uCode: getUCode ?? '',
    path: route.path,
    storeCode,
    tableCode: tableConfig.value.tabletId,
    configHash: md5(JSON.stringify(getInitData)),
  };

  const res = await requestEventConfigUpdate(eventAPIPayload);

  if (res.data.statusCode === 200) {
    const responseData: EventConfigUpdateResponseDataType = res.data.data;
    const currentHashData = md5(getInitData);
    const changeHashData = responseData.configDataHash;

    // 상점 정보가 변경되었을 경우
    if (responseData.configData && currentHashData !== changeHashData) {
      const {
        init,
        storeInfo,
      } = responseData.configData;

      // API 2.0
      if (!init) {
        const { tabletVersion } = storeInfo;

        if (IS_PROD && !IS_LOCAL) {
          // webURL 버전 이동 (리다이렉션 로직)
          const currentUrl = window.location.origin + window.location.pathname;
          // storeInfo의 tabletVersion의 마지막에 /가 적용되어 있지 않으면 강제로 적용해주는 로직 (아래 조건문 실행 위해)
          const formatInitTabletVersion = tabletVersion[tabletVersion?.length - 1] !== '/' ? `${tabletVersion}/` : tabletVersion;

          if (currentUrl !== formatInitTabletVersion) {
            window.location.href = formatInitTabletVersion;
          }
        }

        fetchInitStore(responseData.configData); // store init 갱신
        handleCartConfirm(responseData.configData); // cart init 갱신
        setStorage(CACHE_DATA, JSON.stringify(responseData.configData)); // localStorage init 갱신
        setStoreTheme(responseData.configData?.storeInfo?.theme); // localStorage theme 갱신
        updateLatestUpdateTime(); // ?
        i18nLocaleChange(responseData.configData?.storeInfo?.LanguageDefault ?? KOREAN); // 기본 언어 설정
        const currentTableInfo = responseData.configData.tabletList?.find((table) => table.tabletId === getInitTableId());

        // eventAPI 갱신 시 서비스 점검중일 때 배너/로고 페이지에 머물러 있으면 home으로 이동
        if ((route.path === '/banner' || route.path === '/logo') && getStoreInfo.value.storeClose) {
          pushPage(home);
        }
        // eventAPI 갱신 시 계약 상태가 (해지, 양도양수, 요금미납, 폐업) 하나라도 적용된 경우 배너/로고 페이지에 머물러 있으면 home으로 이동
        if ((route.path === '/banner' || route.path === '/logo') && (getStoreInfo.value.storeStat === 4 || getStoreInfo.value.storeStat === 5 || getStoreInfo.value.storeStat === 6 || getStoreInfo.value.storeStat === 7)) {
          pushPage(home);
        }

        if (currentTableInfo) {
          setTableInfo(currentTableInfo); // store table 갱신
          setStorage(TABLE, JSON.stringify(currentTableInfo)); // localStorage table 갱신
        }
      }

      // API 1.0
      if (!storeInfo) {
        const { T_order_store_tablet_version: tabletVersion } = init as initStoreType;

        window.location.href = `${tabletVersion}?storeCode=${storeCode}&tableCode=${tableConfig.value.tabletId}&tableName=${tableConfig.value.TabletName}`;
      }

      // sendAndroidSetStoreCode();
      openAlert(t('정보가 수정되었습니다!'));
    }
  } else {
    throw new Error('event API 요청에 실패하였습니다.');
  }
};

const openVisitPeopleModalEventListener = (e: Event) => {
  if (!isOccupied.value && !isHaveOrderList.value && getVisitConfig.value?.visitGroupOpenType === 'storeLogo' && getVisitConfig.value?.visitBookUse === 1) {
    if (type.value === HYATT) {
      openModal(CUSTOM_VISIT_PEOPLE);
    } else {
      openModal(VISIT_PEOPLE);

      e.preventDefault();
    }
  }
};

const delayWebReload = () => {
  layoutHubTimeSchedule.value.updateScheduleContext(webReload, Date.now() + getStoreInfo.value?.refreshTime * 1_000);
};

const setActionEventListener = () => {
  const layoutContainer = document.querySelector('.layout-container') as HTMLElement;
  if (!layoutContainer) return;

  layoutContainer.addEventListener('touchstart', openVisitPeopleModalEventListener);
  layoutContainer.addEventListener('touchstart', delayWebReload);
  layoutContainer.addEventListener('touchend', openVisitPeopleModalEventListener);
  layoutContainer.addEventListener('scroll', openVisitPeopleModalEventListener);
};

const removeActionEventListener = () => {
  const layoutContainer = document.querySelector('.layout-container') as HTMLElement;
  if (!layoutContainer) return;

  layoutContainer.removeEventListener('touchstart', openVisitPeopleModalEventListener);
  layoutContainer.removeEventListener('touchstart', delayWebReload);
  layoutContainer.removeEventListener('touchend', openVisitPeopleModalEventListener);
  layoutContainer.removeEventListener('scroll', openVisitPeopleModalEventListener);
};

watch(() => init.value, () => {
  removeActionEventListener();
  setActionEventListener();
});

onMounted(async () => {
  layoutHubTimeSchedule.value.startSchedule();

  onUnmounted(() => {
    layoutHubTimeSchedule.value.endSchedule();
  });

  // 새로고침 리셋 주기 관련 코드
  if (getStoreInfo.value.refreshTime) {
    layoutHubTimeSchedule.value.updateScheduleContext(webReload, Date.now() + getStoreInfo.value?.refreshTime * 1000);
  }

  const { initIsHaveOrderExist } = useOrderConfig();
  const data = await initIsHaveOrderExist();

  updateReviews(data);

  // 상품리스트 최상단 이동
  document.querySelector('.middle-body')?.scrollTo({ top: 0 });

  // 에러페이지일 경우 아무 동작 안함
  if (getRoutePath() === errorPage) return null;

  if (getStoreInfo.value.storeClose) {
    openModal(NOT_USE);
    // 계약 상태가 해지, 양도양수, 요금미납, 폐업일 때 [라이센스 만료] 문구 모달 노출
  } else if (getStoreInfo.value.storeStat === 4 || getStoreInfo.value.storeStat === 5 || getStoreInfo.value.storeStat === 6 || getStoreInfo.value.storeStat === 7) {
    openModal(TERMINATION_OF_CONTRACT);
  } else {
  // 주문내역 여부 ? 배너 : 로고
  // 배너 사용 ? 배너 : 메인
    // eslint-disable-next-line no-lonely-if
    if (data.isOrderExist) {
      const {
        getStoreInfo,
        getBannerList,
      } = storeToRefs(useInitStore());

      if (getStoreInfo.value?.bannerUse && getBannerList.value?.length > 0) {
        pushPage(banner);
      } else {
        pushPage(home);
      }
    } else {
      pushPage(logo);
    }
  }

  window.UUID?.getDeviceUsage();
  if (socket.connected) {
    socket.emit(EVENT, generationBeepData(), () => {
      //
    });
  }

  const initSyncAudioFiles = () => {
    useSyncAudioAOS(SERVING_ROBOT_AUDIO);
  };

  // Uplus의 경우 해당 리소스 알림음 필요로 인해 미리 AOS에 리소스 다운로드
  if (getStoreInfo.value.businessType === 'uplus') initSyncAudioFiles();

  // 도메인 강제접속 시 설정된 URL 로 리다이렉션 되도록 하는 로직
  if (IS_PROD && !IS_LOCAL) {
    const currentUrl = window.location.origin + window.location.pathname;
    // storeInfo 의 tabletVersion 의 마지막에 /가 적용되어 있지 않으면 강제로 적용해주는 로직 (아래 조건문 실행 위해)
    const formatInitTabletVersion = getStoreInfo.value.tabletVersion[getStoreInfo.value.tabletVersion?.length - 1] !== '/' ? `${getStoreInfo.value.tabletVersion}/` : getStoreInfo.value.tabletVersion;

    if (currentUrl !== formatInitTabletVersion) {
      window.location.href = formatInitTabletVersion;
    }
  }

  // sendAndroidSetStoreCode();
  sendAndroidConfigJSON();
  sendAndroidTableJSON();
  requestEventAPI();
  sendAndroidMACAddress();
  setActionEventListener();

  return null;
});

onUnmounted(() => {
  removeActionEventListener();
});

// beepLoopTime마다 beep, eventApi 요청
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const beepLoopTime = 1000 * getRandomInt(90, 150); // 1분 30초 ~ 2분 30초

beepLoop.value = setInterval(async () => {
  socket.emit(EVENT, generationBeepData(), () => {
    //
  });
  await window.UUID?.getDeviceUsage();
  requestEventAPI();
}, beepLoopTime);

// 로고페이지 클릭 시 메뉴판 최상단으로 이동
router.beforeEach((to, from, next) => {
  if (from.path === logo) {
    const elGoodsList = document.querySelector('.product-container');
    if (elGoodsList) elGoodsList.scrollTo(0, 0);
  }
  next();
});

socket.on('connect', () => {
  // 소켓 연결시
  console.log('소켓 연결됨!');
  socket.emit(EVENT, generationBeepData(), () => {
    //
  });
  // sendAndroidSetStoreCode();
  sendAndroidConfigJSON();
  sendAndroidTableJSON();
});

socket.on('disconnect', () => {
  // 소켓 연결시
  console.log('소켓 연결 끊김!!');
});

let arrivedRobotInfo: RobotInfo | undefined;
socket.on(TORDER, async (res: torderResType) => {
// force_update 메세지 수신 시 apk 업데이트를 수행한다.
  if (res.type === 'force_update') {
    if (res.apkInfo) {
      const {
        fileName,
        fileSize,
        option: options,
        url,
      } = res.apkInfo;

      const updateFile = {
        path: 'apk/',
        url,
        fileName,
        fileSize,
        option: { force: false },
      };

      const option = {
        remove: options.remove,
        updateTime: options.updateTime,
        version: options.version || '1.0.0',
      };
      window.UUID?.selfUpdate(updateFile, option);
    }
  }
  if (getMatchedTablet(res)) {
    // torder 소켓 이벤트 강제적으로 새로고침 로직
    if (res.type === 'reload') {
      // 배너 인덱싱 초기화
      handleCurrentBannerIndex(0);
      webReload();
    }
    // [선결제 리메이크] 5단계. 포스 상태 응답 소켓으로 받기
    if (res.type === 'order_result') {
      if (!res.result && res.table.code === getInitTableId()) {
        openPaymentRefundAlarmModal(); // 포스 접수 실패 (주문실패 & 결제취소 안내 팝업 노출) (API -303 에러코드와 동일)
        updatePaymentOrderKey(res.orderKey);
        await postCreditWebLogs('SEND_ORDER_KEY_TO_ANDROID', res.errorCode);
      }
    }
    // 픽업 요청
    // uplus의 경우 도착했을 경우에만 픽업 오디오 재생
    if (res.type === 'message') {
      if (getStoreInfo.value.businessType !== 'uplus') window.UUID?.playOrderBell();
      openModal(PICK_UP);
    }

    // 타이머 메시지
    if (res.type === 'updateTimer') {
      const resData = {
        message: {
          base: res.message.base,
          end: res.message.end,
        },
        sendtime: res.now,
        time: res.time,
      };
      updateTimerMessage(resData);
    }

    // 서빙로봇 이동중
    if (res.type === 'OnTheWay') {
      if (res.table.name === getInitTableName()) {
        pushPage(movingServingRobot); // 로봇 이동중 안내화면 이동

        if (getStoreInfo.value.businessType !== 'uplus') window.UUID?.playOrderBell(); // 알림음 재생
      }
    }
    // 로봇 도착
    if (res.type === 'Arrived') {
      if (res.table.name === getInitTableName()) {
        // 도착한 서빙 로봇 정보를 저장한다.
        arrivedRobotInfo = res.robotInfo;
        pushPage(arriveServingRobot); // 로봇 도착 안내화면 이동

        if (getStoreInfo.value.businessType !== 'uplus') window.UUID?.playOrderBell(); // 알림음 재생
      }
    }

    // 로봇 호출 실패
    if (res.type === 'RobotServerError') {
      const message = res?.ment || t('호출할 수 있는 로봇이 없습니다.');
      openAlert(message); // 에러내용 토스트메세지 노출
    }
  }
  // 로봇 리턴
  if (res.type === 'Returning') {
    if (arrivedRobotInfo?.robot_id === res.robotInfo?.robot_id) {
      pushPage(home);
      if (getStoreInfo.value.businessType !== 'uplus') window.UUID?.playOrderBell(); // 알림음 재생
    }
  }
});

/** 상점정보 업데이트 요청 소켓메세지 수신 시 eventAPI 호출 (즉시반영 처리) */
socket.on('storeUpdate', (res: torderResType) => {
  if (res.type === 'storeUpdate') {
    requestEventAPI();
  }
});

socket.on(TORDER, async (res: torderUpdatedTabletResType) => {
  if (res.type_msg === 'updated_tablet') {
    const isSameTable = tableConfig.value.tabletId === res.data.Ta_id;
    if (!isSameTable) return;
    // 데이터 타입 변경 필요
    setTableInfo(res.data);
    setStorage(TABLE, JSON.stringify(res.data));

    if (window.UUID && window.UUID.setStoreCode && tabletInfo) {
      const storeCodeObj = {
        storeCode,
        tableCode: tableConfig.value.tabletId,
        orderAble: tableConfig.value.orderAble === 1,
      };
      window.UUID.setStoreCode(JSON.stringify(storeCodeObj));
    }
  }

  // 결제 혹은 주문 취소로 인한 테이블 초기화
  if (res.type_msg === 'init') {
    if (getInitTableId() === res.tablet_number) {
      // 영상 배너 다시 보지 않기 초기화
      removeStorage(STOP_EXPOSURE);
      // 인원수 인원 기능 초기화 (테이블에 손님이 없는것으로 판단)
      resetOccupiedTable();

      // get_cart_list 호출
      const isOrderExist = await checkOrderExist(getStoreCode(), getInitTableId(), setOrderList);

      // 배너 인덱스 초기화
      if (!isOrderExist) {
        handleCurrentBannerIndex(0);
      }
    }
  }

  // 주문 완료 후 주문 내역 업데이트
  if (res.type_msg === 'update') {
    if (getInitTableId() === res.tablet_number) { // 해당되는 태블릿만 get_cart_list 호출하게 조건 처리
      const storeCode = getStoreCode();
      const tableCode = getInitTableId();
      // get_cart_list 호출
      await checkOrderExist(
        storeCode,
        tableCode,
        (data) => {
          if (data) {
            setOrderList(data);
            updateReviews(data);
          }
        },
      );
    }
  }
});

// 안드로이드 메세지 수신
window.addEventListener('message', async (event: any) => {
  const { data } = event;

  const {
    methodName,
    message,
    touchLog,
  } = data;

  // DeviceUsage
  if (methodName === 'getDeviceUsage') {
    deviceUsage.value = message;
    console.log(message);
  }
  // [선결제 리메이크] 4단계. 안드로이드 결제완료에 대한 수신
  if (methodName === 'paymentResult') {
    deleteCartProductAll(); // 장바구니 초기화
    closeModal(CART); // 장바구니 닫기
    await checkOrderExist(getStoreCode(), getInitTableId(), setOrderList); // get_cart_list (인원 수 초기화)

    updatePaymentOrderKey(data.orderKey);
    const logText = data.pending ? 'RECEIVE_PENDING_ORDER_FROM_ANDROID' : 'RECEIVE_CLOSE_ACTION_FROM_ANDROID';
    await postCreditWebLogs(logText); // 웹로그 전송
    pushPage(orderComplete); // 주문완료 페이지 이동
  }
  // MAC주소
  if (methodName === 'getMacAddress') {
    updateMACAddr(message?.macAddress);
  }
  // 안드로이드 인터페이스 기능 사용시 에러 로그 수신
  // TODO: 추후 에러 로그 적재 논의, 개선
  if (methodName === 'onLogMessage') {
    console.log(message);
  }
  // 임시
  if (methodName === 'touchEvent') {
    console.log(touchLog);
  }
});

// 기본 컨텍스트 메뉴 동작 막기
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});
</script>

<template>
  <div class="layout-container">
    <FlashModal
      v-if="flag.flash"
      :content="getAlertContent"
    />
    <ConfirmAlertModal v-if="flag.confirmAlertModal" />
    <PaymentRefundAlarmModal v-if="flag.paymentRefundAlarmModal" />
    <PickUpItemModal v-if="flag.pickUp" />
    <NotUseService v-if="flag.notUse" />
    <TerminationOfContract v-if="flag.terminationOfContract" />
    <CallRobotConfirm v-if="flag.callRobotConfirm" />

    <ModalWaypoint />
    <Review/>
    <div v-if="!isComponentsLoading">
      <component :is="layoutComponent">
        <router-view />
      </component>
    </div>

    <VisitPeople v-if="flag.visitPeople && getVisitConfig?.visitGroupOpenType === 'storeLogo'" />
    <CustomVisitPeople v-if="flag.customVisitPeople && !isOccupied && getVisitConfig?.visitGroupOpenType === 'storeLogo'" />
  </div>
  <div class="web-version">
    {{ currentWebVersion }}
  </div>
</template>

<style lang="scss" scoped>
.web-version {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 99999;
  font-size: 0.9375vw;
  font-weight: 500;
  color: #fff;
  letter-spacing: -0.0187vw;
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
