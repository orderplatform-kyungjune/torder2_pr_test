<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { pushPage } from '@utils/route.helper';
import { getStaffCallMessage } from '@utils/businessTypeText';
import {
  getStoreCode,
  getInitTableId,
  getSubPrimaryColor,
} from '@torder/common/utils';
import { CUSTOM_STAFF_CALL_CHECK } from '@torder/common/constant';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import { home } from '@router/routePaths';
import { requestOrders } from '@apis/order';

const { t } = useI18n();

const { flag, closeModal, openAlert } = useModalStore();

const { categoryBackgroundColor, getStoreInfo } = storeToRefs(useInitStore());
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
      closeModal(CUSTOM_STAFF_CALL_CHECK);
      isFetching.value = false;
      pushPage(home);

      openAlert(alertMessage);
    } else {
      openAlert(
        t('현재 직원 호출이 불가능 합니다. 직원에게 직접 문의 부탁드립니다.'),
      );
    }
  } catch {
    openAlert(
      t('현재 직원 호출이 불가능 합니다. 직원에게 직접 문의 부탁드립니다.'),
    );
  } finally {
    isFetching.value = false;
  }
};

const activeCancelButtonColor = getSubPrimaryColor('#5B5B5B', 5, 'Y');
const activeConfirmButtonColor = getSubPrimaryColor(
  categoryBackgroundColor.value,
  5,
  'Y',
);
</script>

<template>
  <teleport
    v-if="flag.customStaffCallCheck"
    to="#modal"
  >
    <div class="staff-call-confirm-modal-container">
      <div class="staff-call-confirm-modal-wrap">
        <div class="staff-call-confirm-header">
          <img
            class="staff-call-confirm-header-close-button"
            src="https://static.torder.co.kr/torder2/btn_small_black_close.svg"
            alt="직원호출 이미지"
            @click="closeModal(CUSTOM_STAFF_CALL_CHECK)"
          />
        </div>
        <div class="staff-call-confirm-body">
          <span class="staff-call-confirm-body-text">
            {{ t('직원을 호출할까요?') }}
          </span>
        </div>
        <div class="staff-call-confirm-footer">
          <div
            class="staff-call-confirm-footer-cancel"
            @click="closeModal(CUSTOM_STAFF_CALL_CHECK)"
          >
            <div class="staff-call-confirm-footer-cancel-button">
              {{ t('취소') }}
            </div>
          </div>
          <div
            class="staff-call-confirm-footer-confirm"
            @click="orderOnlyStaff"
          >
            <div class="staff-call-confirm-footer-confirm-button">
              {{ isFetching ? t('요청중') : t('호출하기') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.staff-call-confirm-modal-container {
  position: absolute;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);

  .staff-call-confirm-modal-wrap {
    display: flex;
    flex-direction: column;
    width: 64.6875vw;
    font-family: pretendard, sans-serif;
    background-color: #fff;
    border-radius: 1.5625vw;

    .staff-call-confirm-header {
      display: flex;
      align-items: flex-start;
      align-self: stretch;
      justify-content: flex-end;
      padding: 1.5625vw;

      .staff-call-confirm-header-close-button {
        width: 3.125vw;
        height: 3.125vw;

        &.button-active {
          background-color: #ebebeb;
          border-radius: 0.625vw;
        }
      }
    }

    .staff-call-confirm-body {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5625vw 1.5625vw 3.125vw 1.5625vw;

      .staff-call-confirm-body-text {
        font-size: 3.75vw;
        font-weight: 600;
        line-height: 4.2188vw;
        color: #313131;
        text-align: center;
        letter-spacing: -0.075vw;
        white-space: pre-line;
      }
    }

    .staff-call-confirm-footer {
      display: flex;

      .staff-call-confirm-footer-cancel {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50%;
        padding: 1.25vw 0.625vw 1.25vw 1.5625vw;

        .staff-call-confirm-footer-cancel-button {
          width: 100%;
          padding: 2.5vw 3.125vw;
          font-size: 3.75vw;
          font-weight: 700;
          line-height: 4.2188vw;
          color: #fff;
          text-align: center;
          background-color: #5b5b5b;
          border-radius: 1.25vw;

          &.button-active {
            background-color: v-bind(activeCancelButtonColor);
          }
        }
      }

      .staff-call-confirm-footer-confirm {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50%;
        padding: 1.25vw 1.5625vw 1.25vw 0.625vw;

        .staff-call-confirm-footer-confirm-button {
          width: 100%;
          padding: 2.5vw 3.125vw;
          font-size: 3.75vw;
          font-weight: 700;
          line-height: 4.2188vw;
          color: #fff;
          text-align: center;
          background-color: v-bind(categoryBackgroundColor);
          border-radius: 1.25vw;

          &.button-active {
            background-color: v-bind(activeConfirmButtonColor);
          }
        }
      }
    }
  }
}
</style>
