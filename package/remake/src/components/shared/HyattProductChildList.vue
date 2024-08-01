<template>
  <div
    :class="[theme.color]"
    class="product-sub-category product-sub-category-observe"
  >
    <div class="product-list-wrap">
      <div class="category-title">
        <span
          :class="getDarkModeClass()"
          class="main-category-title"
        >
          {{ removeNewLine(categoryName) }}
        </span>
        <div
          v-if="childCategoryName"
          class="category-divider"
        >
          <svg
            fill="none"
            height="2.3438vw"
            viewBox="0 0 20 30"
            width="1.875vw"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              :stroke="isDarkMode ? '#fff' : '#313131'"
              d="M7 21L13 15L7 9"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </div>
        <span
          v-if="childCategoryName"
          :class="getDarkModeClass()"
          class="sub-category-title"
        >
          {{ removeNewLine(childCategoryName) }}
        </span>
      </div>
      <div
        v-if="productLength === 0 && getStoreInfo.noGoodsNotifyUse === 'Y'"
        :class="getDarkModeClass()"
        class="product-list-empty"
      >
        <span
          :class="getDarkModeClass()"
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
      <div
        v-if="categoryIndex !== totalLength - 1"
        :class="getDarkModeClass()"
        class="product-divider"
      />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { removeNewLine } from '@torder/common/utils';
import useThemeStore from '@store/storeTheme';
import useInitStore from '@store/storeInit';

const { getStoreInfo } = storeToRefs(useInitStore());
const {
  isDarkMode,
  getDarkModeClass,
} = useInitStore();

const { t } = useI18n();

const { theme } = useThemeStore();

defineProps<{
  categoryName: string,
  childCategoryName: string,
  productLength: number,
  categoryIndex: number,
  totalLength: number,
}>();
</script>

<style lang='scss' scoped>
.product-sub-category {
  display: flex;
  flex-direction: column;

  &.black .product-list-wrap .product-list {
    .main-category-name {
      color: #aaa;
    }

    .sub-category-name {
      font-weight: 500;
      color: #fff;
    }

  }

  .product-divider {
    width: 100%;
    height: 1.25vw;
    margin: 3.2813vw 0;
    background-color: #f8f8f8;

    &.dark-mode {
      background-color: #313131;
    }
  }

  .category-title {
    margin-bottom: 1.25vw;

    .main-category-title {
      font-size: 1.875vw;
      font-weight: 400;
      line-height: 2.3438vw;
      color: #7A7A7A;
      letter-spacing: -0.0562vw;
      word-break: break-all;

      &.dark-mode {
        color: #EBEBEB;
      }
    }

    .category-divider {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: top;
    }

    .sub-category-title {
      font-size: 1.875vw;
      font-weight: 700;
      line-height: 2.3438vw;
      color: #313131;
      letter-spacing: -0.0562vw;
      word-break: break-all;

      &.dark-mode {
        color: #fff;
      }
    }
  }
}

.product-list-wrap {
  display: flex;
  flex-direction: column;

  .product-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3.2813vw 1.25vw;
    justify-content: space-between;
    margin-bottom: 2.3438vw;
  }

  .product-list-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1.5625vw;
    margin-bottom: 2.3438vw;
    background-color: #F8F8F8;
    border: 0.0781vw solid #D5D5D5;
    border-radius: 1.25vw;

    &.dark-mode {
      background-color: #494949;
      border: 0.078125vw solid #7A7A7A;
    }

    .product-list-empty-text {
      font-size: 1.5625vw;
      font-weight: 500;
      line-height: 1.875vw;
      color: #AFAFAF;
      letter-spacing: -0.0469vw;

      &.dark-mode {
        color: #959595;
      }
    }
  }
}

.main-category-name {
  font-size: 1.4063vw;
  font-weight: 600;
  color: #7a7a7a;
}
</style>
