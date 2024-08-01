<template>
  <div
    class="floating-item review-icon"
    @click="popReviewModal"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { home } from '@router/routePaths';
import { useReviews } from '@containers/review';

const { reviewNotify } = storeToRefs(useReviews());
const router = useRouter();

let abortReviewHandler: ((data?: unknown) => void) | undefined;
const popReviewModal = () => {
  const {
    promise,
    abort,
  } = useReviews().reviewOpen();
  abortReviewHandler = abort;
  promise.catch(() => {});
};

watch(() => reviewNotify.value, (enable) => {
  if (!enable) return;
  switch (router.currentRoute.value.path) {
    case home: {
      const {
        promise,
        abort,
      } = useReviews().reviewOpen({ delegateTerminal: true });
      abortReviewHandler = abort;
      promise.catch(() => {});
      break;
    }

    default:
      break;
  }
});

watch(() => router.currentRoute.value.path, (path) => {
  if (path !== home) {
    abortReviewHandler?.();
  }
});
</script>
