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
      <span>
        {{ `${quantity}${t('개')}` }}
      </span>
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  optionName: string,
  quantity: number,
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

    .order-index {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 5.125vw;
      height: 5.125vw;
      font-size: 1.7188vw;
      color: #fff;
      background-color: #999999;
      border-radius: 1.25vw;

      .index {
        display: inline;
        padding-top: .375vw;
      }

      &.active {
        background-color: #ab240f;
      }
    }
  }
}
</style>
