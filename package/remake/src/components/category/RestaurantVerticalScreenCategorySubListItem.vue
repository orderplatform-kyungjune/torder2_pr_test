<template>
  <div class="main-sub-category-container">
    <div
      class="main-sub-category-list-item"
      :class="[activeControl(), props.theme, { 'empty-sub-category': isEmptyString }]"
    >
      {{ props.content }}
    </div>
    <div class="after-list"/>
  </div>
</template>

<script setup lang='ts'>
const props = defineProps<{
  /** 컴포넌트의 테마를 결정해주는 클래스명입니다. */
  theme: string,
  /** 메인 레이아웃의 소 카테고리 리스트의 아이템에 표시되는 텍스트입니다. */
  content: string,
  /** 메인 레이아웃의 소 카테고리 리스트의 아이템이 클릭됨을 나타내는 클래스입니다. */
  active: boolean,
  customActiveFontColor: string,
  customActiveBackgroundColor: string,
  customFontColor: string,
  customBackgroundColor: string,
  isEmptyString: boolean,
}>();

const activeControl = () => {
  const getActiveClassName = props.active ? 'active' : '';

  return getActiveClassName;
};
</script>

<style lang='scss' scoped>
.main-sub-category-container {
  display: flex;
  align-items: center;
  justify-content: center
}

.main-sub-category-list-item {
  padding: .5469vw 0;
  margin: 0 1.5625vw;
  font-family: Noto Serif KR, sans-serif;
  font-size: 1.7188vw;
  font-style: normal;
  font-weight: 500;
  font-stretch: normal;
  line-height: normal;
  text-align: left;
  letter-spacing: -0.0453vw;
  white-space: nowrap;

  // 화이트 테마
  &.white {
    color: v-bind(customFontColor);
  }

  // 블랙 테마
  &.black {
    color: v-bind(customFontColor);
  }

  &.active {
    padding-right: 1.5625vw;
    padding-left: 1.5625vw;
    color: v-bind(customActiveFontColor);
    background-color: v-bind(customActiveBackgroundColor);
    border-radius: 7.8125vw;
  }

  &.empty-sub-category {
    border: none;
  }
}

.after-list {
  width: .1563vw;
  height: 1.5625vw;
  margin: auto 0;
  background-color: #999999;
}
</style>
