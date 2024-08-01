<template>
  <div
    class="main-sub-category"
    :class="type"
  >
    <div
      class="main-sub-category-wrap"
      :class="[type, isActiveCartBind]"
    >
      <div
        v-if="subCategories.length > 0"
        class="main-sub-category-wrap-sub"
        :class="type"
      >
        <HyattCategorySubListItem
          v-for="(subCategory, index) in subCategories"
          :key="getChildCategoryCode(subCategory, index)"
          :data-id="getChildCategoryCode(subCategory, index)"
          :theme="color"
          :content="getChildCategoryName(subCategory)"
          :active="getSelectedItemFlag(subCategory)"
          :isEmptyString="isEmptyString(subCategory.childCategoryName)"
          @click="onClickSubCategoryItemActive"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {
  computed,
  ComputedRef,
} from 'vue';
import { storeToRefs } from 'pinia';
import { scrollMove } from '@utils/scrollUtils';
import { translateLanguage } from '@utils/langTransfer';
import {
  categoryType,
  childCategoryType,
} from '@torder/common/interface/category';
import useThemeStore from '@store/storeTheme';
import useStoreSelectedCategory from '@store/storeSelectedCategory';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import { HyattCategorySubListItem } from '@components';

const { init } = storeToRefs(useInitStore());

const { isActiveCart } = storeToRefs(useCartStore());

const { selectedCategory } = storeToRefs(useStoreSelectedCategory());
const { setSubSelectedCategory } = useStoreSelectedCategory();

const isActiveCartBind = computed(() => {
  const activeCart = { 'active-cart': isActiveCart.value };
  return activeCart;
});

const { theme } = useThemeStore();

const {
  type,
  color,
} = theme;

const subCategories: ComputedRef<childCategoryType[]> = computed(() => {
  const emptyCategory: childCategoryType[] = [];

  try {
    const { goodList } = init.value;

    if (!goodList) return emptyCategory;

    const findCategory = goodList.find((item: categoryType) => item.categoryCode === selectedCategory.value.firstCategory);

    if (!findCategory) return emptyCategory;

    return findCategory.childCategoryList;
  } catch (error) {
    console.error(error);
    return emptyCategory;
  }
});

const getChildCategoryName = (item: childCategoryType) => {
  const {
    childCategoryLanguageName,
    childCategoryName,
  } = item;

  return translateLanguage(childCategoryLanguageName, childCategoryName);
};

const getChildCategoryCode = (item: childCategoryType, index: number) => {
  const { childCategoryCode } = item;

  if (!childCategoryCode) return index;

  const childCategoryId = `${selectedCategory.value.firstCategory}-${childCategoryCode}`;

  return childCategoryId;
};

if (selectedCategory.value.subCategory) {
  const firstSubMenuCode = subCategories.value?.[0]?.childCategoryCode;
  setSubSelectedCategory(firstSubMenuCode);
}

const getSelectedItemFlag = (value: childCategoryType) => {
  const childCategoryId = `${selectedCategory.value.firstCategory}-${value.childCategoryCode}`;
  const selectedItemFlag = selectedCategory.value.subCategory === childCategoryId;

  return selectedItemFlag;
};

// 클릭 이벤트
const onClickSubCategoryItemActive = async (e: Event) => {
  const target = e.target as HTMLElement;
  const realTarget = target.closest('.main-sub-category-container') as HTMLElement;
  const { id } = realTarget.dataset;

  const getId = () => {
    if (!id) return '';

    return id;
  };

  const newId = getId();
  setSubSelectedCategory(newId);

  const scrollElement = document.querySelector('.middle-body') as HTMLElement;
  const scrollTarget = document.getElementById(selectedCategory.value.subCategory) as HTMLElement;

  scrollMove({
    type,
    parent: scrollElement,
    child: scrollTarget,
  });
};

const isEmptyString = (subCategoryContent: string) => {
  if (subCategoryContent === '　') return true;
  return false;
};
</script>

<style lang='scss' scoped>
.main-sub-category {
  display: flex;
  justify-content: space-between;

  .main-sub-category-wrap {
    width: 100%;

    &.active-cart {
      width: 100%;
    }

    .main-sub-category-wrap-sub {
      display: flex;
      gap: 1.25vw;
      overflow-x: scroll;
    }
  }
}
</style>
