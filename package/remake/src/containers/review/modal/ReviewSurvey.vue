<template>
  <div
    v-if="open"
    class="modal-container"
  >
    <div class="header-area">
      <div>
        <span
          v-if="!modalDisplayInfo?.isEdit"
          class="count-badge"
        >{{ activeIndex + 1 }}/{{ modalDisplayInfo?.displayReview.length }}</span>
        <span class="header-text">{{ getHeaderText(modalDisplayInfo?.displayReview ?? [], activeIndex) }}</span>
      </div>
    </div>
    <ReviewSurveyContent
      :displayReviewList="modalDisplayInfo.displayReview"
      :isEdit="modalDisplayInfo?.isEdit ?? false"
      :activeIndex="activeIndex"
      :setActiveIndex="(d)=>activeIndex = d"
    />
    <div class="button-area">
      <div
        class="close-button"
        :class="ACTIONABLE_ELEMENT_CLASS"
        @click="click"
      >
        {{ modalDisplayInfo?.isEdit ? '저장하고 닫을게요' : '리뷰 다음에 할게요' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
} from 'vue';
import { storeToRefs } from 'pinia';
import palette from '@styles/colors';
import { Review } from '@containers/review/types';
import useReviews from '@containers/review/storeReivews';
import useReviewSurvey from '@containers/review/modal/storeReviewSurvey';
import { ACTIONABLE_ELEMENT_CLASS } from '@containers/review/const';
import { replaceSlashToSpacing } from '@apis/review/review';
import ReviewSurveyContent from './ModalContents/ReviewSurveyContent.vue';

const { orderListForReview } = storeToRefs(useReviews());
const { onCreateLogAndMessage } = useReviews();

const {
  open,
  answerList,
  modalDisplayInfo,
} = storeToRefs(useReviewSurvey());

const { reviewSurveyClose } = useReviewSurvey();

/**
 * review 모달에서 carousel 의 위치 값
 */
const activeIndex = ref<number>(0);

watch(() => modalDisplayInfo.value.displayReview.length, () => {
  // 평가지 modal 에 보여질 리스트가 달라지게 될 경우 초기화를 한다.
  // 주의사항 길이는 똑같으나 순서가 바꼈을때 activeIndex 의 위치에 내용이 달라질수 있다. 단, 현재 서비스로직에서는 가능성이 없다.
  activeIndex.value = 0;
});

const { white } = palette;

function getHeaderText(reviewList: Review[], activeIndex: number) {
  if (reviewList.length - 1 < activeIndex) {
    return null;
  }
  const activeReview = reviewList[activeIndex];
  const { surveyType } = activeReview;

  if (surveyType === 'CUSTOM') {
    return activeReview.surveyCustomTitle;
  }

  if (surveyType === 'ITEM') {
    return replaceSlashToSpacing(activeReview.displayName);
  }

  return activeReview.displayName;
}

const click = () => {
  // 전송
  // TODO: 포인트만 바꼈을 때도 체크, 이전 답변이 초기화 필요, 답변의 변경여부 확인 여부안함(각 평가지에서 수정 해야함)
  if (answerList.value.length > 0) {
    answerList.value.forEach(({
      review,
      answer,
    }) => {
      useReviews().onUpdateReview({
        ...review,
        answerList: answer,
      });
    });
  }

  if (orderListForReview.value?.triggerType !== 'CLICK') {
    onCreateLogAndMessage();
  }

  reviewSurveyClose();
};

</script>

<style scoped lang="scss">
@import "./modal";

.modal-container{
  position: absolute;
  inset: 0;
  z-index: 20;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #0e1218;
}
.header-area{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 2;
  height: $HEADER_AREA_HEIGHT + vh;
  padding-top: 3vh;
  padding-left: 12.5vw;
  background-color: #0e1218;
}

.count-badge{
  display: inline-flex;
  padding: 0 0.625vw;
  margin-right: 0.64vw;
  font-size: var(--font-size-h6, 1.328vw);
  font-style: normal;
  line-height: var(--line-height-base);
  color: #e3e8ed;
  letter-spacing: var(--letter-spacing-base);
  background-color: #323a49;
  border-radius: var(--border-radius-infinite, 9999px);
}

.header-text{
  font-size: var(--font-size-h5, 1.641vw);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-height-base);
  color: #e3e8ed;
  letter-spacing: var(--letter-spacing-base);
}

.button-area{
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  height: $BUTTON_AREA_HEIGHT + vh;
  padding: 0 1.875vw;
  background-color: #0e1218;
}
.close-button{
  height: 9vh;
  padding: 2vh 2.187vw;
  font-size: var(--font-size-h3, 2.5vw);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-height-adjust);
  color: #0e1218;
  text-align: center;
  letter-spacing: var(--letter-spacing-base, -1.5%);
  cursor: pointer;
  background-color: v-bind(white);
  border-radius: var(--border-radius-m, 8px);
}
</style>
