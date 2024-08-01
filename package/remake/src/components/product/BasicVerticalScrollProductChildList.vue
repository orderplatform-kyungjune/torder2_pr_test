<template>
  <div class="product-wrap product-sub-category-observe">
    <div class="product-list-wrap">
      <div class="product-category-wrap">
        <div class="main-category-name">
          {{ removeNewLine(categoryName) }}
        </div>
        <div
          :class="themeColor"
          class="sub-category-name"
        >
          {{ removeNewLine(childCategoryName) }}
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
  </div>
</template>

<script lang='ts' setup>
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { removeNewLine } from '@torder/common/utils';
import useInitStore from '@store/storeInit';

const { init } = storeToRefs(useInitStore());
const { t } = useI18n();
const { getStoreInfo } = storeToRefs(useInitStore());

const getMainRowsValue = () => {
  if (init.value.storeInfo.MainRows === 2) {
    return 'repeat(2, 1fr)';
  }

  return 'repeat(3, 1fr)';
};

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
  flex-direction: column;
  font-family: pretendard, sans-serif;

  .product-list-wrap {
    display: flex;
    flex-direction: column;

    .product-category-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 0.7813vw;
      align-items: center;
      padding-bottom: 0.9375vw;

      .main-category-name {
        padding-left: 1.25vw;
        font-size: 1.7188vw;
        font-weight: 600;
        line-height: 2.3438vw;
        color: #F91515;
        letter-spacing: -0.0344vw;
        word-break: break-all;
        border-left: 0.3125vw solid #F91515;
      }

      .sub-category-name {
        padding-left: 0.7813vw;
        font-size: 1.7188vw;
        font-weight: 700;
        line-height: 2.3438vw;
        color: #fff;
        letter-spacing: -0.0344vw;
        word-break: break-all;
        border-left: 0.1563vw solid #FFF;

        &.white {
          color: #313131;
          border-left: 0.1563vw solid #313131;
        }
      }
    }

    .product-list-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 1.5625vw;
      background: rgba(213, 213, 213, 0.80);
      border: 0.078125vw solid #D5D5D5;
      border-radius: 1.25vw;

      &.black {
        background: rgba(49, 49, 49, 0.80);
        border: 0.078125vw solid #494949;

      }

      .product-list-empty-text {
        font-size: 1.875vw;
        font-weight: 700;
        line-height: 1.875vw;
        color: #959595;
        letter-spacing: -0.0469vw;

        &.black {
          color: #fff;
        }
      }
    }

    .product-list {
      display: grid;
      grid-template-columns: v-bind(getMainRowsValue());
      gap: 1.5625vw;
      justify-content: space-between;
    }
  }
}

</style>
