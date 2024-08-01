<template>
  <div
    class="button-container"
    :class="ACTIONABLE_ELEMENT_CLASS"
    @click="onClick"
  >
    <span class="button-icon-box">
      <img
        :src="image.url"
        alt="review-modify-button"
      >
    </span>
    <span class="text">{{ image.text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MEDIA_RESOURCE_URL } from '@torder/common';
import palette from '@styles/colors';
import { ACTIONABLE_ELEMENT_CLASS } from '@containers/review/const';

const { gray20 } = palette;

type Props = {
  type: 'POINT' | 'KEYWORD',
  onClick: () => void,
};
const props = defineProps<Props>();

const image = computed(() => {
  if (props.type === 'POINT') {
    return {
      url: `${MEDIA_RESOURCE_URL}/review/point-modify-button-img.png`,
      text: '별점 수정',
    };
  }
  return {
    url: `${MEDIA_RESOURCE_URL}/review/keyword-modify-button-img.png`,
    text: '리뷰 수정',
  };
});

</script>

<style scoped lang="scss">
.button-container {
  position: absolute;
  right: 4.062vw;
  bottom: 4vh;
  display: inline-flex;
  flex-direction: column;
  gap: 1vh;
  align-items: center;
  padding: 0.625vw;
  cursor: pointer;
}
.button-icon-box{
  display: inline-flex;
  width: 6.25vw;
  height: 6.25vw;
  border-radius: var(--border-radius-infinite, 9999px);

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

.text{
  font-size: var(--font-size-h6, 1.328vw);
  font-style: normal;
  line-height: var(--line-height-base);
  color: v-bind(gray20);
  letter-spacing: var(--letter-spacing-base);
}
</style>
