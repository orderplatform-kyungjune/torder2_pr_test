<template>
  <svg
    fill="none"
    height="2.3438vw"
    width="2.3438vw"
    viewBox="0 0 20 30"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      :stroke="isDarkMode ? '#EBEBEB' : '#313131'"
      d="M7 21L13 15L7 9"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  isDarkMode?: boolean;
}>();
</script>
