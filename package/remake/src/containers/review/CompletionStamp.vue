<template>
  <img
    alt="review_completion_stamp"
    class="completion-stamp"
    :src="`${MEDIA_RESOURCE_URL}/review/review-completion-stamp-img.png`"
  >
</template>

<script setup lang="ts">
import { MEDIA_RESOURCE_URL } from '@torder/common';
</script>

<style scoped lang="scss">
.completion-stamp {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6.25vw;
  height: 6.25vw;
  transform: translate(-50%, -50%);
}
</style>
