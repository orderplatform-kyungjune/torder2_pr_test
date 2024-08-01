<template>
  <div class="compare-area">
    <div class="header-wrapper">
      <p class="question-text">
        {{ props.displayReview.question }}
      </p>
    </div>
    <div class="images-area">
      <CardSelector
        :leftImageUrl="props.displayReview.leftImageUrl"
        :leftValue="props.displayReview.leftValue"
        :rightImageUrl="props.displayReview.rightImageUrl"
        :rightValue="props.displayReview.rightValue"
        :initialSelectedType="props.displayReview.selectedType"
        :isEdit="props.isEdit"
        :showAnimation="isSelect"
        :on-selected="select"
      />
      <div class="notification-wrapper">
        <template v-if="!isSelect">
          <CircleArrowImage/>
          <span class="notification-text">
            {{ props.displayReview.compareCompleted ? '마음이 바뀌셨다면 다시 선택해 보세요!' : '터치하여 선택해 주세요' }}
          </span>
          <CircleArrowImage/>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import palette from '@styles/colors';
import {
  type CustomCompareReview,
  type Review,
  type SelectedCustomCompareType,
} from '@containers/review/types';
import useReviewSurvey from '@containers/review/modal/storeReviewSurvey';
import { ContentsComponentParameter } from '@containers/review/modal/ModalContents/types';
import CircleArrowImage from '@containers/review/modal/ModalContents/CompareContent/CircleArrowImage.vue';
import CardSelector from '@containers/review/modal/ModalContents/CompareContent/CardSelector.vue';
import { getAnswers } from '@apis/review/review';

const props = defineProps<Omit<ContentsComponentParameter, 'displayReview'> & { displayReview: CustomCompareReview }>();

const isSelect = ref<boolean>(false);

const select = (selectedType: SelectedCustomCompareType) => {
  const review: Review = {
    ...props.displayReview,
    selectedType,
    compareCompleted: true,
  };

  isSelect.value = true;
  const updated = useReviewSurvey().update(review, getAnswers(review));

  if (updated) {
    props.onContentUpdated();
  }
};

const { white } = palette;
</script>

<style scoped lang="scss">
@import "@containers/review/modal/modal";

$SIDE_PADDING: 16.015;

.compare-area{
  display: flex;
  flex-direction: column;
  gap: 4vh;
  min-height: ($CONTENT_HEIGHT + vh);
  padding: 4vh $SIDE_PADDING + vw 0;
}

.header-wrapper{
  text-align: center;
}

.question-text{
  font-size: var(--font-size-h1, 3.75vw);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-height-adjust);
  color: v-bind(white);
  letter-spacing: var(--letter-spacing-base, -1.5%);
}
.images-area{
  display: flex;
  flex-direction: column;
  gap: 2.5vh;
}

.notification-wrapper{
  display: flex;
  gap: 0.781vw;
  align-items: center;
  justify-content: center;
}

.notification-text{
  font-size: var(--font-size-h5, 1.641vw);
  font-style: normal;
  font-weight: 500;
  line-height: var(--line-height-base);
  color: v-bind(white);
  letter-spacing: var(--letter-spacing-base);
}
</style>
