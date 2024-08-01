<template>
  <template v-if="isError">
    <img
      :src="props.defaultImageUrl"
      alt="review_image"
      class="error"
    >
  </template>
  <template v-else>
    <img
      :src="props.imageUrl"
      alt="review_image"
      class="normal"
      @error="() => isError = true"
    >
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type Props = {
  imageUrl: string, defaultImageUrl: string,
}

const props = defineProps<Props>();
const isError = ref(false);
</script>

<style scoped lang="scss">
.class{
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
