<template>
  <div class="staff-container">
    <div
      class="staff-left-side-container"
      :class="getDarkModeClass()"
    >
      <div class="staff-header">
        <div
          class="staff-header-staff"
          :class="getDarkModeClass()"
        >
          {{ t('직원호출 메뉴') }}
        </div>
        <span class="guide-text">
          {{ t('항목을 선택해주세요.') }}
        </span>
      </div>
      <div class="staff-call-items-layout">
        <HyattStaffCallItem
          v-for="(item, itemIndex) in convertedItems"
          :key="getItemKey(item, itemIndex)"
          :itemIndex="itemIndex"
          :title="newLineHelper(translateLanguage(item.title, item.title.ko))"
          :active="getItemActive(item)"
          @click="onClickItem(itemIndex)"
        />
      </div>
    </div>
    <div class="staff-right-side-container">
      <HyattStaffCallSelectedItemList
        :selectedItems="selectedItems"
        :deleteItem="deleteItem"
        :plusCount="plusCount"
        :minusCount="minusCount"
        :resetSelectedItems="resetSelectedItems"
      />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import {
  nextTick,
  Ref,
  ref,
  watchEffect,
} from 'vue';
import { storeToRefs } from 'pinia';
import { translateLanguage } from '@utils/langTransfer';
import { newLineHelper } from '@torder/common/utils';
import { StaffCallItemType } from '@torder/common/interface/staffCall';
import { productType } from '@torder/common/interface/product';
import {
  PASSIVE,
  ACTIVE,
} from '@torder/common/constant';
import useStaffCallItems from '@store/storeStaffCallItems';
import useInitStore from '@store/storeInit';
import { HyattStaffCallSelectedItemList } from '@containers';
import { HyattStaffCallItem } from '@components';

const { t } = useI18n();

const {
  existsSelectedStaffCallService,
  noEmployeeCallServiceSelected,
} = useStaffCallItems();

const {
  getDarkModeClass,
  getServiceList,
} = useInitStore();
const { categoryBackgroundColor } = storeToRefs(useInitStore());

/** 아이템 리스트 */
const convertedItems: Ref<StaffCallItemType[]> = ref([]);

/** 선택된 아이템 리스트 */
const selectedItems: Ref<StaffCallItemType[]> = ref([]);

watchEffect(() => {
  const convertChildCategoryList = (childCategory: productType) => {
    const convertedChildCategory = {
      title: childCategory.productLanguageShort,
      active: PASSIVE,
      count: 1,
      productCode: childCategory.productCode,
    } as StaffCallItemType;

    return convertedChildCategory;
  };

  const convertedServiceItemList: StaffCallItemType[] = getServiceList?.childCategoryList?.map(convertChildCategoryList);
  const filteredStaffCallItem = convertedServiceItemList?.filter((item) => item.productCode !== '99999');
  convertedItems.value = filteredStaffCallItem;
});

const resetSelectedItems = () => {
  selectedItems.value = [];
};

/** 아이템을 선택했을 경우와 직원만 호출을 선택했을 경우를 스토어에서 분별해 조건에 맞는 모달을 보여주기 위한 함수 */
const checkSelectedStaffCallService = () => {
  // 선택한 아이템이 있을 경우 티오더로 선택하신 항목을 호출하였습니다 모달 오픈
  if (selectedItems.value.length) {
    existsSelectedStaffCallService();
    return;
  }

  // 아닐 경우 티오더로 직원을 호출했습니다 모달 오픈
  noEmployeeCallServiceSelected();
};

const findIndexSameItemInSelectedItems = (itemCode: string, title: string) => {
  const findSameItem = (item: StaffCallItemType) => item.productCode === itemCode && item.title.ko === title;
  const clickedItemIndex = selectedItems.value.findIndex(findSameItem);

  return clickedItemIndex;
};

const unselectItem = (item: StaffCallItemType, itemIndex: number) => {
  convertedItems.value[itemIndex].active = PASSIVE;

  const clickedItemIndex = findIndexSameItemInSelectedItems(item.productCode, item.title.ko);

  if (clickedItemIndex === -1) return;

  selectedItems.value = selectedItems.value.filter((selectedItem) => selectedItem.productCode !== item.productCode && selectedItem.title.ko !== item.title.ko);
  checkSelectedStaffCallService();
};

const selectItem = (item: StaffCallItemType, itemIndex: number) => {
  convertedItems.value[itemIndex].active = ACTIVE;

  const clickedItemIndex = findIndexSameItemInSelectedItems(item.productCode, item.title.ko);

  if (clickedItemIndex !== -1) return;

  selectedItems.value.push(item);
  checkSelectedStaffCallService();
};

const deleteItem = (item: StaffCallItemType, itemIndex: number) => {
  selectedItems.value[itemIndex].active = PASSIVE;
  selectedItems.value[itemIndex].count = 1;

  const clickedItemIndex = findIndexSameItemInSelectedItems(item.productCode, item.title.ko);

  if (clickedItemIndex === -1) return;

  selectedItems.value = selectedItems.value.filter((selectedItem) => selectedItem.productCode !== item.productCode && selectedItem.title.ko !== item.title.ko);
  checkSelectedStaffCallService();
};

const plusCount = (index: number) => {
  selectedItems.value[index].count += 1;
};

const minusCount = (index: number) => {
  const isCountToOne = selectedItems.value[index].count < 2;

  if (isCountToOne) {
    selectedItems.value[index].active = PASSIVE;
    selectedItems.value = selectedItems.value.filter(
      (selectedItem) => selectedItem.productCode !== selectedItems.value[index].productCode && selectedItem.title.ko !== selectedItems.value[index].title.ko,
    );
    return;
  }

  selectedItems.value[index].count -= 1;
};

const scrollAddedItem = () => {
  const scrollElement = document.querySelector('.staff-item-list-body') as HTMLElement;

  if (scrollElement) {
    scrollElement.scrollTo({
      top: scrollElement.scrollHeight,
      behavior: 'smooth',
    });
  }
};

const onClickItem = async (itemIndex: number) => {
  const clickedItem = convertedItems.value[itemIndex];
  const isPassive = clickedItem.active === PASSIVE;

  if (isPassive) {
    selectItem(clickedItem, itemIndex);
  } else {
    unselectItem(clickedItem, itemIndex);
  }

  await nextTick();
  scrollAddedItem();
};

const getItemActive = (item: StaffCallItemType) => {
  const { active = PASSIVE } = item;

  return active;
};

const getItemKey = (item: StaffCallItemType, index: number) => (item.productCode ? `${item.productCode}-${index}` : `item-${index}`);
</script>

<style lang='scss' scoped>
.staff-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  display: flex;
  width: 100%;
  height: 100%;
  font-family: 'Pretendard', sans-serif;

  .staff-left-side-container {
    display: flex;
    flex-direction: column;
    gap: 1.875vw;
    width: 67.8125vw;
    padding: 2.3438vw 1.5625vw;
    background-color: #fff;

    &.dark-mode {
      background-color: #181818;
    }

    .staff-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .staff-header-staff {
        font-size: 2.5vw;
        font-weight: 700;
        line-height: 3.125vw;
        color: #313131;
        letter-spacing: -0.05vw;

        &.dark-mode {
          color: #fff;
        }
      }

      .guide-text {
        font-size: 1.5625vw;
        font-weight: 500;
        line-height: 1.875vw;
        color: v-bind(categoryBackgroundColor);
        letter-spacing: -0.0469vw
      }
    }

    .staff-call-items-layout {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25vw;
      overflow-y: scroll;
    }
  }

  .staff-right-side-container {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  }
}
</style>
