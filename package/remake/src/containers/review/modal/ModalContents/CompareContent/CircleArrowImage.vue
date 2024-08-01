<template>
  <div class="circle-arrow-image-box">
    <img
      :src="`${MEDIA_RESOURCE_URL}/review/circle-arrow-img.png`"
      alt="circle-arrow-img"
    >
  </div>
</template>

<script setup lang="ts">
import { MEDIA_RESOURCE_URL } from '@torder/common';
</script>

<style scoped lang="scss">
.circle-arrow-image-box{
  width: 1.875vw;
  height: 1.875vw;
  pointer-events: none;

  > img {
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
}
</style>
