<template>
  <div
    v-show="reviewProps.open"
    ref="reviewRef"
    class="review-container"
    @touchstart="handleClick"
  >
    <ReviewList/>
    <ReviewSurvey/>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import { storeToRefs } from 'pinia';
import useReviews from '@containers/review/storeReivews';
import useReviewSurvey from '@containers/review/modal/storeReviewSurvey';
import ReviewSurvey from '@containers/review/modal/ReviewSurvey.vue';
import { ACTIONABLE_ELEMENT_CLASS } from '@containers/review/const';
import ReviewList from '@containers/review/ReviewList.vue';
import TimeSchedule from '@composables/TimeSchedule';

const { onCreateLogAndMessage } = useReviews();
const { reviewProps } = storeToRefs(useReviews());
const { open: reviewSurveyOpen, modalDisplayInfo } = storeToRefs(useReviewSurvey());

const reviewRef = ref<HTMLDivElement>();

const schedule = new TimeSchedule();

const close = () => {
  onCreateLogAndMessage();
  useReviewSurvey().reviewSurveyClose();

  // eslint-disable-next-line no-use-before-define
  schedule.removeScheduleContext(complete);
};

const complete = () => {
  reviewProps.value.resolve?.();
  close();
};

const terminate = () => {
  reviewProps.value.reject?.();
  close();
};

/**
 * Review 는 계속 떠 있기 때문에 Review 가 호출되는 위치(home, banner)가 가지는 Index 가 달라 호출하는 곳에서 review 의 z-index 를 정의해준다.
 */
const reviewZIndex = computed(() => reviewProps.value.zIndex ?? 16);

// 각 component 에 별도 이벤트 처리하는 곳에서 event.preventDefault (수식어 .stop) 을 사용하고 전역 이벤트로 close popup 하게 만든다.
const handleClick = (e: TouchEvent) => {
  const nodes = document.getElementsByClassName(ACTIONABLE_ELEMENT_CLASS);
  if(Array.from(nodes).some((node)=>node.contains(e.target as HTMLElement))){
    if (reviewProps.value.timeout) {
      schedule.updateScheduleContext(complete, Date.now() + reviewProps.value.timeout);
    }
    return;
  }
  e.preventDefault();
  terminate();
};

onMounted(() => {
  schedule.startSchedule();
  onBeforeUnmount(() => {
    close();
    schedule.endSchedule();
  });
});

watch(() => reviewProps.value, (props) => {
  if (!props.open) return;
  if (props.timeout) {
    schedule.updateScheduleContext(complete, Date.now() + props.timeout);
  }
});

watch(()=>reviewSurveyOpen.value, (isReviewSurveyOpened)=>{
  // 평가지가 닫혔는지, 수정모드인지, 평가지가 평가 창을 닫을 수 있는 권한을 부여했는지 여부 체크
  if(!isReviewSurveyOpened && !modalDisplayInfo.value.isEdit && reviewProps.value.delegateTerminal) {
    complete();
  }
})
</script>

<style scoped lang="scss">
.review-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: v-bind(reviewZIndex);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 6vh 4.375vw 3.25vh;
  background: linear-gradient(249deg, rgba(9, 60, 131, 0.2) 11.83%, rgba(32, 90, 172, 0) 64.56%), #0e1218;
}
</style>

<style>
.review-container {
  font-family: 'Pretendard', sans-serif;
}
</style>
