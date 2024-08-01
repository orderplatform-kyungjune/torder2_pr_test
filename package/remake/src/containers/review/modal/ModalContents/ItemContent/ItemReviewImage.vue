<template>
  <template v-if="isError">
    <img
      :src="defaultImageUrl"
      alt="review_image"
      class="error"
    >
  </template>
  <template v-else>
    <img
      :src="imageUrl"
      alt="review_image"
      class="normal"
      @error="()=> isError = true"
    >
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isError = ref(false);

type Props ={
  defaultImageUrl: string,
  imageUrl: string,
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.error{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10.39vw;
  height: 7.5vh;
  transform: translate(-50%, -50%);
}

.normal{
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>
