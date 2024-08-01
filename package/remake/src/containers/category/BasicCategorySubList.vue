<template>
  <div
    class="main-sub-category"
    :class="theme.type"
  >
    <div
      v-if="isTypeVertical()"
      class="main-sub-category-wrap"
      :class="theme.type"
    >
      <div
        v-if="isHasSubCategoryLength"
        class="main-sub-category-wrap-sub"
        :class="theme.type"
      >
        <BasicVerticalScrollCategorySubListItem
          v-for="(subCategory, index) in subCategories"
          :key="getChildCategoryCode(subCategory, index)"
          :data-id="getChildCategoryCode(subCategory, index)"
          :theme="theme.color"
          :content="getChildCategoryName(subCategory)"
          :active="getSelectedItemFlag(subCategory)"
          @click="onClickSubCategoryItemActive"
        />
      </div>
      <div
        v-else
        class="main-sub-category-wrap-sub"
        :class="theme.type"
      >
        <BasicVerticalScrollCategorySubListItem
          :data-id="selectedFirstCategory"
          :theme="theme.color"
          :content="firstCategoryName"
          :active="true"
        />
      </div>
    </div>
    <div
      v-if="isTypeHorizontal()"
      class="main-sub-category-wrap"
      :class="theme.type"
    >
      <div
        v-if="isHasSubCategoryLength"
        class="main-sub-category-wrap-sub"
        :class="theme.type"
      >
        <BasicHorizontalScrollCategorySubListItem
          v-for="(subCategory, index) in subCategories"
          :key="getChildCategoryCode(subCategory, index)"
          class="sub-list"
          :data-id="getChildCategoryCode(subCategory, index)"
          :theme="theme.color"
          :content="getChildCategoryName(subCategory)"
          :active="getSelectedItemFlag(subCategory)"
          @click="onClickSubCategoryItemActive"
        />
      </div>
      <div
        v-else
        class="main-sub-category-wrap-sub"
        :class="theme.type"
      >
        <BasicHorizontalScrollCategorySubListItem
          class="sub-list"
          :data-id="selectedFirstCategory"
          :theme="theme.color"
          :content="firstCategoryName"
          :active="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {
  computed,
  ComputedRef,
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
  HORIZONTAL,
  VERTICAL,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useStoreSelectedCategory from '@store/storeSelectedCategory';
import useInitStore from '@store/storeInit';
import {
  BasicVerticalScrollCategorySubListItem,
  BasicHorizontalScrollCategorySubListItem,
} from '@components';

const {
  init,
  getStoreInfo,
} = storeToRefs(useInitStore());

const { selectedCategory } = storeToRefs(useStoreSelectedCategory());
const { setSubSelectedCategory } = useStoreSelectedCategory();

const { theme } = storeToRefs(useThemeStore());

const isTypeVertical = () => theme.value.type === VERTICAL;

const isTypeHorizontal = () => theme.value.type === HORIZONTAL;

// 카테고리 로직
const firstCategoryName = ref('');

const getSelectedFirstCategory = () => {
  const { firstCategory } = selectedCategory.value;

  if (!firstCategory) return '';

  return firstCategory;
};

const selectedFirstCategory: ComputedRef<string> = computed(getSelectedFirstCategory);

const getSubCategory = () => {
  const emptyCategory: childCategoryType[] = [];
  try {
    const { goodList } = init.value;

    if (!goodList) return emptyCategory;

    const findFunction = (item: categoryType) => item.categoryCode === getSelectedFirstCategory();
    const findCategory = goodList.find(findFunction);

    if (!findCategory) {
      firstCategoryName.value = '';
      return [];
    }

    firstCategoryName.value = translateLanguage(findCategory.categoryLanguageName, findCategory.categoryName);
    const subCategory: childCategoryType [] = findCategory.childCategoryList;

    return subCategory;
  } catch (error) {
    // 추후에 예외 처리 진행 해야되겟죠.
    return [];
  }
};

const subCategories: ComputedRef<childCategoryType[]> = computed(getSubCategory);

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
  const childCategoryId = `${getSelectedFirstCategory()}-${childCategoryCode}`;

  return childCategoryId;
};

const isHasSelectedSubCategory = () => {
  const selectedMenu = selectedCategory.value?.subCategory;

  if (!selectedMenu) return true;
  const hasSelectedSubCategory = selectedMenu === '';

  return hasSelectedSubCategory;
};

if (isHasSelectedSubCategory()) {
  const firstSubMenuCode = subCategories.value?.[0]?.childCategoryCode;
  setSubSelectedCategory(firstSubMenuCode);
}

const getSelectedItem = () => {
  const subMenu = selectedCategory.value?.subCategory;

  if (!subMenu) return '';

  return subMenu;
};

const selectedItem: ComputedRef<string> = computed(getSelectedItem);

const getSelectedItemFlag = (value: childCategoryType) => {
  const childCategoryId = `${getSelectedFirstCategory()}-${value.childCategoryCode}`;
  const selectedItemFlag = selectedItem.value === childCategoryId;

  return selectedItemFlag;
};

// 서브카테고리가 없을 경우
const getSubCategoryLength = () => {
  if (!subCategories.value) return false;

  const isHasSubMenu = subCategories.value.length > 0;

  return isHasSubMenu;
};

const isHasSubCategoryLength: ComputedRef<boolean> = computed(getSubCategoryLength);

// 인원수 사용 여부에 따라 중분류 리스트 넓이 구하는 로직
const getCategoryListWidth = () => {
  const isVisitPeople = getStoreInfo.value.visitconfig?.visitBookUse;

  return isVisitPeople === 1 ? '25.3125vw' : '15.625vw';
};

// 클릭 이벤트
const onClickSubCategoryItemActive = (e: Event) => {
  const target = e.target as HTMLElement;
  const realTarget = target.closest('.main-sub-category-list-item') as HTMLElement;
  const { id } = realTarget.dataset;

  const getId = () => {
    if (!id) return '';

    return id;
  };

  const newId = getId();

  setSubSelectedCategory(newId);

  const scrollElement = document.querySelector('.product-container') as HTMLElement;
  const scrollTarget = document.getElementById(selectedItem.value) as HTMLElement;
  scrollMove({
    type: theme.value.type,
    parent: scrollElement,
    child: scrollTarget,
    direction: isTypeHorizontal() ? 'left' : 'top',
  });
};
</script>

<style lang='scss' scoped>
.main-sub-category {
  position: fixed;
  top: 6.25vw;
  left: 0;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 82vw;
  overflow: scroll;

  &.vertical {
    top: -0.1563vw;
    right: 11vw;
    left: 17.8906vw;
    justify-content: flex-start;
    height: 5.5vw;
    border: none;
  }

  &.horizontal {
    position: fixed;
    left: 17.9688vw;
    z-index: 8;
    display: flex;
    justify-content: flex-start;
    height: 5.5vw;
    color: #fff;
  }

  .main-sub-category-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-align: center;

    &.vertical {
      margin-right: v-bind(getCategoryListWidth());
    }

    &.horizontal {
      height: 5.5vw;
      margin-right: v-bind(getCategoryListWidth());
    }

    .main-sub-category-wrap-sub {
      display: flex;
      gap: .9375vw;
      align-items: center;
      justify-content: center;

      &.horizontal {
        gap: 0.625vw;
        padding: 0 .1172vw;
      }
    }
  }
}
</style>
