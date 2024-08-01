<template>
  <teleport to="#modal">
    <div class="payment-refund-alarm-modal-container">
      <div class="payment-refund-alarm-modal">
        <p class="payment-refund-alarm-title">
          주문 오류
        </p>
        <div class="wrap-payment-refund-alarm-message">
          <p class="payment-refund-alarm-modal-message">
            주문 진행 중 오류가 발생했습니다.
          </p>
          <p class="payment-refund-alarm-modal-message">
            결제 취소 후 재주문해주시길 바랍니다.
          </p>
          <p class="payment-refund-alarm-modal-message">
            결제 취소를 위해 "다음"을 눌러주세요.
          </p>
        </div>
        <div class="wrap-payment-refund-alarm-notice">
          <p class="payment-refund-alarm-notice">
            <span class="billiard">&#8251;</span>
            <span class="underline">다음 화면은 정상적인 결제 취소 과정</span>
            <span>입니다.</span>
          </p>
          <div class="payment-refund-alarm-notice">
            재결제 되지 않으니 안심하세요!
          </div>
        </div>
        <div class="payment-confirm">
          <button
            class="confirm-button"
            @click="clickRefundNext()"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import usePaymentStore from '@store/storePayment';
import useModalStore from '@store/storeModal';
import postCreditWebLogs from '@composables/creditLog';

const { closePaymentRefundAlarmModal } = useModalStore();
const { currentPaymentOrderKey } = storeToRefs(usePaymentStore());

const callAndroidCancelErrorPayment = () => {
  if (window.UUID) {
    window.UUID.cancelErrorPayment(currentPaymentOrderKey.value);
  } else {
    console.log('callAndroidCancelErrorPayment 안드로이드 결제취소 요청 호출');
  }
};

const clickRefundNext = async () => {
  closePaymentRefundAlarmModal();
  callAndroidCancelErrorPayment();
  await postCreditWebLogs('SEND_ORDER_KEY_TO_ANDROID');
};
</script>

<style lang="scss" scoped>
.payment-refund-alarm-modal-container {
  position: absolute;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);

  .payment-refund-alarm-modal {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 80.46875vw;
    height: 47.5vw;
    padding: 2.34375vw;
    background-color: #303136;
    border-radius: 2.34375vw;
    border-radius: 0.78125vw;
    box-shadow: 0.234375vw 0.234375vw 0.46875vw 0 #000;

    .payment-refund-alarm-title {
      padding: 0;
      margin: 2.96875vw 0 0 0;
      font-size: 6.25vw;
      font-weight: bold;
      color: #fff;
      text-align: center;
      letter-spacing: -0.3125vw;
    }

    .wrap-payment-refund-alarm-message {
      display: flex;
      flex-direction: column;

      .payment-refund-alarm-modal-message {
        padding: 0;
        margin: 0;
        font-size: 2.578125vw;
        font-weight: lighter;
        line-height: 1.55;
        color: #fff;
        text-align: center;
        letter-spacing: -0.12890625vw;
      }

      .bold {
        font-weight: bold;
      }
    }

    .wrap-payment-refund-alarm-notice {
      display: flex;
      flex-direction: column;
      align-items: center;

      .billiard {
        margin-right: 0.390625vw;
      }

      .payment-refund-alarm-notice {
        margin: 0;
        font-size: 1.875vw;
        line-height: 1.58;
        color: #9f9f9f;
        letter-spacing: -0.09375vw;
      }

      .underline {
        color: #fff;
        text-decoration: underline;
      }
    }

    .payment-confirm {
      display: flex;
      align-items: center;
      justify-content: center;

      .confirm-button {
        width: 37.5vw;
        height: 7.8125vw;
        font-size: 1.5625vw;
        font-size: 3.125vw;
        font-weight: bold;
        color: #fff;
        letter-spacing: -0.078125vw;
        background-color: #fd251b;
        border: none;
        border-radius: 0.78125vw;
      }
    }
  }
}
</style>
