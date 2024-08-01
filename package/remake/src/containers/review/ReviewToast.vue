<template>
  <div class="toast-layout">
    <span class="animation-box">
      <LottieAnimation
        :animationData="star"
        :autoPlay="true"
        :loop="true"
        :speed="1"
      />
    </span>
    <h5 class="toast-message-text">
      {{ message }}
    </h5>
  </div>
</template>

<script setup lang="ts">
import { LottieAnimation } from 'lottie-web-vue';
import palette from '@styles/colors';
import star from '@assets/review/star.json';

const {
  white,
  gray50,
  gray800,
} = palette;

type Props = {
  message: string,
  visible: boolean,
};

defineProps<Props>();
</script>

<style scoped lang="scss">
.toast-layout{
  display: inline-flex;
  align-items: center;
  padding: 2vh 2.5vw;
  letter-spacing: var(--letter-spacing-base, -1.5%);
  background: v-bind(white);
  border: 1.5px solid v-bind(gray50);
  border-radius: var(--border-radius-infinite, 9999px);
  box-shadow: var(--shadow-l);
  opacity: v-bind(visible);
  transition: opacity 250ms ease-in-out;
}
.animation-box {
  width: 2.656vw;
  height: 2.656vw;
  pointer-events: none;
}
.toast-message-text{
  font-size: 1.64vw;
  font-weight: 700;
  line-height: 2.656vw; // 34px
  color: v-bind(gray800);
  letter-spacing: -0.015em;
}
</style>
