<!-- eslint-disable max-len -->
<!-- eslint-disable vue/max-len -->
<template>
  <svg
    id="language-svg-sub-element"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      id="language-svg-sub-element1"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M4.04513 0C1.81107 0 0 1.81107 0 4.04513V14.9908C0 17.2248 1.81107 19.0359 4.04513 19.0359H14.9908C17.2248 19.0359 19.0359 17.2248 19.0359 14.9908V4.04513C19.0359 1.81107 17.2248 0 14.9908 0H4.04513ZM12.2247 6.7178H6.69053C7.33161 8.46639 8.25399 9.9944 9.4773 11.2438C10.6651 10.0409 11.5692 8.54994 12.2247 6.7178ZM9.42978 12.6718C10.8565 13.9485 12.6161 14.8874 14.7729 15.4538C14.9271 15.1699 15.2354 14.7311 15.4667 14.4989C13.3673 14.0082 11.6258 13.1316 10.2198 11.936C11.5611 10.5678 12.5864 8.85836 13.34 6.7178H15.3382V5.76291H9.98052V3.56924H8.99121V5.76291H3.72345V6.7178H5.63572C6.37031 8.78199 7.36893 10.5407 8.69878 11.9577C7.32417 13.0989 5.62788 13.934 3.56927 14.5247C3.77484 14.757 4.0832 15.2215 4.18598 15.4667C6.2697 14.7882 8.004 13.8844 9.42978 12.6718Z"
      :fill="fill ? fill : '#706D5C'"
    />
    <path
      id="language-svg-sub-element2"
      d="M19.674 26.6661H18.1333L21.5572 18.1328H23.2296L26.6666 26.6661H25.1259L24.2568 24.4149H20.5432L19.674 26.6661ZM20.958 23.3306H23.8354L22.4263 19.6886H22.3605L20.958 23.3306Z"
      :fill="fill ? fill : '#706D5C'"
    />
    <rect
      id="language-svg-sub-element3"
      x="13.5436"
      y="13.5434"
      width="17.5487"
      height="17.5487"
      rx="5.20513"
      :stroke="fill ? fill : '#706D5C'"
      stroke-width="1.48718"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  fill?: string,
}>();
</script>
