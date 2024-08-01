<template>
  <div class="contents">
    {{ surveyCustomTitle }}
  </div>
</template>

<script setup lang="ts">

export type ReviewCarouselCardCustomProps = { surveyCustomTitle: string };

defineProps<ReviewCarouselCardCustomProps>();
</script>

<style lang="scss" scoped>
.contents {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
