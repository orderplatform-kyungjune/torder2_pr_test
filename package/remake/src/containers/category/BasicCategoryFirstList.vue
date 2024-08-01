<template>
  <div
    :class="theme.type"
    class="main-first-category"
  >
    <div
      :class="theme.type"
      class="main-first-category-wrap"
    >
      <div
        v-if="isTypeVertical()"
        :class="theme.type"
        class="main-first-category-wrap-sub"
      >
        <BasicVerticalScrollCategoryFirstListItem
          v-for="(firstCategory, index) in firstCategories"
          :key="getCategoryCode(firstCategory, index)"
          :active="getSelectedItemFlag(firstCategory)"
          :content="getCategoryName(firstCategory)"
          :data-id="getCategoryCode(firstCategory, index)"
          :isJapaneseLanguage="isJapaneseLanguage"
          :theme="theme.color"
          @click="onClickFirstCategoriesItemActive"
        />
      </div>
      <div
        v-if="isTypeHorizontal()"
        :class="theme.type"
        class="main-first-category-wrap-sub"
      >
        <BasicHorizontalScrollCategoryFirstListItem
          v-for="(firstCategory, index) in firstCategories"
          :key="getCategoryCode(firstCategory, index)"
          :active="getSelectedItemFlag(firstCategory)"
          :content="getCategoryName(firstCategory)"
          :data-id="getCategoryCode(firstCategory, index)"
          :isJapaneseLanguage="isJapaneseLanguage"
          :theme="theme.color"
          @click="onClickFirstCategoriesItemActive"
        />
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
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
  categoryType,
  childCategoryType,
} from '@torder/common/interface/category';
import {
  VERTICAL,
  HORIZONTAL,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useStoreSelectedCategory from '@store/storeSelectedCategory';
import useInitStore from '@store/storeInit';
import i18n from '@i18n';
import {
  BasicVerticalScrollCategoryFirstListItem,
  BasicHorizontalScrollCategoryFirstListItem,
} from '@components';

const {
  init,
  getStoreInfo,
} = storeToRefs(useInitStore());

const { selectedCategory } = storeToRefs(useStoreSelectedCategory());
const {
  setFirstSelectedCategory,
  setSubSelectedCategory,
} = useStoreSelectedCategory();

const { theme } = storeToRefs(useThemeStore());

const isTypeVertical = () => theme.value.type === VERTICAL;

const isTypeHorizontal = () => theme.value.type === HORIZONTAL;

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

const getInitStore = computed(() => {
  const { goodList = [] } = init.value;

  return goodList;
});

const firstCategories: Ref<categoryType[]> = ref(getInitStore);

const isHasSelectedFirstCategories = () => {
  const selectedMenu = selectedCategory.value?.firstCategory;

  if (!selectedMenu) return true;

  const hasSelectedFirstCategories = selectedMenu === '';
  return hasSelectedFirstCategories;
};

if (isHasSelectedFirstCategories()) setFirstSelectedCategory(firstCategories.value[0]?.categoryCode);

const getSelectedItem = () => {
  const firstMenu = selectedCategory.value?.firstCategory;

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

// 인원수 사용 여부에 따라 대분류 리스트 높이 구하는 로직
const getCategoryListHeight = () => {
  const isVisitPeople = getStoreInfo.value.visitconfig?.visitBookUse;
  const robotUse = getStoreInfo.value.robotInfo?.robotUse;

  // 인원 수 + 로봇호출 사용
  if (isVisitPeople === 1 && robotUse === 1) {
    return '38.8281vw';
  }
  // 인원 수 사용
  if (isVisitPeople === 1) {
    return '45.5469vw';
  }

  // 모두 미사용
  return '51.1719vw';
};

// 인원수 사용 여부에 따라 중분류 리스트 넓이 구하는 로직
const getCategoryListWidth = () => {
  const isVisitPeople = getStoreInfo.value.visitconfig?.visitBookUse;

  return isVisitPeople === 1 ? '25.3125vw' : '15.625vw';
};

// 클릭이벤트
const onClickFirstCategoriesItemActive = async (e: Event) => {
  const target = e.target as HTMLElement;

  const realTarget = target.closest('.main-first-category-list-item') as HTMLElement;

  const { id } = realTarget.dataset;

  const getId = () => {
    if (!id) return '';
    return id;
  };

  const menuId = getId();

  await setFirstSelectedCategory(menuId);

  const scrollElement = document.querySelector('.product-container') as HTMLElement;

  const scrollTarget = document.getElementById(selectedItem.value) as HTMLElement;

  scrollMove({
    type: theme.value.type,
    parent: scrollElement,
    child: scrollTarget,
    direction: isTypeHorizontal() ? 'left' : 'top',
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
        childCategoryCode: '',
        childCategoryName: '',
        childCategorySort: 0,
        childCategoryLanguageName: {
          ko: '',
          en: '',
          jp: '',
          zh_hans: '',
          zh_hant: '',
        },
        childCategoryProductCount: 0,
        childCategoryProductList: [],
      };
      return defaultSubCategory;
    }

    const firstMenu = subCategory[0];

    return firstMenu;
  };

  const subMenu: childCategoryType = getSubMenu();

  const subCategoryId = `${id}-${subMenu.childCategoryCode}`;

  setSubSelectedCategory(subCategoryId);
};

// 일본어 css 처리
const isJapaneseLanguage = computed(() => {
  const { locale } = i18n.global;

  if (locale.value === 'jp') return true;
  return false;
});
</script>

<style lang='scss' scoped>
.main-first-category {
  position: fixed;
  top: 0;
  right: 0;
  left: 15%;
  z-index: 6;
  display: flex;
  height: 5.1563vw;
  overflow: scroll;

  &.vertical {
    position: fixed;
    top: 5vw;
    left: 0;
    width: 17.8906vw;
    height: v-bind(getCategoryListHeight());
    padding: 0 1.5625vw 1.25vw 1.5625vw;
    overflow: auto;
    border: none;
    transform: none;
    scrollbar-width: none;
  }

  &.horizontal {
    position: fixed;
    top: 0;
    left: 17.9688vw;
    z-index: 6;
    display: flex;
    width: 82.1094vw;
    height: 5.1563vw;
  }

  .main-first-category-wrap {
    display: flex;
    align-items: flex-end;

    &.vertical {
      display: flex;
      align-items: flex-start;
      width: 100%;
      overflow: auto;
    }

    &.horizontal {
      display: flex;
      align-items: flex-start;
      padding: 0 .1172vw;
      margin-right: v-bind(getCategoryListWidth());
      overflow: auto;
    }

    .main-first-category-wrap-sub {
      display: flex;
      gap: 0.9375vw;
      justify-content: center;
      width: 100%;
      text-align: center;

      &.vertical {
        flex-direction: column;
      }

      &.horizontal {
        display: flex;
        justify-content: flex-start;
      }
    }
  }
}
</style>
