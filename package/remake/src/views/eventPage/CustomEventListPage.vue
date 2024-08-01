<template>
  <div class="event-page-container">
    <div class="event-page-warp">
      <div class="event-page-header">
        <div class="event-page-header-title">
          {{ t('이벤트') }}
        </div>
        <img
          alt="닫기 아이콘"
          class="event-page-header-close-button"
          src="https://static.torder.co.kr/torder2/btn_small_black_close.svg"
          @click="pushPage(home)"
        >
      </div>
      <div
        v-if="eventList?.length === 0"
        class="event-page-empty-body"
      >
        {{ t('진행중인 이벤트가 없습니다.') }}
      </div>
      <div
        v-else
        class="event-page-body"
      >
        <div
          v-for="event in eventList"
          :key="event.name"
          class="event-list-wrap"
        >
          <div class="event-period">
            {{ event.startDate }} ~ {{ event.endDate }}
          </div>
          <div class="event-image-wrap">
            <img
              :src="event?.imgUrl ?? ''"
              alt="이벤트 배너 이미지"
              class="event-image"
              @click="onClickEventImage(event.name)"
            >
            <div
              v-if="!event?.active"
              class="event-end"
            >
              <span class="event-end-text">
                {{ t('종료된 이벤트입니다.') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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

const { t } = useI18n();
const { init } = storeToRefs(useInitStore());
const { eventList } = init.value;
const {
  moveEventModulePage,
  postLogSurvey,
} = eventModule();
const { openAlert } = useModalStore();

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

/**
 * 이벤트 리스트에서 배너 클릭시 관련 이벤트 모듈로 이동
 * @param {string} eventBannerName - 이벤트 배너 이름
 */
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
.event-page-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: 'Pretendard', sans-serif;
  background-color: rgba(0, 0, 0, .8);

  .event-page-warp {
    display: flex;
    flex-direction: column;
    gap: 1.875vw;
    width: 96.875vw;
    height: 58.75vw;
    padding: 1.5625vw 1.5625vw 2.3438vw 1.5625vw;
    background-color: #fff;
    border-radius: 1.25vw;

    .event-page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .event-page-header-title {
        font-size: 2.5vw;
        font-weight: 700;
        line-height: 3.125vw;
        letter-spacing: -0.05vw;
      }

      .event-page-header-close-button {
        width: 3.125vw;
        height: 3.125vw;

        &.button-active {
          background-color: #EBEBEB;
          border-radius: 0.625vw;
        }
      }
    }

    .event-page-empty-body {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 2.1875vw;
      font-weight: 600;
      line-height: 2.5vw;
      color: #D5D5D5;
      letter-spacing: -0.0438vw;
      background-color: #F8F8F8;
      border-radius: 0.9375vw;
    }

    .event-page-body {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25vw;
      overflow-y: scroll;

      .event-list-wrap {
        display: flex;
        flex-direction: column;
        gap: 1.25vw;
        padding: 1.5625vw;
        background-color: #fff;
        border: 0.0781vw solid #d5d5d5;
        border-radius: 1.25vw;

        .event-period {
          font-size: 1.0938vw;
          font-weight: 500;
          line-height: 1.7188vw;
          color: #AFAFAF;
          letter-spacing: -0.0328vw;
        }

        .event-image-wrap {
          position: relative;
          height: 32.8125vw;

          .event-image {
            width: 100%;
            height: 100%;
            border: 0.0781vw solid #d5d5d5;
            border-radius: 0.9375vw;
            object-fit: cover;
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
            background-color: rgba(49, 49, 49, 0.80);
            border-radius: 0.9375vw;

            .event-end-text {
              width: 80%;
              font-size: 1.875vw;
              font-weight: 600;
              line-height: 2.5vw;
              color: #fff;
              text-align: center;
              letter-spacing: -0.0375vw;
            }
          }
        }

      }
    }
  }
}

</style>
