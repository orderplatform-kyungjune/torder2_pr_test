<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { pushPage } from '@utils/route.helper';
import { getStaffCallMessage } from '@utils/businessTypeText';
import { getStoreCode, getInitTableId } from '@torder/common/utils';
import { STAFF_CALL_CHECK } from '@torder/common/constant';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import { home } from '@router/routePaths';
import { requestOrders } from '@apis/order';

const { t } = useI18n();

const { flag, closeModal, openAlert } = useModalStore();

const { getStoreInfo } = storeToRefs(useInitStore());
const alertMessage = getStaffCallMessage(getStoreInfo.value.businessType);
const isFetching = ref(false);

const orderOnlyStaff = async () => {
  // 중복 요청 방지
  if (isFetching.value) {
    return;
  }

  isFetching.value = true;

  try {
    const payload = {
      store_code: getStoreCode(),
      tablet_id: getInitTableId(),
      orders: [
        {
          goods_id: '99999',
          goods_qty: 1,
          options: [],
        },
      ],
    };

    const res = await requestOrders(payload);

    if (res.data.result) {
      closeModal(STAFF_CALL_CHECK);
      isFetching.value = false;
      pushPage(home);

      openAlert(alertMessage);
    } else {
      openAlert(t('요청을 실패하였습니다.'));
    }
  } catch {
    openAlert(t('요청을 실패하였습니다.'));
  } finally {
    isFetching.value = false;
  }
};
</script>

<template>
  <teleport
    v-if="flag.staffCallCheck"
    to="#modal"
  >
    <div class="staff-call-check-container">
      <div class="staff-call-check-wrapper">
        <div class="staff-call-check-title">
          {{ t('직원을 호출 하겠습니까?') }}
        </div>
        <div class="staff-call-check-button">
          <div
            class="staff-call-check-no"
            @click="closeModal(STAFF_CALL_CHECK)"
          >
            {{ t('취소') }}
          </div>
          <div
            class="staff-call-check-yes"
            @click="orderOnlyStaff"
          >
            {{ isFetching ? t('요청중') : t('호출하기') }}
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.staff-call-check-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.83);

  .staff-call-check-wrapper {
    display: flex;
    flex-direction: column;
    gap: 3.125vw;
    align-items: center;
    justify-content: center;

    .staff-call-check-title {
      font-size: 5.625vw;
      font-weight: 700;
      line-height: 6.4063vw;
      color: #fff;
      text-align: center;
      text-shadow: 0 0 0.7813vw rgba(0, 0, 0, 0.2);
      letter-spacing: -0.1125vw;
    }

    .staff-call-check-button {
      display: flex;
      gap: 1.875vw;
      align-items: center;
      justify-content: center;

      .staff-call-check-no {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 15.625vw;
        padding: 1.5625vw 1.875vw;
        font-size: 3.2813vw;
        font-weight: 700;
        line-height: 4.375vw;
        color: #fff;
        letter-spacing: -0.0656vw;
        background-color: #5b5b5b;
        border-radius: 0.7813vw;

        &.button-active {
          background-color: #494949;
        }
      }

      .staff-call-check-yes {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 35.1563vw;
        padding: 1.5625vw 1.875vw;
        font-size: 3.2813vw;
        font-weight: 700;
        line-height: 4.375vw;
        color: #fff;
        letter-spacing: -0.0656vw;
        background-color: #f91515;
        border-radius: 0.7813vw;

        &.button-active {
          background-color: #d60505;
        }
      }
    }
  }
}
</style>
