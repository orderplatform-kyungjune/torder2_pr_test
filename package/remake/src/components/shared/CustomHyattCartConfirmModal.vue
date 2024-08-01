<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import {
  cartProductType,
  convertedCartProductType,
} from '@torder/common/interface/cartProduct';
import {
  productOptionItemType,
  productOptionType,
  getSubPrimaryColor,
  removeNewLine,
} from '@torder/common';
import useInitStore from '@store/storeInit';

const {
  getProductsTotalPrice,
  selectedProductInCartProducts,
  order,
  getPriceItem,
  getTotalPriceItem,
} = defineProps<{
  getProductsTotalPrice: number;
  getProductsQuantityText: string;
  orderCartConfirm: () => void;
  closeCartConfirmModal: () => void;
  confirmOrderButtonText: string;
  order: (e: Event, isConfirmOrder?: boolean) => void;
  t: (str: string) => string;
  isEnglish: boolean;
  getCartTotalQuantity: number;
  selectedProductInCartProducts: convertedCartProductType[];
  getPriceItem: (item: cartProductType) => number;
  getTotalPriceItem: (item: cartProductType) => number;
}>();
const { buttonBackgroundColor, buttonFontColor } = storeToRefs(useInitStore());

const getActiveButtonColor = (color: string) =>
  getSubPrimaryColor(color, 10, 'Y');
const getActiveCloseButtonColor = () => getActiveButtonColor('#818181');

const filterCheckedOption = (items: productOptionItemType[]) =>
  items.filter((item) => item.checked && item.code !== 'not_select');

const getProductKey = (item: convertedCartProductType, index: number) =>
  item ? `${item.id}-${index}` : `item-${index}`;
const getOptionKey = (option: productOptionType, index: number) =>
  option ? `${option.name}-${index}` : `option-${index}`;
const getItemKey = (item: productOptionItemType, index: number) =>
  item ? `${item.code}-${index}` : `item-${index}`;

const isHaveOptionList = (item: convertedCartProductType) =>
  item.options && item.options?.length > 0;
</script>

<template>
  <div class="custom-cart-confirm-container">
    <div class="custom-cart-confirm-wrap">
      <div class="custom-cart-confirm-header">
        <span>
          {{ t('주문 전 상품 및 수량을 확인해주세요.') }}
        </span>
      </div>
      <div class="custom-cart-confirm-body">
        <div class="custom-cart-confirm-product-container">
          <div
            v-for="(product, productIndex) in selectedProductInCartProducts"
            :key="getProductKey(product, productIndex)"
            class="custom-cart-confirm-product-wrap"
          >
            <div class="custom-confirm-depth-option-header">
              <div
                class="custom-confirm-depth-option-header-title ellipsis-text-1"
              >
                {{
                  removeNewLine(
                    translateLanguage(
                      product.productLanguage,
                      product.productLanguage?.ko,
                    ),
                  )
                }}
              </div>
              <div class="custom-confirm-depth-option-header-count">
                {{ `${product.quantity}${t('개')}` }}
              </div>
              <div class="custom-confirm-depth-option-header-price">
                {{
                  checkStandardPriceUnit(
                    getTotalPriceItem(product)?.toLocaleString(),
                  )
                }}
              </div>
            </div>
            <!--옵션이 있는 경우-->
            <div
              v-if="isHaveOptionList(product)"
              class="custom-confirm-depth-option-container"
            >
              <!--N차 옵션을 사용하는 경우-->
              <div v-if="product.isDepthMenu">
                <div
                  v-for="(level3, index3) in product.options"
                  :key="index3"
                >
                  <div
                    v-for="(level4, index4) in level3.items"
                    :key="index4"
                  >
                    <div
                      v-if="level4.checked && level4.code !== 'not_select'"
                      class="custom-confirm-depth-option-wrap"
                    >
                      <div class="custom-confirm-depth-option-left-container">
                        <div
                          class="custom-confirm-depth-option-left-basic-name
                            ellipsis-text-1"
                        >
                          {{ translateLanguage(level4.nameArray, level4.name) }}
                        </div>
                        <div
                          class="custom-confirm-depth-option-left-basic-price"
                        >
                          {{
                            `${t('기본')} : ${checkStandardPriceUnit(level4.price?.toLocaleString())}`
                          }}
                        </div>
                        <div
                          class="custom-confirm-depth-option-left-option-list"
                        >
                          <span
                            v-for="(level5, index5) in level4.items"
                            :key="index5"
                          >
                            <div
                              v-for="(level6, index6) in level5.items"
                              :key="index6"
                              class="option-list-wrap"
                            >
                              <span
                                v-if="
                                  level6.checked && level6.name !== '선택안함'
                                "
                              >
                                -
                                {{
                                  translateLanguage(
                                    level6.nameArray,
                                    level6.name,
                                  )
                                }}
                                {{
                                  `(+${checkStandardPriceUnit(level6.price.toLocaleString())})`
                                }}
                                x{{ level6.quantity }}
                                <span
                                  v-for="(level7, index7) in level6.items"
                                  :key="index7"
                                >
                                  <span
                                    v-for="(level8, index8) in level7.items"
                                    :key="index8"
                                  >
                                    <span
                                      v-if="
                                        level8.checked &&
                                        level8.name !== '선택안함'
                                      "
                                    >
                                      /
                                      {{
                                        translateLanguage(
                                          level8.nameArray,
                                          level8.name,
                                        )
                                      }}
                                      {{
                                        `(+${checkStandardPriceUnit(level8.price.toLocaleString())})`
                                      }}
                                      x{{ level8.quantity }}
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </div>
                          </span>
                        </div>
                      </div>
                      <div class="custom-confirm-depth-option-right-container">
                        <div class="custom-confirm-depth-option-right-count">
                          {{ level4.quantity }}{{ t('개') }}
                        </div>
                        <div class="custom-confirm-depth-option-right-price">
                          {{
                            checkStandardPriceUnit(
                              getPriceItem(level4).toLocaleString(),
                            )
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--일반 옵션을 사용하는 경우-->
              <div
                v-else
                class="custom-confirm-basic-option-wrap"
              >
                <div class="custom-confirm-basic-option-product-price">
                  {{
                    `${t('기본')} : ${checkStandardPriceUnit(product.price?.toLocaleString())}`
                  }}
                </div>
                <div class="custom-confirm-basic-option-price-wrap">
                  <div
                    v-for="(basicOption, basicOptionIndex) in product.options"
                    :key="basicOptionIndex"
                  >
                    <div
                      v-for="(basicItem, basicOptionIndex) in basicOption.items"
                      :key="basicOptionIndex"
                    >
                      <div
                        v-if="
                          basicItem.checked && basicItem.code !== 'not_select'
                        "
                        class="custom-confirm-basic-option-price-text"
                      >
                        -
                        {{
                          translateLanguage(basicItem.nameArray, basicItem.name)
                        }}
                        {{
                          `(+${checkStandardPriceUnit(basicItem.price?.toLocaleString())})`
                        }}
                        x {{ basicItem.quantity }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="custom-cart-confirm-basic-product"
            >
              {{
                `${t('기본')} : ${checkStandardPriceUnit(product.price?.toLocaleString())}`
              }}
            </div>
            <div
              v-if="selectedProductInCartProducts.length - 1 !== productIndex"
              class="custom-confirm-depth-product-divider"
            ></div>
          </div>
        </div>
      </div>
      <div class="custom-cart-confirm-footer">
        <div class="custom-cart-confirm-footer-info">
          <span class="custom-cart-confirm-total-text">
            {{ t('총 주문합계') }}
          </span>
          <div class="custom-cart-confirm-price-info">
            <span class="custom-cart-confirm-price-info-count">
              {{ `${getCartTotalQuantity}${t('개')}` }}
            </span>
            <span class="custom-cart-confirm-price-info-price">
              {{
                checkStandardPriceUnit(getProductsTotalPrice?.toLocaleString())
              }}
            </span>
          </div>
        </div>
        <div class="custom-cart-confirm-footer-button-wrap">
          <div class="custom-cart-confirm-footer-close-button">
            <span
              id="custom-cart-confirm-footer-close-sub-element"
              @click="closeCartConfirmModal"
            >
              {{ t('닫기') }}
            </span>
          </div>
          <div
            class="custom-cart-confirm-footer-order-button"
            @click="order"
          >
            <span id="custom-cart-confirm-footer-order-sub-element">
              {{ confirmOrderButtonText }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-cart-confirm-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);

  .custom-cart-confirm-wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 64.6875vw;
    font-family: 'Pretendard', sans-serif;
    background-color: #f8f8f8;
    border-radius: 1.25vw;

    .custom-cart-confirm-header {
      padding: 1.5625vw;
      font-size: 2.3438vw;
      font-weight: 700;
      line-height: 3.125vw;
      color: #313131;
      letter-spacing: -0.0469vw;
    }

    .custom-cart-confirm-body {
      display: flex;
      flex-direction: column;
      height: 39.0625vw;
      padding: 1.875vw;
      margin: 0 1.5625vw 1.25vw 1.5625vw;
      background-color: #fff;
      border: 0.078125vw solid #d5d5d5;
      border-radius: 1.25vw;

      .custom-cart-confirm-product-container {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;

        .custom-cart-confirm-product-wrap {
          display: flex;
          flex-direction: column;
          gap: 1.25vw;

          .custom-confirm-depth-option-header {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .custom-confirm-depth-option-header-title {
              flex: 1;
              font-size: 2.1875vw;
              font-weight: 700;
              line-height: 2.5vw;
              color: #313131;
              letter-spacing: -0.04375vw;
            }

            .custom-confirm-depth-option-header-count {
              width: 5.46875vw;
              margin-left: 1.5625vw;
              font-size: 1.875vw;
              font-weight: 700;
              line-height: normal;
              color: #313131;
              letter-spacing: -0.0375vw;
            }

            .custom-confirm-depth-option-header-price {
              width: 10.15625vw;
              margin-left: 1.09375vw;
              font-size: 1.875vw;
              font-weight: 700;
              line-height: normal;
              color: #313131;
              text-align: right;
              letter-spacing: -0.0375vw;
            }
          }

          .custom-confirm-depth-option-container {
            display: flex;
            flex-direction: column;
            gap: 1.25vw;
            padding: 1.25vw;
            background-color: #f8f8f8;
            border: 0.078125vw solid #ebebeb;
            border-radius: 0.78125vw;

            .custom-confirm-depth-option-wrap {
              display: flex;
              gap: 3.125vw;
              justify-content: space-between;
              margin-bottom: 1.25vw;

              .custom-confirm-depth-option-left-container {
                display: flex;
                flex: 1;
                flex-direction: column;
                gap: 0.3125vw;
                width: 100%;
                max-width: 33.8281vw;

                .custom-confirm-depth-option-left-basic-name {
                  max-width: 33.8281vw;
                  font-size: 1.875vw;
                  font-weight: 600;
                  line-height: 2.5vw;
                  color: #5b5b5b;
                  letter-spacing: -0.0375vw;
                }

                .custom-confirm-depth-option-left-basic-price {
                  font-size: 1.5625vw;
                  font-weight: 400;
                  line-height: 1.875vw;
                  color: #246ff4;
                  letter-spacing: -0.03125vw;
                }

                .custom-confirm-depth-option-left-option-list {
                  font-size: 1.5625vw;
                  font-weight: 400;
                  line-height: normal;
                  color: #246ff4;
                  letter-spacing: -0.0375vw;
                }
              }

              .custom-confirm-depth-option-right-container {
                display: flex;
                justify-content: space-between;
                width: 15vw;

                .custom-confirm-depth-option-right-count {
                  font-size: 1.5625vw;
                  font-weight: 400;
                  line-height: 1.875vw;
                  color: #7a7a7a;
                  letter-spacing: -0.03125vw;
                }

                .custom-confirm-depth-option-right-price {
                  font-size: 1.5625vw;
                  font-weight: 400;
                  line-height: 1.875vw;
                  color: #7a7a7a;
                  text-align: right;
                  letter-spacing: -0.03125vw;
                }
              }
            }

            .custom-confirm-basic-option-wrap {
              display: flex;
              flex-direction: column;
              gap: 0.3125vw;

              .custom-confirm-basic-option-product-price {
                font-size: 1.5625vw;
                font-weight: 400;
                line-height: 1.875vw;
                color: #246ff4;
                letter-spacing: -0.03125vw;
              }

              .custom-confirm-basic-option-price-wrap {
                display: flex;
                flex-direction: column;

                .custom-confirm-basic-option-price-text {
                  font-size: 1.5625vw;
                  font-weight: 400;
                  line-height: 130%;
                  color: #246ff4;
                  letter-spacing: -0.03125vw;
                }
              }
            }
          }

          .custom-confirm-depth-product-divider {
            width: 100%;
            height: 0.078125vw;
            margin: 1.5625vw 0;
            background-color: #ebebeb;
          }
        }
      }

      .custom-cart-confirm-basic-product {
        font-size: 1.5625vw;
        font-weight: 400;
        line-height: 1.875vw;
        color: #246ff4;
        letter-spacing: -0.03125vw;
      }
    }

    .custom-cart-confirm-footer {
      display: flex;
      flex-direction: column;
      gap: 1.25vw;
      padding: 1.5625vw;
      background-color: #fff;
      border-top: 0.0781vw solid #d5d5d5;
      border-bottom-right-radius: 1.25vw;
      border-bottom-left-radius: 1.25vw;
      box-shadow: 0 0.3125vw 2.5vw 0 rgba(0, 0, 0, 0.2);

      .custom-cart-confirm-footer-info {
        display: flex;
        justify-content: space-between;

        .custom-cart-confirm-total-text {
          font-size: 2.5vw;
          font-weight: 700;
          line-height: 3.125vw;
          color: #313131;
          letter-spacing: -0.05vw;
        }

        .custom-cart-confirm-price-info {
          display: flex;
          gap: 7.8125vw;
          align-items: center;
          justify-content: end;
          width: 36.1328vw;

          .custom-cart-confirm-price-info-count {
            font-size: 2.1875vw;
            font-weight: 600;
            line-height: 2.5vw;
            color: #313131;
            text-align: end;
            letter-spacing: -0.0438vw;
          }

          .custom-cart-confirm-price-info-price {
            font-size: 2.5vw;
            font-weight: 700;
            line-height: 3.125vw;
            color: #313131;
            letter-spacing: -0.05vw;
          }
        }
      }

      .custom-cart-confirm-footer-button-wrap {
        display: flex;
        gap: 0.7813vw;

        .custom-cart-confirm-footer-close-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 11.0938vw;
          padding: 1.25vw 1.5625vw;
          background-color: #818181;
          border-radius: 0.7813vw;

          &.button-active {
            background-color: v-bind(getActiveCloseButtonColor());
          }

          span {
            font-size: 1.875vw;
            font-weight: 700;
            line-height: 2.5vw;
            color: #fff;
            letter-spacing: -0.0375vw;
          }
        }

        .custom-cart-confirm-footer-order-button {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          padding: 1.25vw 1.5625vw;
          background-color: v-bind(buttonBackgroundColor);
          border-radius: 0.9375vw;

          &.button-active {
            background-color: v-bind(
              getActiveButtonColor(buttonBackgroundColor)
            );
          }

          span {
            font-size: 1.875vw;
            font-weight: 700;
            line-height: 2.5vw;
            color: v-bind(buttonFontColor);
            letter-spacing: -0.0375vw;
          }
        }
      }
    }
  }
}
</style>
