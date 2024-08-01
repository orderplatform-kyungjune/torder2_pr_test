<template>
  <div class="button-layout">
    <button class="button-wrap">
      {{ title }}
    </button>
  </div>
</template>

<script setup lang='ts'>
const {
  title,
  background,
  color,
  fontSize = '2vw',
  fontWeight = '100',
} = defineProps<{
  title: string,
  background: string,
  color: string,
  fontSize?: string,
  fontWeight?: string,
}>();
</script>

<style lang='scss' scoped>
.button-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6vw;
  margin-top: 1.1vw;
  border-radius: 7vw;

  .button-wrap {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 .7813vw;
    font-size: v-bind(fontSize);
    font-weight: v-bind(fontWeight);
    line-height: inherit;
    color: v-bind(color);
    background-color: v-bind(background);
    border: none;
    border-radius: 0.7813vw;
  }
}
</style>
