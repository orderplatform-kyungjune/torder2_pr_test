<template>
  <div
    class="floating-list"
    :class="theme.type"
  >
    <CustomThemeFloatingItemReview v-if="showReview"/>
  </div>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import useThemeStore from '@store/storeTheme';
import useInitStore from '@store/storeInit';
import CustomThemeFloatingItemReview from '@containers/shared/CustomThemeFloatingItemReview.vue';
import { useReviews } from '@containers/review';

const { theme } = useThemeStore();

const { reviewResult } = storeToRefs(useReviews());

const { getStoreInfo } = storeToRefs(useInitStore());
const showReview = computed(() => ((getStoreInfo.value.storeSurveyUse === 'Y') && ((reviewResult.value?.reviewList.length ?? 0) > 0)));

</script>

<style scoped lang="scss">
.floating-list {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: 10;
  min-width: 10.56209375vw;
  transform: translateY(-50%);

  &.horizontal {
    flex-direction: row;
  }

  .floating-item {
    width: 8.4375vw;
    height: 8.4375vw;

    &.review-icon {
      background: no-repeat url("https://static.torder.co.kr/torder2/review/icon_review_default.svg");
      background-size: contain;
      border-radius: 1.40625vw;
      box-shadow: 0 0.46875vw 1.5625vw 0 #D874004F;
      &:active {
        background: no-repeat url("https://static.torder.co.kr/torder2/review/icon_review_press.svg");
        background-size: contain;
      }
    }
  }
}
</style>
