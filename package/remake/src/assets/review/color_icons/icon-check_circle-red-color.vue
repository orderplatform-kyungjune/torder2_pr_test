<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="48"
      height="48"
      rx="24"
      fill="#FA2B02"
    />
    <path
      d="M32.4166 15.9162L20.7001 27.6277L15.5837 22.5162C14.7634 21.6959 13.4318 21.6959 12.6115 22.5162C11.7912 23.3364 11.7912 24.6681 12.6115 25.4884L19.2115 32.0884C20.0318 32.9086 21.3634 32.9086 22.1837 32.0884L35.3837 18.8884C36.1876 18.0844 36.2036 16.7893 35.4317 15.9658C35.4188 15.9484 35.4045 15.9318 35.3888 15.9162C34.5686 15.0959 33.237 15.0959 32.4167 15.9161C32.4167 15.9161 32.4167 15.9162 32.4166 15.9162Z"
      fill="white"
      stroke="white"
      stroke-width="0.9"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">

type Props = {
  width: string,
  height: string,
}
defineProps<Props>();

</script>
