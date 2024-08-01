<template>
  <teleport
    v-if="flag.visitConfirm"
    to="#modal"
  >
    <div class="visit-confirm-check-container">
      <div class="visit-confirm-check-wrapper">
        <div class="visit-confirm-check-title">
          {{ t('방문 인원수를 초기화 하시겠습니까?') }}
        </div>
        <div class="visit-confirm-check-button">
          <div
            class="visit-confirm-check-no-button"
            @click="() => closeModal(VISIT_CONFIRM)"
          >
            {{ t('아니요') }}
          </div>
          <div
            class="visit-confirm-check-yes-button"
            @click="resetPeople"
          >
            {{ t('예') }}
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { VisitPeopleResetDataType } from '@torder/common/interface';
import {
  VISIT_CONFIRM,
  VISIT_PEOPLE,
} from '@torder/common/constant';
import useVisitPeopleStore from '@store/storeVisitPeople';
import useTableStore from '@store/storeTable';
import useOrderListStore from '@store/storeOrderList';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import { resetVisitPeople } from '@apis/visitPeople';
import { checkOrderExist } from '@apis/orderData';

const props = defineProps<{
  resetPeopleCount?: () => void,
}>();

const { t } = useI18n();

const {
  flag,
  closeModal,
  openAlert,
} = useModalStore();

const { getStoreInfo } = storeToRefs(useInitStore());

const { tableInfo } = storeToRefs(useTableStore());

const {
  setTotalVisitPeople,
  resetOccupiedTable,
} = useVisitPeopleStore();

const { setOrderList } = useOrderListStore();

const resetPeople = async () => {
  const resetData = {
    storeCode: getStoreInfo.value.storeCode,
    tabletNumber: tableInfo.value.tabletId,
  } as VisitPeopleResetDataType;

  try {
    await resetVisitPeople(resetData);
    await checkOrderExist(getStoreInfo.value.storeCode, tableInfo.value.tabletId, setOrderList);
    setTotalVisitPeople(0);
    resetOccupiedTable();
    if (props.resetPeopleCount) {
      props.resetPeopleCount();
    }
    closeModal(VISIT_CONFIRM);
    closeModal(VISIT_PEOPLE);
    openAlert(t('방문 인원수를 \n 초기화 하였습니다.'));
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang='scss' scoped>
.visit-confirm-check-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: "pretendard", sans-serif;
  background-color: rgba(0, 0, 0, 0.83);

  .visit-confirm-check-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .visit-confirm-check-title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 3.125vw;
      font-size: 4vw;
      font-weight: 400;
      color: #fff;
    }

    .visit-confirm-check-button {
      display: flex;
      gap: 2vw;
      align-items: center;
      justify-content: center;
      width: 46.875vw;
      font-weight: 900;

      .visit-confirm-check-no-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 17.1875vw;
        height: 6vw;
        font-size: 2.5vw;
        font-weight: 700;
        color: #fff;
        background-color: #5B5B5B;
        border-radius: 0.7813vw;

        &.button-active {
          background-color: #494949;
        }
      }

      .visit-confirm-check-yes-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 17.1875vw;
        height: 6vw;
        font-size: 2.5vw;
        font-weight: 700;
        color: #fff;
        background-color: #F91515;
        border-radius: 0.7813vw;

        &.button-active {
          background-color: #D60505;
        }
      }
    }
  }
}
</style>
