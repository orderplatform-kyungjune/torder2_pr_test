<template>
  <div class="product-wrap product-sub-category-observe">
    <div class="product-category-wrap">
      <div class="main-category-name">
        <span class="main-category-name-text">
          {{ removeNewLine(categoryName) }}
        </span>
      </div>
      <div
        :class="themeColor"
        class="sub-category-name"
      >
        <span class="sub-category-name-text">
          {{ removeNewLine(childCategoryName) }}
        </span>
      </div>
    </div>
    <div
      v-if="productLength === 0 && getStoreInfo.noGoodsNotifyUse === 'Y'"
      :class="{ black: isDarkTheme() }"
      class="product-list-empty"
    >
      <span
        :class="{ black: isDarkTheme() }"
        class="product-list-empty-text"
      >
        {{ t('등록된 메뉴가 없습니다.') }}
      </span>
    </div>
    <div
      v-else
      class="product-list"
    >
      <slot/>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { removeNewLine } from '@torder/common/utils';
import useInitStore from '@store/storeInit';

const { t } = useI18n();
const { getStoreInfo } = storeToRefs(useInitStore());

defineProps<{
  themeColor: string,
  categoryName: string,
  childCategoryName: string,
  productLength: number,
  isDarkTheme: () => boolean,
}>();
</script>

<style lang="scss" scoped>
.product-wrap {
  display: flex;
  gap: 0.9375vw;
  font-family: pretendard, sans-serif;

  .product-category-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.625vw;
    align-items: flex-start;
    padding: 0.9375vw 0;

    .main-category-name {
      display: flex;
      align-items: center;
      padding-left: 1.25vw;
      border-left: 0.3125vw solid #F91515;

      .main-category-name-text {
        display: -webkit-box;
        width: max-content;
        min-width: 7.3438vw;
        max-width: 23.4375vw;
        overflow: hidden;
        font-size: 1.7188vw;
        font-weight: 700;
        line-height: 2.3438vw;
        color: #F91515;
        text-overflow: ellipsis;
        letter-spacing: -0.0344vw;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
      }
    }

    .sub-category-name {
      display: flex;
      align-items: center;
      padding-left: .9375vw;
      color: #fff;
      border-left: 0.3125vw solid #fff;

      .sub-category-name-text {
        display: -webkit-box;
        width: max-content;
        min-width: 7.3438vw;
        max-width: 23.4375vw;
        overflow: hidden;
        font-size: 2.5vw;
        font-weight: 700;
        line-height: 3.125vw;
        text-overflow: ellipsis;
        letter-spacing: -0.05vw;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
      }

      &.white {
        color: #313131;
        border-left: 0.3125vw solid #313131;
      }
    }
  }

  .product-list-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 27.9688vw;
    height: 26.4063vw;
    padding: 1.25vw 0.3125vw;
    background: rgba(213, 213, 213, 0.80);
    border: 0.078125vw solid #D5D5D5;
    border-radius: 0.7813vw;

    &.black {
      background: rgba(49, 49, 49, 0.80);
      border: 0.078125vw solid #494949;
    }

    .product-list-empty-text {
      font-size: 1.875vw;
      font-weight: 700;
      line-height: 2.5vw;
      color: #959595;
      letter-spacing: -0.0375vw;

      &.black {
        color: #fff;
      }
    }
  }

  .product-list {
    display: flex;
  }
}

</style>
