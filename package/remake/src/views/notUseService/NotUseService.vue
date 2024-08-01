<template>
  <teleport to="#modal">
    <div class="not-use-call-check-container">
      <div class="not-use-call-check-wrapper">
        <div class="not-use-call-check-title">
          <div>
            {{ t('서비스 점검중 입니다.') }}
          </div>
          <div>
            {{ t('직원에게 문의해주세요!') }}
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style lang='scss' scoped>
.not-use-call-check-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 24;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: "Noto Sans SC", sans-serif;
  background-color: rgba(0, 0, 0, 0.9);

  .not-use-call-check-wrapper {
    display: flex;
    flex-direction: column;

    .not-use-call-check-title {
      display: flex;
      flex-direction: column;
      gap: 1.5625vw;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5469vw;
      font-size: 5.2vw;
      font-weight: 900;
      color: #fff;
    }
  }
}
</style>
