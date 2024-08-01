<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { pushPage } from '@utils/route.helper';
import { translateLanguage } from '@utils/langTransfer';
import { StaffCallItemType } from '@torder/common/interface/staffCall';
import { STAFF_CALL_CHECK } from '@torder/common/constant';
import { getSubPrimaryColor } from '@torder/common';
import useModalStore from '@store/storeModal';
import { home } from '@router/routePaths';
import useOrderConfig from '@composables/useOrderConfig';
import { ItemCount } from '@components';
import { requestOrders } from '@apis/order';

const props = defineProps<{
  flag: boolean;
  selectedItems: StaffCallItemType[];
  startFetching: () => void;
  endFetching: () => void;
  plusCount: (index: number) => void;
  minusCount: (index: number) => void;
  deleteItem: (itemCode: string) => void;
  deleteAll: () => void;
}>();

const { t } = useI18n();
const { orderPayload } = useOrderConfig();
const { closeModal, openAlert } = useModalStore();

const setCloseModal = () => closeModal(STAFF_CALL_CHECK);

const countUnit = (item: StaffCallItemType) => {
  const { count = '0개' } = item;
  const countText = `${count} ${t('개')}`;

  return countText;
};

const emptyItems = (arr: StaffCallItemType[]) => {
  const isNotEmpty = arr.length !== 0;

  return isNotEmpty;
};

const requestService = async () => {
  const payload = orderPayload(props.selectedItems);
  if (payload) await requestOrders(payload);
};

const getService = async () => {
  props.startFetching();

  try {
    await requestService();
    openAlert(t('선택하신 항목을 요청하였습니다.'));
    props.deleteAll();
  } catch {
    openAlert(t('요청을 실패하였습니다.'));
  } finally {
    props.endFetching();
    setCloseModal();
    pushPage(home);
  }
};

const activeRemoveButtonColor = getSubPrimaryColor('#999', 10, 'Y');
const activeRequestButtonColor = getSubPrimaryColor('#2f2a26', 10, 'Y');
</script>

<template>
  <div class="staff-item-list-container">
    <div
      v-if="emptyItems(selectedItems)"
      class="staff-item-list-wrapper"
    >
      <div class="staff-item-list">
        <ItemCount
          v-for="(item, index) in selectedItems"
          :key="`item${index}`"
          :title="translateLanguage(item.title, item.title.ko)"
          :countUnit="countUnit(item)"
          :plus="() => plusCount(index)"
          :minus="() => minusCount(index)"
          :deleteTarget="() => deleteItem(item.productCode)"
          :deleteText="t('삭제')"
        />
      </div>
      <div class="staff-item-list-button">
        <div
          class="staff-item-list-remove"
          @click="deleteAll"
        >
          {{ t('전체 삭제') }}
        </div>
        <div
          v-if="!flag"
          class="staff-item-list-request"
          @click="getService"
        >
          {{ t('요청하기') }}
        </div>
        <div
          v-else
          class="staff-item-list-request"
        >
          {{ t('요청중') }}
        </div>
      </div>
    </div>
    <div
      v-else
      class="staff-item-list-empty"
    >
      {{ t('요청하실 항목을 선택해 주세요.') }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.staff-item-list-container {
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 0.78vw;
  box-shadow: 0.2344vw 0.2344vw 0.3125vw 0 rgba(0, 0, 0, 0.4);

  .staff-item-list-wrapper {
    padding: 1.9531vw;

    .staff-item-list {
      height: 41.7188vw;
      overflow: auto;
    }

    .staff-item-list-button {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-top: 1.9531vw;
      font-family: pretendard, sans-serif;
      font-size: 2.0313vw;
      font-weight: bold;
      font-weight: 500;
      color: #fff;

      .staff-item-list-remove {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 12.5vw;
        height: 4.6875vw;
        background-color: #999;
        border-radius: 0.7813vw;

        &.button-active {
          background-color: v-bind(activeRemoveButtonColor);
        }
      }

      .staff-item-list-request {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 12.5vw;
        height: 4.6875vw;
        background-color: #2f2a26;
        border-radius: 0.7813vw;

        &.button-active {
          background-color: v-bind(activeRequestButtonColor);
        }
      }
    }
  }

  .staff-item-list-empty {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 52.2656vw;
    padding: 0;
    font-family: pretendard, sans-serif;
    font-size: 2.4vw;
    line-height: 1.1;
    text-align: center;
    white-space: pre-wrap;
  }
}
</style>
