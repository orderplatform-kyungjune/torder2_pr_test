<template>
  <div class="close-button-container">
    <img :src="imageSrc">
    <div class="close-button-title">
      {{ content }}
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  color: string,
  background: string,
  imageSrc: string,
  content: string,
}>();
</script>

<style lang='scss' scoped>
.close-button-container {
  display: flex;
  gap: 0.7969vw;
  align-items: center;
  justify-content: center;
  width: 11.4063vw;
  height: 5vw;
  background-color: v-bind(background);
  border-radius: 2.5vw;

  .close-button-title {
    margin-top: .2344vw;
    font-size: 2.3438vw;
    color: v-bind(color);
    text-align: center;
    letter-spacing: -0.0586vw;
  }
}
</style>
