<template>
  <teleport to="#modal">
    <div class="custom-visit-people-container">
      <div class="custom-visit-people-wrap">
        <div class="custom-visit-people-header">
          <div class="custom-visit-people-title">
            {{ t('인원 수를 선택해주세요.') }}
          </div>
          <img
            class="custom-visit-people-close-button"
            alt="Close"
            src="https://static.torder.co.kr/torder2/btn_small_black_close.svg"
            @click="closeVisitPeople"
          >
        </div>
        <div class="custom-visit-people-body">
          <div
            v-if="!isPeopleGroupUse"
            class="custom-visit-group-count-container"
          >
            <div class="custom-visit-group-count-wrap">
              <span class="custom-visit-group-name ellipsis-text-1">
                {{ t('총 인원 수') }}
              </span>
              <div class="custom-visit-group-count-box">
                <img
                  v-if="peopleFirstGroupCount < 2"
                  alt="-"
                  src="https://static.torder.co.kr/torder2/bright_gray_minus_button.svg"
                  class="custom-visit-group-count-button"
                >
                <GrayMinus
                  v-else
                  class="custom-visit-people-count-button"
                  @click="minusPeopleFirstGroupCount"
                />
                <span class="custom-visit-people-count-button-number">
                  {{ `${peopleFirstGroupCount}${t('명')}` }}
                </span>
                <GrayPlus
                  class="custom-visit-people-count-button"
                  @click="plusPeopleFirstGroupCount"
                />
              </div>
            </div>
          </div>
          <div
            v-else
            class="custom-visit-group-count-container double"
          >
            <div class="custom-visit-group-count-wrap">
              <span class="custom-visit-group-name ellipsis-text-1">
                {{ getStoreInfo.visitconfig?.peopleGroup[0] }}
              </span>
              <div class="custom-visit-group-count-box">
                <img
                  v-if="peopleFirstGroupCount < 1"
                  alt="-"
                  src="https://static.torder.co.kr/torder2/bright_gray_minus_button.svg"
                  class="custom-visit-group-count-button"
                >
                <GrayMinus
                  v-else
                  class="custom-visit-group-count-button"
                  @click="minusPeopleFirstGroupCount"
                />
                <span class="custom-visit-group-count-button-number">
                  {{ `${peopleFirstGroupCount}${t('명')}` }}
                </span>
                <GrayPlus
                  class="custom-visit-group-count-button"
                  @click="plusPeopleFirstGroupCount"
                />
              </div>
            </div>
            <div class="custom-visit-group-divider"/>
            <div class="custom-visit-group-count-wrap">
              <span class="custom-visit-group-name ellipsis-text-1">
                {{ getStoreInfo.visitconfig?.peopleGroup[1] }}
              </span>
              <div class="custom-visit-group-count-box">
                <img
                  v-if="peopleSecondGroupCount < 1"
                  alt="-"
                  src="https://static.torder.co.kr/torder2/bright_gray_minus_button.svg"
                  class="custom-visit-group-count-button"
                >
                <GrayMinus
                  v-else
                  class="custom-visit-group-count-button"
                  @click="minusPeopleSecondGroupCount"
                />
                <span class="custom-visit-group-count-button-number">
                  {{ `${peopleSecondGroupCount}${t('명')}` }}
                </span>
                <GrayPlus
                  class="custom-visit-group-count-button"
                  @click="plusPeopleSecondGroupCount"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="custom-visit-people-footer">
          <div
            class="custom-visit-people-footer-confirm-button"
            @click="setTotalPeople"
          >
            {{ t('확인') }}
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue';
import { storeToRefs } from 'pinia';
import {
  CUSTOM_VISIT_PEOPLE,
  VisitGroupInfo,
  VisitPeopleDataType,
  getSubPrimaryColor,
} from '@torder/common';
import useVisitPeopleStore from '@store/storeVisitPeople';
import useTableStore from '@store/storeTable';
import useOrderListStore from '@store/storeOrderList';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import GrayPlus from '@assets/btn_gray_plus.vue';
import GrayMinus from '@assets/btn_gray_minus.vue';
import { requestVisitPeople } from '@apis/visitPeople';

const props = defineProps<{
  order?: (e: Event, isConfirmOrder?: boolean) => void,
}>();

const { t } = useI18n();

const {
  init,
  buttonBackgroundColor,
  buttonFontColor,
  getStoreInfo,
} = storeToRefs(useInitStore());

const {
  setTotalVisitPeople,
  setOccupiedTable,
} = useVisitPeopleStore();
const { isOccupied } = storeToRefs(useVisitPeopleStore());

const { orderList } = storeToRefs(useOrderListStore());

const {
  openAlert,
  closeModal,
} = useModalStore();

const isPeopleGroupUse = computed(() => {
  const {
    peoplesGroupUse,
    peopleGroup,
  } = getStoreInfo.value.visitconfig;
  const isUseGroup = peoplesGroupUse === 1;
  const isHaveGroup = peopleGroup?.length > 1;

  return isUseGroup && isHaveGroup;
});

const peopleFirstGroupCount = ref<number>(0);
const peopleSecondGroupCount = ref<number>(0);

const minusPeopleFirstGroupCount = () => {
  if (peopleFirstGroupCount.value < 1) return;

  peopleFirstGroupCount.value -= 1;
};
const plusPeopleFirstGroupCount = () => {
  peopleFirstGroupCount.value += 1;
};

const minusPeopleSecondGroupCount = () => {
  if (peopleSecondGroupCount.value < 1) return;

  peopleSecondGroupCount.value -= 1;
};
const plusPeopleSecondGroupCount = () => {
  peopleSecondGroupCount.value += 1;
};

const { tableInfo } = storeToRefs(useTableStore());
const {
  visitGroupOpenType,
  visitOrderAble,
} = init.value?.storeInfo?.visitconfig;

const setTotalPeople = async (e: Event) => {
  const totalPeople = peopleFirstGroupCount.value + peopleSecondGroupCount.value;

  const visitData = {
    storeCode: getStoreInfo.value.storeCode,
    tabletNumber: tableInfo.value.tabletId,
    groupArray: { total: totalPeople },
  } as VisitPeopleDataType;

  if (peopleFirstGroupCount.value === 0 && peopleSecondGroupCount.value === 0) {
    openAlert(`${t('인원수를 입력해주세요.')}`);
    return;
  }

  if (isPeopleGroupUse.value) {
    const groupInfo = {} as VisitGroupInfo;
    const { visitconfig } = getStoreInfo.value;

    groupInfo[visitconfig.peopleGroup[0]] = peopleFirstGroupCount.value;
    groupInfo[visitconfig.peopleGroup[1]] = peopleSecondGroupCount.value;

    visitData.groupArray.groupInfo = groupInfo;
  }

  setTotalVisitPeople(totalPeople);

  /*
    - 인원수 입력하기

    1. 주문하기로 진입한 경우 (visitGroupOpenType === 'order') => 인원수 입력 후 주문하기 진행
    2. 첫화면에서 진입시 (visitGroupOpenType === 'storeLogo') => 인원수 입력만 진행
  */
  try {
    // 1
    if (visitGroupOpenType === 'order' && props?.order) {
      await requestVisitPeople(visitData);
      closeModal(CUSTOM_VISIT_PEOPLE);
      props.order(e, true);
    } else {
    // 2
      await requestVisitPeople(visitData);
      openAlert(`${t('총')}${totalPeople}${t('명을 선택하셨습니다.')}`);
      setOccupiedTable();
      closeModal(CUSTOM_VISIT_PEOPLE);
    }
  } catch (error) {
    console.error(error);
  }
};

/*
  - 인원수 입력창 닫기

  1. 인원수 미입력시 주문 불가 사용시 (visitOrderAble === 1) && 주문하기로 진입시 (visitGroupOpenType === 'order') => 알럿 메시지 노출 후 인원수 입력창 닫힘
  2. 인원수 미입력시 주문 불가 사용시 (visitOrderAble === 1) && 첫화면에서 진입시 (visitGroupOpenType === 'storeLogo') => 알럿 메시지 노출 후 인원수 입력창 닫힘
  3. 인원수 미입력시 주문 불가 미사용시 (visitOrderAble === 0) && 주문하기로 진입시 (visitGroupOpenType === 'order') => 인원수 입력창 닫힌 후 주문 진행
  4. 인원수 미입력시 주문 불가 미사용시 (visitOrderAble === 0) && 첫화면에서 진입시 (visitGroupOpenType === 'storeLogo') => 인원수 입력창 닫힌 후 다시 노출되지 않음
  5. 이미 인원수를 선택한 경우
*/
const closeVisitPeople = (e: Event) => {
  // 5
  if (isOccupied.value) {
    closeModal(CUSTOM_VISIT_PEOPLE);
    return;
  }
  // 1, 2
  if (visitOrderAble === 1) {
    openAlert(`${t('주문을 위해서 인원 수를 선택해주세요.')}`);
    if (visitGroupOpenType === 'order') {
      closeModal(CUSTOM_VISIT_PEOPLE);
    }
    return;
  }
  // 3
  if (visitOrderAble === 0 && visitGroupOpenType === 'order' && props.order) {
    setOccupiedTable();
    props?.order(e, true);
    closeModal(CUSTOM_VISIT_PEOPLE);
    return;
  }
  // 4
  if (visitOrderAble === 0 && visitGroupOpenType === 'storeLogo') {
    setOccupiedTable();
    closeModal(CUSTOM_VISIT_PEOPLE);
  }
};

// 인원수 초기값 설정을 위한 로직
const setDefaultCount = () => {
  if (!isPeopleGroupUse.value) {
    peopleFirstGroupCount.value = 1;
    peopleSecondGroupCount.value = 0;
  } else {
    peopleFirstGroupCount.value = 0;
    peopleSecondGroupCount.value = 0;
  }
};

const getActiveButtonColor = (color: string) => getSubPrimaryColor(color, 10, 'Y');

watch(() => getStoreInfo.value, () => {
  setDefaultCount();
});

onMounted(() => {
  setDefaultCount();

  const visitPeopleInfo = orderList.value?.visitPeopleArray;
  if (isPeopleGroupUse.value && visitPeopleInfo?.groupInfo) {
    peopleFirstGroupCount.value = Number(Object.values(visitPeopleInfo.groupInfo)[0]);
    peopleSecondGroupCount.value = Number(Object.values(visitPeopleInfo.groupInfo)[1]);
  } else {
    if (!visitPeopleInfo?.total) return;
    peopleFirstGroupCount.value = (visitPeopleInfo.total > 9 ? 0 : visitPeopleInfo.total);
  }
});
</script>

<style lang='scss' scoped>
.custom-visit-people-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  gap: 1.5625vw;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: 'Pretendard', sans-serif;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.80);

  .custom-visit-people-wrap {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 1.5625vw;

    .custom-visit-people-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5625vw;

      .custom-visit-people-title {
        font-size: 2.3438vw;
        font-weight: 700;
        line-height: 3.125vw;
        color: #313131;
        letter-spacing: -0.0469vw;
      }

      .custom-visit-people-close-button {
        width: 3.125vw;
        height: 3.125vw;

        &.button-active {
          background-color: #EBEBEB;
          border-radius: 0.625vw;
        }
      }
    }

    .custom-visit-people-body {
      display: flex;
      flex-direction: column;

      .custom-visit-group-count-container {
        display: flex;
        flex-direction: column;
        gap: 4.6875vw;
        width: 64.6875vw;
        padding: 1.5625vw;

        &.double {
          gap: 2.3438vw;
        }

        .custom-visit-group-count-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .custom-visit-group-name {
            font-size: 3.75vw;
            font-weight: 600;
            line-height: normal;
            color: #313131;
            letter-spacing: -0.075vw;
          }

          .custom-visit-people-count-button {
            width: 9.0625vw;
            height: 7.8125vw;
          }

          .custom-visit-people-count-button-number {
            width: 9.375vw;
            font-size: 3.75vw;
            font-weight: 600;
            line-height: 3.125vw;
            color: #5b5b5b;
            text-align: center;
            letter-spacing: -0.075vw;
          }
        }

        .custom-visit-group-divider {
          width: 100%;
          height: 0.3125vw;
          margin: 2.3438vw 0;
          background-color: #f8f8f8;
        }
      }

      .custom-visit-group-count-box {
        display: flex;
        gap: 3.125vw;
        align-items: center;
        justify-content: space-between;

        .custom-visit-group-count-button {
          width: 9.0625vw;
          height: 7.8125vw;
        }

        .custom-visit-group-count-button-number {
          width: 9.375vw;
          font-size: 3.75vw;
          font-weight: 600;
          line-height: 3.125vw;
          color: #5b5b5b;
          text-align: center;
          letter-spacing: -0.075vw;
        }
      }
    }

    .custom-visit-people-footer {
      padding: 1.5625vw;

      .custom-visit-people-footer-confirm-button {
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 1.25vw 1.5625vw;
        font-size: 3.75vw;
        font-weight: 700;
        line-height: normal;
        color: v-bind(buttonFontColor);
        background-color: v-bind(buttonBackgroundColor);
        border-radius: 0.9375vw;

        &.button-active {
          background-color: v-bind(getActiveButtonColor(buttonBackgroundColor));
        }
      }
    }
  }
}

</style>
