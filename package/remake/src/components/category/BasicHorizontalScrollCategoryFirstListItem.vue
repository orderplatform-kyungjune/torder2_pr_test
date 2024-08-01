<template>
  <div
    class="main-first-category-list-item"
    :class="[activeControl(), theme, { 'japanese-lang': isJapaneseLanguage }]"
  >
    {{ setEllipsisWordLength(removeNewLine(content), 20) }}
  </div>
</template>

<script setup lang='ts'>
import {
  removeNewLine,
  setEllipsisWordLength,
} from '@torder/common/utils';

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
  padding: 1.25vw 1.5625vw;
  font-size: 1.875vw;
  font-weight: 700;
  line-height: 2.5vw;
  text-align: center;
  letter-spacing: -0.0375vw;
  white-space: nowrap;
  background-color: transparent;
  border-radius: 0 0 0.7813vw 0.7813vw;

  &.active {
    color: #fff;
    background-color: #F91515;
    border-radius: 0 0 0.7813vw 0.7813vw;
  }

  &.white {
    box-shadow: 0 0.0781vw 0.3125vw 0 rgba(0, 0, 0, 0.25);
  }

  &.japanese-lang {
    word-break: break-all;
  }
}

.black {
  color: #fff;
}

.white {
  color: #313131;
}
</style>
