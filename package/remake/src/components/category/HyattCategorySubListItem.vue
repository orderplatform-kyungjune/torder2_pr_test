<template>
  <div class="main-sub-category-container sub-list">
    <div
      class="main-sub-category-list-item"
      :class="[{ active: active }, theme, { 'empty-sub-category': isEmptyString }]"
    >
      {{ setEllipsisWordLength(removeNewLine(content), 20) }}
    </div>
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import {
  removeNewLine,
  setEllipsisWordLength,
} from '@torder/common';
import useInitStore from '@store/storeInit';

const {
  subCategoryFontColor,
  subCategoryActiveFontColor,
} = storeToRefs(useInitStore());

defineProps<{
  /** 컴포넌트의 테마를 결정해주는 클래스명입니다. */
  theme: string,
  /** 메인 레이아웃의 소 카테고리 리스트의 아이템에 표시되는 텍스트입니다. */
  content: string,
  /** 메인 레이아웃의 소 카테고리 리스트의 아이템이 클릭됨을 나타내는 클래스입니다. */
  active: boolean,
  isEmptyString: boolean,
}>();
</script>

<style lang='scss' scoped>
.main-sub-category-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard', sans-serif;

  .main-sub-category-list-item {
    padding-bottom: 0.5469vw;
    font-size: 1.875vw;
    font-weight: 700;
    line-height: 2.3438vw;
    color: v-bind(subCategoryFontColor);
    text-align: left;
    letter-spacing: -0.0562vw;
    white-space: nowrap;

    &.active {
      color: v-bind(subCategoryActiveFontColor);
      border-bottom: 0.2344vw solid;
      border-color: v-bind(subCategoryActiveFontColor);
    }

    &.empty-sub-category {
      border: none;
    }
  }

  &:last-child {
    margin-right: 14.84375vw;
  }
}

</style>
