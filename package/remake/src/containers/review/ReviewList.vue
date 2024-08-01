<template>
  <span class="background-image-wrapper">
    <img
      :src="`${MEDIA_RESOURCE_URL}/review/torder-model-img.png`"
      alt="review_list_background_image"
    >
  </span>
  <div class="background-gradient-layer"/>
  <div class="contents-wrapper">
    <div class="information">
      <div class="information-text">
        고객님의 소중한 리뷰를<br>기다리고 있어요
      </div>
      <div class="close-button">
        다음에 하기
      </div>
    </div>
    <div class="carousel-area">
      <ReviewCarousel/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MEDIA_RESOURCE_URL } from '@torder/common';
import palette from '@styles/colors';
import ReviewCarousel from '@containers/review/ReviewCarousel.vue';

const {
  white,
  gray700,
} = palette;

</script>

<style scoped lang="scss">
.background-image-wrapper {
  position: absolute;
  right: 4.375vw;
  bottom: 0;
  width: 53.6vw;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

.background-gradient-layer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 28.75vh;
  background: linear-gradient(180deg, rgba(17, 27, 41, 0) 0%, rgba(17, 27, 41, 0.5) 49.5%, #111b29 100%);
}

.contents-wrapper {
  position: relative;
  height: 100%;
}

.information {
  position: absolute;
  top: 18vh;
  display: inline-flex;
  flex-direction: column;
  gap: 2.5vh;
}

.information-text {
  font-size: 4.063vw;
  font-weight: 700;
  line-height: var(--line-height-adjust, 130%);
  color: v-bind(white);
  letter-spacing: var(--letter-spacing-adjust, -2%);
}

.carousel-area {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
}

.close-button {
  width: max-content;
  padding: 2vh 2.187vw;
  font-size: 2.188vw;
  font-weight: 700;
  line-height: var(--line-height-adjust, 130%);
  color: v-bind(white);
  letter-spacing: var(--letter-spacing-adjust, -2%);
  cursor: pointer;
  background-color: v-bind(gray700);
  border-radius: var(--border-radius-m, 8px);
}
</style>
