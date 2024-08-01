<template>
  <div class="basic-default-option-container">
    <div class="basic-default-option-header">
      <div class="basic-default-option-header-title ellipsis-text-1">
        {{
          removeNewLine(
            translateLanguage(
              targetProductInfo?.productLanguage,
              targetProductInfo?.name,
            ),
          )
        }}
      </div>
      <div
        class="basic-default-option-close-button"
        @click="pushPage(home)"
      >
        <img
          id="basic-default-option-close-icon-sub-element"
          class="basic-default-option-close-image"
          src="https://static.torder.co.kr/torder2/svg_closebutton_normal_black.svg"
        />
        <div
          id="basic-default-option-close-text-sub-element"
          class="basic-default-option-close-text"
        >
          {{ t('닫기') }}
        </div>
      </div>
    </div>
    <div class="basic-default-option-body">
      <div class="basic-default-option-body-left-container">
        <div class="basic-option-group-list-wrap">
          <div
            v-for="(optionGroup, index) in getTargetOptionInfo"
            :id="getScrollGroupElementId(optionGroup.name, index)"
            :key="getOptionGroupKey(optionGroup, index)"
          >
            <div
              class="basic-default-option-group-item"
              :class="{ 'active-tab': index === activeOptionGroupIndex }"
              @click="clickOptionGroupTab(index)"
            >
              <div class="basic-default-option-group-item-index">
                {{ index + 1 }}
              </div>
              <div class="basic-default-option-group-item-text">
                {{
                  removeNewLine(
                    translateLanguage(optionGroup.nameArray, optionGroup.name),
                  )
                }}
              </div>
              <div
                v-if="isCompleteSelect(optionGroup)"
                class="basic-default-option-group-item-complete"
              >
                <span>
                  {{ t('완료') }}
                </span>
              </div>
              <div
                v-else-if="optionGroup.require === 1"
                class="basic-default-option-group-item-require"
              >
                <span> *{{ t('필수') }} </span>
              </div>
            </div>
          </div>
        </div>
        <div class="basic-default-option-item-list-container">
          <div
            v-if="getCountLimitText(getActiveOptionItemList) !== ''"
            class="basic-default-option-item-list-limit-info"
          >
            <span> * </span>
            <div>
              {{ getCountLimitText(getActiveOptionItemList) }}
            </div>
          </div>
          <div class="basic-default-option-item-list-wrap">
            <div
              v-for="(optionItem, index) in getTargetItemsInfo"
              :key="getOptionItemKey(optionItem, index)"
              @click="
                clickOptionItem(getActiveOptionItemList, optionItem, index)
              "
            >
              <!-- 선택옵션 - 선택 안함 -->
              <div
                v-if="optionItem.code === 'not_select'"
                class="basic-default-option-item-wrap"
                :class="{ 'checked-item': optionItem.checked }"
              >
                <CheckBox
                  v-if="optionItem.checked"
                  class="image-option-detail-item-checkbox"
                  fill="#F91515"
                />
                <img
                  v-else
                  class="image-option-detail-item-checkbox"
                  src="https://static.torder.co.kr/torder2/btn_option_uncheckbox_icon.svg"
                />
                <div class="basic-default-option-item-title">
                  {{ t('선택 안 함') }}
                </div>
              </div>
              <!-- 품절 상품 -->
              <div
                v-else-if="optionItem.isSale === 0"
                class="basic-default-option-item-wrap disabled-item"
              >
                <img
                  class="image-option-detail-item-checkbox"
                  src="https://static.torder.co.kr/torder2/btn_option_checkbox_empty_disabled.svg"
                />
                <div class="basic-default-option-item-title">
                  {{
                    removeNewLine(
                      translateLanguage(optionItem.nameArray, optionItem.name),
                    )
                  }}
                </div>
                <div class="image-option-detail-item-sold-out">
                  {{ t('품절') }}
                </div>
                <div class="basic-default-option-item-price sold-out">
                  <span>
                    +{{
                      checkStandardPriceUnit(optionItem.price?.toLocaleString())
                    }}
                  </span>
                </div>
              </div>
              <!-- 일반 상품 -->
              <div
                v-else
                class="basic-default-option-item-wrap"
                :class="{ 'checked-item': optionItem.checked }"
              >
                <CheckBox
                  v-if="optionItem.checked"
                  class="image-option-detail-item-checkbox"
                  fill="#F91515"
                />
                <img
                  v-else
                  class="image-option-detail-item-checkbox"
                  src="https://static.torder.co.kr/torder2/btn_option_uncheckbox_icon.svg"
                />
                <div class="basic-default-option-item-title">
                  {{
                    removeNewLine(
                      translateLanguage(optionItem.nameArray, optionItem.name),
                    )
                  }}
                </div>
                <div class="basic-default-option-item-price">
                  <span>
                    +{{
                      checkStandardPriceUnit(optionItem.price?.toLocaleString())
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="basic-default-option-body-right-container">
        <div class="basic-default-option-selected-list-info-wrap">
          <span
            class="basic-default-option-selected-list-title ellipsis-text-1"
          >
            {{
              removeNewLine(
                translateLanguage(
                  targetProductInfo?.productLanguage,
                  targetProductInfo?.name,
                ),
              )
            }}
          </span>
          <div class="basic-default-option-selected-list-price-text">
            {{
              checkStandardPriceUnit(targetProductInfo?.price?.toLocaleString())
            }}
          </div>
        </div>
        <div
          v-if="getFilteredTargetList?.length === 0"
          class="basic-default-option-selected-list-empty"
        >
          {{ t('선택한 옵션이 없습니다. 옵션을 선택해주세요.') }}
        </div>
        <div
          v-else
          class="basic-option-body-product-selected-list-wrap"
        >
          <div
            v-for="(selectGroup, groupIndex) in getFilteredTargetList"
            :key="getOptionGroupKey(selectGroup, groupIndex)"
          >
            <div class="basic-default-selected-group-wrap">
              <div class="basic-default-selected-group-name">
                {{
                  removeNewLine(
                    translateLanguage(selectGroup.nameArray, selectGroup.name),
                  )
                }}
              </div>
              <div
                v-for="(selectItem, itemIndex) in getFilteredTargetItemList(
                  selectGroup,
                )"
                :id="
                  getScrollElementId(
                    selectGroup.name,
                    selectItem.code,
                    itemIndex,
                  )
                "
                :key="getOptionItemKey(selectItem, itemIndex)"
              >
                <div
                  v-if="selectItem.code !== 'not_select' && selectItem.checked"
                  class="basic-default-option-selected-list-wrap"
                >
                  <div class="basic-default-option-selected-list-top">
                    <div class="basic-default-option-selected-list-top-title">
                      {{
                        removeNewLine(
                          translateLanguage(
                            selectItem.nameArray,
                            selectItem.name,
                          ),
                        )
                      }}
                    </div>
                    <div
                      class="basic-default-option-selected-list-top-delete-button"
                      @click="deleteOptionItem(selectItem, selectGroup)"
                    >
                      {{ t('삭제') }}
                    </div>
                  </div>
                  <div
                    v-if="selectItem.limitQty !== 1"
                    class="basic-default-option-selected-list-button-wrap"
                  >
                    <GrayMinus
                      class="basic-default-option-selected-list-bottom-button"
                      @click="
                        (e) => clickOptionItemMinus(e, selectItem, selectGroup)
                      "
                    />
                    <span
                      class="basic-default-option-selected-list-bottom-count"
                    >
                      {{ `${selectItem.quantity}${t('개')}` }}
                    </span>
                    <GrayPlus
                      class="basic-default-option-selected-list-bottom-button"
                      @click="
                        (e) => clickOptionItemPlus(e, selectItem, selectGroup)
                      "
                    />
                  </div>
                  <div class="basic-default-option-selected-list-bottom-price">
                    +{{ getOptionItemPrice(selectItem) }}
                  </div>
                </div>
                <div
                  v-if="
                    selectItem.checked &&
                    getDividerCount(
                      getFilteredTargetItemList(selectGroup),
                      itemIndex,
                    )
                  "
                  class="basic-default-option-list-item-divider"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="basic-default-option-selected-footer-container">
          <div class="basic-default-option-selected-footer-wrap">
            <Minus
              class="basic-default-option-selected-footer-button-image"
              fill="#0A0A0A"
              @click="clickProductCountMinus"
            />
            <div class="basic-default-option-selected-footer-count-text">
              {{ `${targetProductInfo.quantity}${t('개')}` }}
            </div>
            <Plus
              class="basic-default-option-selected-footer-button-image"
              fill="#0A0A0A"
              @click="clickProductCountPlus"
            />
            <div class="basic-default-option-selected-footer-total-price">
              {{ getTotalPriceCount() }}
            </div>
          </div>
          <div
            class="basic-default-option-selected-footer-confirm-button"
            @click="clickAddCartProduct"
          >
            {{ t('장바구니 담기') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { pushPage } from '@utils/route.helper';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import {
  CartProductOptionGroupType,
  CartProductOptionType,
  cartProductType,
  productOptionItemType,
  removeNewLine,
} from '@torder/common';
import { home } from '@router/routePaths';
import Plus from '@assets/btn_option_plus.vue';
import Minus from '@assets/btn_option_minus.vue';
import CheckBox from '@assets/btn_option_checkbox.vue';
import GrayPlus from '@assets/btn_darkgray_plus.vue';
import GrayMinus from '@assets/btn_darkgray_minus.vue';

const { t } = useI18n();

defineProps<{
  targetProductInfo: cartProductType;
  activeOptionGroupIndex: number;
  clickOptionGroupTab: (index: number) => void;
  getTargetOptionInfo: any[];
  getActiveOptionItemList: any;
  getTargetItemsInfo: any[];
  getOptionGroupKey: (
    group: CartProductOptionGroupType,
    index: number,
  ) => string;
  getOptionItemKey: (item: productOptionItemType, index: number) => string;
  clickOptionItem: (
    group: CartProductOptionGroupType,
    item: CartProductOptionType,
    itemIndex: number,
  ) => Promise<void>;
  getFilteredTargetList: any[];
  getFilteredTargetItemList: (
    optionItem: CartProductOptionGroupType,
  ) => CartProductOptionType[];
  deleteOptionItem: (
    item: CartProductOptionType,
    group: CartProductOptionGroupType,
  ) => void;
  clickOptionItemPlus: (
    e: Event,
    item: CartProductOptionType,
    group: CartProductOptionGroupType,
  ) => void;
  clickOptionItemMinus: (
    e: Event,
    item: productOptionItemType,
    group: CartProductOptionGroupType,
  ) => void;
  clickProductCountPlus: () => void;
  clickProductCountMinus: () => void;
  getTotalPriceCount: () => string;
  clickAddCartProduct: () => void;
  getCountLimitText: (optionGroup: CartProductOptionGroupType) => string;
  isCompleteSelect: (optionGroup: CartProductOptionGroupType) => boolean;
  getDividerCount: (items: CartProductOptionType[], index: number) => boolean;
  getScrollElementId: (
    selectGroupName: string,
    selectItemCode: string,
    itemIndex: number,
  ) => string;
  getScrollGroupElementId: (groupName: string, groupIndex: number) => string;
  getOptionItemPrice: (item: productOptionItemType) => string;
}>();
</script>

<style lang="scss" scoped>
.basic-default-option-container {
  display: flex;
  flex-direction: column;
  gap: 1.25vw;
  width: 100%;
  height: 100%;
  padding: 1.25vw 1.5625vw 1.5625vw 1.5625vw;
  font-family: pretendard, sans-serif;
  background-color: #0a0a0a;

  .basic-default-option-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .basic-default-option-header-title {
      max-width: 81.4844vw;
      padding-left: 1.25vw;
      font-size: 2.5vw;
      font-weight: 700;
      line-height: 3.125vw;
      color: #fff;
      letter-spacing: -0.05vw;
      border-left: 0.3125vw solid #f91515;
    }

    .basic-default-option-close-button {
      display: flex;
      gap: 0.7813vw;
      align-items: center;
      justify-content: space-between;
      padding: 1.25vw 1.5625vw;
      background-color: #fff;
      border: 0.0781vw solid #0a0a0a;
      border-radius: 1.25vw;
      box-shadow: 0.4688vw 0.4688vw 0.9375vw 0 rgba(0, 0, 0, 0.2);

      &.button-active {
        background-color: #ebebeb;
      }

      .basic-default-option-close-image {
        width: 2.1563vw;
        height: 2.1563vw;
      }

      .basic-default-option-close-text {
        font-size: 2.6563vw;
        font-weight: 700;
        line-height: 3.2813vw;
        color: #0a0a0a;
        letter-spacing: -0.0531vw;
      }
    }
  }

  .basic-default-option-body {
    display: flex;
    gap: 1.25vw;
    height: 100%;

    .basic-default-option-body-left-container {
      display: flex;

      .basic-option-group-list-wrap {
        display: flex;
        flex-direction: column;
        gap: 0.9375vw;
        height: 51.7188vw;
        overflow-y: scroll;

        .basic-default-option-group-item {
          display: flex;
          gap: 1.5625vw;
          align-items: flex-start;
          width: 24.5313vw;
          padding: 1.5625vw 1.25vw 1.5625vw 0.9375vw;
          color: #959595;
          background-color: #494949;
          border-radius: 0.9375vw 0 0 0.9375vw;

          .basic-default-option-group-item-index {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 2.5vw;
            height: 2.5vw;
            padding: 0.3125vw;
            color: #fff;
            background-color: #121212;
            border-radius: 0.625vw;
          }

          .basic-default-option-group-item-text {
            flex: 1;
            font-size: 1.875vw;
            font-weight: 700;
            line-height: 2.5vw;
            letter-spacing: -0.0375vw;
            word-break: break-all;
          }

          .basic-default-option-group-item-complete {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.3125vw 0.625vw;
            background-color: #f91515;
            border-radius: 0.625vw;

            span {
              font-size: 1.25vw;
              font-weight: 500;
              line-height: 1.875vw;
              color: #fff;
              letter-spacing: -0.025vw;
            }
          }

          .basic-default-option-group-item-require {
            display: flex;
            align-items: center;
            justify-content: center;
            max-width: 4.8438vw;
            height: 2.5vw;

            span {
              font-size: 1.25vw;
              font-weight: 500;
              line-height: 1.875vw;
              color: #f91515;
              text-align: center;
              letter-spacing: -0.025vw;
              word-break: keep-all;
            }
          }
        }

        .active-tab {
          color: #313131;
          background-color: #fff;
        }
      }

      .basic-default-option-item-list-container {
        display: flex;
        flex-direction: column;
        gap: 1.4063vw;
        height: 52.6563vw;
        padding: 1.5625vw 1.25vw 0.9375vw 1.25vw;
        background-color: #fff;
        border-radius: 0 0.9375vw 0.9375vw 0.9375vw;

        .basic-default-option-item-list-limit-info {
          display: flex;
          align-items: center;
          justify-content: end;
          font-size: 1.25vw;
          font-weight: 600;
          line-height: 1.875vw;
          color: #313131;
          text-align: right;
          letter-spacing: -0.025vw;

          span {
            color: #f91515;
          }
        }

        .basic-default-option-item-list-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.625vw;
          overflow-y: scroll;

          .basic-default-option-item-wrap {
            display: flex;
            gap: 0.9375vw;
            align-items: center;
            justify-content: space-between;
            width: 37.0313vw;
            padding: 1.25vw 1.25vw 1.25vw 0.9375vw;
            background-color: #f8f8f8;
            border: 0.0781vw solid #d5d5d5;
            border-radius: 0.625vw;

            .basic-default-option-item-title {
              flex: 1;
              font-size: 1.875vw;
              font-weight: 600;
              line-height: 2.5vw;
              color: #313131;
              letter-spacing: -0.0375vw;
              word-break: break-all;
            }

            .image-option-detail-item-sold-out {
              font-size: 1.7188vw;
              font-style: normal;
              font-weight: 700;
              line-height: 2.3438vw;
              color: #f91515;
              letter-spacing: -0.0344vw;
            }

            .basic-default-option-item-price {
              display: flex;
              align-items: center;
              justify-content: end;
              color: #313131;

              span {
                font-size: 1.7188vw;
                font-weight: 700;
                line-height: 2.3438vw;
                text-align: right;
                letter-spacing: -0.0344vw;
              }
            }

            .sold-out {
              color: #afafaf;
            }

            .image-option-detail-item-checkbox {
              width: 2.3438vw;
              height: 2.3438vw;
            }
          }

          .disabled-item {
            background-color: #d5d5d5;
          }

          .checked-item {
            background-color: #fff;
            border: 0.1172vw solid #f91515;
          }
        }
      }
    }

    .basic-default-option-body-right-container {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      padding: 1.25vw;
      background-color: #fff;
      border-radius: 0.9375vw;

      .basic-default-option-selected-list-info-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 0.9375vw;
        justify-content: space-between;
        padding-bottom: 0.9375vw;
        margin-bottom: 0.9375vw;
        white-space: nowrap;
        border-bottom: 0.1563vw solid #121212;

        .basic-default-option-selected-list-title {
          flex: 1;
          max-width: 25.9375vw;
          font-size: 2.3438vw;
          font-weight: 700;
          line-height: 2.9688vw;
          letter-spacing: -0.0469vw;
        }

        .basic-default-option-selected-list-price-text {
          font-size: 1.875vw;
          font-weight: 700;
          line-height: 2.5vw;
          color: #313131;
          letter-spacing: -0.0375vw;
        }
      }

      .basic-default-option-selected-list-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 0.9375vw 1.25vw;
        font-size: 1.875vw;
        font-weight: 600;
        line-height: 2.5vw;
        color: #d5d5d5;
        text-align: center;
        letter-spacing: -0.0375vw;
        word-break: keep-all;
        white-space: pre-line;
        background-color: #f8f8f8;
        border: 0.0781vw solid #d5d5d5;
        border-radius: 0.625vw;
      }

      .basic-option-body-product-selected-list-wrap {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 33.4375vw;
        overflow-y: scroll;

        .basic-default-selected-group-wrap {
          display: flex;
          flex-direction: column;
          padding: 0.9375vw 1.25vw;
          margin-bottom: 0.9375vw;
          background-color: #f8f8f8;
          border: 0.0781vw solid #d5d5d5;
          border-radius: 0.625vw;

          .basic-default-selected-group-name {
            width: 24.5313vw;
            margin-bottom: 0.3125vw;
            font-size: 1.5625vw;
            font-weight: 400;
            line-height: 2.1875vw;
            color: #5b5b5b;
            letter-spacing: -0.0313vw;
            word-break: break-all;
          }

          .basic-default-option-selected-list-wrap {
            display: flex;
            flex-direction: column;
            gap: 0.9375vw;
            align-items: flex-start;

            .basic-default-option-selected-list-top {
              display: flex;
              gap: 0.7813vw;
              align-items: flex-start;
              justify-content: space-between;
              width: 100%;

              .basic-default-option-selected-list-top-title {
                flex: 1;
                font-size: 1.875vw;
                font-weight: 700;
                line-height: 2.5vw;
                color: #313131;
                letter-spacing: -0.0375vw;
                word-break: break-all;
              }

              .basic-default-option-selected-list-top-delete-button {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0.5469vw 1.1719vw;
                font-size: 1.7188vw;
                font-weight: 700;
                line-height: 2.3438vw;
                color: #f91515;
                letter-spacing: -0.0344vw;
                background-color: #fff;
                border: 0.0781vw solid #f91515;
                border-radius: 0.625vw;

                &.button-active {
                  background-color: #ebebeb;
                }
              }
            }

            .basic-default-option-selected-list-button-wrap {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;

              .basic-default-option-selected-list-bottom-button {
                width: 4.6875vw;
                height: 3.9063vw;
              }

              .basic-default-option-selected-list-bottom-count {
                font-size: 2.1875vw;
                font-weight: 700;
                line-height: 2.8125vw;
                color: #313131;
                text-align: center;
                letter-spacing: -0.0438vw;
              }
            }

            .basic-default-option-selected-list-bottom-price {
              display: flex;
              justify-content: right;
              width: 100%;
              font-size: 1.4063vw;
              font-weight: 500;
              line-height: 2.0313vw;
              color: #5b5b5b;
              letter-spacing: -0.0281vw;
            }
          }

          .basic-default-option-list-item-divider {
            height: 0.0781vw;
            margin: 1.7188vw 0;
            background-color: #d5d5d5;
          }
        }
      }
    }

    .basic-default-option-selected-footer-container {
      display: flex;
      flex-direction: column;
      gap: 1.25vw;
      margin-top: 1.5625vw;

      .basic-default-option-selected-footer-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .basic-default-option-selected-footer-button-image {
          width: 4.6875vw;
          height: 3.9063vw;
        }

        .basic-default-option-selected-footer-count-text {
          width: 5.1563vw;
          margin: 0 0.625vw;
          font-size: 1.875vw;
          font-weight: 700;
          line-height: 2.5vw;
          color: #313131;
          text-align: center;
          letter-spacing: -0.0375vw;
        }

        .basic-default-option-selected-footer-total-price {
          flex: 1;
          font-size: 1.875vw;
          font-weight: 700;
          line-height: 2.5vw;
          color: #f91515;
          text-align: end;
          letter-spacing: -0.0375vw;
        }
      }

      .basic-default-option-selected-footer-confirm-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.25vw;
        font-size: 1.875vw;
        font-weight: 700;
        line-height: 2.5vw;
        color: #fff;
        letter-spacing: -0.0375vw;
        background-color: #f91515;
        border-radius: 0.7813vw;

        &.button-active {
          background-color: #d60505;
        }
      }
    }
  }
}
</style>
