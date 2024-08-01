<template>
  <div class="selector-container">
    <div class="keyword-label">
      <span class="highlight-text">{{ keyword.keywordsName }}</span> 어떠셨나요?
    </div>
    <div
      class="keywords-area"
      :class="ACTIONABLE_ELEMENT_CLASS"
    >
      <ReviewKeywordCard
        :keyword="keyword.negativeKeywords"
        :selected="keyword.selectedType === 'NEGATIVE'"
        :on-click="() => handleSelectKeyword('NEGATIVE')"
      />
      <ReviewKeywordCard
        :keyword="keyword.generalKeywords"
        :selected="keyword.selectedType === 'GENERAL'"
        :on-click="() => handleSelectKeyword('GENERAL')"
      />
      <ReviewKeywordCard
        :keyword="keyword.positiveKeywords"
        :selected="keyword.selectedType === 'POSITIVE'"
        :on-click="()=>handleSelectKeyword('POSITIVE')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import palette from '@styles/colors';
import {
  type Keyword,
  type KeywordType,
} from '@containers/review/types';
import { ACTIONABLE_ELEMENT_CLASS } from '@containers/review/const';
import ReviewKeywordCard from '@containers/review/ReviewKeywordCard.vue';

const props = defineProps<{
  keyword: Keyword,
  onSelected: (keyword: Keyword) => void,
}>();

const handleSelectKeyword = (type: KeywordType) => {
  props.onSelected({
    ...props.keyword,
    selectedType: type,
  });
};

const {
  gray200,
  white,
} = palette;
</script>

<style scoped lang="scss">
.selector-container{
  display: flex;
  flex-direction: column;
  gap: 3vh;
  align-items: center;
}

.keyword-label{
  font-size: var(--font-size-h2, 3.125vw);
  font-style: normal;
  font-weight: 500;
  line-height: var(--line-height-adjust);
  color: v-bind(gray200);
  letter-spacing: var(--letter-spacing-adjust);
}

.keywords-area{
  display: flex;
  gap: 1.562vw;
}

.highlight-text {
  font-weight: 700;
  color: v-bind(white);
}
</style>
