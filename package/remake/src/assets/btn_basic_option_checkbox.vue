<!-- eslint-disable vue/max-len -->
<!-- eslint-disable max-len -->
<!-- eslint-disable vue/no-parsing-error -->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
  >
    <path
      d="M0.75 8C0.75 3.99594 3.99594 0.75 8 0.75H22C26.0041 0.75 29.25 3.99594 29.25 8V22C29.25 26.0041 26.0041 29.25 22 29.25H8C3.99594 29.25 0.75 26.0041 0.75 22V8Z"
      :fill="fill ? fill : '#494949'"
    />
    <path
      v-if="!isNoneBorder"
      d="M0.75 8C0.75 3.99594 3.99594 0.75 8 0.75H22C26.0041 0.75 29.25 3.99594 29.25 8V22C29.25 26.0041 26.0041 29.25 22 29.25H8C3.99594 29.25 0.75 26.0041 0.75 22V8Z"
      :stroke="stroke ? stroke : '#5B5B5B'"
      stroke-width="1.5"
    />
    <path
      v-if="!isEmptyIcon"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M23.3721 7.84192C23.9813 8.36841 24.0686 9.31371 23.5672 9.95332L14.16 21.9533C13.9162 22.2642 13.5636 22.4592 13.1815 22.4943C12.7994 22.5294 12.4199 22.4017 12.1285 22.1399L7.25003 17.7586C6.65046 17.2201 6.58014 16.2732 7.09298 15.6437C7.60581 15.0141 8.50759 14.9403 9.10716 15.4788L12.8793 18.8665L21.3613 8.04675C21.8627 7.40714 22.763 7.31544 23.3721 7.84192Z"
      :fill="stroke ? stroke : '#5B5B5B'"
    />
  </svg>
</template>

<script setup lang='ts'>
defineProps<{
  fill?: string,
  stroke?: string,
  isEmptyIcon?: boolean,
  isNoneBorder?: boolean,
}>();
</script>
