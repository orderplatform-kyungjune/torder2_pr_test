<template>
  <teleport to="#modal">
    <div class="termination-of-contract-modal-container">
      <div class="termination-of-contract-content-wrap">
        <span>
          {{ t('라이센스가 만료되어') }}
        </span>
        <span>
          {{ t('서비스가 중지되었습니다.') }}
        </span>
        <!-- 국내만 고객센터 전화번호 제공, 해외는 문구 다름 -->
        <div
          v-if="IS_ORIGIN"
          class="ling-change-text"
        >
          {{ getContactMessage(getStoreInfo.businessType) }}
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { getContactMessage } from '@utils/businessTypeText';
import useInitStore from '@store/storeInit';
import { IS_ORIGIN } from '@common/mode';

const { t } = useI18n();
const { getStoreInfo } = storeToRefs(useInitStore());

</script>

<style lang="scss" scoped>
.termination-of-contract-modal-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 24;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: 'Pretendard', sans-serif;
  white-space: pre-line;
  background-color: rgba(0, 0, 0, 0.9);

  .termination-of-contract-content-wrap {
    display: flex;
    flex-direction: column;
    gap: 2.3438vw;
    align-items: center;
    justify-content: center;
    font-size: 5vw;
    font-weight: 800;
    color: #fff;

    .ling-change-text {
      line-height: 1.5;
      text-align: center;
      white-space: pre-line;
    }
  }

}

</style>
