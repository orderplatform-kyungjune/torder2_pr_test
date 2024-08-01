<template>
  <div
    class="card-container"
    @click="onClick"
  >
    <div class="top-area">
      <div class="image-wrapper">
        <ReviewImage
          :imageUrl="getImageUrl.imageUrl"
          :defaultImageUrl="getImageUrl.defaultImageUrl"
          :isCompleted="isCompleted"
        />
        <CompletionStamp v-if="isCompleted"/>
      </div>
      <div class="contents-wrapper">
        <ReviewCarouselCardContents v-bind="props.review"/>
      </div>
    </div>
    <div class="bottom-area">
      <ReviewCarouselCardBottom v-bind="props.review"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MEDIA_RESOURCE_URL } from '@torder/common';
import palette from '@styles/colors';
import {
  type CustomReview,
  type Review,
} from '@containers/review/types';

import ReviewImage from '@containers/review/ReviewImage.vue';
import ReviewCarouselCardContents from '@containers/review/ReviewCarouselCardContents.vue';
import ReviewCarouselCardBottom from '@containers/review/ReviewCarouselCardBottom.vue';
import CompletionStamp from '@containers/review/CompletionStamp.vue';

const {
  white,
  gray20,
} = palette;

type Props = {
  review: Review,
  onClick: () => void,
};
const props = defineProps<Props>();
const isCompleted = computed(() => props.review.completionType === 'COMPLETED');

type ReviewImageProps = {
  imageUrl: string,
  defaultImageUrl: string,
};

function getCustomImageUrl(review: CustomReview): ReviewImageProps {
  const { surveyCustomType } = review;

  switch (surveyCustomType) {
    case 'SINGLE':
      return {
        imageUrl: review.imgUrl ?? '',
        defaultImageUrl: `${MEDIA_RESOURCE_URL}/review/review-BI-img.png`,
      };
    case 'COMPARE':
      return {
        imageUrl: `${MEDIA_RESOURCE_URL}/review/review-compare-default-img.png`,
        defaultImageUrl: `${MEDIA_RESOURCE_URL}/review/review-compare-default-img.png`,
      };
    default:
      throw new Error('Invalid SurveyCustomType');
  }
}

const getImageUrl = computed(() => {
  const { surveyType } = props.review;

  switch (surveyType) {
    case 'STORE':
      return {
        imageUrl: props.review.storeImgUrl ?? '',
        defaultImageUrl: `${MEDIA_RESOURCE_URL}/review/review-BI-img.png`,
      };
    case 'ITEM':
      return {
        imageUrl: props.review.imgUrl ?? '',
        defaultImageUrl: `${MEDIA_RESOURCE_URL}/review/review-BI-img.png`,
      };
    case 'CUSTOM':
      return getCustomImageUrl(props.review);
    default:
      throw new Error('Invalid SurveyType');
  }
});
</script>

<style scoped lang="scss">
.card-container{
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 1.5vh;
  width: 29.375vw;
  height: 21.25vh;
  padding: 1.25vw;
  cursor: pointer;
  background-color: v-bind(white);
  border-radius: var(--border-radius-m, 8px);
}

.top-area {
  display: flex;
  gap: 0.937vw;
}

.image-wrapper {
  position: relative;
  width: 10.625vw;
  height: 11.875vh;
  overflow: hidden;
  background-color: v-bind(gray20);
  border-radius: var(--border-radius-m, 8px);
}

.contents-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 15.312vw;
  max-height: 11.875vh;
  font-size: var(--font-size-h4, 1.875vw);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-height-adjust);
  text-align: left;
  letter-spacing: var(--letter-spacing-adjust);
  word-break: break-all;
}

.bottom-area {
  display: flex;
  justify-content: center;
}
</style>
