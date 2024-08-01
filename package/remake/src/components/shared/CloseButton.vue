<template>
  <div
    class="close-button-container"
    :class="themeType"
  >
    <img
      id="close-sub-element-img"
      :src="route"
    >
    <div
      id="close-sub-element-text"
      class="close-button-title"
    >
      {{ content }}
    </div>
  </div>
</template>

<script setup lang='ts'>
import { getSubPrimaryColor } from '@torder/common/utils';

defineProps({
  color: {
    type: String,
    required: true,
  },
  background: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  themeType: {
    type: String,
    required: true,
  },
  borderRadius: {
    type: String,
    default: '2.5vw',
  },
});

const getActiveButtonColor = (color: string) => getSubPrimaryColor(color, 10, 'Y');
</script>

<style lang='scss' scoped>
.close-button-container {
  display: flex;
  gap: 0.7813vw;
  align-items: center;
  justify-content: center;
  padding: 1.2500vw 1.5625vw;
  background-color: v-bind(background);
  border-radius: v-bind(borderRadius);
  box-shadow: 0.4688vw 0.4688vw 0.9375vw 0 rgba(0, 0, 0, 0.20);

  #close-sub-element-img {
    width: 1.5625vw;
    height: 1.5625vw;
  }

  &.button-active {
    background-color: v-bind(getActiveButtonColor(background));
  }

  &.restaurant-vertical{
    width: 18vw;
    height: 8vw;
  }

  .close-button-title {
    margin-top: .2344vw;
    font-size: 1.8750vw;
    font-weight: 700;
    color: v-bind(color);
    text-align: center;
    letter-spacing: -0.0586vw;
  }
}
</style>
