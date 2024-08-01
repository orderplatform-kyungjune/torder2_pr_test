<template>
  <div class="moving-serving-robot-container">
    <div class="moving-serving-robot-text">
      <p>
        {{ t('로봇이 테이블로 이동하고 있습니다.') }}
      </p>
      <p>
        {{ t('잠시만 기다려 주세요.') }}
      </p>
    </div>
    <div
      class="moving-serving-robot-button"
      @click="pushPage(home)"
    >
      {{ t('확인') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import {
  onBeforeMount,
  onBeforeUnmount,
} from 'vue';
import { pushPage } from '@utils/route.helper';
import { home } from '@router/routePaths';

const { t } = useI18n();

let timer: ReturnType<typeof setTimeout>;

onBeforeMount(() => {
  timer = setTimeout(() => {
    pushPage(home);
  }, 30000);
});

onBeforeUnmount(() => {
  clearTimeout(timer);
});
</script>

<style lang="scss" scoped>
.moving-serving-robot-container {
  position: absolute;
  z-index: 25;
  display: flex;
  flex-direction: column;
  gap: 3.1250vw;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: 'Pretendard', sans-serif;
  color: #fff;
  background: rgba(0, 0, 0, 0.80);

  .moving-serving-robot-text {
    font-size: 5.4688vw;
    font-weight: 700;
    line-height: 6.5266vw;
    text-align: center;
  }

  .moving-serving-robot-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50.7813vw;
    height: 9.2188vw;
    font-size: 3.7500vw;
    font-weight: 700;

    line-height: 4.2188vw;
    color: #fff;
    background-color: #e30000;
    border-radius: 1.25vw;
  }
}
</style>
