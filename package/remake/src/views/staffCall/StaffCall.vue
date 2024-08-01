<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, nextTick, Ref, ref, watchEffect } from 'vue';
import { goBackPage, pushPage } from '@utils/route.helper';
import { translateLanguage } from '@utils/langTransfer';
import { getStoreCode, getInitTableId, deepCopy } from '@torder/common/utils';
import { StaffCallItemType } from '@torder/common/interface/staffCall';
import { productType } from '@torder/common/interface/product';
import {
  PASSIVE,
  RESTAURANT_VERTICAL,
  WHITE,
  STAFF_CALL_CHECK,
  ACTIVE,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useStaffCallItems from '@store/storeStaffCallItems';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import { home } from '@router/routePaths';
import { StaffCallItemSelect, StaffCallSelectedItemList } from '@containers';
import useOrderConfig from '@composables/useOrderConfig';
import { RestaurantVerticalScreenStaffCallItemList } from '@components';
import { requestOrders } from '@apis/order';

const { staffCallOrderPayload } = useOrderConfig();
const { t } = useI18n();

const { getServiceList } = useInitStore();

const { existsSelectedStaffCallService, noEmployeeCallServiceSelected } =
  useStaffCallItems();

const isFetching = ref(false);

const startFetching = () => {
  isFetching.value = true;
};

const endFetching = () => {
  isFetching.value = false;
};

const { theme } = useThemeStore();
const isRestaurantVertical = computed(() => theme.type === RESTAURANT_VERTICAL);

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

  const convertedServiceItemList: StaffCallItemType[] =
    getServiceList?.childCategoryList?.map(convertChildCategoryList);
  const filteredStaffCallItem = convertedServiceItemList.filter(
    (item) => item.productCode !== '99999',
  );
  convertedItems.value = filteredStaffCallItem;
});

const checkSelectedStaffCallService = () => {
  if (selectedItems.value.length) {
    existsSelectedStaffCallService();
    return;
  }

  noEmployeeCallServiceSelected();
};

const findItemIndexInSelectedItems = (itemCode: string) => {
  const findSameCodeItem = (item: StaffCallItemType) =>
    item.productCode === itemCode;
  const clickedItemIndex = selectedItems.value.findIndex(findSameCodeItem);

  return clickedItemIndex;
};

const deleteItem = (itemCode: string) => {
  const clickedItemIndex = findItemIndexInSelectedItems(itemCode);
  if (clickedItemIndex === -1) return;

  selectedItems.value[clickedItemIndex].active = PASSIVE;
  selectedItems.value[clickedItemIndex].count = 1;
  selectedItems.value.splice(clickedItemIndex, 1);

  checkSelectedStaffCallService();
};

const unselectItem = (itemCode: string, listIndex: number) => {
  const clickedItemIndex = findItemIndexInSelectedItems(itemCode);
  if (clickedItemIndex === -1) return;

  selectedItems.value.splice(clickedItemIndex, 1);
  convertedItems.value[listIndex].active = PASSIVE;

  checkSelectedStaffCallService();
};

const selectItem = (item: StaffCallItemType, listIndex: number) => {
  const clickedItemIndex = findItemIndexInSelectedItems(item.productCode);

  if (clickedItemIndex !== -1) return;

  selectedItems.value.push(item);
  convertedItems.value[listIndex].active = ACTIVE;

  checkSelectedStaffCallService();
};

const plusCount = (index: number) => {
  selectedItems.value[index].count += 1;
};

const minusCount = (index: number) => {
  const isOverZero = selectedItems.value[index].count < 2;

  if (isOverZero) return;

  selectedItems.value[index].count -= 1;
};

const plusCountFromRestaurantVerticalTheme = (
  listIndex: number,
  listsArr: StaffCallItemType[],
) => {
  const clickedItem = listsArr[listIndex];

  if (clickedItem.count === 1 && clickedItem.active === PASSIVE) {
    selectItem(clickedItem, listIndex);
  }

  clickedItem.count += 1;
};

const minusCountFromRestaurantVerticalTheme = (
  listIndex: number,
  listsArr: StaffCallItemType[],
) => {
  const clickedItem = listsArr[listIndex];
  const isOverZero = clickedItem.count < 2;

  if (clickedItem.count === 1) {
    deleteItem(clickedItem.productCode);
    clickedItem.active = PASSIVE;
  }

  if (isOverZero) return;

  clickedItem.count -= 1;
};

const deleteAll = () => {
  selectedItems.value.length = 0;

  const getPassiveList = (item: StaffCallItemType) => {
    const newItem = {
      ...item,
      count: 1,
      active: PASSIVE,
    };

    return newItem;
  };

  const deepCopyLists = deepCopy(convertedItems.value);
  const newLists = deepCopyLists.map(getPassiveList);

  convertedItems.value = newLists;
};

const scrollAddedItem = () => {
  const scrollElement = document.querySelector(
    '.staff-item-list',
  ) as HTMLElement;

  if (scrollElement) {
    scrollElement.scrollTo({
      top: scrollElement.scrollHeight,
      behavior: 'smooth',
    });
  }
};

const onClickItem = async (
  listIndex: number,
  listsArr: StaffCallItemType[],
) => {
  const clickedItem = listsArr[listIndex];
  const itemCode = clickedItem.productCode;
  const isPassive = clickedItem.active === PASSIVE;

  if (isPassive) {
    selectItem(clickedItem, listIndex);
  } else {
    unselectItem(itemCode, listIndex);
  }

  await nextTick();
  scrollAddedItem();
};

const getItemActive = (item: StaffCallItemType) => {
  const { active = PASSIVE } = item;
  return active;
};

const isHaveItems = computed(() => selectedItems.value.length > 0);

const { openModal, openAlert } = useModalStore();

const requestService = async () => {
  const payload = staffCallOrderPayload(selectedItems.value);
  if (payload) await requestOrders(payload);
};

const getService = async () => {
  if (!isHaveItems.value) {
    openAlert('한개 이상 선택해주세요');
    return;
  }

  startFetching();

  try {
    await requestService();
    openAlert(t('선택하신 항목을 요청하였습니다.'));
  } catch {
    openAlert(t('요청을 실패하였습니다.'));
  } finally {
    endFetching();
    deleteAll();
    pushPage(home);
  }
};
</script>

<template>
  <div
    v-if="!isRestaurantVertical"
    class="staff-container"
  >
    <div class="staff-header">
      <div class="staff-header-title">
        <div class="staff-header-staff">{{ t('직원 호출') }}&nbsp;-&nbsp;</div>
        <div class="staff-header-what">
          {{ t('무엇을 도와드릴까요?') }}
        </div>
      </div>
      <div
        class="staff-header-close"
        @click="goBackPage"
      >
        <div>
          <img
            src="https://static.torder.co.kr/torder2/btn_close_white_25.2px.svg"
            alt="닫기 버튼 이미지"
          />
        </div>
        <div>
          {{ t('닫기') }}
        </div>
      </div>
    </div>
    <div class="staff-contents-layout">
      <div class="staff-contents-grid">
        <StaffCallItemSelect
          :flag="isFetching"
          :convertedItemList="convertedItems"
          :selectedItems="selectedItems"
          :selectItem="selectItem"
          :unselectItem="unselectItem"
          :deleteAll="deleteAll"
          :startFetching="startFetching"
          :endFetching="endFetching"
        />
      </div>
      <div class="staff-contents-list">
        <StaffCallSelectedItemList
          :flag="isFetching"
          :selectedItems="selectedItems"
          :startFetching="startFetching"
          :endFetching="endFetching"
          :plusCount="plusCount"
          :minusCount="minusCount"
          :deleteItem="deleteItem"
          :deleteAll="deleteAll"
        />
      </div>
    </div>
  </div>
  <div
    v-else
    class="staff-container"
    :class="[theme.color, theme.type]"
  >
    <div class="staff-vertical-top">
      <img
        v-if="theme.color === WHITE"
        src="https://static.torder.co.kr/torder2/svg_left_arrow_black.svg"
        alt="left-arrow"
        @click="goBackPage"
      />
      <img
        v-else
        src="https://static.torder.co.kr/torder2/svg_left_arrow_white.svg"
        alt="left-arrow"
        @click="goBackPage"
      />
      <span :class="theme.color">{{ t('직원 호출') }}</span>
    </div>
    <div class="staff-vertical-middle">
      <RestaurantVerticalScreenStaffCallItemList
        v-for="(list, index) in convertedItems"
        :key="`item${index}`"
        :count="list.count"
        :plusCount="
          () => plusCountFromRestaurantVerticalTheme(index, convertedItems)
        "
        :minusCount="
          () => minusCountFromRestaurantVerticalTheme(index, convertedItems)
        "
        :checked="getItemActive(list)"
        :t="t"
        :theme="theme.color"
        :itemName="translateLanguage(list.title, list.title.ko)"
        @click="onClickItem(index, convertedItems)"
      />
    </div>
    <div
      class="staff-vertical-bottom"
      :class="{ active: isHaveItems }"
    >
      <button
        v-if="!isHaveItems"
        @click="openModal(STAFF_CALL_CHECK)"
      >
        {{ t('직원만 호출하기') }}
      </button>
      <button
        v-if="!isFetching"
        :class="{ active: isHaveItems }"
        @click="getService()"
      >
        {{ t('요청하기') }}
      </button>
      <button
        v-else
        :class="{ active: isHaveItems }"
      >
        {{ t('요청중') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.staff-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #231f1d;

  &.restaurant-vertical {
    &.white {
      background-color: #fff;
      background-image: none;
    }

    &.black {
      background-color: #222222;
      background-image: none;
    }

    .staff-vertical-top {
      position: relative;
      padding: 1.9531vw 0;
      text-align: center;
      border-bottom: 0.0781vw solid #ddd;

      img {
        position: absolute;
        top: 50%;
        left: 5%;
        transform: translate(-50%, -50%);
      }

      span {
        font-family: 'Noto Sans SC', sans-serif;
        font-size: 2.6563vw;
        font-weight: bold;
        color: #000;

        &.black {
          color: #fff;
        }
      }
    }

    .staff-vertical-middle {
      flex-grow: 1;
      padding: 0 5vw;
      margin: 5vw 0;
      overflow: auto;
    }

    .staff-vertical-bottom {
      display: grid;
      grid-template-columns: 1fr 1fr;

      &.active {
        grid-template-columns: 1fr;
      }

      button {
        height: 13.75vw;
        font-family: 'Pretendard', sans-serif;
        font-size: 2.6563vw;
        font-weight: bold;
        color: #fff;
        border: none;

        &:first-child {
          background-color: #2f2a26;
        }

        &:last-child {
          background-color: #999999;

          &.active {
            background-color: #ab240f;
          }
        }
      }
    }
  }

  .staff-header {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 5.8594vw;
    padding: 2.3438vw 1.9531vw 0 1.9531vw;
    font-family: 'Noto Sans SC', sans-serif;
    color: #fff;

    .staff-header-title {
      display: flex;
      align-items: center;

      .staff-header-staff {
        font-family: 'Noto Sans SC', sans-serif;
        font-size: 2.5vw;
        font-weight: 500;
      }

      .staff-header-what {
        font-family: 'Noto Sans SC', sans-serif;
        font-size: 2.5vw;
        font-weight: 300;
      }
    }

    .staff-header-close {
      display: flex;
      gap: 0.7813vw;
      align-items: center;
      height: 3.5156vw;
      font-family: 'Noto Sans SC', sans-serif;
      font-size: 2.3438vw;
      font-weight: 400;
      color: #fff;
    }
  }

  .staff-contents-layout {
    display: flex;
    flex: 1;
    gap: 2.7344vw;
    padding: 2.4219vw 1.9531vw 1.9531vw 3.125vw;

    .staff-contents-grid {
      flex: 1;
    }

    .staff-contents-list {
      width: 29.6875vw;
    }
  }
}
</style>
