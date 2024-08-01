<template>
  <div
    class="main-first-category-list-item"
    :class="[activeControl(), theme, { 'japanese-lang': isJapaneseLanguage }]"
  >
    {{ props.content }}
  </div>
</template>

<script setup lang='ts'>
const props = defineProps<{
  /** 컴포넌트의 테마를 결정해주는 클래스명입니다. */
  theme: string,
  /** 메인 레이아웃의 대 카테고리 리스트의 아이템에 표시되는 텍스트입니다. */
  content: string,
  /** 메인 레이아웃의 대 카테고리 리스트의 아이템이 클릭됨을 나타내는 클래스입니다. */
  active: boolean,
  customActiveFontColor: string,
  customActiveBackgroundColor: string,
  customFontColor: string,
  customBackgroundColor: string,
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
  padding: 1.125vw 3.125vw;
  font-family: Noto Serif KR, sans-serif;
  font-size: 2.0313vw;
  font-style: normal;
  font-weight: 500;
  font-stretch: normal;
  line-height: normal;
  text-align: center;
  letter-spacing: normal;
  border-radius: 7.8125vw;

  &.japanese-lang {
    word-break: break-all;
  }
}

// 화이트 테마
.white {
  color: v-bind(customFontColor);
  border: solid .1563vw v-bind(customFontColor);

  &.active {
    font-weight: 900;
    color: v-bind(customActiveFontColor);
    background-color: v-bind(customActiveBackgroundColor);
    border: none;
  }
}

// 블랙 테마
.black {
  color: v-bind(customFontColor);
  background-color: #303030;

  &.active {
    font-weight: 900;
    color: v-bind(customActiveFontColor);
    background-color: v-bind(customActiveBackgroundColor);
    border: none;
  }
}
</style>
