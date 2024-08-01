<template>
  <div class="event-page">
    <div class="event-page-header">
      <span class="head-text">EVENT</span>
      <span>
        {{ `${t('진행중인')} ${t('이벤트')} ( ${getEventListCount()} )` }}
      </span>
    </div>
    <div class="event-page-body">
      <ul
        v-for="event in eventList"
        :key="event.name"
      >
        <li class="event-list">
          <div
            v-if="!event?.active"
            class="event-end"
          >
            이벤트 종료
          </div>
          <img
            :src="event?.imgUrl ?? ''"
            alt="이벤트 배너 이미지"
            class="event-image"
            @click="onClickEventImage(event.name)"
          >
        </li>
      </ul>
    </div>
  </div>
  <CloseButton
    :content="t('닫기')"
    background="#fff"
    borderRadius="0.625vw"
    class="close-btn"
    color="#000"
    route="https://static.torder.co.kr/torder2/svg_closebutton_normal_black.svg"
    theme-type="white"
    @click="pushPage(home)"
  />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import {
  getRouteName,
  pushPage,
  pushPageWithQueries,
} from '@utils/route.helper';
import useOrderListStore from '@store/storeOrderList';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import {
  banner,
  home,
} from '@router/routePaths';
import eventModule from '@composables/eventModule';
import { CloseButton } from '@components';

const { t } = useI18n();

const { init } = storeToRefs(useInitStore());

const { openAlert } = useModalStore();

const { eventList } = init.value;

const {
  moveEventModulePage,
  postLogSurvey,
} = eventModule();

const getEventListCount = () => eventList?.length ?? 0;

const checkBeforeOrder = (): boolean => {
  const { orderList } = useOrderListStore();
  return orderList.order_info.length === 0;
};

// 설문조사 이벤트는 국제화 대상에서 제외
const handleBeforeOrder = (): void => {
  openAlert('주문을 먼저 해주세요.');
};

/**
 * survey 이름을 가진 이벤트는 유효성 검사 후 질문 선택을 위해 배너로 이동해야함
 * @param {string} eventBannerName - 이벤트 배너 이름
 */
const exceptionSurveyBanner = (eventBannerName: string) => {
  const queryData = { target: eventBannerName };
  if (checkBeforeOrder()) {
    handleBeforeOrder();
    return;
  }

  postLogSurvey(eventBannerName);
  pushPageWithQueries(getRouteName(banner), queryData);
};

const onClickEventImage = (eventBannerName: string): void => {
  const isSurveyBanner = eventBannerName.includes('survey');
  if (isSurveyBanner) {
    exceptionSurveyBanner(eventBannerName);
    return;
  }

  moveEventModulePage(eventBannerName, 'image', 1);
};

</script>

<style lang="scss" scoped>
.event-page {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
  display: grid;
  grid-template-rows: 20% 80%;
  width: 100%;
  height: 100%;
  padding: 3.9063vw;
  color: #fff;
  background-color: rgba($color: #000000, $alpha: 0.9);

  .event-page-header {
    display: flex;
    flex-direction: column;
    gap: 1.5625vw;
    font-size: 3.125vw;
    font-weight: 300;

    .head-text {
      font-size: 4.375vw;
      font-weight: 900;
    }
  }

  .event-page-body {
    display: flex;
    gap: 2.3438vw;
    padding: 3.125vw;
    overflow-x: scroll;

    .event-list {
      position: relative;
      width: 19.5313vw;
      height: 32.0313vw;
      overflow: hidden;
      border-radius: 1.5625vw;

      .event-image {
        width: 100%;
        height: 100%;
        object-fit: fill;
      }

      .event-end {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: 2.1875vw;
        color: #fff;
        background-color: #000;
        opacity: 70%;
      }
    }
  }
}

.close-btn {
  position: absolute;
  top: 2.3438vw;
  right: 2.3438vw;
  z-index: 55;
  font-weight: 700;
}
</style>
