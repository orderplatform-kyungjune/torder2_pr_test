<!-- <template>
  <div class="order-history-container">
    <div class="order-history-header-wrap">
      <div class="order-history-header-timer">
        <span>
          {{ `${t('n초 후에 닫힙니다.', { time: time })}` }}
        </span>
      </div>
      <div
        class="order-history-header-close-button"
        @click="closeModal"
      >
        <span>
          {{ t('닫기') }}
        </span>
        <img
          class="close-button"
          src="https://static.torder.co.kr/torder2/svg_closebutton_normal_white.svg"
        >
      </div>
    </div>
    <div class="order-history-body-wrap">
      <div class="order-history-grid-wrap">
        <div class="order-history-body">
          <div class="order-head-title">
            {{ t('주문내역') }}
          </div>
          <div class="order-history-body-title">
            <div>
              {{ t('상품명') }}
            </div>
            <div class="product-quantity">
              {{ t('수량') }}
            </div>
            <div class="product-price">
              {{ t('상품 금액') }}
            </div>
            <div class="order-price">
              {{ t('주문 금액') }}
            </div>
          </div>

          <div class="order-history-list-body-wrap">
            <div class="order-history-list-body">
              <template
                v-for="([key, orders]) in orderHistory"
                :key="key"
              >
                <div class="order-history-list">
                  <div class="order-list-container">
                    <div class="order-list">
                      <template
                        v-for="order in orders"
                        :key="order.good_code"
                      >
                        <div
                          v-if="order.cart_show !== 1"
                          class="menu-list"
                        >
                          <div class="menu-item-container">
                            <span class="menu-name">
                              {{ removeNewLine(translateLanguage(order.trans, order.display_name)) }}
                            </span>
                            <span class="menu-quantity">
                              {{ getMenuQuantity(order) + t('개') }}
                            </span>
                            <span class="menu-product-price">
                              {{ checkStandardPriceUnit(Number(order.good_price)?.toLocaleString()) }}
                            </span>
                            <template v-if="getOptionsList(order)?.length === 0">
                              <span class="menu-order-price">
                                {{ checkStandardPriceUnit(getOptionTotalPrice(order)?.toLocaleString()) }}
                              </span>
                            </template>
                          </div>

                          <div class="option-list-container">
                            <template
                              v-for="option in getOptionsList(order)"
                              :key="option.good_code"
                            >
                              <div
                                v-if="option.cart_show !== 1"
                                class="option-list"
                              >
                                <span class="option-title">
                                  └ {{ removeNewLine(translateLanguage(option.langs, option.display_name)) }}
                                </span>
                                <span class="option-quantity">
                                  {{ getOptionQuantity(option) + t('개') }}
                                </span>
                                <span class="option-price">
                                  {{ checkStandardPriceUnit(getOptionPrice(option)?.toLocaleString()) }}
                                </span>
                                <span class="blank-option"/>
                              </div>
                              <div
                                v-for="subOption in getSubOptionsList(option)"
                                :key="subOption.good_code"
                                class="option-list"
                              >
                                <span class="option-title">
                                  {{ translateLanguage(subOption.langs, subOption.display_name) }}
                                </span>
                                <span class="option-quantity">
                                  {{ getOptionQuantity(subOption) + t('개') }}
                                </span>
                                <span class="option-price">
                                  {{ checkStandardPriceUnit(getOptionPrice(subOption)?.toLocaleString()) }}
                                </span>
                                <span class="blank-option"/>
                              </div>
                            </template>
                          </div>

                          <div
                            v-if="getOptionsList(order)?.length"
                            class="total-info-with-options"
                          >
                            <span class="blank-total"/>
                            <span class="total-menu-quantity">
                              {{ getMenuQuantity(order) + t('개') }}
                            </span>
                            <span class="total-menu-price-wrap">
                              <span class="text-with-options">
                                {{ t('옵션포함 상품금액') }}
                              </span>
                              <span class="total-menu-price">
                                {{ checkStandardPriceUnit(getSingleCommodityPriceWithOptionPrice(order)?.toLocaleString()) }}
                              </span>
                            </span>
                            <span class="total-order-price">
                              {{ checkStandardPriceUnit(getOptionTotalPrice(order)?.toLocaleString()) }}
                            </span>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <HyattBillTotalSum
          class="total-price"
          :sumTitle="t('합계')"
          :totalPrice="orderTotalOrderPrice?.toLocaleString()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import {
  onMounted,
  watchEffect,
} from 'vue';
import { goBackPage } from '@utils/route.helper';
import { translateLanguage } from '@utils/langTransfer';
import { removeNewLine } from '@torder/common/utils';
import {
  orderInfoOptionType,
  orderInfoType,
} from '@torder/common/interface/orderList';
import { useModalTimer } from '@torder/common';
import useOrderListStore from '@store/storeOrderList';
import useInitStore from '@store/storeInit';
import { HyattBillTotalSum } from '@components';

const { t } = useI18n();

const { checkStandardPriceUnit } = useInitStore();

const { orderList } = useOrderListStore();

const ordersMap: Map<number, orderInfoType[]> = new Map();
const orderInfoList: orderInfoType[] = orderList.order_info;

orderInfoList?.forEach((order) => {
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

    goBackPage();
  }
});

const orderHistory = Array.from(ordersMap);

const orderTotalOrderPrice: number = orderList.bills?.totalCreditPrice || 0;

const closeModal = () => {
  goBackPage();
};

const getMenuQuantity = (item: orderInfoType) => {
  if (!item) return 0;
  return item.order_qty;
};

const getOptionsList = (item: orderInfoType) => {
  if (!item) return [];
  return item.option;
};

const getSubOptionsList = (item: orderInfoOptionType) => {
  if (!item) return [];
  return item.option;
};

const getOptionQuantity = (item: orderInfoOptionType) => {
  if (!item) return 0;
  return item.order_qty;
};

const getOptionPrice = (item: orderInfoOptionType) => {
  if (!item) return 0;
  return item.good_price * item.order_qty;
};

const getSingleCommodityPriceWithOptionPrice = (item: orderInfoType) => {
  if (item.option.length) {
    let optionTotalPrice = 0;

    item.option?.forEach((optionItem) => {
      optionTotalPrice += optionItem.good_price * optionItem.order_qty;
    });

    return item.good_price + optionTotalPrice;
  }

  return item.good_price;
};

const getOptionTotalPrice = (item: orderInfoType) => Number(getSingleCommodityPriceWithOptionPrice(item)) * item.order_qty;

onMounted(() => {
  const scrollElement = document.querySelector('.order-history-container') as HTMLElement;

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
.order-history-container {
  position: absolute;
  right: 0;
  left: 0;
  z-index: 11;
  display: flex;
  flex-direction: column;
  gap: 0.7813vw;
  width: 100vw;
  height: 100vh;
  padding: 2.3438vw 1.9531vw 2.1094vw;
  background-color: rgba(#2f2a26, 0.8);

  .order-history-header-wrap {
    display: flex;
    gap: 6.25vw;

    .order-history-header-timer{
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Pretendard, sans-serif;
      font-size: 2.0313vw;
      font-style: normal;
      font-weight: normal;
      font-stretch: normal;
      line-height: normal;
      color: #fff;
      letter-spacing: -0.0508vw;

      span {
        font-size: 1.875vw;
        font-weight: bold;
        color: #fff;
      }
    }
    align-items: center;
    justify-content: end;
    height: 4.7156vw;

    .order-history-header-close-button {
      display: flex;
      align-items: center;

      span {
        display: flex;
        align-items: center;
        height: 3.5156vw;
        margin: 0 0.7813vw 0 0 ;
        font-size: 2.3438vw;
        font-style: normal;
        font-weight: bold;
        font-stretch: normal;
        line-height: normal;
        color: #fff;
        text-align: center;
        letter-spacing: normal;
      }
    }
  }

  .order-history-body-wrap {
    width: 96.0938vw;
    height: 53.2188vw;
    margin: 0 0.3906vw 0 0;
    background-color: #fff;
    border: solid .0781vw #707070;
    border-radius: 1.5625vw;

    .order-history-grid-wrap{
      display: grid;
      grid-template-rows: 80% 15%;
      align-content: space-between;
      align-items: center;
      height: 100%;
    }

    .order-history-body {
      height: 100%;
      padding: 2.2656vw 2.3438vw 0;

      .order-head-title {
        height: 3.9063vw;
        height: 3.5938vw;
        margin: .3906vw 0;
        font-family: "Noto Sans SC", sans-serif;
        font-size: 2.5vw;
        font-weight: bold;
        color: #000000;
      }

      .order-history-body-title {
        display: grid;
        grid-template-columns: 2.2fr 0.5fr 1.9fr 1fr;
        align-items: center;
        height: 5.8594vw;
        padding: 0.7813vw 0.7813vw 0.7813vw 0;
        font-family: "Noto Sans SC", sans-serif;
        font-size: 1.7188vw;
        font-weight: 500;
        line-height: 1.73;
        color: #2f2a26;
        border-top: .0781vw solid #dfdfdf;
        border-bottom: .0781vw solid #dfdfdf;

        .product-quantity {
          display: flex;
          justify-content: flex-end;
        }

        .product-price {
          display: flex;
          justify-content: flex-end;
        }

        .order-price {
          display: flex;
          justify-content: flex-end;
        }
      }

      .order-history-list-body-wrap {
        height: calc(100% - 8.2031vw);
        overflow-y: auto;

        .order-history-list-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          height: 100%;

          .order-history-list {
            width: 100%;
            margin: -0.3125vw;
            border-bottom: .0781vw solid #dfdfdf;

            .order-list-container {
              display: flex;
              margin: 1.5625vw 0 .7813vw;

              .order-list {
                display: flex;
                flex-direction: column;
                width: 100%;

                .menu-list {
                  display: flex;
                  flex-direction: column;
                  margin-top: 1.1719vw;
                  font-family: "Noto Sans SC", sans-serif;
                  font-size: 1.875vw;
                  font-weight: bold;
                  line-height: 1.58;
                  color: #000;
                  letter-spacing: -0.0469vw;

                  &:first-child {
                    margin-top: 0;
                  }

                  .menu-item-container {
                    display: grid;
                    grid-template-columns: 2.25fr 0.45fr 1.95fr 1fr;
                    padding: 0 0.7813vw 0 0;

                    .menu-name {
                      overflow: hidden;
                      text-overflow: ellipsis;
                      word-break: break-word;
                      white-space: nowrap;
                    }

                    .menu-quantity {
                      display: flex;
                      justify-content: flex-end;
                    }

                    .menu-product-price {
                      display: flex;
                      justify-content: flex-end;
                    }

                    .menu-order-price {
                      display: flex;
                      justify-content: flex-end;
                    }
                  }

                  .total-info-with-options {
                    display: grid;
                    grid-template-columns: 2.2fr 0.45fr 1.9fr 1fr;
                    align-items: center;
                    padding: 0.7813vw 0.7813vw 0 0;

                    .total-menu-quantity {
                      display: flex;
                      justify-content: flex-end;
                    }

                    .total-menu-price-wrap {
                      display: flex;
                      align-items: center;
                      justify-content: flex-end;
                      font-size: 1.4844vw;

                      .text-with-options {
                        display: flex;
                        justify-content: flex-end;
                        margin-left: 1.5625vw;
                      }
                    }

                    .total-menu-price {
                      display: flex;
                      justify-content: flex-end;
                      width: 50%;
                      font-size: 1.875vw;
                    }

                    .total-order-price {
                      display: flex;
                      justify-content: flex-end;
                    }
                  }
                }

                .option-list-container {
                  margin-top: .7813vw;
                  font-size: 1.875vw;

                  .option-list {
                    display: grid;
                    grid-template-columns: 2.2fr 0.4fr 1.9fr 1fr;
                    padding: .3125vw;
                    font-family: "Noto Sans SC", sans-serif;
                    font-size: 1.875vw;
                    font-weight: normal;
                    color: #818181;
                    text-align: left;
                    letter-spacing: -0.0469vw;

                    .option-title{
                      word-break: break-word;
                      white-space: pre-line;
                    }

                    .sub-option-list{
                      display: grid;
                      grid-template-columns: 2.2fr 0.4fr 1.9fr 1fr;
                    }
                  }

                  .option-quantity {
                    display: flex;
                    justify-content: flex-end;
                  }

                  .option-price {
                    display: flex;
                    justify-content: flex-end;
                  }

                  .blank-option {
                    width: 100%;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style> -->
