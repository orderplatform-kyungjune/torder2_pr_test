<template>
  <div
    class="main-sub-category"
    :class="type"
  >
    <div
      v-if="isTypeHorizontal || isTypeHorizontalCard"
      class="main-sub-category-wrap"
      :class="[type, isActiveCartBind]"
    >
      <div
        v-if="isHasSubCategoryLength"
        class="main-sub-category-wrap-sub"
        :class="type"
      >
        <RestaurantHorizontalScreenCategorySubListItem
          v-for="(subCategory, index) in subCategories"
          :key="getChildCategoryCode(subCategory, index)"
          class="sub-list"
          :data-id="getChildCategoryCode(subCategory, index)"
          :theme="theme"
          :content="getChildCategoryName(subCategory)"
          :active="getSelectedItemFlag(subCategory)"
          :isEmptyString="isEmptyString(subCategory.childCategoryName)"
          :customFontColor="subCategoryFontColor"
          :customActiveFontColor="subCategoryActiveFontColor"
          @click="onClickSubCategoryItemActive"
        />
      </div>
      <div
        v-else
        class="main-sub-category-wrap-sub"
        :class="type"
      >
        <RestaurantHorizontalScreenCategorySubListItem
          class="sub-list"
          :data-id="selectedFirstCategory"
          :theme="theme"
          :content="firstCategoryName"
          :active="true"
          :isEmptyString="isEmptyString(firstCategoryName)"
          :customFontColor="subCategoryFontColor"
          :customActiveFontColor="subCategoryActiveFontColor"
        />
      </div>
    </div>
    <div
      v-if="isTypeVertical"
      class="main-sub-category-wrap"
      :class="[type, isActiveCartBind]"
    >
      <div
        v-if="isHasSubCategoryLength"
        class="main-sub-category-wrap-sub"
        :class="type"
      >
        <RestaurantVerticalScreenCategorySubListItem
          v-for="(subCategory, index) in subCategories"
          :key="getChildCategoryCode(subCategory, index)"
          class="sub-list"
          :data-id="getChildCategoryCode(subCategory, index)"
          :theme="theme"
          :content="getChildCategoryName(subCategory)"
          :active="getSelectedItemFlag(subCategory)"
          :customActiveFontColor="subCategoryActiveFontColor"
          :customActiveBackgroundColor="subCategoryActiveBackgroundColor"
          :customFontColor="subCategoryFontColor"
          :customBackgroundColor="subCategoryBackgroundColor"
          :isEmptyString="isEmptyString(subCategory.childCategoryName)"
          @click="onClickSubCategoryItemActive"
        />
      </div>
      <div
        v-else
        class="main-sub-category-wrap-sub"
        :class="type"
      >
        <RestaurantVerticalScreenCategorySubListItem
          class="sub-list"
          :data-id="selectedFirstCategory"
          :theme="theme"
          :content="firstCategoryName"
          :active="true"
          :customActiveFontColor="subCategoryActiveFontColor"
          :customActiveBackgroundColor="subCategoryActiveBackgroundColor"
          :customFontColor="subCategoryFontColor"
          :customBackgroundColor="subCategoryBackgroundColor"
          :isEmptyString="isEmptyString(firstCategoryName)"
        />
      </div>
    </div>
    <div
      v-if="!flag.cart && isHorizontalType"
      class="store-wrap"
    >
      <TableTagToSecret/>
      <div class="toolbox-store-name">
        {{ getStoreName() }}
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
import { getStoreName } from '@torder/common/utils';
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
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import useRestaurantVerticalStore from '@store/restaurantVertical';
import { TableTagToSecret } from '@containers';
import {
  RestaurantHorizontalScreenCategorySubListItem,
  RestaurantVerticalScreenCategorySubListItem,
} from '@components';

const {
  init,
  subCategoryActiveFontColor,
  subCategoryFontColor,
  subCategoryActiveBackgroundColor,
  subCategoryBackgroundColor,
} = storeToRefs(useInitStore());

// 장바구니 의존한 스타일 관련 코드
const { flag } = useModalStore();
const { isActiveCart } = storeToRefs(useCartStore());

const isActiveCartBind = computed(() => {
  const activeCart = { 'active-cart': isActiveCart.value };
  return activeCart;
});

const themeStore = useThemeStore();

const getThemeStoreColor = () => {
  const { color } = themeStore.theme;

  return color;
};

const theme: ComputedRef<colorType> = computed(getThemeStoreColor);

const getThemeStoreType = () => {
  const { type } = themeStore.theme;

  if (!type) return 'vertical';

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
const firstCategoryName = ref('');
const storeSelectedCategory = useStoreSelectedCategory();

const getSelectedFirstCategory = () => {
  const { firstCategory } = storeSelectedCategory.selectedCategory;

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

    firstCategoryName.value = findCategory.categoryName;
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
  const selectedMenu = storeSelectedCategory.selectedCategory?.subCategory;

  if (!selectedMenu) return true;

  const hasSelectedSubCategory = selectedMenu === '';

  return hasSelectedSubCategory;
};

if (isHasSelectedSubCategory()) {
  const firstSubMenuCode = subCategories.value?.[0]?.childCategoryCode;
  storeSelectedCategory.setSubSelectedCategory(firstSubMenuCode);
}

const getSelectedItem = () => {
  const subMenu = storeSelectedCategory.selectedCategory?.subCategory;

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
  await storeSelectedCategory.setSubSelectedCategory(newId);

  const scrollElement = document.querySelector('.middle-body') as HTMLElement;
  const scrollTarget = document.getElementById(selectedItem.value) as HTMLElement;
  const { upDownFlag } = storeToRefs(useRestaurantVerticalStore());

  scrollMove({
    type: type.value,
    parent: scrollElement,
    child: scrollTarget,
    isBodyChange: upDownFlag.value,
  });
};

const isEmptyString = (subCategoryContent: string) => {
  if (subCategoryContent === '　') return true;
  return false;
};

// 카드 테마인지 확인
const { theme: isHorizontal } = useThemeStore();
const isHorizontalType = computed(() => isHorizontal.type === RESTAURANT_HORIZONTAL);
</script>

<style lang='scss' scoped>
.main-sub-category {
  display: flex;
  justify-content: space-between;

  .main-sub-category-wrap {
    width: 70%;

    &.restaurant-horizontal-card, &.restaurant-vertical {
      width: 100%;
    }

    &.active-cart {
      width: 100%;
    }
  }

  .toolbox-store-name {
    margin: 0.625vw 0vw 0.3125vw 0vw;
    font-family: 'Pretendard', sans-serif;
    font-size: 1.0938vw;
    font-weight: 200;
    color: #2f2a26;
    text-align: center;
  }

  .store-wrap {
    width: 28%;
    margin-top: -2.7344vw;
  }
}

.main-sub-category-wrap-sub {
  display: flex;
  overflow-x: scroll;

  .sub-list {
    &:first-child:deep(.main-sub-category-list-item) {
      margin-left: 0;
    }

    &:last-child:deep(.after-list) {
      display: none;
    }
  }
}
</style>
