<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { pushPage } from '@utils/route.helper';
import { translateLanguage } from '@utils/langTransfer';
import {
  getStorage,
  getSubPrimaryColor,
  removeNewLine,
} from '@torder/common/utils';
import { StaffCallItemType } from '@torder/common/interface/staffCall';
import { CUSTOM_STAFF_CALL_CHECK, TABLE } from '@torder/common/constant';
import useStaffCallItems from '@store/storeStaffCallItems';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import { home } from '@router/routePaths';
import useOrderConfig from '@composables/useOrderConfig';
import { HyattStaffCallSelectedItem } from '@components';
import { requestOrders } from '@apis/order';

const props = defineProps<{
  selectedItems: StaffCallItemType[];
  deleteItem: (item: StaffCallItemType, itemIndex: number) => void;
  plusCount: (index: number) => void;
  minusCount: (index: number) => void;
  resetSelectedItems: () => void;
}>();

const { t } = useI18n();

const { openAlert, openModal } = useModalStore();

const { init, isHaveStaffCallItem, buttonBackgroundColor, buttonFontColor } =
  storeToRefs(useInitStore());
const { staffCallOrderPayload } = useOrderConfig();

const { getDarkModeClass } = useInitStore();

const { noEmployeeCallServiceSelected } = useStaffCallItems();

const isFetching = ref(false);

const startFetching = () => {
  isFetching.value = true;
};

const endFetching = () => {
  isFetching.value = false;
};

const orderStaffCallOnly = () => {
  openModal(CUSTOM_STAFF_CALL_CHECK);
  noEmployeeCallServiceSelected();
  props.resetSelectedItems();
};

const countUnit = (item: StaffCallItemType) => {
  const { count = '0개' } = item;
  const countText = `${count} ${t('개')}`;

  return countText;
};

const getStoreInformation = () => {
  const { storeCode } = init.value.storeInfo;
  const isStoreCode = storeCode === undefined;
  const tableString = getStorage(TABLE);
  const isTableString = tableString === null;

  if (isTableString || isStoreCode) {
    openAlert(t('테이블을 찾을수 없습니다'));

    return {
      storeCode: undefined,
      tableNumber: null,
    };
  }

  const table = JSON.parse(tableString);
  const tableNumber = table.tabletId;
  const storeInfo = {
    storeCode,
    tableNumber,
  };

  return storeInfo;
};

const isHaveSelectedItem = computed(() => props.selectedItems.length > 0);

const orderServiceItems = async () => {
  startFetching();

  try {
    const payload = staffCallOrderPayload(props.selectedItems);
    if (!payload) return;

    await requestOrders(payload);

    pushPage(home);
    openAlert(t('선택하신 항목을 요청하였습니다.'));
    props.resetSelectedItems();
  } catch {
    openAlert(t('요청을 실패하였습니다.'));
  } finally {
    endFetching();
  }
};

const getActiveButtonColor = (color: string) =>
  getSubPrimaryColor(color, 10, 'Y');
</script>

<template>
  <div
    class="staff-item-list-container"
    :class="getDarkModeClass()"
  >
    <div class="staff-item-list-body">
      <div
        v-if="isHaveSelectedItem"
        class="staff-item-list-wrapper"
      >
        <HyattStaffCallSelectedItem
          v-for="(item, index) in selectedItems"
          :key="`item${index}`"
          :title="removeNewLine(translateLanguage(item.title, item.title.ko))"
          :countUnit="countUnit(item)"
          :plus="() => plusCount(index)"
          :minus="() => minusCount(index)"
          :deleteTarget="() => deleteItem(item, index)"
          :deleteText="t('삭제')"
          :isLast="index === selectedItems?.length - 1"
        />
      </div>
      <div
        v-else
        class="guide-text"
        :class="getDarkModeClass()"
      >
        <span v-if="!isHaveSelectedItem && !isHaveStaffCallItem">
          {{ t('요청하실 항목을 선택해 주세요.') }}
        </span>
        <span v-else>
          {{ t('직원호출만 원하실 경우 아래 호출 버튼을 눌러주세요.') }}
        </span>
      </div>
    </div>
    <div class="staff-item-list-footer">
      <div
        class="staff-close-button"
        @click="pushPage(home)"
      >
        <span id="staff-close-sub-element">
          {{ t('닫기') }}
        </span>
      </div>
      <div
        v-if="isFetching"
        class="staff-call-button"
      >
        <span id="staff-call-sub-element">
          {{ t('주문 진행 중') }}
        </span>
      </div>
      <div
        v-else-if="!isHaveSelectedItem && !isHaveStaffCallItem"
        class="staff-call-button disabled"
      >
        <span id="staff-call-sub-element">
          {{ t('호출하기') }}
        </span>
      </div>
      <div
        v-else-if="!isHaveSelectedItem"
        class="staff-call-button"
        @click="orderStaffCallOnly"
      >
        <span id="staff-call-sub-element">
          {{ t('호출하기') }}
        </span>
      </div>
      <div
        v-else
        class="staff-call-button"
        @click="orderServiceItems"
      >
        <span id="staff-call-sub-element">
          {{ t('요청하기') }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.staff-item-list-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  font-family: 'Pretendard', sans-serif;
  background-color: #f8f8f8;
  border-left: 0.0781vw solid #d5d5d5;

  &.dark-mode {
    background-color: #313131;
    border-left: 0.0781vw solid #5b5b5b;
  }

  .staff-item-list-body {
    flex: 1;
    padding: 2.3438vw 1.5625vw 0 1.5625vw;
    overflow-y: scroll;

    .guide-text {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;

      span {
        font-size: 1.875vw;
        font-weight: 400;
        line-height: 2.3438vw;
        color: #313131;
        letter-spacing: -0.0562vw;
        white-space: pre-wrap;
      }

      &.dark-mode {
        span {
          color: #7a7a7a;
        }
      }
    }
  }

  .staff-item-list-footer {
    display: flex;
    gap: 0.625vw;
    align-items: center;
    padding: 1.25vw 1.5625vw;

    .staff-close-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25vw 1.5625vw;
      background: #5b5b5b;
      border-radius: 0.7813vw;

      &.button-active {
        background-color: #494949;
      }

      span {
        font-size: 1.875vw;
        font-style: normal;
        font-weight: 700;
        line-height: 2.5vw;
        color: #fff;
        letter-spacing: -0.0375vw;
      }
    }

    .staff-call-button {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      padding: 1.25vw 1.5625vw;
      background-color: v-bind(buttonBackgroundColor);
      border-radius: 0.9375vw;

      span {
        font-size: 1.875vw;
        font-style: normal;
        font-weight: 700;
        line-height: 2.5vw;
        color: v-bind(buttonFontColor);
        letter-spacing: -0.0375vw;
      }

      &.button-active {
        background-color: v-bind(getActiveButtonColor(buttonBackgroundColor));
      }

      &.disabled {
        background-color: #7a7a7a;

        span {
          color: #afafaf;
        }
      }
    }
  }
}
</style>
