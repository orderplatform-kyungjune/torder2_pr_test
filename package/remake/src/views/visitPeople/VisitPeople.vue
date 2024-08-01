<template>
  <teleport to="#modal">
    <VisitResetConfirm :resetPeopleCount="() => resetPeopleCount()"/>
    <div class="visit-people-container">
      <div class="visit-people-left-container">
        <div class="visit-people-torder-logo">
          <img :src="getBasicThemeProductLogoImage()">
        </div>
        <div class="visit-people-left-title">
          {{ t('방문 인원 수') }}
        </div>
      </div>
      <div class="visit-people-right-container">
        <div class="visit-people-select-header">
          <span>
            {{ t('인원을 선택해주세요.') }}
          </span>
          <div @click="openModal(VISIT_CONFIRM)">
            <img
              class="visit-people-reset-button"
              src="https://static.torder.co.kr/torder2/icn_reset_button_black.svg"
              alt="reset-button"
            >
          </div>
        </div>
        <div class="middle-wrapper">
          <div :class="getSelectWrapperClass()">
            <div class="select-group-info">
              <span
                v-if="isPeopleGroupUse"
                class="group-title"
              >
                {{ getStoreInfo.visitconfig?.peopleGroup[0] }}
              </span>
              <div class="group-count">
                <span class="count-info">{{ peopleFirstGroupCount }}</span>
                <span class="count-unit">{{ t('명') }}</span>
              </div>
            </div>
            <div
              v-if="isPeopleGroupUse"
              class="select-count-wrapper"
            >
              <DefaultButton
                v-for="visitNumber in Array.from(Array(10), (_, index)=>index)"
                :key="`visit-first-button-${visitNumber}`"
                class="count-button"
                :class="getDefaultButtonClass(visitNumber)"
                :content="String(visitNumber)"
                v-bind="{ ...countButtonStyle }"
                @click="setPeopleFirstGroupCount(visitNumber)"
              />
            </div>
            <div
              v-else
              class="select-count-wrapper"
            >
              <DefaultButton
                v-for="visitNumber in 10"
                :key="`visit-second-button-${visitNumber}`"
                class="count-button"
                :class="getDefaultButtonClass(visitNumber)"
                :content="String(visitNumber)"
                v-bind="{ ...countButtonStyle }"
                @click="setPeopleFirstGroupCount(visitNumber)"
              />
            </div>
          </div>
          <div
            v-if="isPeopleGroupUse"
            class="select-wrapper"
          >
            <div class="select-group-info">
              <span class="group-title">{{ getStoreInfo.visitconfig?.peopleGroup[1] }}</span>
              <div class="group-count">
                <span class="count-info">{{ peopleSecondGroupCount }}</span>
                <span class="count-unit">{{ t('명') }}</span>
              </div>
            </div>
            <div class="select-count-wrapper">
              <DefaultButton
                v-for="visitNumber in Array.from(Array(10), (_, index)=>index)"
                :key="`visit-button-${visitNumber}`"
                class="count-button"
                :class="getSecondGroupButtonClass(visitNumber)"
                :content="String(visitNumber)"
                v-bind="{ ...countButtonStyle }"
                @click="setPeopleSecondGroupCount(visitNumber)"
              />
            </div>
          </div>
        </div>
        <div class="visit-button-wrapper">
          <DefaultButton
            class="visit-people-close-button"
            :content="t('닫기')"
            v-bind="{ ...visitButtonStyle }"
            color="#fff"
            background="#0A0A0A"
            @click="closeVisitPeople"
          />
          <DefaultButton
            class="visit-people-confirm-button"
            :content="t('입력완료')"
            v-bind="{ ...visitButtonStyle }"
            color="#fff"
            background="#F91515"
            @click="setTotalPeople"
          />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
} from 'vue';
import { storeToRefs } from 'pinia';
import { VisitResetConfirm } from '@views';
import { getBasicThemeProductLogoImage } from '@utils/logoUtils';
import {
  VisitGroupInfo,
  VisitPeopleDataType,
} from '@torder/common/interface';
import {
  VISIT_CONFIRM,
  VISIT_PEOPLE,
} from '@torder/common/constant';
import { DefaultButton } from '@torder/common/components';
import useVisitPeopleStore from '@store/storeVisitPeople';
import useTableStore from '@store/storeTable';
import useOrderListStore from '@store/storeOrderList';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import { requestVisitPeople } from '@apis/visitPeople';
import { checkOrderExist } from '@apis/orderData';

const props = defineProps<{
  order?: (e: Event, isConfirmOrder?: boolean) => void,
}>();

const { t } = useI18n();

const {
  setTotalVisitPeople,
  setOccupiedTable,
} = useVisitPeopleStore();
const { isOccupied } = storeToRefs(useVisitPeopleStore());

const { setOrderList } = useOrderListStore();
const { orderList } = storeToRefs(useOrderListStore());

const { tableInfo } = storeToRefs(useTableStore());

const {
  openModal,
  closeModal,
  openAlert,
  resetBeforeOrder,
} = useModalStore();
const { isBeforeOrder } = storeToRefs(useModalStore());

const { getStoreInfo } = storeToRefs(useInitStore());

const {
  visitGroupOpenType,
  visitOrderAble,
} = getStoreInfo.value?.visitconfig;

const visitButtonStyle = {
  width: '100%',
  height: '5.0781vw',
  'font-weight': '900',
  'font-size': '2.125vw',
  border: 'none',
  'border-radius': '.7813vw',
};

const countButtonStyle = {
  width: '100%',
  height: '6.25vw',
  'font-weight': '500',
  'font-size': '2.375vw',
  border: '.1563vw solid #dcdcdc',
  'border-radius': '.7813vw',
};

const peopleFirstGroupCount = ref<number>(0);

const setPeopleFirstGroupCount = (count: number) => {
  peopleFirstGroupCount.value = count;
};

const peopleSecondGroupCount = ref<number>(0);

const setPeopleSecondGroupCount = (count: number) => {
  peopleSecondGroupCount.value = count;
};

const resetPeopleCount = () => {
  peopleFirstGroupCount.value = 0;
  peopleSecondGroupCount.value = 0;
};

const isPeopleGroupUse = computed(() => {
  const {
    peoplesGroupUse,
    peopleGroup,
  } = getStoreInfo.value.visitconfig;
  const isUseGroup = peoplesGroupUse === 1;
  const isHaveGroup = peopleGroup?.length > 1;

  return isUseGroup && isHaveGroup;
});

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
    if (visitGroupOpenType === 'order' && props?.order && isBeforeOrder.value) {
      await requestVisitPeople(visitData);
      await checkOrderExist(getStoreInfo.value.storeCode, tableInfo.value.tabletId, setOrderList);
      closeModal(VISIT_PEOPLE);
      props.order(e, true);
    } else {
    // 2
      await requestVisitPeople(visitData);
      await checkOrderExist(getStoreInfo.value.storeCode, tableInfo.value.tabletId, setOrderList);
      openAlert(`${t('총')}${totalPeople}${t('명을 선택하셨습니다.')}`);
      setOccupiedTable();
      closeModal(VISIT_PEOPLE);
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
    closeModal(VISIT_PEOPLE);
    return;
  }
  // 1, 2
  if (visitOrderAble === 1) {
    openAlert(`${t('주문을 위해서 인원 수를 선택해주세요.')}`);
    if (visitGroupOpenType === 'order') {
      closeModal(VISIT_PEOPLE);
    }
    return;
  }
  // 3
  if (visitOrderAble === 0 && visitGroupOpenType === 'order' && props.order && isBeforeOrder.value) {
    setOccupiedTable();
    props.order(e, true);
    closeModal(VISIT_PEOPLE);
    return;
  }
  // 4
  if (visitOrderAble === 0 && visitGroupOpenType === 'storeLogo') {
    setOccupiedTable();
    closeModal(VISIT_PEOPLE);

    return;
  }

  closeModal(VISIT_PEOPLE);
};

const getDefaultButtonClass = (number: number) => {
  if (number === peopleFirstGroupCount.value) return 'count-button active';
  return 'count-button';
};

const getSelectWrapperClass = () => {
  if (!isPeopleGroupUse.value) return 'select-wrapper only';
  return 'select-wrapper';
};

const getSecondGroupButtonClass = (number: number) => {
  if (number === peopleSecondGroupCount.value) return 'count-button active';
  return 'count-button';
};

onMounted(() => {
  const visitPeopleInfo = orderList.value?.visitPeopleArray;

  if (isPeopleGroupUse.value && visitPeopleInfo?.groupInfo) {
    peopleFirstGroupCount.value = Number(Object.values(visitPeopleInfo?.groupInfo)[0]) ?? 0;
    peopleSecondGroupCount.value = Number(Object.values(visitPeopleInfo?.groupInfo)[1]) ?? 0;
  } else {
    if (!visitPeopleInfo?.total) return;
    peopleFirstGroupCount.value = (visitPeopleInfo.total > 9 ? 0 : visitPeopleInfo.total) ?? 0;
  }
});

onUnmounted(() => {
  resetBeforeOrder();
});
</script>

<style lang='scss' scoped>
.visit-people-container{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  display: grid;
  grid-template-columns: 22% 1fr;
  gap: 1.5625vw;
  width: 100%;
  height: 100%;
  padding: 1.5625vw;
  font-family: 'pretendard',sans-serif;
  color: #fff;
  background-color: #000;

  .visit-people-left-container{
    padding: 1.5625vw 0;

    .visit-people-torder-logo{
      display: flex;
      justify-content: flex-start;
      height: 6.25vw;
      margin: 2.3438vw 0;

      img{
        max-width: 75%;
        height: 100%;
      }
    }

    .visit-people-left-title{
      font-size: 3.375vw;
      font-weight: 700;
    }
  }

  .visit-people-right-container{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3.125vw 4.6875vw;
    color: #000;
    background-color: #fff;
    border-radius: 1.5625vw;

    .visit-people-select-header{
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      font-size: 2.75vw;
      font-weight: 700;

      .visit-people-reset-button {
        &.button-active {
          filter: brightness(0.9);
        }
      }
    }

    .select-wrapper{
      display: grid;
      grid-template-columns: 1fr 45.3125vw;
      padding: 2.3438vw 0;

      &.only{
        display: flex;
        flex-direction: column;
        gap: 2.3438vw;
        align-content: center;
        align-items: center;

        .select-count-wrapper{
          width: 50vw;

          .count-button{
            height: 7.8125vw;

            &.button-active {
              background-color: #EBEBEB;
            }
          }
        }

        .select-group-info{
          gap: 0;

          .count-info{
            font-size: 10vw;
            color: #F91515;
          }

          .count-unit{
            font-size: 6.25vw;
          }
        }

      }

      &:first-child{
        border-bottom: .0781vw solid #000;

        &.only{
          border-bottom: none;
        }
      }

      .select-count-wrapper{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        gap: .7813vw;
        width: 100%;

        .count-button{

          &.button-active {
            background-color: #EBEBEB;
          }

          &.active{
            font-weight: 700;
            color: #F91515;
            border: .3125vw solid #F91515;
          }
        }
      }

      .select-group-info{
        display: flex;
        gap: 3.125vw;
        align-items: center;

        .group-title{
          font-size: 2.375vw;
          color: #666;
        }

        .group-count{
          font-weight: 900;
          color: #000;
        }

        .count-info{
          font-size: 5vw;
        }

        .count-unit{
          font-size: 3.25vw;
        }
      }
    }

    .visit-button-wrapper{
      display: grid;
      grid-template-columns: 25% 1fr;
      gap: 1.5625vw;

      .visit-people-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.4844vw;
        font-size: 2.1094vw;
        font-weight: 700;
        color: #fff;
        background-color: #000;
        border-radius: .7813vw;

        &.button-active {
          background-color: #242424;
        }
      }

      .visit-people-confirm-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.4844vw;
        font-size: 2.1094vw;
        font-weight: 700;
        color: #fff;
        background-color: #F91515;
        border-radius: .7813vw;

        &.button-active {
          background-color: #D60505;
        }
      }
    }
  }
}
</style>
