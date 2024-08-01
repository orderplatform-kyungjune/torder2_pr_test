<template>
  <div class="survey-container">
    <div class="survey-list-wrapper">
      <button
        v-for="(question, index) in surveyContents.questions"
        :key="getQuestionKey(question, index)"
        :class="activeClassName(question)"
        class="survey-button"
        @click="() => handleClickQuestion(question)"
      >
        <img
          :src="`https://static.torder.co.kr/survey/survey_disney/${activeClassName(question)}.webp`"
          alt="체크 이미지"
          class="check-icon"
        >
        <span class="button-content">{{ question }}</span>
      </button>
    </div>

    <button
      :class="{ disable: !summitAnswer }"
      class="survey-summit-button"
      @click.stop="onClickSummitButton"
    >
      <span>예매권 받으러 가기</span>
      <img
        alt="화살표 이미지"
        class="survey-summit-button-icon"
        src="https://static.torder.co.kr/torder2/icon_arrow_right_white.svg"
      >
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useOrderListStore from '@store/storeOrderList';
import useModalStore from '@store/storeModal';

const props = defineProps<{
  surveyContents: {
    eventBannerName: string,
    questions: string[],
    answer: string,
    validationMessage: {
      invalidAnswer: string,
      beforeOrder: string,
      alreadyCheck: string,
      beforeSelect: string,
    },
  },
  clickEventModuleLinkArea: (targetEvent: string) => void,
}>();

const { openAlert } = useModalStore();

const summitAnswer = ref<string | null>(null);

const activeClassName = (question: string): 'checked' | 'unchecked' => {
  const selected = question === summitAnswer.value;

  if (selected) return 'checked';
  return 'unchecked';
};

const checkBeforeOrder = (): boolean => {
  const { orderList } = useOrderListStore();
  return orderList.order_info.length === 0;
};

const handleInvalidAnswer = (): void => {
  openAlert(props.surveyContents.validationMessage.invalidAnswer);
};

// 설문조사 이벤트는 국제화 대상에서 제외
const handleBeforeOrder = (): void => {
  openAlert(props.surveyContents.validationMessage.beforeOrder);
};

const handleClickQuestion = (question: string) => {
  const isCorrectAnswer = question === props.surveyContents.answer;

  if (checkBeforeOrder()) {
    handleBeforeOrder();
    return;
  }
  if (summitAnswer.value) {
    openAlert(props.surveyContents.validationMessage.alreadyCheck);
    return;
  }
  if (!isCorrectAnswer) {
    handleInvalidAnswer();
    return;
  }

  summitAnswer.value = question;
};

const popValidAlertMessage = (): void => {
  const isBeforeSelected = !summitAnswer.value;

  if (checkBeforeOrder()) {
    handleBeforeOrder();
    return;
  }
  if (isBeforeSelected) {
    openAlert(props.surveyContents.validationMessage.beforeSelect);
    return;
  }
  handleInvalidAnswer();
};

const onClickSummitButton = (): void => {
  const isCorrectAnswer = summitAnswer.value === props.surveyContents.answer;

  if (isCorrectAnswer) {
    props.clickEventModuleLinkArea(props.surveyContents.eventBannerName);
    return;
  }
  popValidAlertMessage();
};

const getQuestionKey = (question: string, index: number) => (`${question}-${index}`);

</script>

<style lang='scss' scoped>
@font-face {
  font-family: 'TheJamsil5Bold';
  font-style: normal;
  font-weight: 700;
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302_01@1.0/TheJamsil5Bold.woff2') format('woff2');
}

.survey-container {
  padding: 2.3438vw;
}

.survey-list-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5625vw;
}

.survey-button {
  display: flex;
  flex-direction: row;
  gap: 1.25vw;
  align-items: center;
  padding: 3.9454vw 2.3438vw;
  background-color: #fff;
  border: 0.2344vw solid #BEBEBE;
  border-radius: 1.25vw;
}

.survey-button.checked {
  border-color: #D60040;
}

.check-icon {
  width: 3.125vw;
  height: 3.125vw;
}

.button-content {
  font-family: 'TheJamsil5Bold', serif;
  font-size: 2.9688vw;
  font-weight: bold;
  line-height: 3.2813vw;
}

.survey-summit-button {
  display: flex;
  gap: 1.5625vw;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2.3438vw 1.5625vw;
  margin-top: 5vw;
  font-size: 2.5vw;
  font-weight: 700;
  color: #fff;
  background-color: #D60040;
  border: none;
  border-radius: 1.25vw;

  &.disable {
    background-color: #d2d2d2;
  }

}

.survey-summit-button-icon {
  width: 1.875vw;
  height: 1.875vw;

}
</style>
