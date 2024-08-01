<template>
  <div
    v-if="remainingTime > 0"
    class="timer-message-container"
  >
    <span
      v-if="timeInfo.hours !== '00'"
      class="timer-message-time"
    >
      {{ timeInfo.hours }}{{ t('시간') }}&nbsp;
    </span>
    <span
      v-if="timeInfo.hours !== '00' || timeInfo.minutes !== '00'"
      class="timer-message-time"
    >
      {{ timeInfo.minutes }}{{ t('분') }}&nbsp;
    </span>
    <span
      v-if="timeInfo.seconds"
      class="timer-message-time"
    >
      {{ timeInfo.seconds }}{{ t('초') }}&nbsp;
    </span>
    <span class="timer-message-time">
      {{ timeInfo.base }}
    </span>
  </div>
  <div
    v-else
    class="timer-message-container"
  >
    <span class="timer-message-time">
      {{ timeInfo.end }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  watch,
} from 'vue';
import { storeToRefs } from 'pinia';
import useInitStore from '@store/storeInit';

const { getTimerMessageInfo } = storeToRefs(useInitStore());

const { t } = useI18n();

const remainingTime = ref(0);
const timeInfo = reactive({
  hours: '',
  minutes: '',
  seconds: '',
  base: '',
  end: '',
});

// eslint-disable-next-line no-undef
const currentIntervalId = ref<undefined | NodeJS.Timeout>(undefined);

// 남은 시간 시,분,초 형식으로 변환하는 로직
const setTimerInfoData = () => {
  const endTime = Number(getTimerMessageInfo.value.time);
  const nowTime = Number(Math.floor(new Date().getTime() / 1000)); // Unix timestamp으로 변환

  remainingTime.value = endTime - nowTime;

  if (remainingTime.value < 0) {
    clearInterval(currentIntervalId.value);
    timeInfo.hours = '';
    timeInfo.minutes = '';
    timeInfo.seconds = '';
    timeInfo.base = '';
    timeInfo.end = getTimerMessageInfo.value?.message?.end ?? '';

    return;
  }

  timeInfo.hours = String(Math.floor((remainingTime.value % (60 * 60 * 24)) / (60 * 60))).padStart(2, '0');
  timeInfo.minutes = String(Math.floor((remainingTime.value % (60 * 60)) / 60)).padStart(2, '0');
  timeInfo.seconds = String(Math.floor(remainingTime.value % 60)).padStart(2, '0');
  timeInfo.base = getTimerMessageInfo.value?.message?.base ?? '';
};

watch(() => getTimerMessageInfo.value, () => {
  clearInterval(currentIntervalId.value);

  setTimerInfoData();

  currentIntervalId.value = setInterval(() => {
    setTimerInfoData();
  }, 1000);
});

onMounted(() => {
  setTimerInfoData();

  currentIntervalId.value = setInterval(() => {
    setTimerInfoData();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(currentIntervalId.value);
});
</script>

<style lang="scss" scoped>
.timer-message-container {
  position: absolute;
  top: 11.0938vw;
  right: 1.5625vw;
  z-index: 10000;
  max-width: 46.875vw;
  padding: 1.25vw 1.5625vw;
  font-family: 'Pretendard', sans-serif;
  background-color: rgba(249, 21, 21, 0.90);
  border-radius: .7813vw;
  box-shadow: 0 .3906vw .7813vw 0 rgba(0, 0, 0, 0.25);

  .timer-message-time {
    font-size: 1.7188vw;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 2.1875vw;
    color: #fff;
    text-align: right;
    text-shadow: 0 0 0.7813vw rgba(0, 0, 0, 0.25);
    letter-spacing: -0.0344vw;
    word-break: break-all;
  }
}

</style>
