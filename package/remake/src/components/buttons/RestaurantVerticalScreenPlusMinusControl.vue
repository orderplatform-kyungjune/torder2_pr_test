<template>
  <div class="control-container">
    <img
      src="https://static.torder.co.kr/torder2/icn_plus_button_white.svg"
      alt="수량 증가 버튼"
      @click.stop="plusCount"
    >
    <div
      class="count-wrap"
      :class="theme"
    >
      <span>{{ count }}</span>
      <span>{{ t(unit) }}</span>
    </div>
    <img
      src="https://static.torder.co.kr/torder2/icn_minus_button_white.svg"
      alt="수량 감소 버튼"
      @click.stop="minusCount"
    >
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  count: number,
  theme: string,
  t: (str: string) => string,
  plusCount: () => void,
  minusCount: () => void,
  unit: string,
}>();
</script>

<style lang='scss' scoped>
.control-container {
  display: grid;
  grid-template-columns: 5.75vw  7vw  5.75vw;
  gap: 1.875vw;
  width: 22.5vw;

  .count-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.1875vw;

    &.white {
      color: #000;
    }

    &.black {
      color: #fff;
    }
  }
}
</style>
