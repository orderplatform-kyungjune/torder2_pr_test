<template>
  <div
    class="main-sub-category-list-item"
    :class="[activeControl(), theme]"
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
  /** 메인 레이아웃의 소 카테고리 리스트의 아이템에 표시되는 텍스트입니다. */
  content: string,
  /** 메인 레이아웃의 소 카테고리 리스트의 아이템이 클릭됨을 나타내는 클래스입니다. */
  active: boolean,
}>();

const activeControl = () => {
  const getActiveClassName = props.active ? 'active' : '';
  return getActiveClassName;
};
</script>

<style lang='scss' scoped>
.main-sub-category-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25vw;
  font-size: 1.875vw;
  font-weight: 700;
  line-height: 2.5vw;
  text-align: center;
  white-space: nowrap;
  border-radius: 0.7813vw;

  &.active {
    color: #fff;
    background-color: #F91515;
  }

  &.white {
    box-shadow: 0 0.0781vw 0.3125vw 0 rgba(0, 0, 0, 0.25);
  }
}

.black {
  color: #fff;
}

.white {
  color: #313131;
}
</style>
