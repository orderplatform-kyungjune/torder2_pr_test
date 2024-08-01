<template>
  <div class="number-button-container">
    {{ text }}
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  text: string,
  background: string,
  color: string,
}>();
</script>

<style lang='scss' scoped>
.number-button-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 7.68vh;
  margin: 0.6vw;
  font-size: 2vw;
  background-color: v-bind(background);
  border-radius: 1vw;
}
</style>
