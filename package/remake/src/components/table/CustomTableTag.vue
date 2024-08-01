<template>
  <div class="custom-table-container">
    <div
      ref="customTableBodyRef"
      class="custom-table-body"
    >
      <div class="custom-table-header">
        Table.
      </div>
      <div class="custom-table-info">
        <span
          class="custom-table-info-text"
          :class="{ newline: tableInfo?.length > 5 }"
        >
          {{ tableInfo }}
        </span>
      </div>
    </div>
    <div
      v-if="storeInfo"
      class="custom-table-store-info ellipsis-text-1"
    >
      {{ storeInfo }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import useInitStore from '@store/storeInit';

const {
  tableNumBackgroundColor,
  tableNumFontColor,
} = storeToRefs(useInitStore());

defineProps<{
  storeInfo?: string,
  tableInfo: string,
}>();

const customTableBodyRef = ref();
const getBodyWidth = computed(() => {
  if (!customTableBodyRef.value) return;

  const targetElement = customTableBodyRef.value;
  if (targetElement) {
    const bodyWidth = targetElement?.clientWidth ?? 0;
    const screenWidth = window.screen.width;

    return `${(bodyWidth * 100) / screenWidth}vw`;
  }

  return '10.9375vw';
});

</script>

<style lang="scss" scoped>
.custom-table-container {
  position: absolute;
  top: 0;
  right: 1.5625vw;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 0.3125vw;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard', sans-serif;

  .custom-table-body {
    display: flex;
    flex-direction: column;
    padding: 0.7813vw;
    background-color: v-bind(tableNumBackgroundColor);
    border-radius: 0 0 1.25vw 1.25vw;
    box-shadow: 0 0.1563vw 0.3125vw 0 rgba(0, 0, 0, 0.25), 0 -0.1172vw 0.0781vw 0 rgba(0, 0, 0, 0.25) inset;
    .custom-table-header {
      font-size: 1.0938vw;
      font-weight: 600;
      line-height: 1.4063vw;
      color: v-bind(tableNumFontColor);
      letter-spacing: -0.0328vw;
    }

    .custom-table-info{
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 10.9375vw;
      max-width: 17.5781vw;
      height: 5vw;

      .custom-table-info-text {
        font-size: 3.75vw;
        font-weight: 700;
        line-height: 4.2188vw;
        color: v-bind(tableNumFontColor);
        text-align: center;

        &.newline {
          display: -webkit-box;
          overflow: hidden;
          font-size: 1.7188vw;
          line-height: 2.1875vw;
          text-overflow: ellipsis;
          letter-spacing: -0.0344vw;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
    }
  }

  .custom-table-store-info {
    width: v-bind(getBodyWidth);
    font-size: 1.0938vw;
    font-weight: 600;
    line-height: 1.4063vw;
    color: #fff;
    text-align: center;
    text-shadow: 0 0 0.3125vw rgba(0, 0, 0, 0.45);
    letter-spacing: -0.0328vw;
  }
}

</style>
