<template>
  <div
    class="list-head-wrap"
    :class="theme"
  >
    <div class="head-left-side">
      <span>
        +
      </span>
      <span>
        {{ optionName }}
      </span>
    </div>
    <div class="head-right-side">
      <span class="bill-quantity">
        {{ `${quantity}${t('개')}` }}
      </span>
      <span class="bill-item-price">{{ itemPrice }}</span>
      <span class="bill-sum-price">{{ sumPrice }}</span>
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  optionName: string,
  quantity: number,
  itemPrice: string,
  sumPrice: string,
  t: (str: string) => string,
  theme: string,
}>();
</script>

<style lang='scss' scoped>
.list-head-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Pretendard', sans-serif;
  font-size: 1.7188vw;

  &.white {
    color: #999;
  }

  &.black {
    color: #fff;
  }

  .head-left-side {
    display: flex;
    gap: 1.25vw;
    align-items: center;
    width: 33.75vw;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .head-right-side {
    display: grid;
    grid-template-columns: 8.5vw 23.875vw 23.875vw;
    width: 56.25vw;

    .bill-quantity,
    .bill-item-price,
    .bill-sum-price {
      text-align: end;
    }
  }
}
</style>
