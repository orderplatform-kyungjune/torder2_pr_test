<template>
  <div id="error-page">
    <img src="https://static.torder.co.kr/torder2/icn_loading_error.svg">
    <p class="error-info-text">
      {{ getErrorText() }}
    </p>
    <p class="error-info-text">
      {{ getInfoText() }}
    </p>
    <button
      class="button"
      @click="refreshPage"
    >
      {{ getButtonText() }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { refreshPage } from '@utils/globalUtils';
import { IS_ORIGIN } from '@common/mode';

const getErrorText = () => {
  if (IS_ORIGIN) return '정보를 불러오는데 실패했습니다.';

  return 'Failed to load information.';
};

const getInfoText = () => {
  if (IS_ORIGIN) return '아래 버튼을 눌러 다시 시도해주세요.';

  return 'Please click the button below to try again.';
};

const getButtonText = () => {
  if (IS_ORIGIN) return '다시 시도하기';

  return 'Try again';
};

</script>

<style lang="scss" scoped>
#error-page{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999999999999;
  display: flex;
  flex-direction: column;
  gap: 2vw;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 1);
}

.error-info-text {
  font-size: 3.75vw;
  font-style: normal;
  font-weight: 700;
  line-height: 4.2188vw;
  color: #fff;
}

.button {
  padding: 2.5vw 3.125vw;
  font-size: 3.75vw;
  font-weight: 700;
  line-height: 4.2188vw;
  color: #5B5B5B;
  background-color: #FFF;
  border: 0.1563vw solid #5B5B5B;
  border-radius: 1.25vw;
}
   </style>
