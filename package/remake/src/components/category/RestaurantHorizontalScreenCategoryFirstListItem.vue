<template>
  <div
    class="main-first-category-list-item"
    :class="[props.theme, { 'japanese-lang': isJapaneseLanguage }]"
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
  customFontColor: string,
  isJapaneseLanguage: boolean,
}>();
</script>

<style lang='scss' scoped>
.main-first-category-list-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: 1.9531vw;
  font-family: Noto Serif KR, sans-serif;
  font-size: 1.9531vw;
  font-style: normal;
  font-weight: 500;
  font-stretch: normal;
  line-height: normal;
  color: v-bind(customFontColor);
  letter-spacing: normal;

  &.japanese-lang {
    word-break: break-all;
  }
}
</style>
