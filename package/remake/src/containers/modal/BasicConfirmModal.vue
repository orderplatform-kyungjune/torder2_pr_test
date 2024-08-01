<template>
  <teleport
    v-if="flag.basicConfirm"
    to="#modal"
  >
    <div class="additional-modal-container">
      <div class="additional-modal-wrap">
        <span class="custom-additional-info-text">
          {{ t('상품을/를 장바구니에 1개 더 추가하시겠습니까?', { item: confirmAlertMessage }) }}
        </span>
        <div class="additional-button-wrap">
          <div
            class="additional-button-cancel"
            @click="closeModal(BASIC_CONFIRM)"
          >
            <span class="additional-button-cancel-text">
              {{ t('취소') }}
            </span>
          </div>
          <div
            class="additional-button-confirm"
            @click="confirmAddProduct"
          >
            <span class="additional-button-confirm-text">
              {{ confirmButtonText }}
            </span>
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
  BASIC_CONFIRM,
  CART,
} from '@torder/common';
import useModalStore from '@store/storeModal';
import useCartStore from '@store/storeCart';
import { home } from '@router/routePaths';

const {
  flag,
  openModal,
  closeModal,
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

const { t } = useI18n();

const confirmAddProduct = () => {
  openAlert(`${confirmAlertMessage.value}\n${t('상품을 추가하였습니다.')}`);
  increaseCartProductQuantity(additionalProductIndex.value);
  pushUpItemIndex(additionalProductIndex.value);
  closeModal(BASIC_CONFIRM);
  openModal(CART);
  pushPage(home);
};
</script>

<style lang="scss" scoped>
.additional-modal-container {
  position: absolute;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);

  .additional-modal-wrap {
    display: flex;
    flex-direction: column;
    gap: 3.125vw;
    align-items: center;
    justify-content: center;
    font-family: pretendard, sans-serif;
    border-radius: 1.5625vw;

    .custom-additional-info-text {
      max-width: 80.3906vw;
      font-size: 5.625vw;
      font-weight: 600;
      line-height: 6.4063vw;
      color: #fff;
      text-align: center;
      text-shadow: 0 0 0.7813vw rgba(0, 0, 0, 0.20);
      letter-spacing: -0.1125vw;
      word-break: break-all;
      white-space: pre-line;
    }

    .additional-button-wrap {
      display: flex;
      gap: 1.875vw;

      .additional-button-cancel {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 15.625vw;
        padding: 1.5625vw 1.875vw;
        background-color: #5B5B5B;
        border-radius: 0.7813vw;

        .additional-button-cancel-text {
          font-size: 3.75vw;
          font-weight: 700;
          line-height: 4.2188vw;
          color: #FFF;
          text-align: center;
        }
      }

      .additional-button-confirm {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 35.1563vw;
        padding: 1.5625vw 1.875vw;
        background-color: #F91515;
        border-radius: 0.7813vw;

        .additional-button-confirm-text {
          font-size: 3.75vw;
          font-weight: 700;
          line-height: 4.2188vw;
          color: #FFF;
          text-align: center;
        }
      }
    }
  }
}
</style>
