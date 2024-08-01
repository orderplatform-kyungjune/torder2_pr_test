<template>
  <div
    class="table-people-count-container"
    :class="RESTAURANT_HORIZONTAL_CARD"
  >
    <div class="table-people-count-title">
      {{ totalPeople }}
    </div>
    <div class="table-people-count-wrapper">
      <div class="table-people-count-number">
        {{ peopleCount }}
      </div>
      <div class="table-people-count-unit">
        {{ people }}
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { RESTAURANT_HORIZONTAL_CARD } from '@torder/common';

defineProps<{
  /** 총 인원 숫자 입니다. */
  peopleCount: number,
  /** 국제화를 사용하기 위한 (명) 텍스트 입니다. */
  people: string,
  /** 국제화를 사용하기 위한 (총 인원) 텍스트 입니다. */
  totalPeople: string,
}>();
</script>

<style lang='scss' scoped>
.table-people-count-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75vw 1.1719vw 0.75vw 1.4844vw;
  font-family: 'Pretendard', sans-serif;
  color: #ffffff;
  // TODO: 임시주석
  visibility: hidden;
  border: .0781vw #ffffff solid;
  border-radius: .7813vw;
  box-shadow: 0.3906vw 0.3906vw 1.1719vw 0 rgba(0, 0, 0, 0.05);

  &.restaurant-horizontal-card {
    color: #000000;
    border: none;
  }

  .table-people-count-title {
    font-size: 1.7188vw;
    font-weight: bold;
  }

  .table-people-count-wrapper {
    display: flex;
    align-items: center;

    .table-people-count-number {
      font-size: 2.1875vw;
      font-weight: bold;
      color: #ab240f;

      &.restaurant-horizontal-card {
        color: #ffffff;
      }
    }

    .table-people-count-unit {
      font-size: 1.7188vw;
      letter-spacing: -0.0344vw;
    }
  }
}
</style>
