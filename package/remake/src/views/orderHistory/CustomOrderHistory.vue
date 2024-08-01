<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { getFullTime } from '@utils/timeUtils';
import { pushPage } from '@utils/route.helper';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { removeNewLine } from '@torder/common/utils';
import {
  orderInfoOptionType,
  orderInfoType,
} from '@torder/common/interface/orderList';
import { useModalTimer } from '@torder/common';
import useOrderListStore from '@store/storeOrderList';
import useInitStore from '@store/storeInit';
import { home } from '@router/routePaths';

const { t } = useI18n();

const { categoryBackgroundColor, getServiceList } = storeToRefs(useInitStore());

const { orderList } = useOrderListStore();

// 타이머
const { time, timer, resetTimer } = useModalTimer(10);

const timerId = timer();

watchEffect(() => {
  const isZero = time.value === 0;

  if (isZero) {
    clearInterval(timerId);

    pushPage(home);
  }
});

const ordersMap: Map<number, orderInfoType[]> = new Map();
const orderInfoList: orderInfoType[] = orderList.order_info;

/**
 * 주문한 모든 상품이 배열로 넘어와서
 * 같이 주문한 상품끼리 묶기 위한 로직
 */
orderInfoList?.reverse()?.forEach((order) => {
  if (order.cart_show === 1) return;
  const hasValue = ordersMap.get(order.order_time);

  if (ordersMap.has(order.order_time) && hasValue) {
    ordersMap.set(order.order_time, [...hasValue, order]);
  } else {
    ordersMap.set(order.order_time, [order]);
  }
});

const orderHistory = Array.from(ordersMap);

const orderTotalOrderPrice: number = orderList.bills?.totalCreditPrice || 0;

const closeModal = () => {
  pushPage(home);
};

const getMenuQuantity = (item: orderInfoType) => (item ? item.order_qty : 0);

/**
 * 어드민 주문서 표기 안함 사용시 주문내역에 미노출
 * @param order
 */
const getOrderList = (order: orderInfoType[]) => {
  if (!order) return [];
  return order.filter((item) => item.cart_show !== 1);
};

/**
 * 어드민 주문서 표기 안함 사용시 주문내역에 미노출
 * @param item
 */
const getOptionsList = (item: orderInfoType) => {
  if (!item) return [];
  return item.option?.filter((option) => option.cart_show !== 1);
};

const isHaveOptionList = (item: orderInfoType) => item.option?.length > 0;

/**
 * 서버 <-> 포스 sync 명목으로 상품 갯수, 옵션 갯수가 n번 곱해져서 데이터를 받음
 * 따라서 상품 주문 갯수 /옵션 주문 갯수
 */
const getOptionQuantity = (
  item: orderInfoType,
  option: orderInfoOptionType,
) => {
  const optionQty = option ? option.order_qty : 0;

  if (item.order_qty) return optionQty / item.order_qty;
  return optionQty;
};

/**
 * 총 주문한 상품 수량
 */
const getTotalQuantity = () => {
  if (!orderInfoList) return 0;
  return orderInfoList.reduce((acc, cur) => acc + cur.order_qty, 0);
};

/**
 * 직원 호출 상품인지 일반 상품인지 구분하는 로직
 * @param orderList
 */
const isServiceItem = (orderList: orderInfoType[]) => {
  const isHaveItem = (targetCode: string) =>
    orderList.some((order) => order.good_code === targetCode);
  const isStaffCallItem = getServiceList.value?.childCategoryList?.some(
    (service) => isHaveItem(service.productCode),
  );

  return isStaffCallItem ? t('직원 호출') : t('주문');
};

const getTotalPrice = (item: orderInfoOptionType) =>
  checkStandardPriceUnit(
    (Number(item.good_price) * Number(item.order_qty)).toLocaleString(),
  );

/**
 * N차 옵션 노출 텍스트 구하는 로직
 * @param secondOption
 */
const getOptionItemText = (
  secondOption: orderInfoOptionType,
  option: orderInfoOptionType,
) => {
  const translatedSecondOption = translateLanguage(
    secondOption.langs,
    secondOption.display_name,
  );

  let defaultItemText = `- ${translatedSecondOption} (+${getTotalPrice(secondOption)}) x${secondOption.order_qty / option.order_qty}`;
  if (secondOption.option && secondOption.option?.length > 0) {
    secondOption.option.forEach((thirdOption) => {
      const translatedThirdOption = translateLanguage(
        thirdOption.langs,
        thirdOption.display_name,
      );
      defaultItemText += ` / ${translatedThirdOption} (+${getTotalPrice(thirdOption)}) x${thirdOption.order_qty / secondOption.order_qty}`;
    });
  }

  return defaultItemText;
};

/**
 * N차 옵션 총 가격 구하는 로직
 * @param option
 */
const getSetOptionTotalPrice = (option: orderInfoOptionType) => {
  const defaultOptionPrice =
    Number(option.good_price) * Number(option.order_qty);

  if (option.option && option.option.length > 0) {
    const secondOptionTotalPrice = option.option.reduce(
      (secondPrice, secondOption) => {
        const secondOptionPrice =
          Number(secondOption.good_price) * Number(secondOption.order_qty);

        if (secondOption.option && secondOption.option.length > 0) {
          const thirdOptionTotalPrice = secondOption.option.reduce(
            (thirdPrice, thirdOption) => {
              const thirdOptionPrice =
                Number(thirdOption.good_price) * Number(thirdOption.order_qty);

              return thirdPrice + thirdOptionPrice;
            },
            0,
          );

          return secondOptionPrice + thirdOptionTotalPrice;
        }

        return secondPrice + secondOptionPrice;
      },
      0,
    );

    return defaultOptionPrice + secondOptionTotalPrice;
  }
  return defaultOptionPrice;
};

/**
 * 2댑스 옵션 총 가격 구하는 로직 (N차 옵션을 사용하지 않는 일반 옵션 상품)
 * @param item
 */
const getBasicOptionTotalPrice = (item: orderInfoOptionType) => {
  const basicProductPrice = Number(item.good_price) * Number(item.order_qty);
  if (item.option && item.option.length > 0) {
    const productOptionPrice = item.option.reduce(
      (totalPrice, option) => totalPrice + getSetOptionTotalPrice(option),
      0,
    );

    return basicProductPrice + productOptionPrice;
  }
  return basicProductPrice;
};

/**
 * 상품의 총 가격 구하는 로직 (N차 옵션 포함)
 * @param item
 */
const getProductTotalPrice = (item: orderInfoType) => {
  const basicProductPrice = Number(item.good_price) * Number(item.order_qty);
  if (item.option && item.option.length > 0) {
    const productOptionPrice = item.option.reduce(
      (totalPrice, option) => totalPrice + getBasicOptionTotalPrice(option),
      0,
    );

    return basicProductPrice + productOptionPrice;
  }
  return basicProductPrice;
};

/**
 * 상품 리스트 사이에 divider 를 추가하는데, 마지막에는 미노출 시키기 위한 마지막 인덱스 확인 로직
 * @param product
 * @param index
 */
const getIsLastIndex = (
  product: [number, orderInfoType[]][] | orderInfoType[],
  index: number,
) => product.length - 1 !== index;

const isBasicOptionItem = (item: orderInfoType) => {
  const firstOptionList = item.option;

  if (firstOptionList && firstOptionList.length > 0) {
    return firstOptionList?.some(
      (secondOption) => secondOption.option && secondOption.option.length > 0,
    );
  }

  return firstOptionList;
};

const getProductOrderTime = (time: number) => {
  const modifiedTimeStamp = new Date(time * 1000);
  return getFullTime(modifiedTimeStamp);
};

// v-for 방어 코드
const getOrderHistoryKey = (key: number) => key || `orderHistory-${key}`;
const getOrdersKey = (order: orderInfoType, index: number) =>
  order ? `${order.good_code}-${index}` : `order-${index}`;
const getOptionKey = (option: orderInfoOptionType, index: number) =>
  option ? `${option.good_code}-${index}` : `option-${index}`;
const getSecondOptionKey = (option: orderInfoOptionType, index: number) =>
  option ? `second-${option.good_code}-${index}` : `second-option-${index}`;
const getBasicOptionKey = (option: orderInfoOptionType, index: number) =>
  option ? `basic-${option.good_code}-${index}` : `basic-option-${index}`;

onMounted(() => {
  const scrollElement = document.querySelector(
    '.custom-order-history-body',
  ) as HTMLElement;

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

<template>
  <div class="custom-order-history-container">
    <div class="custom-order-history-wrap">
      <div class="custom-order-history-header">
        <span class="custom-order-history-header-title">
          {{ t('주문내역') }}
        </span>
        <div class="custom-order-history-header-text">
          <div class="custom-order-history-header-close-time">
            {{ `${t('n초 후에 닫힙니다.', { time })}` }}
          </div>
          <img
            class="custom-order-history-header-close-button"
            src="https://static.torder.co.kr/torder2/btn_small_black_close.svg"
            alt="닫기 아이콘"
            @click="closeModal"
          />
        </div>
      </div>
      <div class="custom-order-history-body">
        <div
          v-for="([orderTime, orders], orderHistoryIndex) in orderHistory"
          :key="getOrderHistoryKey(orderTime)"
        >
          <div class="custom-order-history-body-item">
            <div class="custom-order-history-body-item-header">
              <div class="custom-order-history-body-item-header-title">
                {{ isServiceItem(orders) }}
              </div>
              <div class="custom-order-history-body-item-header-divider">•</div>
              <div class="custom-order-history-body-item-header-time">
                {{ getProductOrderTime(orderTime) }}
              </div>
            </div>
            <div class="custom-order-history-body-item-body">
              <div
                v-for="(order, ordersIndex) in getOrderList(orders)"
                :key="getOrdersKey(order, ordersIndex)"
              >
                <div class="history-item-body-top-wrap">
                  <div class="history-item-body-header-name ellipsis-text-1">
                    {{
                      removeNewLine(
                        translateLanguage(order.trans, order.display_name),
                      )
                    }}
                  </div>
                  <div class="history-item-body-header-quantity">
                    {{ getMenuQuantity(order) + t('개') }}
                  </div>
                  <div class="history-item-body-header-total">
                    {{
                      checkStandardPriceUnit(
                        getProductTotalPrice(order)?.toLocaleString(),
                      )
                    }}
                  </div>
                </div>
                <!--옵션이 있는 경우-->
                <div
                  v-if="isHaveOptionList(order)"
                  class="history-item-body-middle-wrap"
                >
                  <!--N차 옵션을 사용하는 경우-->
                  <div
                    v-if="isBasicOptionItem(order)"
                    class="history-item-body-middle-option-item"
                  >
                    <div
                      v-for="(option, optionListIndex) in getOptionsList(order)"
                      :key="getOptionKey(option, optionListIndex)"
                    >
                      <div class="history-item-body-middle-option-wrap">
                        <div class="history-item-body-middle-option-left-wrap">
                          <div
                            class="history-item-body-middle-option-left-name
                              ellipsis-text-1"
                          >
                            {{
                              removeNewLine(
                                translateLanguage(
                                  option.langs,
                                  option.display_name,
                                ),
                              )
                            }}
                          </div>
                          <div
                            class="history-item-body-middle-option-left-price"
                          >
                            {{ t('기본') }} :
                            {{
                              checkStandardPriceUnit(
                                option.good_price?.toLocaleString(),
                              )
                            }}
                          </div>
                          <div
                            v-for="(secondOption, optionIndex) in option.option"
                            :key="getSecondOptionKey(secondOption, optionIndex)"
                            class="history-item-body-middle-option-left-list"
                          >
                            <div
                              class="history-item-body-middle-option-left-list-item"
                            >
                              {{ getOptionItemText(secondOption, option) }}
                            </div>
                          </div>
                        </div>
                        <div class="history-item-body-middle-option-right-wrap">
                          <div
                            class="history-item-body-middle-option-right-quantity"
                          >
                            {{ getOptionQuantity(order, option) + t('개') }}
                          </div>
                          <div
                            class="history-item-body-middle-option-right-price"
                          >
                            {{
                              checkStandardPriceUnit(
                                getBasicOptionTotalPrice(
                                  option,
                                )?.toLocaleString(),
                              )
                            }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--기본 옵션을 사용하는 경우-->
                  <div
                    v-else
                    class="history-item-body-middle-basic-option-wrap"
                  >
                    <div class="history-item-body-middle-basic-option-price">
                      {{ t('기본') }} :
                      {{
                        checkStandardPriceUnit(
                          order.good_price?.toLocaleString(),
                        )
                      }}
                    </div>
                    <div
                      v-for="(basicOption, basicOptionIndex) in order.option"
                      :key="getBasicOptionKey(basicOption, basicOptionIndex)"
                      class="history-item-body-middle-basic-option-option"
                    >
                      <div
                        class="history-item-body-middle-basic-option-option-name"
                      >
                        - {{ basicOption.display_name }} (+{{
                          checkStandardPriceUnit(
                            basicOption.good_price?.toLocaleString(),
                          )
                        }}) x{{ basicOption.order_qty }}
                      </div>
                    </div>
                  </div>
                </div>
                <!--옵션이 없는 경우-->
                <div
                  v-else
                  class="history-item-body-middle-basic-price"
                >
                  {{ t('기본') }} :
                  {{
                    checkStandardPriceUnit(order.good_price?.toLocaleString())
                  }}
                </div>
                <div
                  v-if="getIsLastIndex(orders, ordersIndex)"
                  class="custom-order-history-list-divider"
                ></div>
              </div>
            </div>
          </div>
          <div
            v-if="getIsLastIndex(orderHistory, orderHistoryIndex)"
            class="custom-order-history-divider"
          ></div>
        </div>
      </div>

      <div class="custom-order-history-footer">
        <div class="custom-order-history-footer-left">
          <div class="custom-order-history-footer-left-title">
            {{ t('주문합계') }}
          </div>
          <div class="custom-order-history-footer-left-desc">
            <img
              src="https://static.torder.co.kr/torder2/icn_warning.svg"
              class="custom-order-history-footer-left-desc-icon"
              alt="주의 아이콘"
            />
            {{ t('주문내역은 포스 주문 정보와 다를 수 있습니다.') }}
          </div>
        </div>
        <div class="custom-order-history-footer-right">
          <div class="custom-order-history-footer-right-quantity">
            {{ `${getTotalQuantity()} ${t('개')}` }}
          </div>
          <div class="custom-order-history-footer-right-price">
            {{ checkStandardPriceUnit(orderTotalOrderPrice?.toLocaleString()) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-order-history-container {
  position: absolute;
  right: 0;
  left: 0;
  z-index: 21;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(#2f2a26, 0.8);

  .custom-order-history-wrap {
    display: flex;
    flex-direction: column;
    font-family: Pretendard, sans-serif;
    background-color: #f8f8f8;
    border-radius: 1.5625vw;

    .custom-order-history-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5625vw;

      .custom-order-history-header-title {
        font-size: 2.3438vw;
        font-weight: 700;
        line-height: 3.125vw;
        color: #313131;
        letter-spacing: -0.0469vw;
      }

      .custom-order-history-header-text {
        display: flex;
        gap: 0.7813vw;
        align-items: center;

        .custom-order-history-header-close-time {
          display: flex;
          font-size: 1.875vw;
          font-weight: 400;
          line-height: 2.3438vw;
          color: #313131;
          letter-spacing: -0.0562vw;

          span {
            margin-right: 0.3906vw;
            font-size: 1.875vw;
            font-weight: 700;
            line-height: 2.3438vw;
            color: #d63333;
            letter-spacing: -0.0562vw;
          }
        }

        .custom-order-history-header-close-button {
          width: 3.125vw;
          height: 3.125vw;

          &.button-active {
            background-color: #ebebeb;
            border-radius: 0.625vw;
          }
        }
      }
    }

    .custom-order-history-body {
      display: flex;
      flex-direction: column;
      width: 70.3125vw;
      height: 44.375vw;
      padding: 1.25vw 0;
      overflow-y: scroll;

      .custom-order-history-body-item {
        display: flex;
        flex-direction: column;
        gap: 0.78125vw;
        padding: 0 1.5625vw;

        .custom-order-history-body-item-header {
          display: flex;
          gap: 0.3906vw;
          font-size: 1.875vw;
          font-weight: 700;
          line-height: 2.34375vw;
          letter-spacing: -0.05625vw;

          .custom-order-history-body-item-header-title {
            color: #7a7a7a;
          }

          .custom-order-history-body-item-header-divider {
            color: #ebebeb;
          }

          .custom-order-history-body-item-header-time {
            color: #e30000;
          }
        }

        .custom-order-history-body-item-body {
          display: flex;
          flex-direction: column;
          padding: 1.875vw;
          background-color: #fff;
          border: 0.078125vw solid #d5d5d5;
          border-radius: 1.25vw;

          .history-item-body-top-wrap {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 700;
            color: #313131;
            letter-spacing: -0.0375vw;

            .history-item-body-header-name {
              width: 45.15625vw;
              font-size: 2.1875vw;
              line-height: 2.5vw;
            }

            .history-item-body-header-quantity {
              margin: 0 1.09375vw 0 1.5625vw;
              font-size: 1.875vw;
              line-height: normal;
            }

            .history-item-body-header-total {
              flex: 1;
              font-size: 1.875vw;
              line-height: normal;
              text-align: right;
            }
          }

          .history-item-body-middle-basic-price {
            margin-top: 1.25vw;
            font-size: 1.5625vw;
            font-weight: 400;
            line-height: 1.875vw;
            color: #246ff4;
            letter-spacing: -0.03125vw;
            opacity: 0.8;
          }

          .history-item-body-middle-wrap {
            display: flex;
            flex-direction: column;
            padding: 1.25vw;
            margin-top: 1.25vw;
            background-color: #f8f8f8;
            border: 0.078125vw solid #ebebeb;
            border-radius: 0.78125vw;

            .history-item-body-middle-option-item {
              display: flex;
              flex-direction: column;
              gap: 1.25vw;

              .history-item-body-middle-option-wrap {
                display: flex;
                gap: 3.125vw;
                justify-content: space-between;

                .history-item-body-middle-option-left-wrap {
                  display: flex;
                  flex-direction: column;
                  gap: 0.3125vw;
                  width: 42.8125vw;

                  .history-item-body-middle-option-left-name {
                    font-size: 1.875vw;
                    font-weight: 600;
                    line-height: 1.875vw;
                    color: #5b5b5b;
                    letter-spacing: -0.0375vw;
                  }

                  .history-item-body-middle-option-left-price {
                    font-size: 1.5625vw;
                    font-weight: 400;
                    line-height: 1.875vw;
                    color: #246ff4;
                    letter-spacing: -0.03125vw;
                    opacity: 0.8;
                  }

                  .history-item-body-middle-option-left-list {
                    display: flex;
                    flex-direction: column;

                    .history-item-body-middle-option-left-list-item {
                      font-size: 1.5625vw;
                      font-weight: 400;
                      line-height: 130%;
                      color: #246ff4;
                      letter-spacing: -0.03125vw;
                      opacity: 0.8;
                    }
                  }
                }

                .history-item-body-middle-option-right-wrap {
                  display: flex;
                  flex: 1;
                  gap: 0.78125vw;
                  align-items: flex-start;
                  justify-content: space-between;
                  font-size: 1.5625vw;
                  font-weight: 400;
                  line-height: 1.875vw;
                  color: #7a7a7a;
                  letter-spacing: -0.03125vw;

                  .history-item-body-middle-option-right-price {
                    flex: 1;
                    text-align: right;
                  }
                }
              }
            }

            .history-item-body-middle-basic-option-wrap {
              display: flex;
              flex-direction: column;
              gap: 0.3125vw;
              font-size: 1.5625vw;
              font-weight: 400;
              color: #246ff4;
              letter-spacing: -0.03125vw;
              opacity: 0.8;

              .history-item-body-middle-basic-option-price {
                line-height: 1.875vw;
              }

              .history-item-body-middle-basic-option-option {
                display: flex;
                flex-direction: column;

                .history-item-body-middle-basic-option-option-name {
                  line-height: 130%;
                }
              }
            }
          }
        }

        .custom-order-history-list-divider {
          width: 100%;
          height: 0.078125vw;
          margin: 1.5625vw 0;
          background-color: #ebebeb;
        }
      }

      .custom-order-history-divider {
        width: 100%;
        height: 1.25vw;
        margin: 2.5vw 0;
        background-color: #ebebeb;
        border-top: 0.078125vw solid #d5d5d5;
      }
    }

    .custom-order-history-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.875vw 1.5625vw;
      background-color: v-bind(categoryBackgroundColor);
      border-radius: 0 0 1.4063vw 1.4063vw;

      .custom-order-history-footer-left {
        display: flex;
        flex-direction: column;
        gap: 0.78125vw;

        .custom-order-history-footer-left-title {
          font-size: 2.5vw;
          font-weight: 700;
          line-height: 3.125vw;
          color: #fff;
          letter-spacing: -0.05vw;
        }

        .custom-order-history-footer-left-desc {
          display: flex;
          gap: 0.3125vw;
          align-items: center;
          font-size: 1.5625vw;
          font-weight: 400;
          line-height: 1.875vw;
          color: #fff;
          letter-spacing: -0.046875vw;

          .custom-order-history-footer-left-desc-icon {
            width: 1.875vw;
            height: 1.875vw;
          }
        }
      }

      .custom-order-history-footer-right {
        display: flex;
        gap: 7.8125vw;
        align-items: center;
        color: #fff;

        .custom-order-history-footer-right-quantity {
          font-size: 2.1875vw;
          font-weight: 600;
          line-height: 2.5vw;
          letter-spacing: -0.0438vw;
        }

        .custom-order-history-footer-right-price {
          font-size: 2.5vw;
          font-weight: 700;
          line-height: 3.125vw;
          letter-spacing: -0.05vw;
        }
      }
    }
  }
}
</style>
