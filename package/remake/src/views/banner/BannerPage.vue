<script lang='ts' setup>
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  computed,
  onMounted,
  ref,
  watch,
  watchEffect,
  onBeforeMount,
  onBeforeUnmount,
} from 'vue';
import { storeToRefs } from 'pinia';
import { flow } from 'fp-ts/function';
import {
  BannerControl,
  SurveyArea,
} from '@views';
import { pushPage } from '@utils/route.helper';
import { getBannerLogoImage } from '@utils/logoUtils';
import {
  setStorage,
  getStorage,
  getStoreName,
  getInitTableName,
  getStorageData,
} from '@torder/common/utils';
import {
  bannerType,
  initDataType,
} from '@torder/common/interface/initData';
import {
  BLACK,
  SECRET_LOGIN,
} from '@torder/common/constant/string';

import {
  CACHE_DATA,
  HORIZONTAL,
  HYATT,
  RESTAURANT_HORIZONTAL,
  RESTAURANT_HORIZONTAL_CARD,
  RESTAURANT_VERTICAL,
  VERTICAL,
  BANNER_CONTROL,
  STOP_EXPOSURE,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useTableStore from '@store/storeTable';
import useModalStore from '@store/storeModal';
import useLogStore from '@store/storeLog';
import useInitStore from '@store/storeInit';
import useBannerStore from '@store/storeBanner';
import {
  banner,
  home,
  login,
} from '@router/routePaths';
import { useReviews } from '@containers/review';
import { TableTagToSecret } from '@containers';
import useHiddenController from '@composables/useHiddenController';
import { useSecret } from '@composables/secret';
import eventModule from '@composables/eventModule';
import {
  CloseButton,
  BasicLayoutStoreTableInfo,
  CustomTableTag,
} from '@components';
import { IS_ORIGIN } from '@common/mode';

type BannerType = 'video' | 'image' | 'survey' | 'android' | 'review' | '';

const route = useRoute();
const { t } = useI18n();
const { theme } = storeToRefs(useThemeStore());
const {
  getBannerList,
  init,
  MACAddr,
  getStoreInfo,
} = storeToRefs(useInitStore());
const { setBannerList } = useInitStore();
const { tableInfo } = storeToRefs(useTableStore());
const {
  openModal,
  closeModal,
} = useModalStore();
const {
  updateAdBannerLogData,
  postDpLoggerFront,
  resetAdBannerLogData,
} = useLogStore();
const { adBannerLogData } = storeToRefs(useLogStore());
const { currentBannerIndex } = storeToRefs(useBannerStore());
const { handleCurrentBannerIndex } = useBannerStore();
const {
  moveEventModulePage,
  postLogSurvey,
} = eventModule();
const { onNextSecret } = useSecret();
const { onNextClick } = useHiddenController();

const videoRef = ref<HTMLVideoElement>();
const bannerListData = ref(getBannerList.value ?? []);
watch(() => getBannerList.value, (list) => {
  bannerListData.value = list;
});

const {
  reviewResult,
  reviewNotify,
} = storeToRefs(useReviews());

let surveyBannerIndex = getBannerList.value.findIndex((banner) => banner.bannerName.includes('survey'));
let timer: ReturnType<typeof setTimeout>;

// 주소창으로 들어오는 경로 방어 코드
const hasLength = getBannerList.value.length > 0;
if (!hasLength) {
  const cacheData = getStorageData<initDataType | null>(CACHE_DATA, null);

  // 캐싱데이터 없으면 다시 로그인
  if (!cacheData) {
    localStorage.clear();
    pushPage(login);
  } else {
    setBannerList(cacheData.bannerList);
  }
}

const currentBannerInfo = computed(() => bannerListData.value?.[currentBannerIndex.value]);

// 배너 클릭시 액션
const clickBanner = () => {
  const isBannerControl = init.value?.storeInfo?.bannerControl;
  if (isBannerControl === 1) {
    openModal(BANNER_CONTROL);
    return;
  }

  const isSurveyBanner = currentBannerInfo.value?.bannerName.includes('survey');
  // survey 배너는 이외 영역 클릭 시 종료되지 않음
  if (isSurveyBanner) {
    return;
  }

  pushPage(home);
};

const modalZIndex = 26;
const bannerZIndex = ref<string>('25');
let abortReviewHandler: ((data?: unknown) => void) | undefined;

type Direction = 'PREV'|'NEXT';
const checkReview = (direction: Direction = 'NEXT') => new Promise<void>((resolve, reject) => {
  const isReviewTime: boolean = (direction === 'PREV')
    ? (currentBannerIndex.value - 1 + bannerListData.value.length) % bannerListData.value.length === bannerListData.value.length - 1
    : (currentBannerIndex.value + 1) % bannerListData.value.length === 0;

  if (
    (!reviewResult.value || reviewResult.value.isAllCompleted) // 리뷰가 모두 완료 되었는지 확인
      || !(isReviewTime || reviewNotify.value) // 리뷰해야 할 사항인지 확인(배너리스트에 마지막) 또는 리뷰요청시간이 되었는지 확인
  ) {
    resolve();
    return;
  }

  bannerZIndex.value = 'auto';
  const {
    promise,
    abort,
  } = useReviews().reviewOpen({
    timeout: 10_000,
    zIndex: modalZIndex,
    delegateTerminal: true,
  }, { force: true });

  abortReviewHandler = abort;

  promise
    .then(resolve)
    .catch(flow(clickBanner, reject))
    .finally(() => {
      bannerZIndex.value = '25';
    });
});

const changeBanner = (): void => {
  clearTimeout(timer);
  closeModal(BANNER_CONTROL);

  checkReview('NEXT').then(() => {
    handleCurrentBannerIndex((currentBannerIndex.value + 1) % bannerListData.value.length);

    timer = setTimeout(changeBanner, bannerListData.value[currentBannerIndex.value].time * 1000);
  }).catch(() => {});
};

const prevBanner = () => {
  clearTimeout(timer);
  checkReview('PREV').then(() => {
    handleCurrentBannerIndex((currentBannerIndex.value - 1 + bannerListData.value.length) % bannerListData.value.length);

    timer = setTimeout(changeBanner, bannerListData.value[currentBannerIndex.value].time * 1000);
  }).catch(() => {});
};

const nextBanner = () => {
  clearTimeout(timer);
  checkReview('NEXT').then(() => {
    handleCurrentBannerIndex((currentBannerIndex.value + 1) % bannerListData.value.length);

    timer = setTimeout(changeBanner, bannerListData.value[currentBannerIndex.value].time * 1000);
  }).catch(() => {});
};

watch(init, (newInit, prev) => {
  surveyBannerIndex = newInit.bannerList.findIndex((banner) => banner.bannerName.includes('survey'));

  // 배너 데이터가 바뀌어도 이어서 재생한다.
  const currentBannerInfo = prev.bannerList[currentBannerIndex.value].bannerName;
  const changedCurrentBannerIndex = newInit.bannerList.findIndex((newBanner) => newBanner.bannerName === currentBannerInfo);

  if (changedCurrentBannerIndex > -1) {
    clearTimeout(timer);
    handleCurrentBannerIndex(changedCurrentBannerIndex);
    timer = setTimeout(changeBanner, bannerListData.value[currentBannerIndex.value].time * 1000);
  }

  // 배너 페이지에서 배너 미사용 옵션 변경 시 홈으로 이동
  if (getStoreInfo.value.bannerUse === 0) pushPage(home);
  if (newInit.bannerList?.length > 0) return;
  pushPage(home);
});

// 이전에 열렸던 리뷰팝업을 강제로 닫는다.
onMounted(() => {
  useReviews().reviewClose();
});

onMounted(() => {
  // 택시쿠폰받기 버튼 클릭으로 접근시
  if (route.query.type === 'module') {
    const tadaEventBanner = getBannerList.value?.find((banner) => banner.bannerName === 'tada_event');
    if (tadaEventBanner) {
      bannerListData.value = [tadaEventBanner];
      return;
    }

    // 배너가 없을 경우 메인화면으로 이동
    pushPage(home);
    return;
  }

  // 쿼리에 targetBanner 가 주어진 경우 타켓 배너로 이동
  if (route.query.target) {
    handleCurrentBannerIndex(getBannerList.value?.findIndex((banner) => banner.bannerName === route.query.target));
  }

  const storeBannerList: bannerType[] = JSON.parse(JSON.stringify(getBannerList.value));
  const localStopExposureData = getStorage(STOP_EXPOSURE);

  let banners;

  // 다시 보지 않기 배너 필터링
  if (localStopExposureData) {
    const stopExposureData: string[] = JSON.parse(localStopExposureData);
    banners = storeBannerList.filter((banner) => !stopExposureData.includes(banner.id));
  } else {
    banners = storeBannerList;
  }

  bannerListData.value = banners;
  if (bannerListData.value.length) handleCurrentBannerIndex(currentBannerIndex.value % bannerListData.value.length);
  else handleCurrentBannerIndex(0);

  const firstBanner = bannerListData.value[0];

  if (firstBanner?.bannerType === 'video') {
    clearTimeout(timer);
  } else {
    timer = setTimeout(changeBanner, bannerListData.value[0]?.time * 1000);
  }
});

// 앱 버전이 낮을 경우 영상배너가 앱에서 실행되지 않아서 playAdMedia 로 영상배너 실행 여부를 판단하기 위한 로직
const isRegisteredPlayAdMedia = () => window?.UUID?.playAdMedia;

const checkedBannerType = computed<BannerType>((): BannerType => {
  const targetBanner = currentBannerInfo.value;
  if (targetBanner?.bannerType === 'video') {
    if (isRegisteredPlayAdMedia()) return 'android';
    return 'video';
  }

  return (targetBanner?.bannerType ?? '') as BannerType;
});

/**
 * template 에서 1번만 호출 되기 때문에 render 시 호출되는 method 로 두는 것도 나쁘지 않을 수 있다.
 */
const isEventBanner = (): boolean => {
  const targetBanner = bannerListData.value?.[currentBannerIndex.value];

  return targetBanner?.listType === 'event';
};
// 설문조사 배너
const SURVEY_CONTENTS = {
  eventBannerName: 'survey_escape',
  answer: '공항대교',
  questions: [
    '공항대교',
    '한남대교',
  ],
  validationMessage: {
    invalidAnswer: '오답입니다. 다른 대교를 선택해주세요.',
    beforeOrder: '주문을 먼저 해주세요.',
    alreadyCheck: '이미 투표하셨습니다.',
    beforeSelect: '대교를 선택 후 응모해주세요.',
  },
};

const isSurveyBanner = computed((): boolean => surveyBannerIndex === currentBannerIndex.value);
const orderUniqueData = JSON.parse(localStorage.getItem('orderUniqueData') ?? '');

const setDpLoggerData = async (currentBannerInfo: bannerType) => {
  if (currentBannerInfo) {
    const params = {
      type: currentBannerInfo.listType,
      order_id: orderUniqueData.orderId,
      order_key: orderUniqueData.orderKey,
      kind: currentBannerInfo.bannerType,
      owner: '',
      banner_id: currentBannerInfo.id,
      exposure_duration: currentBannerInfo.time,
      img_url: currentBannerInfo.url,
      store_ad_code: currentBannerInfo.adCode,
      ip: '',
      tablet_id: tableInfo.value.tabletId,
      mac_address: MACAddr.value,
      store_name: getStoreInfo.value.storeName,
      store_code: getStoreInfo.value.storeCode,
      etc_json: '', // JSON.stringify({})
    };

    updateAdBannerLogData(params);
  }
  if (adBannerLogData.value.length >= 400) {
    postDpLoggerFront();
    resetAdBannerLogData();
  }
};

watch(() => currentBannerInfo.value, (bannerInfo) => {
  const isBannerControl = init.value?.storeInfo?.bannerControl;

  if (bannerInfo?.bannerType === 'video') {
    clearTimeout(timer);

    if (isRegisteredPlayAdMedia()) {
      // android
      const { playAdMedia } = window.UUID;
      playAdMedia(currentBannerIndex.value, currentBannerInfo.value?.url, isBannerControl);
    } else if (videoRef.value) {
      // web
      videoRef.value.load();
    }
  }
}, { immediate: true });

watch(() => currentBannerInfo.value, (newCurrentBannerInfo) => {
  if (IS_ORIGIN) setDpLoggerData(newCurrentBannerInfo);
});

// 영상 배너 다시 보지 않기
const clickStopExposureBanner = () => {
  const stopExposureBannerData = getStorage(STOP_EXPOSURE);

  if (stopExposureBannerData) {
    const editedData = JSON.parse(stopExposureBannerData);
    editedData.push(currentBannerInfo.value.id);
    setStorage(STOP_EXPOSURE, JSON.stringify(editedData));
  } else {
    setStorage(STOP_EXPOSURE, JSON.stringify([currentBannerInfo.value.id]));
  }

  pushPage(home);
};

// 영상배너 관련
const handleMediaBanner = (event: MessageEvent) => {
  const isBannerControl = init.value?.storeInfo?.bannerControl;
  const { data } = event;

  if (data.methodName && data.methodName === 'adMediaEvent') {
    if (data.action === 'ENDED' || data.action === 'NEXT') {
      nextBanner();
    }

    if (data.action === 'PREV') {
      prevBanner();
    }

    if (data.action === 'CLOSE') {
      pushPage(home);
    }

    if (data.action === 'NEVER') {
      clickStopExposureBanner();
    }

    if (data.action === 'TOUCH' && isBannerControl === 0) {
      pushPage(home);
    }

    if (data.action === 'SECRET') {
      pushPage(home);
      openModal(SECRET_LOGIN);
    }
  }
};

const clickEventModuleLinkArea = (eventBannerName: string) => {
  if (eventBannerName.includes('survey')) postLogSurvey(eventBannerName);
  moveEventModulePage(eventBannerName, 'image', 1);
};

const isVertical = computed(() => theme.value.type === VERTICAL);

const isHorizontal = computed(() => theme.value.type === HORIZONTAL);

/**
 * @deprecated 사용하지 않는 테마
 */
const isRestaurantHorizontalCard = computed(() => theme.value.type === RESTAURANT_HORIZONTAL_CARD);

/**
 * @deprecated 사용하지 않는 테마
 */
const isRestaurantHorizontal = computed(() => theme.value.type === RESTAURANT_HORIZONTAL);

/**
 * @deprecated 사용하지 않는 테마
 */
const isRestaurantVertical = computed(() => theme.value.type === RESTAURANT_VERTICAL);

const isHyatt = computed(() => theme.value.type === HYATT);

onBeforeMount(() => {
  window.addEventListener('message', handleMediaBanner);
});

// 리뷰 관련 unmount 로직
onBeforeUnmount(() => {
  abortReviewHandler?.();
});

onBeforeUnmount(async () => {
  postDpLoggerFront();
  resetAdBannerLogData();
  clearTimeout(timer);

  handleCurrentBannerIndex(currentBannerIndex.value + 1);
  window.removeEventListener('message', handleMediaBanner);
});
</script>

<template>
  <BannerControl
    :nextBanner="nextBanner"
    :prevBanner="prevBanner"
  />
  <div class="banner-container">
    <div
      class="company-logo"
      @click="onNextClick"
    >
      <img
        :src="getBannerLogoImage()"
        alt="메인 로고"
        class="company-logo-image"
      />
    </div>
    <!-- 세로, 가로 블랙 테마 -->
    <BasicLayoutStoreTableInfo
      v-if="isVertical || isHorizontal"
      :storeName="getStoreName()"
      :tableName="getInitTableName()"
      :theme-color="BLACK"
      :title="t('테이블명')"
      class="table-container"
      @click="onNextSecret"
    />
    <!-- 레스토랑 테마 -->
    <TableTagToSecret
      v-if="isRestaurantHorizontal || isRestaurantHorizontalCard || isRestaurantVertical"
      class="restaurant-theme-table"
    />
    <!-- 커스텀 테마 -->
    <CustomTableTag
      v-if="isHyatt"
      :storeInfo="getStoreName()"
      :tableInfo="getInitTableName()"
      class="custom-theme-table"
      @click="onNextSecret"
    />

    <div
      :class="theme.type"
      class="banner-wrap"
    >
      <CloseButton
        :background="'#fff'"
        :color="'#000'"
        :content="t('닫기')"
        :theme-type="theme.type"
        class="close-button"
        route="https://static.torder.co.kr/torder2/svg_closebutton_normal_black.svg"
        @click="pushPage(home)"
      />
      <div
        v-if="checkedBannerType === 'video'"
        class="stop-exposure-banner-button"
        @click="clickStopExposureBanner"
      >
        {{ t('다시 보지 않기') }}
      </div>
      <video
        v-if="!isRegisteredPlayAdMedia() && checkedBannerType === 'video'"
        ref="videoRef"
        :autoplay="true"
        :muted="true"
        class="video-banner"
        @click="clickBanner"
        @ended="changeBanner"
      >
        <source
          :src="currentBannerInfo?.url ?? ''"
          type="video/webm"
        />
      </video>
      <img
        v-if="checkedBannerType === 'image'"
        ref="banner"
        :src="currentBannerInfo?.url ?? ''"
        alt="banner"
        class="banner-image"
        @touchstart.prevent="clickBanner"
      />
      <SurveyArea
        v-if="isSurveyBanner"
        :clickEventModuleLinkArea="clickEventModuleLinkArea"
        :surveyContents="SURVEY_CONTENTS"
        class="event-survey-link-area"
      />
      <div
        v-else-if="isEventBanner()"
        class="event-module-link-area"
        @touchstart.prevent="clickEventModuleLinkArea(currentBannerInfo.bannerName)"
      ></div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.banner-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: v-bind(bannerZIndex);

  .company-logo {
    position: absolute;
    top: 1.5625vw;
    left: 50%;
    z-index: v-bind(modalZIndex);
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, 0%);

    .company-logo-image {
      max-width: 16.328125vw;
      max-height: 3.75vw;
      object-fit: contain;
    }
  }

  .table-container {
    position: fixed;
    top: 0;
    right: 1.5625vw;
    z-index: v-bind(modalZIndex);
  }

  .banner-wrap {
    display: flex;
    width: 100vw;
    height: 100vh;
    background-color: #000000;

    .close-button {
      position: fixed;
      top: 1.5625vw;
      left: 1.5625vw;
      z-index: v-bind(modalZIndex);
    }

    .stop-exposure-banner-button {
      position: fixed;
      top: 1.5625vw;
      left: 13.5625vw;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 5vw;
      padding: 0 2vw;
      font-size: 2.3438vw;
      color: #000;
      background-color: #fff;
      border-radius: 100vw;
      box-shadow: 0 0 0.8vw -0.4vw #000;

      &.custom {
        right: 13.5625vw;
      }
    }

    .torder-logo {
      position: fixed;
      top: 1.5625vw;
      left: 50%;
      width: 6.25vw;
      transform: translate(-50%, 0);

      &.CI {
        width: 9.375vw;
      }
    }

    .banner-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }

    .event-module-link-area {
      position: absolute;
      bottom: 0;
      width: 100vw;
      height: 8.75rem;
    }

    .event-survey-link-area {
      position: absolute;
      right: 1.25vw;
      bottom: 3.125vw;
      width: 51.5625vw;
    }
  }
}

.restaurant-theme-table {
  position: absolute;
  right: 1.5625vw;
  z-index: 20;
  width: 15.625vw;
}

.custom-theme-table {
  position: absolute;
  top: 0;
  right: 1.5625vw;
  z-index: v-bind(modalZIndex);
}
</style>
