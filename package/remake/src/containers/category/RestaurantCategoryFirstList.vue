<template>
  <div
    class="main-first-category"
    :class="type"
  >
    <div
      class="main-first-category-wrap"
      :class="type"
    >
      <div
        v-if="isTypeHorizontal || isTypeHorizontalCard"
        class="main-first-category-wrap-sub"
        :class="type"
      >
        <template
          v-for="(firstCategory, index) in firstCategories"
          :key="getCategoryCode(firstCategory, index)"
        >
          <RestaurantHorizontalScreenActiveCategoryFirstListItem
            v-if="getSelectedItemFlag(firstCategory)"
            :data-id="getCategoryCode(firstCategory, index)"
            :theme="theme"
            :content="getCategoryName(firstCategory)"
            :active="getSelectedItemFlag(firstCategory)"
            :isJapaneseLanguage="isJapaneseLanguage"
            :customActiveFontColor="mainCategoryActiveFontColor"
            @click="onClickFirstCategoryItemActive"
          />
          <RestaurantHorizontalScreenCategoryFirstListItem
            v-else
            class="category-list"
            :data-id="getCategoryCode(firstCategory, index)"
            :theme="theme"
            :content="getCategoryName(firstCategory)"
            :active="getSelectedItemFlag(firstCategory)"
            :isJapaneseLanguage="isJapaneseLanguage"
            :customFontColor="mainCategoryFontColor"
            @click="onClickFirstCategoryItemActive"
          />
        </template>
      </div>
      <div
        v-if="isTypeVertical"
        class="main-first-category-wrap-sub"
        :class="type"
      >
        <template
          v-for="(firstCategory, index) in firstCategories"
          :key="getCategoryCode(firstCategory, index)"
        >
          <RestaurantVerticalScreenCategoryFirstListItem
            v-if="getSelectedItemFlag(firstCategory)"
            class="category-list"
            :data-id="getCategoryCode(firstCategory, index)"
            :theme="theme"
            :content="getCategoryName(firstCategory)"
            :active="getSelectedItemFlag(firstCategory)"
            :isJapaneseLanguage="isJapaneseLanguage"
            :customActiveFontColor="mainCategoryActiveFontColor"
            :customActiveBackgroundColor="mainCategoryActiveBackgroundColor"
            :customFontColor="mainCategoryFontColor"
            :customBackgroundColor="mainCategoryBackgroundColor"
            @click="onClickFirstCategoryItemActive"
          />
          <RestaurantVerticalScreenCategoryFirstListItem
            v-else
            class="category-list"
            :data-id="getCategoryCode(firstCategory, index)"
            :theme="theme"
            :content="getCategoryName(firstCategory)"
            :active="getSelectedItemFlag(firstCategory)"
            :isJapaneseLanguage="isJapaneseLanguage"
            :customActiveFontColor="mainCategoryActiveFontColor"
            :customActiveBackgroundColor="mainCategoryActiveBackgroundColor"
            :customFontColor="mainCategoryFontColor"
            :customBackgroundColor="mainCategoryBackgroundColor"
            @click="onClickFirstCategoryItemActive"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {
  computed,
  ComputedRef,
  Ref,
  ref,
} from 'vue';
import { storeToRefs } from 'pinia';

import { scrollMove } from '@utils/scrollUtils';
import { translateLanguage } from '@utils/langTransfer';
import {
  colorType,
  typeType,
} from '@torder/common/interface/theme';
import {
  categoryType,
  childCategoryType,
} from '@torder/common/interface/category';
import {
  RESTAURANT_HORIZONTAL,
  RESTAURANT_HORIZONTAL_CARD,
  RESTAURANT_VERTICAL,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useStoreSelectedCategory from '@store/storeSelectedCategory';
import useInitStore from '@store/storeInit';
import useRestaurantVerticalStore from '@store/restaurantVertical';
import i18n from '@i18n';
import {
  RestaurantHorizontalScreenCategoryFirstListItem,
  RestaurantHorizontalScreenActiveCategoryFirstListItem,
  RestaurantVerticalScreenCategoryFirstListItem,
} from '@components';

const {
  init,
  mainCategoryFontColor,
  mainCategoryBackgroundColor,
  mainCategoryActiveFontColor,
  mainCategoryActiveBackgroundColor,
} = storeToRefs(useInitStore());

const themeStore = useThemeStore();

const getThemeStoreColor = () => {
  const { color } = themeStore.theme;

  return color;
};

const theme: ComputedRef<colorType> = computed(getThemeStoreColor);

const getThemeStoreType = () => {
  const { type } = themeStore.theme;

  return type;
};

const type: ComputedRef<typeType> = computed(getThemeStoreType);

// 레스토랑 노카드 테마
const getHorizontalFlag = () => {
  const isVertical = type.value === RESTAURANT_HORIZONTAL;

  return isVertical;
};

const isTypeHorizontal = computed(getHorizontalFlag);

// 레스토랑 카드 테마
const getHorizontalCardFlag = () => {
  const isHorizontal = type.value === RESTAURANT_HORIZONTAL_CARD;

  return isHorizontal;
};

const isTypeHorizontalCard = computed(getHorizontalCardFlag);

// 레스토랑 세로테마
const getVerticalFlag = () => {
  const isVertical = type.value === RESTAURANT_VERTICAL;

  return isVertical;
};

const isTypeVertical = computed(getVerticalFlag);

// 카테고리 로직
const getCategoryName = (item: categoryType) => {
  const {
    categoryLanguageName,
    categoryName,
  } = item;

  return translateLanguage(categoryLanguageName, categoryName);
};

const getCategoryCode = (item: categoryType, index: number) => {
  const { categoryCode } = item;

  if (!categoryCode) return index;

  return categoryCode;
};

const storeSelectedCategory = useStoreSelectedCategory();

const getInitStore = computed(() => {
  const { goodList = [] } = init.value;

  return goodList;
});

const firstCategories: Ref<categoryType[]> = ref(getInitStore);

const isHasSelectedFirstCategory = () => {
  const selectedMenu = storeSelectedCategory.selectedCategory?.firstCategory;

  if (!selectedMenu) return true;

  const hasSelectedFirstCategory = selectedMenu === '';

  return hasSelectedFirstCategory;
};

if (isHasSelectedFirstCategory()) storeSelectedCategory.setFirstSelectedCategory(firstCategories.value[0]?.categoryCode);

const getSelectedItem = () => {
  const firstMenu = storeSelectedCategory.selectedCategory?.firstCategory;

  if (!firstMenu) return '';

  return firstMenu;
};

const selectedItem: ComputedRef<string> = computed(getSelectedItem);

const getSelectedItemFlag = (item: categoryType) => {
  try {
    const selected = selectedItem.value === item.categoryCode;

    return selected;
  } catch (error) {
    return false;
  }
};

// 클릭이벤트
const onClickFirstCategoryItemActive = async (e: Event) => {
  const target = e.target as HTMLElement;
  const realTarget = target.closest('.main-first-category-list-item') as HTMLElement;
  const { id } = realTarget.dataset;

  const getId = () => {
    if (!id) return '';

    return (id);
  };

  const menuId = getId();

  await storeSelectedCategory.setFirstSelectedCategory(menuId);

  const scrollElement = document.querySelector('.middle-body') as HTMLElement;
  const scrollTarget = document.getElementById(selectedItem.value) as HTMLElement;
  const { upDownFlag } = storeToRefs(useRestaurantVerticalStore());

  scrollMove({
    type: type.value,
    parent: scrollElement,
    child: scrollTarget,
    isBodyChange: upDownFlag.value,
  });

  const getMenuFlag = (item: categoryType) => {
    const isMenu = item.categoryCode === id;
    return isMenu;
  };

  const findSubCategory = firstCategories.value.find(getMenuFlag) as categoryType;

  const getSubMenu = () => {
    const subCategory = findSubCategory.childCategoryList;

    if (!subCategory || subCategory.length === 0) {
      const defaultSubCategory = {
        childCategoryCode: 0,
        childCategoryName: '',
        childCategorySort: 0,
        childCategoryProductCount: 0,
        childCategoryProductList: [],
      };

      return defaultSubCategory;
    }

    const firstMenu = subCategory[0];

    return firstMenu;
  };

  const subMenu = getSubMenu() as childCategoryType;
  const subCategoryId = `${id}-${subMenu.childCategoryCode}`;
  storeSelectedCategory.setSubSelectedCategory(subCategoryId);
};

const isJapaneseLanguage = computed(() => {
  const { locale } = i18n.global;

  if (locale.value === 'jp') return true;
  return false;
});
</script>

<style lang='scss' scoped>
.main-first-category {
  margin-bottom: 0.78125vw;
  overflow: auto;

  .main-first-category-wrap {
    height: 100%;
    overflow: auto;
  }

  .main-first-category-wrap-sub {
    &.restaurant-horizontal {
      display: flex;
      flex-direction: column;

      .category-list {
        padding-top: 0.78125vw ;
        padding-bottom: 0.78125vw ;
      }
    }

    &.restaurant-vertical {
      display: flex;
      flex-direction: row;

      .category-list {
        margin: 0 0.625vw;
        white-space: nowrap;

        &:first-child{
          margin-left: 0;
        }
      }

    }
  }

  .category-list {
    height: 6.875vw;
  }
}
</style>
