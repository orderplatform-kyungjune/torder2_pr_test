<template>
  <teleport
    v-if="flag.visitSelect"
    to="#modal"
  >
    <div class="visit-select-check-container">
      <CloseButton
        class="visit-select-check-close-button"
        color="#fff"
        route="https://static.torder.co.kr/torder2/svg_closebutton_normal_white.svg"
        background="transparent"
        :content="t('닫기')"
        :theme-type="theme.type"
        @click="closeModal(VISIT_SELECT)"
      />
      <div class="visit-select-check-message-container">
        <p class="visit-select-check-text">
          {{ t('첫 주문은 인원수를 입력해야 주문할 수 있습니다.') }}
        </p>
      </div>
      <img
        class="visit-select-check-image"
        src="https://static.torder.co.kr/torder2/visit_select_confirm_arrow_vertical.svg"
      >
    </div>
    <BasicLayoutPersonButton
      v-if="isVisitPeopleUse"
      class="visit-people-button"
      :isChangeFontSize="isChangeFontSize"
      :content="t('총 인원 입력')"
      @click="clickVisitPeopleButton"
    />
  </teleport>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import {
  VISIT_PEOPLE,
  VISIT_SELECT,
} from '@torder/common/constant';
import useVisitPeopleStore from '@store/storeVisitPeople';
import useThemeStore from '@store/storeTheme';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import {
  BasicLayoutPersonButton,
  CloseButton,
} from '@components';

const {
  t,
  locale,
} = useI18n();

const { getStoreInfo } = storeToRefs(useInitStore());

const {
  flag,
  openModal,
  closeModal,
} = useModalStore();

const { theme } = storeToRefs(useThemeStore());

const { totalVisitPeople } = storeToRefs(useVisitPeopleStore());

const isVisitPeopleUse = computed(() => {
  const isVisitPeople = getStoreInfo.value.visitconfig?.visitBookUse;

  return isVisitPeople === 1;
});

const clickVisitPeopleButton = () => {
  closeModal(VISIT_SELECT);
  openModal(VISIT_PEOPLE);
};

// 방문 인원수 변경 버튼 영어 번역일 경우 텍스트 길이가 길어져 줄바꿈 관련 로직
const isChangeFontSize = () => locale.value === 'en' && totalVisitPeople.value > 0;

</script>

<style lang="scss" scoped>
.visit-select-check-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 51;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: "Noto Sans SC", sans-serif;
  background-color: rgba(0, 0, 0, 0.83);

  .visit-select-check-close-button{
    position: absolute;
    top: 2.6406vw;
    right: 2.3438vw;
    font-weight: bold;
  }

  .visit-select-check-message-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52.890625vw;
    height: 24.084507042vh;
    padding: 0.7813vw;
    background-color: rgba(255,0,0,.9);
    border-radius: .78125vw;
    box-shadow: .23438vw .23438vw .3125vw 0 rgba(0,0,0,.4);

    .visit-select-check-text {
      width: 80%;
      font-family: 'Noto Sans KR', serif;
      font-size: 3.3594vw;
      line-height: 1.44;
      color: #fff;
      text-align: center;
      letter-spacing: -.16796875vw;
    }
  }

  .visit-select-check-image {
    position: absolute;
    bottom: 9.3vh;
    left: 17.03125vw;
    width: 16.8671875vw;
    height: 18.183098592vh;
    animation: beat 0.7s ease 0s infinite;
  }

  @keyframes beat {
    0%{ transform: translate(0px, 0px); }
    50%{ transform: translate(10px, 0px); }
    100%{ transform: translate(0px, 0px); }
  }
}
.visit-people-button {
  z-index: 51;
}
</style>
