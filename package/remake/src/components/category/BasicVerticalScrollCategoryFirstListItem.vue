<template>
  <div
    class="main-first-category-list-item"
    :class="[activeControl(), theme, { 'japanese-lang': isJapaneseLanguage }]"
  >
    <span class="main-first-category-list-item-text">
      {{ newLineHelper(content) }}
    </span>
  </div>
</template>

<script setup lang='ts'>
import { newLineHelper } from '@torder/common/utils';

const props = defineProps<{
  /** 컴포넌트의 테마를 결정해주는 클래스명입니다. */
  theme: string,
  /** 메인 레이아웃의 대 카테고리 리스트의 아이템에 표시되는 텍스트입니다. */
  content: string,
  /** 메인 레이아웃의 대 카테고리 리스트의 아이템이 클릭됨을 나타내는 클래스입니다. */
  active: boolean,
  isJapaneseLanguage: boolean,
}>();

const activeControl = () => {
  const getActiveClassName = props.active ? 'active' : '';

  return getActiveClassName;
};
</script>

<style lang='scss' scoped>
.main-first-category-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
  min-height: 2vw;
  padding: 1vw 0.5vw;
  font-weight: 700;
  border-radius: 0.7813vw;

  .main-first-category-list-item-text {
    font-size: 1.7188vw;
    line-height: 1.2;
    word-break: break-all;
    white-space: pre-wrap;
  }

  &.active {
    color: #fff;
    background-color: #F91515;
    opacity: 1;
  }

  &.japanese-lang {
    word-break: break-all;
  }
}

.black {
  color: #313131;
  background-color: #fff;
}

.white {
  color: #313131;
  background-color: #fff;
}
</style>
