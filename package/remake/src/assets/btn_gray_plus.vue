<!-- eslint-disable vue/no-parsing-error -->
<template>
  <svg
    width="60"
    height="50"
    viewBox="0 0 60 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="gray-plus-sub-element-g">
      <rect
        id="gray-plus-sub-element-rect"
        width="60"
        height="50"
        rx="8"
        fill="#818181"
      />
      <path
        id="gray-plus-sub-element-path1"
        d="M30 37L30 13"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        id="gray-plus-sub-element-path2"
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
