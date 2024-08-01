<template>
  <div
    class="card-container"
    @click="onClick"
  >
    <div class="image-box">
      <CardImage
        :imageUrl="imageUrl ?? ''"
        :defaultImageUrl="`${MEDIA_RESOURCE_URL}/review/BI-img.png`"
      />
    </div>
    <span class="card-text">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
import {
  h,
  ref,
} from 'vue';
import { MEDIA_RESOURCE_URL } from '@torder/common';
import palette from '@styles/colors';

const {
  white,
  gray20,
} = palette;

type Props = {
  imageUrl: string,
  value: string,
  onClick: () => void,
};
defineProps<Props>();

function CardImage({
  imageUrl,
  defaultImageUrl,
}: { imageUrl: string; defaultImageUrl: string }) {
  const isError = ref<boolean>(false);

  if (isError.value) {
    return h('img', {
      src: defaultImageUrl,
      alt: 'review_image',
      class: 'default-image-url',
    });
  }

  return h('img', {
    src: imageUrl,
    alt: 'review_image',
    class: 'image-url',
    onError: () => { isError.value = true; },
  });
}
</script>

<style scoped lang="scss">
.card-container{
  display: flex;
  flex-direction: column;
  width: 27vw;
  height: 45vh;
  cursor: pointer;
  /* border-radius: var(--border-radius-l, 16px); */
  background-color: v-bind(white);
  box-shadow: 0 8px 30px 0 #0000001a;
}

.image-box{
  /* border-radius: 14px 14px 0 0; // 부모 div의 radius보다 작은 값으로 보정 */
  position: relative;
  width: 100%;
  height: 33.125vh;
  overflow: hidden;
  background-color: v-bind(gray20);
}

.card-text{
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-h3, 2.5vw);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-height-adjust);
  letter-spacing: var(--letter-spacing-adjust);
}

.default-image-url {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 9.375vw;
  transform: translate(-50%, -50%);
}

.image-url{
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>
