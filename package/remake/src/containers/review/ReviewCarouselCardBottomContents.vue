<template>
  <template v-if="props.surveyCustomType === 'SINGLE'">
    <ReviewPointStars
      :reviewPoint="props.reviewPoint"
      :size="2.812"
      :gap="0.468"
      :disabled="true"
    />
  </template>
  <template v-if="props.surveyCustomType === 'COMPARE'">
    <div class="custom-compare-bottom-contents">
      투표하기
    </div>
  </template>
</template>

<script setup lang="ts">
import palette from '@styles/colors';
import { SurveyCustomType } from '@containers/review/types';
import ReviewPointStars from '@containers/review/ReviewPointStars.vue';

type Props = {
  reviewPoint?: number,
  surveyCustomType?: SurveyCustomType,
}
const props = defineProps<Props>();

const {
  gray100,
  gray600,
} = palette;
</script>

<style scoped lang="scss">
.custom-compare-bottom-contents {
  flex: 1 1 0;
  padding: 0.312vw;
  font-size: var(--font-size-h6, 1.328vw);
  font-style: normal;
  font-weight: 600;
  line-height: var(--line-height-base);
  color: v-bind(gray600);
  text-align: center;
  letter-spacing: var(--letter-spacing-base);
  border: 1px solid v-bind(gray100);
  border-radius: var(--border-radius-m, 8px);
}
</style>
