<template>
  <div
    class="list-head-wrap"
    :class="[{ active: active }, theme]"
  >
    <div class="head-left-side">
      <div
        class="order-index"
        :class="[{ active: active }, theme]"
      >
        <span class="index">
          {{ orderIndex }}
        </span>
      </div>
      <span class="head-text">{{ headText }}</span>
    </div>
    <div class="head-right-side">
      <span>
        {{ orderTime }}
      </span>
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  orderIndex: number,
  headText: string,
  orderTime: string,
  active: boolean,
  theme: string,
}>();
</script>

<style lang='scss' scoped>
.list-head-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Noto Serif KR', sans-serif;
  font-size: 2.5vw;
  color: #999;

  &.active {
    color: #ab240f;

    &.black {
      color: #f33619
    }
  }

  .head-left-side {
    display: flex;
    gap: 2.5vw;
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
      }

      &.active {
        background-color: #ab240f;

        &.black {
          background-color: #f33619
        }
      }
    }

    .head-text {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: .375vw;
      font-family: 'Pretendard', sans-serif;
      font-weight: bold;
    }
  }

  .head-right-side {
    span{
      padding-top: .375vw;
    }
  }
}
</style>
