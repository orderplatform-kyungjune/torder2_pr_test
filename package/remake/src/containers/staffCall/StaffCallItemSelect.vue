<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { StaffCallCheck } from '@views';
import { pushPage } from '@utils/route.helper';
import { translateLanguage } from '@utils/langTransfer';
import { StaffCallItemType } from '@torder/common/interface/staffCall';
import { PASSIVE, STAFF_CALL_CHECK } from '@torder/common/constant';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import { home } from '@router/routePaths';
import useOrderConfig from '@composables/useOrderConfig';
import { StaffCallItem } from '@components';
import { requestOrders } from '@apis/order';

const {
  flag,
  convertedItemList,
  selectedItems,
  selectItem,
  unselectItem,
  deleteAll,
  startFetching,
  endFetching,
} = defineProps<{
  flag: boolean;
  convertedItemList: StaffCallItemType[];
  selectedItems: StaffCallItemType[];
  selectItem: (item: StaffCallItemType, listIndex: number) => void;
  unselectItem: (itemCode: string, listIndex: number) => void;
  deleteAll: () => void;
  startFetching: () => void;
  endFetching: () => void;
}>();

const { t } = useI18n();

const { openModal, closeModal, openAlert } = useModalStore();

const { isHaveStaffCallItem } = storeToRefs(useInitStore());
const { staffCallOrderPayload } = useOrderConfig();

const setOpenModal = () => {
  openModal(STAFF_CALL_CHECK);
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

const onClickItem = async (item: StaffCallItemType, listIndex: number) => {
  const itemCode = item.productCode;
  const itemActive = item.active;
  const isPassive = itemActive === PASSIVE;

  if (isPassive) {
    selectItem(item, listIndex);
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

const requestService = async () => {
  const payload = staffCallOrderPayload(selectedItems);
  if (payload) await requestOrders(payload);
};

const setCloseModal = () => closeModal(STAFF_CALL_CHECK);

const checkItemLength = () => selectedItems?.length > 0;
const isHaveSelectedItem = computed(checkItemLength);

const getService = async () => {
  startFetching();

  try {
    await requestService();
    openAlert(t('선택하신 항목을 요청하였습니다.'));
    deleteAll();
  } catch {
    openAlert(t('요청을 실패하였습니다.'));
  } finally {
    endFetching();
    setCloseModal();
    pushPage(home);
  }
};
</script>

<template>
  <StaffCallCheck />
  <div class="staff-call-list-container">
    <div class="staff-call-list-wrap">
      <div class="staff-call-list-grid">
        <div
          v-for="(item, index) in convertedItemList"
          :key="`item${index}`"
          class="staff-call-list-item"
        >
          <StaffCallItem
            :title="translateLanguage(item.title, item.title.ko)"
            :active="getItemActive(item)"
            @click="onClickItem(item, index)"
          />
        </div>
      </div>
    </div>
    <div v-if="isHaveStaffCallItem">
      <div v-if="!flag">
        <div
          v-if="isHaveSelectedItem"
          class="staff-call-list-only"
          @click="getService"
        >
          {{ t('요청하기') }}
        </div>
        <div
          v-else
          class="staff-call-list-only"
          @click="setOpenModal"
        >
          {{ t('직원만 호출하기') }}
        </div>
      </div>
      <div
        v-else
        class="staff-call-list-only"
      >
        {{ t('요청중') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.staff-call-list-container {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  .staff-call-list-wrap {
    height: 46.0938vw;
    overflow-y: scroll;

    .staff-call-list-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.6406vw 1.5625vw;
    }
  }

  .staff-call-list-only {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 4.6875vw;
    font-size: 2.0313vw;
    font-weight: 500;
    color: #fff;
    text-align: center;
    background-color: #f91515;
    border-radius: 0.78vw;

    &.button-active {
      background-color: #d60505;
    }
  }
}
</style>
