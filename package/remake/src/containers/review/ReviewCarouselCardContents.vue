<template>
  <template v-if="surveyType === 'STORE'">
    매장 평가
  </template>
  <template v-if="props.surveyType === 'ITEM'">
    <ReviewCarouselCardContentsGood
      :price="props.price"
      :displayName="props.displayName"
    />
  </template>
  <template v-if="props.surveyType === 'CUSTOM'">
    <ReviewCarouselCardContentsCustom :surveyCustomTitle="props.surveyCustomTitle"/>
  </template>
</template>

<script setup lang="ts">
import { Review } from '@containers/review/types';
import ReviewCarouselCardContentsGood from '@containers/review/ReviewCarouselCardContentsGood.vue';
import ReviewCarouselCardContentsCustom from '@containers/review/ReviewCarouselCardContentsCustom.vue';

type Props = Review
const props = defineProps<Props>();
</script>
