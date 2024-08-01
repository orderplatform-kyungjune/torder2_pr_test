<template>
  <div
    class="main-first-category"
    :class="theme.type"
  >
    <div
      v-observer
      class="main-first-category-wrap"
      :class="theme.type"
    >
      <div
        class="main-first-category-wrap-sub"
        :class="theme.type"
      >
        <div
          v-for="(firstCategory, index) in firstCategories"
          :id="`categoryItem-${index}`"
          :key="getCategoryId(firstCategory, index)"
        >
          <HyattCategoryFirstListItem
            :data-id="getCategoryId(firstCategory, index)"
            :theme="theme.color"
            :content="translateCategoryName(firstCategory)"
            :active="isSelectedItem(firstCategory)"
            :isJapaneseLanguage="isJapaneseLanguage"
            @click="onClickFirstCategoryItemActive"
          />
        </div>
      </div>
    </div>
    <div
      v-if="moreDetailFlag"
      class="more-detail-box"
    >
      <span class="more-detail-box-text">
        {{ t('더보기') }}
      </span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
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
import useThemeStore from '@store/storeTheme';
import useStoreSelectedCategory from '@store/storeSelectedCategory';
import useInitStore from '@store/storeInit';
import i18n from '@i18n';
import { HyattCategoryFirstListItem } from '@components';

const { t } = useI18n();

const { init } = storeToRefs(useInitStore());

const { theme } = storeToRefs(useThemeStore());

const { selectedCategory } = storeToRefs(useStoreSelectedCategory());
const {
  setFirstSelectedCategory,
  setSubSelectedCategory,
} = useStoreSelectedCategory();

const moreDetailFlag = ref(false);

const translateCategoryName = (category: categoryType): string => {
  const {
    categoryLanguageName,
    categoryName,
  } = category;

  return translateLanguage(categoryLanguageName, categoryName);
};

const getCategoryId = (category: categoryType, index: number): string | number => category.categoryCode || index;

const getInitStore = computed(() => init.value.goodList || []);
const firstCategories: Ref<categoryType[]> = ref(getInitStore);

const isHasSelectedFirstCategory = (): boolean => {
  const selectedMenu = selectedCategory.value?.firstCategory;
  return !selectedMenu || selectedMenu === '';
};

if (isHasSelectedFirstCategory()) setFirstSelectedCategory(firstCategories.value[0]?.categoryCode);

const getFirstSelectedCategory = (): string => selectedCategory.value?.firstCategory || '';

const selectedItem: ComputedRef<string> = computed(getFirstSelectedCategory);

const isSelectedItem = (item: categoryType): boolean => selectedItem.value === item.categoryCode;

const isJapaneseLanguage = computed(() => i18n.global.locale.value === 'jp');

// 클릭된 요소에서 메뉴 아이디를 추출하는 함수
const getMenuId = (target: HTMLElement): string => {
  const realTarget = target.closest('.main-first-category-list-item') as HTMLElement;
  return realTarget.dataset.id || '';
};

// 서브 메뉴를 가져오는 함수
const getSubMenu = (category: categoryType | undefined): childCategoryType => {
  if (!category || !category.childCategoryList || category.childCategoryList.length === 0) {
    return {
      childCategoryCode: '',
      childCategoryName: '',
      childCategorySort: 0,
      childCategoryProductCount: 0,
      childCategoryProductList: [],
      childCategoryLanguageName: {
        ko: '',
        en: '',
        jp: '',
        zh_hans: '',
        zh_hant: '',
      },
    };
  }

  return category.childCategoryList[0];
};

// 클릭된 요소의 카테고리를 찾는 함수
const findClickedCategory = (id: string): categoryType | undefined => firstCategories.value.find((item) => item.categoryCode === id);

const onClickFirstCategoryItemActive = (e: Event) => {
  const target = e.target as HTMLElement;
  const menuId = getMenuId(target);

  setFirstSelectedCategory(menuId);

  const scrollElement = document.querySelector('.middle-body') as HTMLElement;
  const scrollTarget = document.getElementById(selectedItem.value) as HTMLElement;

  scrollMove({
    type: theme.value.type,
    parent: scrollElement,
    child: scrollTarget,
  });

  const clickedCategory = findClickedCategory(menuId);

  const subMenu = getSubMenu(clickedCategory);
  const subCategoryId = `${menuId}-${subMenu.childCategoryCode}`;
  setSubSelectedCategory(subCategoryId);
};

// 스크롤을 감지해서 마지막 대분류가 노출되었을때 더보기 UI가 사라지도록 하는 로직
// 참고: IntersectionObserver(https://heropy.blog/2019/10/27/intersection-observer/)
const setIntersectionObserver = () => {
  // 열린 대분류가 없을 경우 미노출
  if (firstCategories.value?.length === 0) {
    moreDetailFlag.value = false;
    return;
  }

  const lastIndex = firstCategories.value?.length - 1;
  const targetElement = document.querySelector(`#categoryItem-${lastIndex}`) as HTMLElement;

  const options = {
    rootMargin: '0px',
    threshold: 0.8,
  };

  const observers = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      moreDetailFlag.value = false;
    } else {
      moreDetailFlag.value = true;
    }
  }, options);

  if (targetElement) {
    observers.disconnect();
    observers.observe(targetElement);
  }
};

const vObserver = {
  mounted() {
    setIntersectionObserver();
  },
  updated() {
    setIntersectionObserver();
  },
};
</script>

<style lang='scss' scoped>
.main-first-category {
  position: relative;
  flex: 1;
  overflow: auto;

  .main-first-category-wrap {
    height: 100%;
    overflow: auto;

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
          white-space: nowrap;
        }
      }
    }
  }

  .more-detail-box {
    position: absolute;
    bottom: 1.25vw;
    left: 50%;
    z-index: 5;
    display: flex;
    gap: 0.3125vw;
    align-items: center;
    justify-content: center;
    padding: 0.625vw 1.25vw;
    background: rgba(91, 91, 91, 0.85);
    border: 0.0781vw solid #494949;
    border-radius: .7813vw;
    box-shadow: 0 0.2344vw 0.3125vw 0 rgba(0, 0, 0, 0.30);
    transform: translateX(-50%);

    .more-detail-box-text {
      font-size: 1.5625vw;
      font-weight: 600;
      line-height: 1.875vw;
      color: #FFF;
      letter-spacing: -0.0313vw;
    }
  }
}
</style>
