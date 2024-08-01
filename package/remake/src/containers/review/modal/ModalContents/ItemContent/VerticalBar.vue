<template>
  <span class="vertical-bar">
    &#124;
  </span>
</template>

<script setup lang="ts">
import palette from '@styles/colors';

const { gray100 } = palette;
</script>

<style scoped lang="scss">
.vertical-bar{
  margin-right: 0.937vw;
  font-size: 1.953vw;
  color: v-bind(gray100);
}
</style>
