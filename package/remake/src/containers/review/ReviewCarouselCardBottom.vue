<template>
  <template v-if="(props.surveyType === 'STORE' || props.surveyType === 'ITEM')">
    <ReviewPointStars
      :reviewPoint="props.reviewPoint"
      :size="2.812"
      :gap="0.468"
      :disabled="true"
    />
  </template>
  <template v-if="props.surveyType === 'CUSTOM'">
    <ReviewCarouselCardBottomContents
      :reviewPoint="props.reviewPoint"
      :surveyCustomType="props.surveyCustomType"
    />
  </template>
</template>

<script setup lang="ts">
import {
  SurveyCustomType,
  SurveyType,
} from '@containers/review/types';
import ReviewPointStars from '@containers/review/ReviewPointStars.vue';
import ReviewCarouselCardBottomContents from '@containers/review/ReviewCarouselCardBottomContents.vue';

type Props = {
  surveyType: SurveyType,
  reviewPoint?: number,
  surveyCustomType?: SurveyCustomType,
}
const props = defineProps<Props>();
</script>
