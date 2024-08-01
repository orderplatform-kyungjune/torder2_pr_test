<!-- eslint-disable vue/no-parsing-error -->
<template>
  <svg
    width="70"
    height="60"
    viewBox="0 0 70 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      id="darkgray-plus-sub-element-path"
      d="M0 8C0 3.58172 3.58172 0 8 0H62C66.4183 0 70 3.58172 70 8V52C70 56.4183 66.4183 60 62 60H8C3.58172 60 0 56.4183 0 52V8Z"
      fill="#5B5B5B"
    />
    <rect
      id="darkgray-plus-sub-element-rect1"
      x="22"
      y="29"
      width="26"
      height="3"
      rx="1.5"
      fill="white"
    />
    <rect
      id="darkgray-plus-sub-element-rect2"
      x="22"
      y="29"
      width="26"
      height="3"
      rx="1.5"
      fill="white"
    />
    <rect
      id="darkgray-plus-sub-element-rect3"
      x="33"
      y="17"
      width="3"
      height="26"
      rx="1.5"
      fill="white"
    />
  </svg>
</template>

<script setup lang="ts">
import { getSubPrimaryColor } from '@torder/common';

const props = defineProps<{
  fill?: string,
}>();

const activeButtonColor = props.fill ? getSubPrimaryColor(props.fill, 10, 'Y') : getSubPrimaryColor('#494949', 10, 'Y');

</script>

<style scoped lang='scss'>
svg.button-active {
  path {
    fill: v-bind(activeButtonColor) ;
  }
}
</style>
