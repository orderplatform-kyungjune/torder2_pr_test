<template>
  <teleport
    v-if="flag.customConfirm"
    to="#modal"
  >
    <div class="custom-confirm-modal-container">
      <div class="custom-confirm-modal-wrap">
        <div class="custom-confirm-header">
          <img
            class="custom-confirm-header-close-button"
            src="https://static.torder.co.kr/torder2/btn_small_black_close.svg"
            @click="closeModal(CUSTOM_CONFIRM)"
          >
        </div>
        <div class="custom-confirm-body">
          <span class="custom-confirm-body-text">
            {{ t('상품을/를 장바구니에 1개 더 추가하시겠습니까?', { item: confirmAlertMessage }) }}
          </span>
        </div>
        <div class="custom-confirm-footer">
          <div
            class="custom-confirm-footer-cancel"
            @click="closeModal(CUSTOM_CONFIRM)"
          >
            <div class="custom-confirm-footer-cancel-text">
              {{ t('취소') }}
            </div>
          </div>
          <div
            class="custom-confirm-footer-confirm"
            @click="confirmAddProduct"
          >
            <div class="custom-confirm-footer-confirm-text">
              {{ confirmButtonText }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { pushPage } from '@utils/route.helper';
import {
  CART,
  CUSTOM_CONFIRM,
  getSubPrimaryColor,
} from '@torder/common';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import { home } from '@router/routePaths';

const { t } = useI18n();

const {
  flag,
  closeModal,
  openModal,
  openAlert,
} = useModalStore();
const {
  confirmAlertMessage,
  confirmButtonText,
  additionalProductIndex,
} = storeToRefs(useModalStore());

const {
  increaseCartProductQuantity,
  pushUpItemIndex,
} = useCartStore();

const {
  buttonBackgroundColor,
  buttonFontColor,
} = storeToRefs(useInitStore());

const confirmAddProduct = () => {
  openAlert(`${confirmAlertMessage.value}\n${t('상품을 추가하였습니다.')}`);
  increaseCartProductQuantity(additionalProductIndex.value);
  pushUpItemIndex(additionalProductIndex.value);
  closeModal(CUSTOM_CONFIRM);
  openModal(CART);
  pushPage(home);
};

const getActiveButtonColor = () => getSubPrimaryColor(buttonBackgroundColor.value, 10, 'Y');
</script>

<style lang="scss" scoped>
.custom-confirm-modal-container {
  position: absolute;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);

  .custom-confirm-modal-wrap {
    display: flex;
    flex-direction: column;
    width: 64.6875vw;
    font-family: pretendard, sans-serif;
    background-color: #fff;
    border-radius: 1.5625vw;

    .custom-confirm-header {
      display: flex;
      align-items: flex-start;
      align-self: stretch;
      justify-content: flex-end;
      padding: 1.5625vw;

      .custom-confirm-header-close-button {
        width: 3.125vw;
        height: 3.125vw;

        &.button-active {
          background-color: #EBEBEB;
          border-radius: 0.625vw;
        }
      }
    }

    .custom-confirm-body {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5625vw 1.5625vw 3.125vw 1.5625vw;

      .custom-confirm-body-text {
        font-size: 3.75vw;
        font-weight: 600;
        line-height: 4.2188vw;
        color: #313131;
        text-align: center;
        letter-spacing: -0.075vw;
        word-break: break-all;
        white-space: pre-line;
      }
    }

    .custom-confirm-footer {
      display: flex;

      .custom-confirm-footer-cancel {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50%;
        padding: 1.25vw 0.625vw 1.25vw 1.5625vw;

        .custom-confirm-footer-cancel-text {
          width: 100%;
          padding: 2.5vw 3.125vw;
          font-size: 3.75vw;
          font-weight: 700;
          line-height: 4.2188vw;
          color: #FFF;
          text-align: center;
          background-color: #5B5B5B;
          border-radius: 1.25vw;

          &.button-active {
            background-color: #494949;
          }
        }
      }

      .custom-confirm-footer-confirm {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50%;
        padding: 1.25vw 1.5625vw 1.25vw 0.625vw;

        .custom-confirm-footer-confirm-text {
          width: 100%;
          padding: 2.5vw 3.125vw;
          font-size: 3.75vw;
          font-weight: 700;
          line-height: 4.2188vw;
          color: v-bind(buttonFontColor);
          text-align: center;
          background-color: v-bind(buttonBackgroundColor);
          border-radius: 1.25vw;

          &.button-active {
            background-color: v-bind(getActiveButtonColor());
          }
        }
      }
    }
  }
}
</style>
