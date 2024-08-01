<template>
  <div
    v-if="active"
    class="main-first-category-list-item"
    :class="[activeControl(), theme]"
  >
    <div class="wrap-content-top">
      <div class="content-top"/>
    </div>
    <div class="content-container">
      <div
        class="item-content"
        :class="{ 'japanese-lang': isJapaneseLanguage }"
      >
        <span class="item-content-text ellipsis-text-3">
          {{ newLineHelper(content) }}
        </span>
      </div>
    </div>
    <div class="wrap-content-bottom">
      <div class="content-bottom"/>
    </div>
  </div>

  <div
    v-else
    class="main-first-category-list-item default"
  >
    <span class="main-first-category-list-item-text ellipsis-text-3">
      {{ newLineHelper(content) }}
    </span>
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { newLineHelper } from '@torder/common/utils';
import useInitStore from '@store/storeInit';

const props = defineProps<{
  /** 컴포넌트의 테마를 결정해주는 클래스명입니다. */
  theme?: string,
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

// 커스텀 디자인
const {
  backgroundColor,
  mainCategoryActiveFontColor,
  mainCategoryFontColor,
} = storeToRefs(useInitStore());
</script>

<style lang='scss' scoped>
.main-first-category-list-item{
  &.active{

    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;

    .wrap-content-top,
    .wrap-content-bottom {
      display: flex;
      justify-content: flex-end;
      width: 10%;
    }

    .content-top {
      width: 100%;
      height: 1.1719vw;
      border-bottom-right-radius: 2.3828vw;
      box-shadow: 1.015625vw 1.171875vw 0 0.859375vw v-bind(backgroundColor);
    }

    .content-bottom {
      width: 100%;
      height: 1.1719vw;
      border-top-right-radius: 2.3828vw;
      box-shadow: 1.015625vw -1.171875vw 0 0.859375vw v-bind(backgroundColor);
    }

    .content-container {
      display: flex;
      align-items: center;
      width: 16.875vw;
      padding: 1.5625vw;
      overflow: hidden;
      background-color: v-bind(backgroundColor);
      border-radius: 1.5625vw;
    }

    .item-content {
      z-index: 5;
      display: flex;
      align-items: center;
      overflow: hidden;
      text-align: left;
      word-break: break-all;

      .item-content-text {
        font-size: 1.875vw;
        font-weight: 700;
        line-height: 2.3438vw;
        color: v-bind(mainCategoryActiveFontColor);
        letter-spacing: -0.0562vw;
        white-space: pre-wrap;
      }

      &.japanese-lang {
        word-break: break-word;
      }
    }
  }
  &.default{
    padding: 1.5625vw;

    .main-first-category-list-item-text {
      font-size: 1.875vw;
      font-weight: 400;
      line-height: 2.3438vw;
      color: v-bind(mainCategoryFontColor);
      letter-spacing: -0.0562vw;
      word-break: break-all;
      white-space: pre-wrap;
    }
  }
}

</style>
