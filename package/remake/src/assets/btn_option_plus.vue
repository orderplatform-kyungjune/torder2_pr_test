<!-- eslint-disable vue/no-parsing-error -->
<template>
  <svg
    width="4.6875vw"
    height="3.9063vw"
    viewBox="0 0 60 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="option-plus-sub-element-g">
      <rect
        id="option-plus-sub-element-rect"
        width="60"
        height="50"
        rx="8"
        :fill="fill ? fill : '#6B9F05'"
      />
      <path
        id="option-plus-sub-element-path1"
        d="M30 37L30 13"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        id="option-plus-sub-element-path2"
        d="M18 25H42"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
      />
    </g>
  </svg>
</template>

<script setup lang='ts'>
import { getSubPrimaryColor } from '@torder/common';

const props = defineProps<{
  fill?: string,
}>();

const getActiveButtonColor = () => {
  // 검은색 버튼은 pressed 색상을 가져오지 못하여 고정된 색상값을 리턴하는 로직
  if (props.fill === '#0A0A0A') return '#242424';
  if (props.fill) return getSubPrimaryColor(props.fill, 10, 'Y');
  return null;
};
</script>

<style scoped lang='scss'>
svg.button-active {
  rect {
    fill: v-bind(getActiveButtonColor());
  }
}
</style>
