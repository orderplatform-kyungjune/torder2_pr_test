<template>
  <div
    class="history-wrap"
    :class="theme"
  >
    <span class="ellipsis-text-2">{{ itemName }}</span>
    <span>{{ `${quantity}${t('개')}` }}</span>
  </div>
  <slot/>
</template>

<script setup lang='ts'>
defineProps<{
  itemName: string,
  quantity: number,
  t: (str: string) => string,
  theme: string,
}>();
</script>

<style lang='scss' scoped>
.history-wrap {
  display: flex;
  justify-content: space-between;
  font-family: 'Noto Serif KR', sans-serif;
  font-size: 2.5vw;

  &.black {
    color: #fff;
  }

  > span {
    line-height: 1.1;
  }
}
</style>
