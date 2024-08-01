<template>
  <div
    v-if="!isRestaurantVertical"
    class="bill-order-container"
    :class="{ restaurant: isThemeRestaurant }"
  >
    <RestaurantLayoutStoreInfo
      v-if="isRestaurantTheme"
      :tableName="getInitTableName()"
    />
    <ViewOrderHead
      class="order-header"
      :title="t('계산서')"
      :time="time"
      :buttonText="t('닫기')"
      :isRestaurant="isThemeRestaurant"
      :onClick="goBackPage"
    />
    <BasicLayoutStoreTableInfo
      class="table-info"
      :title="t('테이블명')"
      :tableName="getInitTableName()"
      :storeName="getStoreName()"
      :theme-color="theme?.color"
      :cartActive="isActiveCart"
      @click="onNextSecret"
    />
    <div class="bill-order-body">
      <div class="bill-left-body">
        <div class="bill-list-wrap">
          <BillListItem
            v-for="(bill, index) in orderBillList"
            :key="getBillId(index)"
            class="bill-list"
            :order="bill"
            :totalPrice="setLocaleString(getTotalPrice(bill))"
            :quantityUnit="t('개')"
          />
        </div>
        <BillTotalSum
          class="bill-sum"
          :sumTitle="t('합계')"
          :totalPrice="setLocaleString(orderTotalOrderPrice)"
        />
      </div>
      <div class="bill-right-body">
        <ItemCount
          class="dutch-pay"
          :title="t('더치페이')"
          :countUnit="setStringDutchPerson(dutchPerson)"
          :plus="onClickPlusPerson"
          :minus="onClickMinusPerson"
        />
        <BillDutchPayPrice
          class="dutch-price"
          :price="getCalculateDutchPrice()"
          :person="t('1인당')"
        />
      </div>
    </div>
  </div>
  <div
    v-else
    class="bill-order-container"
    :class="[storeTheme.type, storeTheme.color]"
  >
    <div class="bill-vertical-top">
      <img
        v-if="storeTheme.color === WHITE"
        src="https://static.torder.co.kr/torder2/svg_left_arrow_black.svg"
        alt="left-arrow"
        @click="goBackPage"
      >
      <img
        v-else
        src="https://static.torder.co.kr/torder2/svg_left_arrow_white.svg"
        alt="left-arrow"
        @click="goBackPage"
      >
      <span :class="storeTheme.color">
        {{ t('계산서') }}
      </span>
    </div>
    <div class="bill-order-list-wrap">
      <div class="bill-column-wrap">
        <template
          v-for="(bill, index) in orderBillList"
          :key="getBillId(index)"
        >
          <RestaurantVerticalScreenBillList :bill="bill"/>
        </template>
      </div>
      <div
        class="total-price-wrap"
        :class="storeTheme.color"
      >
        <span>
          {{ t('총 주문금액') }}
        </span>
        <span>
          {{ orderTotalOrderPrice?.toLocaleString() }}
        </span>
      </div>
    </div>
    <div
      class="dutch-wrap"
      :class="storeTheme.color"
    >
      <span class="text">
        {{ t('더치페이') }}
      </span>
      <RestaurantVerticalScreenPlusMinusControl
        :count="dutchPerson"
        :theme="storeTheme.color"
        :t="t"
        :plusCount="onClickPlusPerson"
        :minusCount="onClickMinusPerson"
        :unit="'명'"
      />
    </div>
    <div
      class="bill-vertical-bottom"
      :class="storeTheme.color"
    >
      <div class="total-order-wrap">
        <span class="total-text">{{ t('1인당') }}</span>
        <div class="total-quantity">
          <span> {{ checkStandardPriceUnit(getCalculateDutchPrice()) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import {
  computed,
  Ref,
  ref,
  watchEffect,
  onMounted,
} from 'vue';
import { storeToRefs } from 'pinia';
import { goBackPage } from '@utils/route.helper';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import {
  getStoreName,
  getInitTableName,
} from '@torder/common/utils';
import { billsArrayType } from '@torder/common/interface/orderList';
import {
  RESTAURANT_HORIZONTAL,
  RESTAURANT_HORIZONTAL_CARD,
  RESTAURANT_VERTICAL,
  WHITE,
} from '@torder/common/constant';
import { useModalTimer } from '@torder/common/composables';
import useThemeStore from '@store/storeTheme';
import useOrderListStore from '@store/storeOrderList';
import useCartStore from '@store/storeCart';
import { RestaurantVerticalScreenBillList } from '@containers';
import { useSecret } from '@composables/secret';
import {
  ViewOrderHead,
  RestaurantLayoutStoreInfo,
  BillListItem,
  BillTotalSum,
  ItemCount,
  BillDutchPayPrice,
  RestaurantVerticalScreenPlusMinusControl,
  BasicLayoutStoreTableInfo,
} from '@components';

const { t } = useI18n();

const { isActiveCart } = storeToRefs(useCartStore());
const { onNextSecret } = useSecret();

const { theme } = storeToRefs(useThemeStore());

const isRestaurantTheme = computed(() => theme.value?.type === RESTAURANT_HORIZONTAL || theme.value?.type === RESTAURANT_HORIZONTAL_CARD);

// 계산내역 불러오는 코드
const { orderList } = useOrderListStore();

const orderBillList: billsArrayType[] = orderList.bills?.billsArray || [];
const orderTotalOrderPrice: number = orderList.bills?.totalCreditPrice || 0;

const getBillId = (index: number) => {
  const temporaryKey = `bill${index}`;
  return temporaryKey;
};

const getTotalPrice = (order: billsArrayType) => {
  const { orderPrice } = order;

  return orderPrice;
};

const setLocaleString = (price: number) => price?.toLocaleString();

const dutchPerson: Ref<number> = ref(1);

const onClickPlusPerson = () => {
  dutchPerson.value += 1;
};

const onClickMinusPerson = () => {
  const isHasPerson = dutchPerson.value <= 1;

  if (isHasPerson) return;

  dutchPerson.value -= 1;
};

const setStringDutchPerson = (person: number) => person.toString();

const getCalculateDutchPrice = () => {
  const personPrice = orderTotalOrderPrice / dutchPerson.value;
  const ceilPrice = Math.ceil(personPrice);

  return ceilPrice?.toLocaleString();
};

const { theme: storeTheme } = useThemeStore();

const isThemeRestaurant = computed(() => storeTheme.type.includes('restaurant'));

const isRestaurantVertical = computed(() => storeTheme.type === RESTAURANT_VERTICAL);

// 타이머
const {
  time,
  timer,
  resetTimer,
} = useModalTimer(10);

const timerId = timer();

watchEffect(() => {
  const isZero = time.value === 0;
  if (isZero) {
    clearInterval(timerId);

    if (!isRestaurantVertical.value) goBackPage();
  }
});

onMounted(() => {
  const scrollElement = document.querySelector('.bill-list-wrap') as HTMLElement;

  document.body.addEventListener('touchstart', () => {
    resetTimer();
  });

  document.body.addEventListener('touchend', () => {
    resetTimer();
  });

  scrollElement.addEventListener('scroll', () => {
    resetTimer();
  });
});
</script>

<style lang='scss' scoped>
.bill-order-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 25;
  height: 62.5vw;
  padding: 2.3438vw 1.9531vw 2.1094vw;
  font-family: pretendard, sans-serif;
  background-color: #2f2a26;

  .table-info {
    position: absolute;
    top: 0;
    right: 1.5625vw;
  }

  &.restaurant{
    font-family: Noto Serif Kr, sans-serif;
  }

  // 세로버전 css
  &.restaurant-vertical{
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    height: auto;
    padding: 0;

    &.white {
      background-color: #fff;
    }

    &.black {
      background-color: #222222;
    }

    .bill-vertical-top {
      position: relative;
      padding: 1.9531vw 0;
      text-align: center;
      border-bottom: .0781vw solid #ddd;

      img {
        position: absolute;
        top: 50%;
        left: 5%;
        transform: translate(-50%, -50%);
      }

      span {
        font-family: 'Noto Serif KR', sans-serif;
        font-size: 2.6563vw;
        font-weight: bold;
        color: #000;

        &.black {
          color: #fff;
        }
      }
    }

    .bill-order-list-wrap {
      height: 100%;
      padding: 0 5vw;
      overflow-x: hidden;
      overflow-y: auto;

      .bill-column-wrap {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }

      .total-price-wrap{
        display: flex;
        justify-content: space-between;
        padding: 5vw 0;

        &.white {
          color: #F91515;
        }

        &.black {
          color: #F91515;
        }

        span:first-child {
          font-size: 2.1875vw;
          font-weight: bold;
        }

        span:last-child {
          font-size: 2.5vw;
          font-weight: bold;
        }
      }
    }

    .dutch-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 13.75vw;
      padding: 0 3.125vw;
      font-family: 'Noto Serif KR', sans-serif;

      .text {
        font-size: 2.6563vw;
        font-weight: bold;
      }

      &.white {
        color: #000;
        background-color: #fff;
        border-top: .0781vw solid #ddd;
      }

      &.black {
        color: #fff;
        background-color: #111111;
      }
    }

    .bill-vertical-bottom {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4.375vw 0;
      color: #fff;

      &.white {
        background-color: #2f2a26;
      }

      &.black {
        background-color: #b51900;
      }

      .total-order-wrap {
        display: flex;
        gap: 1.25vw;
        align-items: center;

        .total-text {
          font-family: 'Pretendard', sans-serif;
          font-size: 2.1875vw;
        }

        .total-quantity {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;

          span {
            font-family: 'Pretendard', sans-serif;
            font-size: 2.6563vw;
            font-weight: bold;
          }
        }
      }
    }
  }

  .bill-order-body {
    display: flex;
    justify-content: space-around;
    width: 96.0938vw;
    margin-top: 2.7344vw;

    .bill-left-body {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 64.4531vw;
      height: 52.2656vw;
      background-color: #fff;
      border: solid .0781vw #707070;
      border-radius: 1.5625vw;

      .bill-list-wrap {
        height: 100%;
        padding: 2.3438vw;
        overflow-y: auto;

        .bill-list {
          padding: 1.5625vw 0;
          border-bottom: solid .0781vw #dfdfdf;

          &:first-child {
            padding-top: 0;
          }
        }
      }

      .bill-sum {
        padding: 2.3438vw 0;
        margin: 0 2.3438vw;
        border-top: .0781vw solid #dfdfdf;
      }
    }

    .bill-right-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 29.6875vw;
      height: 52.2656vw;
      margin-left: 2.3438vw;
      background-color: #fff;
      border: solid .0781vw #707070;
      border-radius: 1.5625vw;

      .dutch-pay {
        width: 90%;
        height: 17.1875vw;

        &:deep(.staff-item-count-layout) {
          padding: 5.4688vw 0;
          border-top: .0781vw solid #dfdfdf;
        }

        &:deep(.staff-item-count-title) {
          justify-content: center;
          font-size: 2.3438vw;
          font-style: normal;
          font-weight: bold;
          font-stretch: normal;
          line-height: normal;
          color: #131313;
          text-align: left;
          letter-spacing: -0.1172vw;
        }

        &:deep(.staff-item-count-grid) {
          width: 24.3125vw;
        }

        &:deep(img) {
          margin-top: 0.5469vw;
        }

        &:deep(.staff-item-count-count) {
          font-size: 4.0625vw;
          font-style: normal;
          font-weight: bold;
          font-stretch: normal;
          line-height: 0.81;
          color: #000;
          text-align: center;
          letter-spacing: -0.2031vw;
        }

        &:deep(.staff-item-remove) {
          display: none;
        }
      }

      .dutch-price {
        margin-top: 2.3438vw;
      }
    }
  }
}
</style>
