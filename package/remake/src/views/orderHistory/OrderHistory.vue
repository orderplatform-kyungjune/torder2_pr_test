<template>
  <div
    v-if="!isRestaurantVertical"
    class="history-order-container"
    :class="{ restaurant: isThemeRestaurant }"
  >
    <RestaurantLayoutStoreInfo
      v-if="isRestaurantTheme"
      :tableName="getInitTableName()"
    />
    <ViewOrderHead
      class="order-header"
      :title="t('주문내역')"
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
    <div class="history-order-body">
      <div class="history-order-list-wrap">
        <div class="history-column-wrap">
          <template
            v-for="([key, orders], index) in orderHistory"
            :key="key"
          >
            <div class="history-order-list">
              <div class="order-list-wrap">
                <div
                  class="order-list-left-wrap"
                  :class="getLastOrderActive(index)"
                >
                  <div class="list-index">
                    <span>{{ setIndex(index) }}</span>
                  </div>
                  <span class="order-past">
                    {{ getLastOrderORPreviousOrderText(index) }}
                  </span>
                  <span class="order-time">
                    {{ getTime(new Date(key * 1000)) }}
                  </span>
                </div>
                <div class="order-list-right-wrap">
                  <template
                    v-for="order in orders"
                    :key="order.good_code"
                  >
                    <div
                      v-if="order.cart_show !== 1"
                      class="menu-list"
                    >
                      <div class="menu-title-wrap">
                        <span class="menu-title">
                          {{ removeNewLine(translateLanguage(order.trans, order.display_name)) }}
                        </span>
                        <span class="menu-quantity">
                          {{ getMenuQuantity(order) + t('개') }}
                        </span>
                      </div>
                      <div class="option-list-wrap">
                        <template
                          v-for="option in getOptionsList(order)"
                          :key="option.good_code"
                        >
                          <div
                            v-if="option.cart_show !== 1"
                            class="option-list"
                          >
                            <span>
                              + {{ removeNewLine(translateLanguage(option.langs, option.display_name)) }}
                            </span>
                            <span>
                              {{ getOptionQuantity(order, option) + t('개') }}
                            </span>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="order-total-wrap">
        <span class="total-text">
          {{ t('합계') }}
        </span>
        <span class="total-count">
          {{ getTotalCount(orderHistory) + t('개') }}
        </span>
      </div>
    </div>
  </div>
  <div
    v-else
    class="history-order-container"
    :class="[storeTheme.type, storeTheme.color]"
  >
    <div class="history-vertical-top">
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
      <span :class="storeTheme.color">{{ t('주문내역') }}</span>
    </div>
    <div class="history-order-list-wrap">
      <div class="history-column-wrap">
        <template
          v-for="([key, orders], index) in orderHistory"
          :key="key"
        >
          <RestaurantVerticalScreenOrderHistoryList
            v-if="!isOrdersAllNotShow(orders)"
            :orderIndex="index + 1"
            :histories="orders"
            :active="isLastOrder(index)"
            :orderTime="getTime(new Date(key * 1000))"
          />
        </template>
      </div>
    </div>
    <div
      class="history-vertical-bottom"
      :class="storeTheme.color"
    >
      <div class="total-order-wrap">
        <span class="total-text">{{ t('주문합계') }}</span>
        <div class="total-quantity">
          <span> {{ getTotalCount(orderHistory) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import {
  computed,
  onMounted,
  watchEffect,
} from 'vue';
import { storeToRefs } from 'pinia';
import { getTime } from '@utils/timeUtils';
import { goBackPage } from '@utils/route.helper';
import { translateLanguage } from '@utils/langTransfer';
import {
  getStoreName,
  getInitTableName,
  removeNewLine,
} from '@torder/common/utils';
import {
  orderInfoOptionType,
  orderInfoType,
} from '@torder/common/interface/orderList';
import {
  ACTIVE,
  RESTAURANT_HORIZONTAL,
  RESTAURANT_HORIZONTAL_CARD,
  RESTAURANT_VERTICAL,
  WHITE,
} from '@torder/common/constant';
import { useModalTimer } from '@torder/common/composables';
import useThemeStore from '@store/storeTheme';
import useOrderListStore from '@store/storeOrderList';
import useCartStore from '@store/storeCart';
import { RestaurantVerticalScreenOrderHistoryList } from '@containers';
import { useSecret } from '@composables/secret';
import {
  ViewOrderHead,
  RestaurantLayoutStoreInfo,
  BasicLayoutStoreTableInfo,
} from '@components';

const { t } = useI18n();

const ordersMap: Map<number, orderInfoType[]> = new Map();

const { isActiveCart } = storeToRefs(useCartStore());

const { onNextSecret } = useSecret();

const { orderList } = useOrderListStore();

const orderInfoList: orderInfoType[] = orderList.order_info;

orderInfoList.forEach((order) => {
  if (order.cart_show === 1) return;
  const hasValue = ordersMap.get(order.order_time);

  if (ordersMap.has(order.order_time) && hasValue) {
    ordersMap.set(order.order_time, [
      ...hasValue,
      order,
    ]);
  } else {
    ordersMap.set(order.order_time, [order]);
  }
});

const orderHistory = Array.from(ordersMap);

const themeStore = useThemeStore();

const theme = computed(() => (themeStore.theme));

const isRestaurantTheme = computed(() => theme.value?.type === RESTAURANT_HORIZONTAL || theme.value?.type === RESTAURANT_HORIZONTAL_CARD);

// 주문내역 미표기 관련
const isOrdersAllNotShow = (orders: orderInfoType[]) => orders.every((order) => order.cart_show === 1);

const getLastOrderActive = (index: number) => {
  const orderLength = orderHistory.filter(([
    _key,
    orders,
  ]) => !isOrdersAllNotShow(orders)).length;
  const defineOrderLength = orderLength - 1;
  const isLast = index === defineOrderLength;

  if (isLast) return ACTIVE;

  return '';
};

const getLastOrderORPreviousOrderText = (index: number) => {
  const orderLength = orderHistory.length;
  const defineOrderLength = orderLength - 1;
  const isLast = index === defineOrderLength;
  const lastOrderText = t('마지막 주문');
  const previousOrderText = t('이전 주문');

  if (isLast) return lastOrderText;

  return previousOrderText;
};

const setIndex = (index: number) => {
  const newIndex = index + 1;
  return newIndex;
};

const getMenuQuantity = (item: orderInfoType) => {
  if (!item) return 0;
  return item.order_qty;
};

const getOptionsList = (item: orderInfoType) => {
  if (!item) return [];
  return item.option;
};

const getOptionQuantity = (item: orderInfoType, option: orderInfoOptionType) => {
  const optionQty = option ? option.order_qty : 0;

  if (item.order_qty) return optionQty / item.order_qty;

  return optionQty;
};

const getTotalCount = (list: [number, orderInfoType[]][]) => {
  const getTotalQuantity = (cur: number, next: [number, orderInfoType[]
  ]) => {
    const nextValue = next[1].filter(((item) => item.cart_show !== 1));
    const infoSum = nextValue.reduce((before, after) => before + after.order_qty, 0);
    const total = cur + infoSum;

    return total;
  };

  const quantity = list.reduce(getTotalQuantity, 0);

  return quantity;
};

const { theme: storeTheme } = useThemeStore();

const isThemeRestaurant = computed(() => storeTheme.type.includes('restaurant'));

const isRestaurantVertical = computed(() => storeTheme.type === RESTAURANT_VERTICAL);

// 마지막 주문 active 반환 함수
const isLastOrder = (idx: number) => {
  const orderLength = orderHistory.filter(([
    _key,
    orders,
  ]) => !isOrdersAllNotShow(orders)).length;
  const isLast = idx + 1 === orderLength;

  return isLast;
};

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
  const scrollElement = document.querySelector('.history-order-list-wrap') as HTMLElement;

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
.history-order-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 25;
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
  &.restaurant-vertical {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    padding: 0;

    &.white {
      background-color: #fff;
    }

    &.black {
      background-color: #222222;
    }

    .history-vertical-top {
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
        font-size: 2.6563vw;
        font-weight: bold;
        color: #000;

        &.black {
          color: #fff;
        }
      }
    }

    .history-order-list-wrap {
      height: 100%;
      padding: 0 5vw;
      overflow-x: hidden;
      overflow-y: auto;

      .history-column-wrap {
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-end;
      }
    }

    .history-vertical-bottom {
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
        gap: 2.5vw;
        align-items: center;

        .total-text {
          font-family: 'Pretendard', sans-serif;
          font-size: 2.6563vw;
          font-weight: bold;
        }

        .total-quantity {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: .3906vw;
          color: #2f2a26;
          background-color: #fff;
          border-radius: .625vw;

          span {
            padding-top: .625vw;
            font-size: 2.1875vw;
            font-weight: bold;
          }
        }
      }
    }
  }

  .history-order-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 96.0938vw;
    height: 52.2656vw;
    padding: 2.2656vw 2.3438vw 1.5625vw;
    margin: 2.7156vw 0.3906vw 0 0;
    background-color: #fff;
    border: solid .0781vw #707070;
    border-radius: 1.5625vw;

    .history-order-list-wrap {
      overflow-x: hidden;
      overflow-y: auto;

      .history-column-wrap {
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-end;
      }
    }

    .history-order-list {
      border-bottom: .0781vw solid #dfdfdf;

      .order-list-wrap {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin: 1.5625vw 0;
      }

      .order-list-left-wrap {
        display: flex;

        .list-index {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3.125vw;
          height: 3.125vw;
          margin: 0 1.5625vw 0 0;
          color: #fff;
          background-color: #999;
          border-radius: .7813vw;

          span {
            margin-top: 0.2344vw;
            font-family: SpoqaHanSansNeo, sans-serif;
            font-size: 1.7188vw;
            font-style: normal;
            font-weight: bold;
            font-stretch: normal;
            line-height: normal;
          }
        }

        .order-past {
          width: 11.7188vw;
          height: 2.5781vw;
          margin: 0.3125vw 1.5625vw 0.2344vw 1.5625vw;
          font-family: Pretendard, sans-serif;
          font-size: 2.1875vw;
          font-style: normal;
          font-weight: bold;
          font-stretch: normal;
          line-height: normal;
          color: #999;
          text-align: left;
          letter-spacing: -0.0438vw;
        }

        .order-time {
          width: 13.7969vw;
          height: 2.4219vw;
          margin: 0.3906vw 0 0.3125vw 1.1719vw;
          font-family: Pretendard, sans-serif;
          font-size: 2.0313vw;
          font-style: normal;
          font-weight: 500;
          font-stretch: normal;
          line-height: 1.12;
          color: #999;
          text-align: right;
          letter-spacing: -0.0406vw;
        }

        &.active {
          .list-index {
            background-color: #F91515;
          }

          .order-past {
            color: #F91515;
          }

          .order-time {
            color: #F91515;
          }
        }
      }

      .order-list-right-wrap {
        display: flex;
        flex-direction: column;
        width: 52.3438vw;

        .menu-list {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-top: 1.5625vw;
          font-size: 1.875vw;
          font-style: normal;
          font-weight: bold;
          font-stretch: normal;
          line-height: 1.58;
          color: #2f2a26;
          letter-spacing: -0.0469vw;

          &:first-child {
            margin-top: 0;
          }

          .menu-title-wrap {
            display: flex;
            gap: .3906vw;
            justify-content: space-between;
            font-size: 1.875vw;

            .menu-title {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

        .option-list-wrap {
          margin-top: .7813vw;
          font-size: 1.875vw;

          .option-list {
            display: flex;
            justify-content: space-between;
            padding: .7813vw 0 .7813vw .7813vw;
            font-family: SpoqaHanSansNeo, sans-serif;
            font-size: 1.875vw;
            font-style: normal;
            font-weight: normal;
            font-stretch: normal;
            line-height: normal;
            color: #0080ff;
            text-align: left;
            letter-spacing: -0.0469vw;
            white-space: pre-line;
          }
        }
      }
    }

    .order-total-wrap {
      display: flex;
      justify-content: space-between;
      padding-top: 1.5625vw;
      color: #F91515;
      border-top: .0781vw solid #dfdfdf;

      .total-text {
        font-family: Pretendard, sans-serif;
        font-size: 1.875vw;
        font-style: normal;
        font-weight: 500;
        font-stretch: normal;
        line-height: 1.58;
        letter-spacing: -0.0469vw;
      }

      .total-count {
        font-size: 2.9688vw;
        font-style: normal;
        font-weight: 900;
        font-stretch: normal;
        line-height: normal;
        letter-spacing: -0.0742vw;
      }
    }
  }
}
</style>
