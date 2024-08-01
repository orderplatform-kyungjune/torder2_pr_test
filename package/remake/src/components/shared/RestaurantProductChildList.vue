<template>
  <div
    class="product-sub-category product-sub-category-observe"
    :class="theme.color"
  >
    <div class="product-list-wrap">
      <div class="product-category-wrap">
        <div class="main-category-name">
          {{ categoryName }}
        </div>
        <div class="sub-category-name">
          {{ childCategoryName }}
        </div>
      </div>
      <div class="product-list">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { themeStoreType } from '@torder/common';
import useThemeStore from '@store/storeTheme';

// 테마 관련 로직
const { theme }: themeStoreType = useThemeStore();

defineProps<{
  categoryName: string,
  childCategoryName: string,
}>();
</script>

<style scoped lang='scss'>
.product-sub-category {
  display: flex;
  flex-direction: column;

  &.black .product-list-wrap .product-list .product-category-wrap {
    .main-category-name {
      color: #aaa;
    }

    .sub-category-name {
      font-weight: 500;
      color: #fff;
    }
  }
}

.product-list-wrap {
  display: flex;
  flex-direction: column;
}

.product-list {
  display: grid;
  grid-template-columns: 31% 31% 31%;
  gap: 1.5625vw;
  justify-content: space-between;
}

.product-category-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding-bottom: 0.7vw;
  margin: 1vw 0;
  color: black;
  border-bottom: .1563vw solid #2f2a26;
}

.main-category-name {
  font-family: 'Noto Serif KR', sans-serif;
  font-size: 1.4063vw;
  font-weight: 600;
  color: #7a7a7a;
}

.sub-category-name {
  padding-top: 0.7vw;
  font-family: 'Noto Serif KR', sans-serif;
  font-size: 2.3438vw;
  font-weight: 900;
  font-stretch: normal;
  line-height: normal;
  color: #2f2a26;
  text-align: left;
  letter-spacing: normal;
}
</style>
