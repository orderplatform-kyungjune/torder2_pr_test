<!-- eslint-disable vue/no-parsing-error -->
<template>
  <svg
    width="2.6563vw"
    height="2.6563vw"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="chekbox">
      <path
        id="Vector"
        d="M24 1H10C5.02944 1 1 5.02944 1 10V24C1 28.9706 5.02944 33 10 33H24C28.9706 33 33 28.9706 33 24V10C33 5.02944 28.9706 1 24 1Z"
        :fill="fill ? fill : '#6B9F05'"
        :stroke="fill ? fill : '#6B9F05'"
        stroke-width="2"
      />
      <path
        id="&#237;&#140;&#168;&#236;&#138;&#164; 172"
        d="M8.71093 19.4048L13.9656 24.4022L24.4978 11.1504"
        stroke="white"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </svg>
</template>

<script setup lang='ts'>
defineProps<{
  fill?: string,
}>();
</script>
