<template>
  <div
    ref="pointAreaRef"
    class="review-point-area"
  >
    <div class="top-content-wrapper">
      <div class="item-info-box">
        <span class="sub-title">매장 평가</span>
        <div class="item-info-text">
          <p class="item-name-text">
            {{ props.displayReview.displayName }}
          </p>
          어떠셨나요?
        </div>
      </div>
      <div class="image-wrapper">
        <StoreReviewImage
          :imageUrl="props.displayReview.storeImgUrl ?? ''"
          :defaultImageUrl="`${MEDIA_RESOURCE_URL}/review/BI-img.png`"
        />
      </div>
    </div>
    <div class="review-point-stars-wrap">
      <ReviewPointStars
        type="Gradation"
        :size="10.937"
        :gap="1.25"
        :reviewPoint="props.displayReview.reviewPoint"
        :on-change="reviewPointStarsChange"
      />
    </div>
    <ModifyButton
      v-if="keywordCount > 0 && props.displayReview.pointCompleted"
      type="KEYWORD"
      :onClick="() => handleMoveArea('KEYWORDS')"
    />
  </div>
  <div
    v-if="keywordCount > 0"
    ref="keywordsAreaRef"
    class="keywords-area"
  >
    <div class="keywords-wrapper">
      <ReviewKeywordSelector
        v-for="(keyword, idx) in props.displayReview.keywords"
        :key="`${keyword.keywordsName}_${idx}`"
        :keyword="keyword"
        :on-selected="reviewKeywordSelectorSelected(idx)"
      />
    </div>
    <ModifyButton
      type="POINT"
      :onClick="() => handleMoveArea('POINT')"
    />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue';
import { MEDIA_RESOURCE_URL } from '@torder/common';
import palette from '@styles/colors';
import {
  Keyword,
  StoreReview,
} from '@containers/review/types';
import useReviewSurvey from '@containers/review/modal/storeReviewSurvey';
import { ContentsComponentParameter } from '@containers/review/modal/ModalContents/types';
import StoreReviewImage from '@containers/review/modal/ModalContents/StoreContent/StoreReviewImage.vue';
import ReviewPointStars from '@containers/review/ReviewPointStars.vue';
import ReviewKeywordSelector from '@containers/review/ReviewKeywordSelector.vue';
import ModifyButton from '@containers/review/ModifyButton.vue';
import { getAnswers } from '@apis/review/review';

const {
  gray50,
  gray700,
  white,
} = palette;

const props = defineProps<Omit<ContentsComponentParameter, 'displayReview'> & { displayReview: StoreReview }>();

const keywordCount = computed(() => props.displayReview.keywords.length);
const pointAreaRef = ref<HTMLDivElement | null>(null);
const keywordsAreaRef = ref<HTMLDivElement | null>(null);
/**
 * carousel 를 사용하고 있기 때문에 다음 리스트로 넘어가기 위해서 scrollIntoView 를 사용하고 있음.
 * TODO: 평가지(review-modal)를 carousel 를 사용하지 않는 방안 검토 필요.
 * @param target
 * @return scrollIntoView 호출하지 못했을 때 false
 */
const handleMoveArea = (target: 'POINT' | 'KEYWORDS') => {
  const targetEl = (target === 'POINT') ? pointAreaRef.value : keywordsAreaRef.value;

  if (!targetEl) return false;

  setTimeout(() => targetEl.scrollIntoView(), 50); // 별점이 표시되기 전에 넘어가는 현상으로 인해 수정

  return true;
};

const getKeywordsWrapperPaddingTop = computed(() => {
  switch (keywordCount.value) {
    case 1: return '20vh';
    case 2: return '4vh';
    default: return 0;
  }
});

const reviewPointStarsChange = ((initReviewPoint?: number) => (reviewPoint: number) => {
  const review = {
    ...props.displayReview,
    reviewPoint,
    pointCompleted: true,
  };

  let updated = false;
  if (initReviewPoint !== reviewPoint) {
    updated = useReviewSurvey().update(review);
  }

  if (keywordCount.value > 0) {
    handleMoveArea('KEYWORDS');
    return;
  }

  if (updated) {
    setTimeout(props.onContentUpdated, 50);
  }
})(props.displayReview.reviewPoint);

const reviewKeywordSelectorSelected = (idx: number) => (keyword: Keyword) => {
  const review = {
    ...props.displayReview,
    keywords: props.displayReview.keywords.map((item, i) => ((idx === i) ? keyword : item)),
  };

  const answers = getAnswers(review);
  const keywordsCompleted = props.displayReview.keywords.length === answers.length;

  const updated = useReviewSurvey().update({
    ...review,
    keywordsCompleted,
  }, answers);

  if (updated && keywordsCompleted) {
    props.onContentUpdated();
  }
};
</script>

<style scoped lang="scss">
@import "@containers/review/modal/modal";

.review-point-area {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3vh;
  min-height: ($CONTENT_HEIGHT + vh);
  padding: 3.125vh ($SIDE_PADDING + vw) 0;
}

.top-content-wrapper {
  display: flex;
  gap: 1.875vw;
}

.item-info-box{
  display: flex;
  flex-direction: column;
  gap: 1vh;
  width: 100%;
  max-width: 34.375vw;
}

.sub-title {
  padding-left: 0.312vw;
  font-size: 2.187vw;
  font-weight: 500;
  line-height: var(--line-height-adjust, 130%);
  color: v-bind(gray50);
  letter-spacing: var(--letter-spacing-base, -1.5%);
}

.item-info-text {
  font-size: 4.843vw;
  font-weight: 700;
  line-height: var(--line-height-adjust, 130%);
  color: v-bind(white);
  letter-spacing: var(--letter-spacing-adjust, -2%);
}

.item-name-text{
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  word-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.image-wrapper{
  position: relative;
  width: 39.062vw;
  height: 43.25vh;
  overflow: hidden;
  background-color: v-bind(gray700);
  border-radius: var(--border-radius-m, 8px);
}

.keywords-area{
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: ($CONTENT_HEIGHT + vh);
  padding: 0 ($SIDE_PADDING + 3.281) + vw;
  margin-top: ($BUTTON_AREA_HEIGHT + vh);
}

.keywords-wrapper{
  display: flex;
  flex-direction: column;
  gap: 6vh;
  padding-top: v-bind(getKeywordsWrapperPaddingTop);
}

.review-point-stars-wrap{
  text-align: center
}
</style>
