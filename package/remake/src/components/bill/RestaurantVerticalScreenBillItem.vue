<template>
  <div
    class="bill-wrap"
    :class="theme"
  >
    <span class="item-name">{{ itemName }}</span>
    <div class="bill-price-wrap">
      <span>{{ `${quantity}${t('개')}` }}</span>
      <span>{{ itemPrice }}</span>
      <span>{{ sumPrice }}</span>
    </div>
  </div>
  <slot/>
</template>

<script setup lang='ts'>
defineProps<{
  itemName: string,
  quantity: number,
  itemPrice: string,
  sumPrice: string,
  t: (str: string) => string,
  theme: string,
}>();
</script>

<style lang='scss' scoped>
.bill-wrap {
  display: flex;
  justify-content: space-between;
  font-family: 'Noto Serif KR', sans-serif;
  font-size: 2.5vw;

  &.white {
    color: #000;
  }

  &.black {
    color: #fff;
  }

  .item-name {
    width: 33.75vw;
    overflow: hidden;
    line-height: 1.1;
    text-overflow: ellipsis;
  }

  .bill-price-wrap {
    display: grid;
    grid-template-columns: 8.5vw 23.875vw 23.875vw;
    width: 56.25vw;

    span {
      text-align: end;
    }
  }
}
</style>
