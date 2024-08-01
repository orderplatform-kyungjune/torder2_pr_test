<template>
  <svg
    width="60"
    height="50"
    viewBox="0 0 60 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="gray-minus-sub-element-g">
      <rect
        id="gray-minus-sub-element-rect"
        width="60"
        height="50"
        rx="8"
        fill="#818181"
      />
      <path
        id="gray-minus-sub-element-path"
        d="M18 25H42"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { getSubPrimaryColor } from '@torder/common';

const activeButtonColor = getSubPrimaryColor('#818181', 10, 'Y');
</script>

<style lang="scss" scoped>
svg.button-active {
  rect {
    fill: v-bind(activeButtonColor);
  }
}
</style>
