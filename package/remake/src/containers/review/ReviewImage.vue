<template>
  <img
    alt="review_image"
    :src="isError || !imageUrl ? defaultImageUrl : imageUrl"
    :class="isError || !imageUrl ? 'review-image-error' : 'review-image'"
    @error="!isError ? onError : undefined"
  >
</template>

<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue';

const props = defineProps<{
  imageUrl: string,
  defaultImageUrl: string,
  isCompleted: boolean,
}>();

const isError = ref<boolean>(false);

const opacity = computed(() => (props.isCompleted ? 0.4 : 1));

const onError = () => {
  isError.value = true;
};
</script>

<style scoped lang="scss">
.review-image-error {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4.687vw;
  height: 3.5vh;
  opacity: v-bind(opacity);
  transform: translate(-50%, -50%);
}

.review-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: v-bind(opacity);
}
</style>
