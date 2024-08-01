<template>
  <div
    ref="pointAreaRef"
    class="review-point-area"
  >
    <div class="top-content-wrapper">
      <div class="item-info-box">
        <div class="item-info-text">
          <p class="item-name-text">
            {{ replaceSlashToSpacing(props.displayReview.displayName) }}
          </p>
          어떠셨나요?
        </div>
        <div style="width: 100%">
          <LabelText
            label="가격"
            :value="itemInfoBoxLabel"
          />
          <LabelText
            v-if="hasOptions"
            label="옵션"
            :value="renderOptions"
          />
        </div>
      </div>
      <div class="image-wrapper">
        <ItemReviewImage
          :imageUrl="props.displayReview.imgUrl ?? ''"
          :defaultImageUrl="`${MEDIA_RESOURCE_URL}/review/BI-img.png`"
        />
      </div>
    </div>
    <div style="text-align: center;">
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
      :on-click="() => handleMoveArea('KEYWORDS')"
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
      :onClick="() => {
        handleMoveArea('POINT');
      }"
    />
  </div>
</template>

<script setup lang="ts">

import {
  computed,
  h,
  ref,
} from 'vue';
import { MEDIA_RESOURCE_URL } from '@torder/common';
import palette from '@styles/colors';
import {
  ItemReview,
  Keyword,
} from '@containers/review/types';
import useReviewSurvey from '@containers/review/modal/storeReviewSurvey';
import { ContentsComponentParameter } from '@containers/review/modal/ModalContents/types';
import VerticalBar from '@containers/review/modal/ModalContents/ItemContent/VerticalBar.vue';
import LabelText from '@containers/review/modal/ModalContents/ItemContent/LabelText.vue';
import ItemReviewImage from '@containers/review/modal/ModalContents/ItemContent/ItemReviewImage.vue';
import ReviewPointStars from '@containers/review/ReviewPointStars.vue';
import ReviewKeywordSelector from '@containers/review/ReviewKeywordSelector.vue';
import ModifyButton from '@containers/review/ModifyButton.vue';
import {
  getAnswers,
  replaceSlashToSpacing,
} from '@apis/review/review';

const props = defineProps<Omit<ContentsComponentParameter, 'displayReview'> & { displayReview: ItemReview }>();

const {
  gray200,
  white,
  gray700,
} = palette;

const keywordCount = computed(() => props.displayReview.keywords.length);
const hasOptions = computed(() => props.displayReview.options.length > 0);
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

const renderOptions = computed(() => h(
  'div',
  {
    style: {
      fontWeight: 500,
      color: gray200,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  props.displayReview.options.map(
    ({
      optionName,
      optionCode,
    }, idx) => {
      const children = [];
      let margin = '';
      if (idx > 0) {
        children.push(
          h(VerticalBar),
        );
        margin = '0 0.937vw';
      }
      children.push(replaceSlashToSpacing(optionName));
      return h(
        'span',
        {
          key: `${optionCode}_${idx}`,
          style: {
            margin,
            marginRight: 0,
            firstOfType: { marginLeft: 0 },
          },
        },
        children,
      );
    },
  ),
));

const itemInfoBoxLabel = computed(() => h(
  'span',
  {
    style: {
      fontWeight: 500,
      color: palette.gray200,
    },
  },
  [`${props.displayReview.price.toLocaleString()}원`],
));

const getKeywordsWrapperPaddingTop = computed(() => {
  switch (keywordCount.value) {
    case 1:
      return '20vh';
    case 2:
      return '4vh';
    default:
      return 0;
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

.image-wrapper {
  position: relative;
  width: 39.062vw;
  height: 43.25vh;
  overflow: hidden;
  background-color: v-bind(gray700);
  border-radius: var(--border-radius-m, 8px);
}

.keywords-area {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: ($CONTENT_HEIGHT + vh);
  padding: 0 ($SIDE_PADDING + 3.281) + vw;
  margin-top: ($BUTTON_AREA_HEIGHT + vh);
}

.review-point-area {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3vh;
  min-height: ($CONTENT_HEIGHT + vh);
  padding: 3.125vh 12.343vw 0;
}

.top-content-wrapper {
  display: flex;
  gap: 1.875vw;
}

.keywords-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6vh;
  padding-top: v-bind(getKeywordsWrapperPaddingTop);
}

.item-info-box {
  display: flex;
  flex-direction: column;
  gap: 1.5vh;
  width: 100%;
  max-width: 34.375vw;
}

.item-info-text {
  font-size: 4.843vw;
  font-weight: 700;
  line-height: var(--line-height-adjust, 130%);
  color: v-bind(white);
  letter-spacing: var(--letter-spacing-adjust, -2%);
}

.item-name-text {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  word-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

</style>
