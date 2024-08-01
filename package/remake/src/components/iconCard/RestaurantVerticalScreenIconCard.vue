<template>
  <div
    class="image-card-wrap"
    :class="theme"
  >
    <img
      :src="imageUrl"
      alt="icon-image"
    >
    <span>{{ text }}</span>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  imageUrl: string,
  text: string,
  imgWidth?: string,
  fontSize?: string,
  theme: string,
}>();
</script>

<style lang='scss' scoped>
.image-card-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.3906vw;
  align-items: center;
  font-size: v-bind(fontSize);

  &.black {
    color: #fff;
  }

  &.white {
    color: #2f2a26;
  }

  img {
    width: v-bind(imgWidth);
  }
}
</style>
