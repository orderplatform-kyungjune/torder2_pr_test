<template>
  <div class="basic-text-option-container">
    <div
      class="basic-text-option-body"
      :class="isWhiteTheme()"
    >
      <div class="basic-text-option-body-middle-wrap">
        <div
          class="basic-text-option-body-left-container"
          :class="isWhiteTheme()"
        >
          <div class="basic-text-option-body-top-info-wrap">
            <span
              class="basic-text-option-body-top-product-name ellipsis-text-1"
            >
              {{
                removeNewLine(
                  translateLanguage(
                    targetProductInfo.productLanguage,
                    targetProductInfo.name,
                  ),
                )
              }}
            </span>
            <div class="basic-text-option-body-top-price-info">
              <img
                class="basic-text-option-body-top-price-info-arrow"
                :src="getArrowIcon()"
              />
              <span
                class="basic-text-option-body-top-price-info-text"
                :class="isWhiteTheme()"
              >
                {{ t('기본가격') }}
              </span>
              <span
                class="basic-text-option-body-top-price-info-text bold"
                :class="isWhiteTheme()"
              >
                {{
                  checkStandardPriceUnit(
                    targetProductInfo.price?.toLocaleString(),
                  )
                }}
              </span>
            </div>
          </div>
          <div class="basic-option-group-list-wrap">
            <div
              v-for="(optionGroup, groupIndex) in getTargetOptionInfo"
              :id="getScrollGroupElementId(optionGroup.name, groupIndex)"
              :key="getOptionGroupKey(optionGroup, groupIndex)"
            >
              <div
                class="basic-text-option-body-group-wrap"
                :class="[
                  { 'essential-group': optionGroup.require === 1 },
                  isWhiteTheme(),
                ]"
              >
                <div
                  class="basic-text-option-body-group-header"
                  :class="isWhiteTheme()"
                >
                  <div class="basic-text-option-body-product-info">
                    <div
                      v-if="optionGroup.require === 1"
                      class="basic-text-option-body-product-essential"
                    >
                      {{ t('필수') }}
                    </div>
                    <div
                      class="basic-text-option-body-product-name"
                      :class="isWhiteTheme()"
                    >
                      {{
                        removeNewLine(
                          translateLanguage(
                            optionGroup.nameArray,
                            optionGroup.name,
                          ),
                        )
                      }}
                    </div>
                  </div>
                  <div
                    class="basic-text-option-body-product-limit"
                    :class="isWhiteTheme()"
                  >
                    <span
                      v-if="
                        isCompleteSelect(optionGroup) ||
                        getCountLimitText(optionGroup) !== ''
                      "
                    >
                      *
                    </span>
                    <div v-if="isCompleteSelect(optionGroup)">
                      {{ t('선택완료') }}
                    </div>
                    <div v-else>
                      {{ getCountLimitText(optionGroup) }}
                    </div>
                  </div>
                </div>
                <div class="basic-text-option-body-item-list-wrap">
                  <div
                    v-for="(optionItem, itemIndex) in getFilteredTargetItemList(
                      optionGroup,
                    )"
                    :key="getOptionItemKey(optionItem, itemIndex)"
                    class="basic-text-option-body-item-wrap"
                    :class="isWhiteTheme()"
                    @click="
                      clickTargetOptionItem(
                        optionGroup,
                        optionItem,
                        groupIndex,
                        itemIndex,
                      )
                    "
                  >
                    <div class="basic-text-option-body-item-name-info">
                      <CheckBox
                        v-if="optionItem.checked"
                        class="basic-text-option-body-item-check-icon"
                        fill="#F91515"
                        stroke="#fff"
                        :isNoneBorder="true"
                      />
                      <CheckBox
                        v-else-if="optionItem.isSale === 0"
                        class="basic-text-option-body-item-check-icon"
                        :isEmptyIcon="true"
                        :fill="
                          isWhiteTheme() === 'white-theme'
                            ? '#EBEBEB'
                            : '#494949'
                        "
                        :stroke="
                          isWhiteTheme() === 'white-theme'
                            ? '#D5D5D5'
                            : '#494949'
                        "
                      />
                      <CheckBox
                        v-else
                        class="basic-text-option-body-item-check-icon"
                        :fill="
                          isWhiteTheme() === 'white-theme' ? '#fff' : '#494949'
                        "
                        :stroke="
                          isWhiteTheme() === 'white-theme'
                            ? '#D5D5D5'
                            : '#5B5B5B'
                        "
                      />
                      <span
                        class="basic-text-option-body-item-name"
                        :class="[
                          { 'sold-out': optionItem.isSale === 0 },
                          isWhiteTheme(),
                        ]"
                      >
                        {{
                          removeNewLine(
                            translateLanguage(
                              optionItem.nameArray,
                              optionItem.name,
                            ),
                          )
                        }}
                      </span>
                      <span
                        v-if="optionItem.isSale === 0"
                        class="basic-text-option-body-item-sold-out"
                      >
                        {{ t('품절') }}
                      </span>
                    </div>
                    <div
                      v-if="optionItem.code !== 'not_select'"
                      class="basic-text-option-body-item-price-info"
                    >
                      <span
                        v-if="optionItem.isSale !== 0"
                        class="basic-text-option-body-item-price-text"
                        :class="[
                          { 'sold-out': optionItem.isSale === 0 },
                          isWhiteTheme(),
                        ]"
                      >
                        {{ optionItem.quantity }} {{ t('개') }}
                      </span>
                      <span
                        v-if="optionItem.isSale !== 0"
                        class="basic-text-option-body-item-price-text price"
                        :class="[
                          { 'sold-out': optionItem.isSale === 0 },
                          isWhiteTheme(),
                        ]"
                      >
                        {{
                          checkStandardPriceUnit(
                            optionItem.price?.toLocaleString(),
                          )
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="basic-text-option-body-right-container">
          <div
            v-if="isUseDescription"
            class="basic-text-option-body-top-button-wrap"
          >
            <div
              class="basic-text-option-body-top-button"
              :class="{
                'white-theme': optionLayout.color === 'white',
                'active-tab-white':
                  activeTab === 'detail' && optionLayout.color === 'white',
                'active-tab-black':
                  activeTab === 'detail' && optionLayout.color === 'black',
              }"
              @click="setActiveTab('detail')"
            >
              {{ t('상세정보') }}
            </div>
            <div
              class="basic-text-option-body-top-button"
              :class="{
                'white-theme': optionLayout.color === 'white',
                'active-tab-white':
                  activeTab === 'selected' && optionLayout.color === 'white',
                'active-tab-black':
                  activeTab === 'selected' && optionLayout.color === 'black',
              }"
              @click="setActiveTab('selected')"
            >
              {{ t('선택한 옵션') }}
            </div>
          </div>
          <div
            class="basic-text-option-body-product-detail-container"
            :class="{ 'only-option': !isUseDescription }"
          >
            <div
              v-if="activeTab === 'detail'"
              class="basic-text-option-body-product-detail-wrap"
            >
              <div
                class="basic-text-option-body-product-detail-image-wrap"
                :class="isWhiteTheme()"
              >
                <img
                  v-if="targetProductInfo.image"
                  class="basic-text-option-body-product-detail-image"
                  :src="targetProductInfo.image"
                />
                <img
                  v-else
                  class="basic-text-option-body-product-detail-empty"
                  :src="getEmptyImageLogo()"
                />
              </div>
              <div
                class="basic-text-option-body-product-detail"
                :class="isWhiteTheme()"
              >
                {{ getProductDescription() }}
              </div>
            </div>
            <div
              v-else
              class="basic-text-option-body-product-selected-wrap"
            >
              <div
                v-if="getFilteredTargetList?.length === 0"
                class="basic-text-option-body-product-selected-empty"
                :class="isWhiteTheme()"
              >
                <span>
                  {{ t('선택한 옵션이 없습니다. 옵션을 선택해주세요.') }}
                </span>
              </div>
              <div
                v-else
                class="basic-option-body-product-selected-list-wrap"
                :class="{ 'only-option': !isUseDescription }"
              >
                <div
                  v-for="(selectGroup, groupIndex) in getFilteredTargetList"
                  :key="getOptionGroupKey(selectGroup, groupIndex)"
                >
                  <div
                    class="basic-option-body-product-selected-group-wrap"
                    :class="isWhiteTheme()"
                  >
                    <div
                      class="basic-option-body-product-selected-group-name"
                      :class="isWhiteTheme()"
                    >
                      {{
                        removeNewLine(
                          translateLanguage(
                            selectGroup.nameArray,
                            selectGroup.name,
                          ),
                        )
                      }}
                    </div>
                    <div
                      v-for="(
                        selectItem, itemIndex
                      ) in getFilteredTargetItemList(selectGroup)"
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
                        v-if="
                          selectItem.code !== 'not_select' && selectItem.checked
                        "
                        class="basic-text-option-selected-list-wrap"
                        :class="isWhiteTheme()"
                      >
                        <div class="basic-text-option-selected-list-top">
                          <div
                            class="basic-text-option-selected-list-top-title"
                            :class="isWhiteTheme()"
                          >
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
                            class="basic-text-option-selected-list-top-delete-button"
                            :class="isWhiteTheme()"
                            @click="deleteOptionItem(selectItem, selectGroup)"
                          >
                            {{ t('삭제') }}
                          </div>
                        </div>
                        <div
                          v-if="selectItem.limitQty !== 1"
                          class="basic-text-option-selected-list-button-wrap"
                        >
                          <Minus
                            class="basic-text-option-selected-list-bottom-button"
                            :fill="getCountButtonColor()"
                            @click="
                              (e) =>
                                clickOptionItemMinus(e, selectItem, selectGroup)
                            "
                          />
                          <span
                            class="basic-text-option-selected-list-bottom-count"
                            :class="isWhiteTheme()"
                          >
                            {{ `${selectItem.quantity}${t('개')}` }}
                          </span>
                          <Plus
                            class="basic-text-option-selected-list-bottom-button"
                            :fill="getCountButtonColor()"
                            @click="
                              (e) =>
                                clickOptionItemPlus(e, selectItem, selectGroup)
                            "
                          />
                        </div>
                        <div
                          class="basic-text-option-selected-list-middle-price"
                          :class="isWhiteTheme()"
                        >
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
                        class="basic-text-option-list-item-divider"
                        :class="isWhiteTheme()"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="basic-text-option-body-bottom-wrap"
        :class="isWhiteTheme()"
      >
        <div class="basic-text-option-body-bottom-info">
          <div class="basic-text-option-body-bottom-count-wrap">
            <Minus
              class="basic-text-option-body-bottom-count-button"
              fill="#0A0A0A"
              @click="clickProductCountMinus"
            />
            <div
              class="basic-text-option-body-bottom-count-text"
              :class="isWhiteTheme()"
            >
              {{ `${targetProductInfo.quantity}${t('개')}` }}
            </div>
            <Plus
              class="basic-text-option-body-bottom-count-button"
              fill="#0A0A0A"
              @click="clickProductCountPlus"
            />
          </div>
          <div
            class="basic-text-option-body-bottom-price"
            :class="isWhiteTheme()"
          >
            {{ getTotalPriceCount() }}
          </div>
        </div>
        <div class="basic-text-option-body-bottom-button-wrap">
          <div
            class="basic-text-option-body-bottom-cancel-button"
            :class="isWhiteTheme()"
            @click="pushPage(home)"
          >
            {{ t('닫기') }}
          </div>
          <div
            class="basic-text-option-body-bottom-confirm-button"
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
import { ref, watch } from 'vue';
import { pushPage } from '@utils/route.helper';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import {
  cartProductType,
  CartProductOptionGroupType,
  productOptionItemType,
  CartProductOptionType,
  removeNewLine,
} from '@torder/common';
import { home } from '@router/routePaths';
import Plus from '@assets/btn_option_plus.vue';
import Minus from '@assets/btn_option_minus.vue';
import CheckBox from '@assets/btn_basic_option_checkbox.vue';

const { t } = useI18n();

const props = defineProps<{
  targetProductInfo: cartProductType;
  clickOptionGroupTab: (index: number) => void;
  getTargetOptionInfo: any[];
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
  optionLayout: { type: string; color: string };
  getProductDescription: () => string;
  getCountLimitText: (optionGroup: CartProductOptionGroupType) => string;
  isCompleteSelect: (optionGroup: CartProductOptionGroupType) => boolean;
  isUseDescription: boolean;
  isWhiteTheme: () => string;
  getArrowIcon: () => string;
  getCountButtonColor: () => string;
  getEmptyImageLogo: () => string;
  getDividerCount: (items: CartProductOptionType[], index: number) => boolean;
  getScrollElementId: (
    selectGroupName: string,
    selectItemCode: string,
    itemIndex: number,
  ) => string;
  getScrollGroupElementId: (groupName: string, groupIndex: number) => string;
  getOptionItemPrice: (item: productOptionItemType) => string;
}>();

// 탭 상태값 (상세설명, 알러지)
const activeTab = ref(props.isUseDescription ? 'detail' : 'selected');

// 탭 선택하는 로직
const setActiveTab = (key: string) => {
  activeTab.value = key;
};

// 옵션 아이템 선택 로직
const clickTargetOptionItem = (
  optionGroup: CartProductOptionGroupType,
  optionItem: productOptionItemType,
  groupIndex: number,
  itemIndex: number,
) => {
  props.clickOptionGroupTab(groupIndex);
  props.clickOptionItem(optionGroup, optionItem, itemIndex);
};

// 선택한 상품이 있을 경우 자동으로 선택한 옵션 탭으로 이동하는 로직
watch(
  () => props.getFilteredTargetList,
  () => {
    const isHaveSelectedItem = props.getFilteredTargetList?.length > 0;

    if (isHaveSelectedItem || !props.isUseDescription) setActiveTab('selected');
    else setActiveTab('detail');
  },
  { deep: true },
);
</script>

<style lang="scss" scoped>
.basic-text-option-container {
  display: flex;
  gap: 1.25vw;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2.3438vw 1.5625vw;
  font-family: pretendard, sans-serif;
  background-color: #0a0a0a;

  .basic-text-option-body {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #313131;
    border: 0.0781vw solid #494949;
    border-radius: 1.25vw;

    &.white-theme {
      background-color: #fff;
    }

    .basic-text-option-body-middle-wrap {
      display: flex;
      flex: 1;

      .basic-text-option-body-left-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        border-right: 0.1172vw solid #494949;

        &.white-theme {
          border-right: 0.1172vw solid #d5d5d5;
        }

        .basic-text-option-body-top-info-wrap {
          display: flex;
          gap: 0.9375vw;
          max-width: 67.3438vw;
          padding: 1.25vw 1.875vw;

          .basic-text-option-body-top-product-name {
            font-size: 2.1875vw;
            font-weight: 700;
            line-height: 2.8125vw;
            color: #f91515;
            letter-spacing: -0.0438vw;
          }

          .basic-text-option-body-top-price-info {
            display: flex;
            align-items: center;

            .basic-text-option-body-top-price-info-arrow {
              width: 1.875vw;
              height: 1.875vw;
            }

            .basic-text-option-body-top-price-info-text {
              margin-left: 0.9375vw;
              font-size: 2.1875vw;
              font-weight: 600;
              line-height: 2.8125vw;
              color: #fff;
              letter-spacing: -0.0438vw;
              white-space: nowrap;
              border: none;

              &.white-theme {
                color: #313131;
              }
            }

            .bold {
              font-weight: 700;
            }
          }
        }

        .basic-option-group-list-wrap {
          display: flex;
          flex-direction: column;
          gap: 1.5625vw;
          width: 67.3438vw;
          height: 45.2344vw;
          padding: 0 1.5625vw 1.25vw 1.5625vw;
          overflow-y: scroll;

          .basic-text-option-body-group-wrap {
            display: flex;
            flex-direction: column;
            background-color: #313131;
            border: 0.1563vw solid #494949;
            border-radius: 0.7813vw;

            &.white-theme {
              background-color: #fff;
              border: 0.1563vw solid #d5d5d5;
            }

            &.essential-group {
              border: 0.1563vw solid #f91515;
            }

            .basic-text-option-body-group-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 1.5625vw 1.25vw;
              background-color: #494949;
              border-radius: 0.7813vw 0.7813vw 0 0;

              &.white-theme {
                background-color: #ebebeb;
              }

              .basic-text-option-body-product-info {
                display: flex;
                flex: 1;
                gap: 0.9375vw;
                align-items: center;

                .basic-text-option-body-product-essential {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 0.3125vw 0.625vw;
                  font-size: 1.875vw;
                  font-weight: 700;
                  line-height: 2.5vw;
                  color: #fff;
                  letter-spacing: -0.0375vw;
                  background-color: #f91515;
                  border-radius: 0.625vw;
                }

                .basic-text-option-body-product-name {
                  width: 100%;
                  font-size: 2.3438vw;
                  font-weight: 700;
                  line-height: 2.9688vw;
                  color: #fff;
                  letter-spacing: -0.0469vw;
                  word-break: break-all;
                  white-space: pre-line;

                  &.white-theme {
                    color: #313131;
                    border: none;
                  }
                }
              }

              .basic-text-option-body-product-limit {
                display: flex;
                align-items: center;
                justify-content: end;
                font-size: 1.4063vw;
                font-weight: 500;
                line-height: 2.0313vw;
                color: #fff;
                text-align: right;
                letter-spacing: -0.0281vw;

                &.white-theme {
                  color: #313131;
                  border: none;
                }

                span {
                  color: #f91515;
                }
              }
            }

            .basic-text-option-body-item-list-wrap {
              display: flex;
              flex-direction: column;

              .basic-text-option-body-item-wrap {
                display: flex;
                gap: 0.9375vw;
                align-items: center;
                justify-content: space-between;
                padding: 1.5625vw 1.25vw;
                border-bottom: 0.0781vw solid #494949;

                &.white-theme {
                  border-bottom: 0.0781vw solid #d5d5d5;
                }

                &:last-child {
                  border: none;
                }

                .basic-text-option-body-item-name-info {
                  display: flex;
                  gap: 0.9375vw;
                  align-items: center;

                  .basic-text-option-body-item-check-icon {
                    width: 2.3438vw;
                    height: 2.3438vw;
                  }

                  .basic-text-option-body-item-name {
                    flex: 1;
                    font-size: 2.1875vw;
                    font-weight: 600;
                    line-height: 2.8125vw;
                    color: #fff;
                    letter-spacing: -0.0438vw;
                    word-break: break-all;

                    &.white-theme {
                      color: #313131;
                    }

                    &.sold-out {
                      color: #959595;
                    }
                  }

                  .basic-text-option-body-item-sold-out {
                    font-size: 1.875vw;
                    font-weight: 700;
                    line-height: 2.5vw;
                    color: #f91515;
                    letter-spacing: -0.0375vw;
                  }
                }

                .basic-text-option-body-item-price-info {
                  display: flex;
                  gap: 5vw;
                  align-items: center;

                  .basic-text-option-body-item-price-text {
                    font-size: 2.3438vw;
                    font-weight: 700;
                    line-height: 2.9688vw;
                    color: #fff;
                    text-align: end;
                    letter-spacing: -0.0469vw;
                    white-space: nowrap;

                    &.white-theme {
                      color: #313131;
                    }

                    &.sold-out {
                      color: #959595;
                    }
                  }

                  .price {
                    min-width: 12.3438vw;
                  }
                }
              }
            }
          }
        }
      }

      .basic-text-option-body-right-container {
        display: flex;
        flex: 1;
        flex-direction: column;
        width: 29.2969vw;

        .basic-text-option-body-top-button-wrap {
          display: flex;
          gap: 0.7813vw;
          justify-content: space-between;
          padding: 0.9375vw 1.25vw;

          .basic-text-option-body-top-button {
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: center;
            padding: 0.9375vw;
            font-size: 1.875vw;
            font-weight: 700;
            line-height: 2.5vw;
            color: #959595;
            text-align: center;
            letter-spacing: -0.1016vw;
            white-space: nowrap;
            background-color: #494949;
            border-radius: 0.7813vw;
          }

          .white-theme {
            color: #d5d5d5;
            background-color: #f8f8f8;
            border: 0.0781vw solid #ebebeb;

            &.button-active {
              background-color: #ebebeb;
            }
          }

          .button-active {
            background-color: #242424;
          }

          .active-tab-black {
            color: #0a0a0a;
            background-color: #fff;

            &.button-active {
              background-color: #fff;
            }
          }

          .active-tab-white {
            color: #fff;
            background-color: #0a0a0a;
            border: 0.0781vw solid #959595;

            &.button-active {
              background-color: #0a0a0a;
            }
          }
        }

        .basic-text-option-body-product-detail-container {
          height: 44.375vw;
          padding: 0 1.25vw 1.25vw 1.25vw;
          overflow-y: scroll;

          &.only-option {
            height: 50.625vw;
            padding: 1.25vw;
          }

          .basic-text-option-body-product-detail-wrap {
            display: flex;
            flex-direction: column;
            gap: 0.9375vw;

            .basic-text-option-body-product-detail-image-wrap {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 24.2188vw;
              background-color: #494949;
              border-radius: 0.7813vw;

              &.white-theme {
                background-color: #afafaf;
              }

              .basic-text-option-body-product-detail-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 0.7813vw;
              }

              .basic-text-option-body-product-detail-empty {
                width: 100%;
                height: 100%;
                opacity: 0.5;
                object-fit: none;
              }
            }

            .basic-text-option-body-product-detail {
              font-size: 1.5625vw;
              font-weight: 600;
              line-height: 2.3438vw;
              color: #ebebeb;
              letter-spacing: -0.0313vw;
              word-break: break-all;
              white-space: pre-line;

              &.white-theme {
                color: #7a7a7a;
              }
            }
          }

          .basic-text-option-body-product-selected-wrap {
            width: 100%;
            height: 100%;

            .basic-text-option-body-product-selected-empty {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100%;
              padding: 0.9375vw 1.25vw;
              background-color: #494949;
              border-radius: 0.625vw;

              span {
                font-size: 1.875vw;
                font-weight: 600;
                line-height: 2.5vw;
                color: #959595;
                text-align: center;
                letter-spacing: -0.0375vw;
                white-space: pre-line;
              }

              &.white-theme {
                background-color: #f8f8f8;
                border: 0.0781vw solid #d5d5d5;
              }
            }

            .basic-option-body-product-selected-list-wrap {
              display: flex;
              flex-direction: column;
              height: 44.375vw;
              overflow-y: scroll;

              &.only-option {
                height: 49.375vw;
              }

              .basic-option-body-product-selected-group-wrap {
                display: flex;
                flex-direction: column;
                padding: 0.9375vw 1.25vw;
                margin-bottom: 1.5625vw;
                background-color: #494949;
                border: 0.0781vw solid #313131;
                border-radius: 0.625vw;

                &.white-theme {
                  background-color: #f8f8f8;
                  border: 0.0781vw solid #d5d5d5;
                }

                .basic-option-body-product-selected-group-name {
                  width: 24.5313vw;
                  margin-bottom: 0.3125vw;
                  font-size: 1.5625vw;
                  font-weight: 400;
                  line-height: 2.1875vw;
                  color: #ebebeb;
                  letter-spacing: -0.0313vw;
                  word-break: break-all;

                  &.white-theme {
                    color: #5b5b5b;
                  }
                }

                .basic-text-option-selected-list-wrap {
                  display: flex;
                  flex-direction: column;
                  gap: 0.9375vw;
                  align-items: flex-start;

                  .basic-text-option-selected-list-top {
                    display: flex;
                    gap: 0.7813vw;
                    align-items: flex-start;
                    justify-content: space-between;
                    width: 100%;

                    .basic-text-option-selected-list-top-title {
                      flex: 1;
                      font-size: 1.875vw;
                      font-weight: 700;
                      line-height: 2.5vw;
                      color: #fff;
                      letter-spacing: -0.0375vw;
                      word-break: break-all;

                      &.white-theme {
                        color: #313131;
                      }
                    }

                    .basic-text-option-selected-list-top-delete-button {
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      padding: 0.5469vw 1.1719vw;
                      font-size: 1.7188vw;
                      font-weight: 700;
                      line-height: 2.3438vw;
                      color: #0a0a0a;
                      letter-spacing: -0.0344vw;
                      background-color: #fff;
                      border-radius: 0.625vw;

                      &.button-active {
                        background-color: #ebebeb;
                      }

                      &.white-theme {
                        color: #f91515;
                        border: 0.0781vw solid #f91515;
                      }
                    }
                  }

                  .basic-text-option-selected-list-button-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;

                    .basic-text-option-selected-list-bottom-button {
                      width: 4.6875vw;
                      height: 3.9063vw;
                    }

                    .basic-text-option-selected-list-bottom-count {
                      font-size: 2.1875vw;
                      font-weight: 700;
                      line-height: 2.8125vw;
                      color: #fff;
                      text-align: center;
                      letter-spacing: -0.0438vw;

                      &.white-theme {
                        color: #313131;
                      }
                    }
                  }

                  .basic-text-option-selected-list-middle-price {
                    display: flex;
                    justify-content: right;
                    width: 100%;
                    font-size: 1.4063vw;
                    font-weight: 500;
                    line-height: 2.0313vw;
                    color: #d5d5d5;
                    letter-spacing: -0.0281vw;

                    &.white-theme {
                      color: #5b5b5b;
                    }
                  }
                }

                .basic-text-option-list-item-divider {
                  height: 0.0781vw;
                  margin: 1.7188vw 0;
                  background-color: #5b5b5b;

                  &.white-theme {
                    background-color: #d5d5d5;
                  }
                }
              }
            }
          }
        }
      }
    }

    .basic-text-option-body-bottom-wrap {
      display: flex;
      align-items: center;
      background-color: #313131;
      border-top: 0.1172vw solid #f91515;
      border-radius: 0 0 1.25vw 1.25vw;
      box-shadow: 0 -0.3125vw 3.9063vw 0 rgba(0, 0, 0, 0.25);

      &.white-theme {
        background-color: #ebebeb;
      }

      .basic-text-option-body-bottom-info {
        display: flex;
        gap: 0.625vw;
        align-items: center;
        width: 52.5vw;
        padding: 0 1.875vw;

        .basic-text-option-body-bottom-count-wrap {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: space-between;

          .basic-text-option-body-bottom-count-button {
            width: 5.4688vw;
            height: 4.6875vw;
          }

          .basic-text-option-body-bottom-count-text {
            font-size: 3.125vw;
            font-weight: 700;
            line-height: 4.0625vw;
            color: #fff;
            letter-spacing: -0.0625vw;

            &.white-theme {
              color: #313131;
            }
          }
        }

        .basic-text-option-body-bottom-price {
          width: 19.2188vw;
          font-size: 3.125vw;
          font-weight: 700;
          line-height: 4.0625vw;
          color: #fff;
          text-align: right;
          letter-spacing: -0.0625vw;

          &.white-theme {
            color: #313131;
          }
        }
      }

      .basic-text-option-body-bottom-button-wrap {
        display: flex;
        flex: 1;

        .basic-text-option-body-bottom-cancel-button {
          display: flex;
          align-items: center;
          justify-items: center;
          padding: 1.5625vw 1.875vw;
          font-size: 3.2813vw;
          font-weight: 700;
          line-height: 4.375vw;
          color: #fff;
          letter-spacing: -0.0656vw;
          background-color: #5b5b5b;

          &.button-active {
            background-color: #494949;
          }

          &.white-theme {
            background-color: #818181;

            &.button-active {
              background-color: #696969;
            }
          }
        }

        .basic-text-option-body-bottom-confirm-button {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          padding: 1.5625vw 1.875vw;
          font-size: 3.2813vw;
          font-weight: 700;
          line-height: 4.375vw;
          color: #fff;
          letter-spacing: -0.0656vw;
          background-color: #f91515;
          border-bottom-right-radius: 1.25vw;

          &.button-active {
            background-color: #d60505;
          }
        }
      }
    }
  }
}
</style>
