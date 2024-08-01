<template>
  <div
    class="main-first-category-list-item"
    :class="[activeControl(), props.theme]"
  >
    <div class="wrap-content-top">
      <div class="content-top"/>
    </div>
    <div class="content-container">
      <div
        class="item-content"
        :class="{ 'japanese-lang': isJapaneseLanguage }"
      >
        {{ props.content }}
      </div>
    </div>
    <div class="wrap-content-bottom">
      <div class="content-bottom"/>
    </div>
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
  flex-direction: column;
  align-items: flex-end;
  width: 100%;

  .wrap-content-top, .wrap-content-bottom {
    display: flex;
    justify-content: flex-end;
    width: 10%;
  }

  .content-top {
    width: 100%;
    height: 1.1719vw;
    border-bottom-right-radius: 2.3828vw;
    box-shadow: 1.015625vw 1.171875vw 0 0.859375vw #fff;
  }

  .content-bottom {
    width: 100%;
    height: 1.1719vw;
    border-top-right-radius: 2.3828vw;
    box-shadow: 1.015625vw -1.171875vw 0 0.859375vw #fff;
  }

  .content-container {
    display: flex;
    width: 90%;
    background-color: #fff;
    border-radius: 2.3828vw 0 0 2.3828vw;
  }

  .item-content {
    z-index: 5;
    flex-grow: 1;
    padding-top: .9375vw;
    padding-bottom: .9375vw;
    padding-left: 1.9531vw;
    font-family: Noto Serif KR, sans-serif;
    font-size: 1.9531vw;
    font-style: normal;
    font-weight: 900;
    font-stretch: normal;
    line-height: normal;
    color: v-bind(customActiveFontColor);
    text-align: left;
    letter-spacing: normal;
    word-break: break-all;
    border-radius: 2.3828vw;

    &.japanese-lang {
      word-break: break-all;
    }
  }
}
</style>
