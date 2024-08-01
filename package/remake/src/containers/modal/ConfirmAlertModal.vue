<template>
  <teleport to="#modal">
    <div class="confirm-alert-modal-container">
      <div class="alert-modal-wrap">
        <div class="modal-inner-message">
          {{ confirmAlertMessage }}
        </div>
        <div
          class="confirm-button"
          @click="closeConfirmAlert()"
        >
          {{ t('확인') }}
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import useModalStore from '@store/storeModal';

const { t } = useI18n();

const { closeConfirmAlert } = useModalStore();
const { confirmAlertMessage } = storeToRefs(useModalStore());
</script>

<style lang="scss" scoped>
.confirm-alert-modal-container {
  position: absolute;
  z-index: 50;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);

  .alert-modal-wrap {
    position: absolute;
    top: 25%;
    left: 25%;
    box-sizing: border-box;
    width: 46.8750vw;
    height: 35.1563vw;
    padding: 1.5625vw;
    background-color: #fff;
    border-radius: .6250vw;

    .modal-inner-message {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 43.7500vw;
      height: 25.7813vw;
      font-size: 1.9531vw;
      color: #000;
      text-align: center;
      word-break: break-all;
      white-space: pre-wrap;
    }

    .confirm-button {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      height: 6.2500vw;
      font-size: 2.3438vw;
      font-weight: bold;
      color: #fff;
      background-color: #fc0000;
      border-radius: 0.3906vw;
    }
  }
}
</style>
