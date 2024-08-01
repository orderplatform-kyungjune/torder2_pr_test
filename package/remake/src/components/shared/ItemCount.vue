<template>
  <div class="staff-item-count-container">
    <div class="staff-item-count-title ellipsis-text-3">
      {{ removeSymbol(title) }}
    </div>
    <div class="staff-item-count-layout">
      <div class="staff-item-count-grid">
        <div @click="minus">
          <img
            class="staff-item-count-button"
            src="https://static.torder.co.kr/torder2/btn_remove_black_80px.svg"
          >
        </div>
        <div class="staff-item-count-count">
          {{ countUnit }}
        </div>
        <div @click="plus">
          <img
            class="staff-item-count-button"
            src="https://static.torder.co.kr/torder2/btn_add_black_80px.svg"
          >
        </div>
      </div>
      <div
        v-if="deleteText"
        class="staff-item-remove-button"
      >
        <div
          id="staff-item-remove-sub-element"
          class="staff-item-remove-title"
          @click="deleteTarget"
        >
          {{ deleteText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { removeSymbol } from '@torder/common/utils';
import { getSubPrimaryColor } from '@torder/common';

defineProps<{
  /** 해당 상품 이름입니다. */
  title: string,
  /** 해당 상품 수량입니다.(단위도 같이 넘겨주거나 단위가 없더라도 문자열로 변환해 넘겨주어야 합니다.) */
  countUnit: string,
  /** 상품 추가 함수입니다. */
  plus: () => void,
  /** 상품 추감 함수입니다. */
  minus: () => void,
  /** 해당 상품 삭제 함수입니다. */
  deleteTarget?: () => void,
  /** 삭제버튼의 텍스트입니다. */
  deleteText?: string,
}>();

const activeDeleteColor = getSubPrimaryColor('#fff', 10, 'Y');
</script>

<style lang='scss' scoped>
.staff-item-count-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 25.7813vw;
  margin-bottom: 1.5234vw;
  font-family: pretendard, sans-serif;

  .staff-item-count-title {
    width: 25.7813vw;
    font-size: 2.0313vw;
    line-height: normal;
  }

  .staff-item-count-layout {
    display: flex;
    gap: 1.4844vw;
    align-items: center;
    justify-content: center;
    height: 7.4219vw;
    border-bottom: 0.0781vw solid #dfdfdf;
    transform: translateY(-0.3906vw);

    .staff-item-count-grid {
      display: flex;
      justify-content: space-between;
      width: 20.3125vw;

      .staff-item-count-button {
        width: 6.25vw;
        height: 4.6875vw;

        &.button-active {
          filter: opacity(0.7);
        }
      }

      .staff-item-count-count {
        display: flex;
        align-items: center;
        font-size: 2.0313vw;
        font-weight: 500;
        color: #000;
        letter-spacing: -0.1016vw;
      }
    }

    .staff-item-remove-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3.9844vw;
      height: 2.6563vw;
      border: 0.0781vw solid #999;
      border-radius: 0.3906vw;

      &.button-active {
        background-color: v-bind(activeDeleteColor);
      }

      .staff-item-remove-title {
        font-size: 1.4844vw;
        font-weight: 500;
        line-height: normal;
        color: #999;
      }
    }
  }
}
</style>
