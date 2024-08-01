<template>
  <button class="button-wrap">
    {{ content }}
  </button>
</template>

<script setup lang='ts'>
const {
  content,
  width = '100px',
  height = '60px',
  background = 'transparent',
  color = '#000',
  fontSize = '1rem',
  fontWeight = '300',
  border = '1px solid #000',
  borderRadius = '5px',
  padding = '0',
} = defineProps<{
  content: string,
  width?: string,
  height?: string,
  background?: string,
  color?: string,
  fontSize?: string,
  fontWeight?: string,
  border?: string,
  borderRadius?: string,
  padding?: string,
}>();
</script>

<style lang='scss' scoped>
.button-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind(width);
  height: v-bind(height);
  padding: v-bind(padding);
  font-family: 'Pretendard', sans-serif;
  font-size: v-bind(fontSize);
  font-weight: v-bind(fontWeight);
  color: v-bind(color);
  background-color: v-bind(background);
  border: v-bind(border);
  border-radius: v-bind(borderRadius);
}
</style>
