<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import {
  removeNewLine,
  getSubPrimaryColor,
  cartProductType,
} from '@torder/common';
import useInitStore from '@store/storeInit';
import useOrderDepthOptions from '@composables/OrderOptions/useOrderOptions';
import BtnArrow from '@assets/btn_arrow.vue';
import CheckBox from '@assets/btn_option_checkbox.vue';
import UnCheckBox from '@assets/btn_checkbox_uncheck.vue';
import UnCheckBoxLight from '@assets/btn_checkbox_uncheck_light.vue';
import GrayPlus from '@assets/btn_darkgray_plus.vue';
import GrayMinus from '@assets/btn_darkgray_minus.vue';

const { getDarkModeClass } = useInitStore();
const { t } = useI18n();

const { isDarkMode } = storeToRefs(useInitStore());

const props = defineProps<{
  depthOptionInfo: cartProductType;
  onCloseSheet: () => void;
  onConfirmSheet: () => void;
}>();

const {
  isRequiredOption,
  isShowCountBox,
  rangeSelectText,
  handleCheckOptions,
  onClickOptionCountPlus,
  onClickOptionCountMinus,
  disableOption,
} = useOrderDepthOptions();

const { categoryBackgroundColor, buttonBackgroundColor, buttonFontColor } =
  storeToRefs(useInitStore());

const getActiveButtonColor = (color: string) =>
  getSubPrimaryColor(color, 10, 'Y');
</script>

<template>
  <div class="dimmer" />
  <div
    class="sheet-container"
    :class="getDarkModeClass()"
  >
    <h4
      class="sheet-title"
      :class="getDarkModeClass()"
    >
      {{ t('옵션을 선택해주세요.') }}
    </h4>
    <main class="sheet-main">
      <ul class="level3">
        <li
          v-for="(level3, index3) in depthOptionInfo.items"
          :key="index3"
        >
          <details
            class="level3-details"
            :open="level3.checked"
            :class="getDarkModeClass()"
          >
            <summary
              class="level3-sheet-summary sheet-option"
              @click.stop.prevent="handleCheckOptions(level3)"
            >
              <div class="level3-option-header-container">
                <div class="level3-option-header-wrapper">
                  <div class="level3-option-header-title">
                    <p
                      class="level3-option-title"
                      :class="getDarkModeClass()"
                    >
                      {{
                        removeNewLine(
                          translateLanguage(level3.nameArray, level3.name),
                        )
                      }}
                    </p>
                    <span
                      v-if="isRequiredOption(level3)"
                      class="level3-option-required"
                      >{{ t('필수') }}</span
                    >
                  </div>
                  <div
                    v-if="rangeSelectText(level3) !== ''"
                    class="level3-option-quantity"
                    :class="getDarkModeClass()"
                  >
                    {{ rangeSelectText(level3) }}
                  </div>
                </div>
                <BtnArrow
                  v-if="level3.items?.length > 0"
                  :isDarkMode="isDarkMode"
                />
              </div>
            </summary>
            <!-- level4 -->
            <!-- 하위 details case1: 하위 뎁스가 없고 수량 선택 가능 구조-->
            <ul
              v-if="level3.items?.length > 0"
              class="level4"
              :class="getDarkModeClass()"
            >
              <li
                v-for="(level4, index4) in level3.items"
                :key="index4"
                class="level4-options-group"
                :class="getDarkModeClass()"
              >
                <details
                  :ref="`level6-details-ref-${index3}-${index4}`"
                  class="level4-depth-option"
                  :open="level4.checked"
                  :class="{ 'disable-option': disableOption(level4, level3) }"
                >
                  <summary
                    class="level4-summary"
                    @click.stop.prevent="handleCheckOptions(level4, level3)"
                  >
                    <div class="level4-option-header-container">
                      <div class="level4-option-header-wrapper">
                        <CheckBox
                          class="active-check-box"
                          :fill="categoryBackgroundColor"
                        />
                        <unCheckBox
                          v-if="!isDarkMode"
                          class="unActive-check-box"
                        />
                        <UnCheckBoxLight
                          v-else
                          class="unActive-check-box"
                        />
                        <div
                          class="level4-option-header-title"
                          :class="getDarkModeClass()"
                        >
                          <p class="level4-option-title">
                            {{
                              removeNewLine(
                                translateLanguage(
                                  level4.nameArray,
                                  level4.name,
                                ),
                              )
                            }}
                          </p>
                        </div>
                      </div>
                      <p
                        v-if="level4.isSale === 0"
                        class="soldOut-option"
                      >
                        {{ t('품절') }}
                      </p>
                      <div
                        v-else
                        class="level4-option-price-wrapper"
                      >
                        <p
                          class="level4-option-price"
                          :class="getDarkModeClass()"
                        >
                          +{{
                            checkStandardPriceUnit(
                              level4.price.toLocaleString(),
                            )
                          }}
                        </p>
                        <BtnArrow
                          class="list-arrow"
                          v-if="level4.items?.length > 0"
                          :isDarkMode="isDarkMode"
                        />
                      </div>
                    </div>
                  </summary>
                  <!-- level5 -->
                  <!-- 옵션 갯수 설정 -->
                  <div
                    v-if="isShowCountBox(level4)"
                    class="level5-count"
                  >
                    <GrayMinus
                      class="level5-count-button"
                      @click.stop="
                        onClickOptionCountMinus(
                          level4,
                          $refs[`level6-details-ref-${index3}-${index4}`],
                        )
                      "
                    />
                    <span
                      class="level5-count-text"
                      :class="getDarkModeClass()"
                    >
                      {{ `${level4.quantity}${t('개')}` }}
                    </span>
                    <GrayPlus
                      class="level5-count-button"
                      @click.stop="onClickOptionCountPlus(level4, level3)"
                    />
                  </div>
                  <div
                    v-if="level4.limitQty === 1 && level4.items.length === 0"
                    class="is-selected"
                  ></div>
                  <!-- level5 -->
                  <!-- 옵션 리스팅 -->
                  <div
                    v-for="(level5, index5) in level4.items"
                    v-else
                    :key="index5"
                    class="level5-depth-wrapper"
                  >
                    <svg
                      class="list-divider-img"
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0 10.5V0.5H2V10.5C2 11.6046 2.89543 12.5 4 12.5H14V14.5H4C1.79086 14.5 0 12.7091 0 10.5Z"
                        fill="#AFAFAF"
                      />
                    </svg>
                    <ul
                      class="level5-depth-option"
                      :class="getDarkModeClass()"
                    >
                      <li class="level5-depth-item">
                        <details
                          class="level5-depth-details"
                          :open="level5.checked"
                        >
                          <summary
                            class="level5-depth-summary"
                            @click.stop.prevent="handleCheckOptions(level5)"
                          >
                            <div class="level5-level3-option-header-container">
                              <div class="level5-option-header-wrapper">
                                <div class="level5-option-header-title">
                                  <p
                                    class="level5-option-title"
                                    :class="getDarkModeClass()"
                                  >
                                    {{
                                      removeNewLine(
                                        translateLanguage(
                                          level5.nameArray,
                                          level5.name,
                                        ),
                                      )
                                    }}
                                  </p>
                                  <span
                                    v-if="isRequiredOption(level5)"
                                    class="level5-option-required"
                                    >{{ t('필수') }}</span
                                  >
                                </div>
                                <div
                                  v-if="rangeSelectText(level5) !== ''"
                                  class="level5-option-quantity"
                                  :class="getDarkModeClass()"
                                >
                                  {{ rangeSelectText(level5) }}
                                </div>
                              </div>
                              <BtnArrow
                                v-if="level5.items?.length > 0"
                                :isDarkMode="isDarkMode"
                                class="list-arrow"
                              />
                            </div>
                          </summary>
                          <!-- level6 -->
                          <ul class="level6-depth-wrapper">
                            <li
                              v-for="(level6, index6) in level5.items"
                              :key="level6.name"
                              class="level6-depth-list"
                              :class="getDarkModeClass()"
                              @click.stop.prevent="
                                handleCheckOptions(level6, level5)
                              "
                            >
                              <details
                                :ref="`level6-details-ref-${index3}-${index4}-${index5}-${index6}`"
                                class="level6-details"
                                :open="level6.checked"
                                :class="[
                                  {
                                    'disable-option': disableOption(
                                      level6,
                                      level5,
                                    ),
                                  },
                                ]"
                              >
                                <summary class="level6-summary">
                                  <div class="level6-depth-title-wrapper">
                                    <CheckBox
                                      class="active-check-box"
                                      :fill="categoryBackgroundColor"
                                    />
                                    <unCheckBox
                                      v-if="!isDarkMode"
                                      class="unActive-check-box"
                                    />
                                    <UnCheckBoxLight
                                      v-else
                                      class="unActive-check-box"
                                    />
                                    <p
                                      class="level6-depth-item"
                                      :class="getDarkModeClass()"
                                    >
                                      {{
                                        removeNewLine(
                                          translateLanguage(
                                            level6.nameArray,
                                            level6.name,
                                          ),
                                        )
                                      }}
                                    </p>
                                  </div>
                                  <p
                                    v-if="level6.isSale === 0"
                                    class="soldOut-option"
                                  >
                                    {{ t('품절') }}
                                  </p>
                                  <div
                                    v-else
                                    class="level4-option-price-wrapper"
                                  >
                                    <p
                                      class="level6-depth-price"
                                      :class="getDarkModeClass()"
                                    >
                                      +{{
                                        checkStandardPriceUnit(
                                          level6.price?.toLocaleString(),
                                        )
                                      }}
                                    </p>
                                  </div>
                                </summary>

                                <div
                                  v-if="isShowCountBox(level6)"
                                  class="level7-count"
                                >
                                  <GrayMinus
                                    class="level7-count-button"
                                    @click.stop="
                                      onClickOptionCountMinus(
                                        level6,
                                        $refs[
                                          `level6-details-ref-${index3}-${index4}-${index5}-${index6}`
                                        ],
                                      )
                                    "
                                  />
                                  <span
                                    class="level7-count-text"
                                    :class="getDarkModeClass()"
                                  >
                                    {{ `${level6.quantity}${t('개')}` }}
                                  </span>
                                  <GrayPlus
                                    class="level7-count-button"
                                    @click.stop="
                                      onClickOptionCountPlus(level6, level5)
                                    "
                                  />
                                </div>
                                <div
                                  v-if="level6.limitQty === 1"
                                  class="is-selected"
                                ></div>
                              </details>
                            </li>
                          </ul>
                        </details>
                      </li>
                    </ul>
                  </div>
                </details>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </main>
    <footer class="sheet-footer">
      <button
        class="close-button"
        @click="onCloseSheet"
      >
        {{ t('취소') }}
      </button>
      <button
        class="confirm-button"
        @click.stop="() => onConfirmSheet()"
      >
        {{ t('선택완료') }}
      </button>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.dimmer {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vw;
  background-color: #000;
  opacity: 0.4;
}

.disable-option {
  .level4-option-header-wrapper,
  .level4-option-price-wrapper,
  .level6-depth-title-wrapper {
    opacity: 0.4;
  }
}

.soldOut-option {
  font-size: 1.5625vw;
  font-weight: 400;
  color: #f91515;
}

.sheet-title {
  font-size: 2.3438vw;
  font-weight: 700;
  line-height: 3.125vw;

  &.dark-mode {
    color: #fff;
  }
}

.sheet-container {
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5625vw;
  width: 52.8125vw;
  height: 100vh;
  min-height: 100%;
  padding: 1.5625vw;
  overflow: auto;
  background-color: #fff;
  border-radius: 1.25vw 0 0 1.25vw;
  box-shadow: 0 0 3.4375vw 0 rgba(0, 0, 0, 0.35);
  animation: slideIn 0.3s forwards;

  &.dark-mode {
    background: #1c1c1c;
    border: 0.078125vw solid #494949;
    box-shadow: -2.34375vw 0 3.4375vw 0 rgba(0, 0, 0, 0.55);
  }
}

.sheet-main {
  flex-grow: 1;
  overflow: auto;
}

.level3 {
  display: flex;
  flex-direction: column;
  gap: 1.25vw;

  .level3-details {
    background: #fff;
    border: 0.078125vw solid #d5d5d5;
    border-radius: 0.78125vw;

    /* transition: max-height 1s ease; */
    &.dark-mode {
      background: #181818;
      border: 0.1171875vw solid #5b5b5b;
    }

    .level3-sheet-summary {
      padding: 1.5625vw;
      list-style: none;

      svg {
        transition: all 0.2s;
      }
    }

    .level3-option-header-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .level3-option-header-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.46875vw;
    }

    .level3-option-header-title {
      display: flex;
      flex-direction: row;
      gap: 0.46875vw;
    }

    .level3-option-title {
      max-width: 27.34375vw;
      overflow: hidden;
      font-size: 1.875vw;
      font-weight: 700;
      line-height: 2.34375vw;
      color: #313131;
      text-overflow: ellipsis;
      letter-spacing: -0.05624vw;
      white-space: nowrap;
      &.dark-mode {
        color: #fff;
      }
    }

    .level3-option-required {
      display: inline-flex;
      align-items: center;
      padding: 0.3125vw 0.46875vw;
      font-size: 1.09375vw;
      font-weight: 700;
      line-height: 1.40625vw;
      color: #f91515;
      letter-spacing: -0.0328124vw;
      background: #ffe9ec;
      border-radius: 0.625vw;
    }

    .level3-option-quantity {
      font-size: 1.25vw;
      font-weight: 400;
      color: #7a7a7a;

      &.dark-mode {
        color: #959595;
      }
    }

    &.level3-details[open] summary {
      border-radius: 0.78125vw 0.78125vw 0 0;
    }

    &.level3-details .level3-sheet-summary svg {
      transform: rotate(90deg);
    }

    &.level3-details[open] .level3-sheet-summary svg {
      transform: rotate(-90deg);
    }
  }
}

.level4 {
  background-color: #f8f8f8;
  border-top: 0.078125vw solid #d5d5d5;
  border-radius: 0 0 0.78125vw 0.78125vw;

  &.dark-mode {
    background-color: #313131;
    border-color: #5b5b5b;
  }

  .level4-options-group {
    padding: 1.5625vw;
    border-bottom: 0.078125vw solid #d5d5d5;

    &.dark-mode {
      border-color: #5b5b5b;
    }
  }

  .level4-summary {
    list-style: none;
  }

  .level4-option-header-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .level4-option-header-wrapper {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    gap: 0.9375vw;
    align-items: center;
  }

  .level4-depth-option[open] .active-check-box {
    display: block;
    width: 2.5vw;
    height: 2.5vw;
  }

  .level4-depth-option .active-check-box {
    display: none;
  }

  .level4-depth-option[open] .unActive-check-box {
    display: none;
  }

  .level4-depth-option .unActive-check-box {
    display: block;
    width: 2.5vw;
    height: 2.5vw;
  }

  .level4-depth-option .level4-option-title {
    max-width: 27.34375vw;
    overflow: hidden;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .level4-option-header-title {
    font-size: 1.875vw;
    font-weight: 500;
    line-height: 2.34375vw;
    color: #313131;
    letter-spacing: -0.05624vw;

    &.dark-mode {
      color: #f8f8f8;
    }
  }

  .level4-option-price {
    font-size: 1.5625vw;
    font-style: normal;
    font-weight: 400;
    line-height: 1.875vw;
    color: #7a7a7a;
    text-align: right;
    letter-spacing: -0.04687vw;

    &.dark-mode {
      color: #ebebeb;
    }
  }
  .level4-option-price-wrapper {
    display: flex;
    flex-direction: row;
    gap: 0.625vw;
    align-items: center;
  }
  .level4-options-group:last-child {
    border-bottom: none;
  }

  .level4-depth-option .list-arrow {
    width: 1.5625vw;
    height: 1.5625vw;
    transition: all 0.2s;
    transform: rotate(90deg);
  }

  .level4-depth-option[open] .list-arrow {
    transform: rotate(270deg);
  }
}

.level5-count {
  display: flex;
  flex-direction: row;
  gap: 1.875vw;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1.25vw;
  text-align: right;

  .level5-count-button {
    width: 4.921875vw;
    height: 4.21875vw;
  }

  svg {
    transition: all 0.2s;
  }

  .level5-count-text {
    font-size: 2.8125vw;
    font-style: normal;
    font-weight: 700;
    line-height: 3.75vw;
    color: #313131;
    text-align: center;
    letter-spacing: -0.0562vw;

    &.dark-mode {
      color: #fff;
    }
  }
}

.level5-depth-wrapper {
  display: flex;
  flex-direction: row;
  gap: 0.625vw;
  align-items: baseline;
  padding-left: 0.625vw;
  margin-top: 1.5625vw;

  .level5-depth-option {
    width: 100%;
    background-color: #fff;
    border: 0.078125vw solid #d5d5d5;
    border-radius: 0.625vw;

    &.dark-mode {
      background-color: #181818;
      border-color: #5b5b5b;
    }
  }

  .level5-depth-item {
    border-bottom: 0.078125vw solid #d5d5d5;
  }

  .level5-depth-item:last-child {
    border-bottom: none;
  }

  .level5-depth-details .level5-depth-summary {
    padding: 1.5625vw;
    list-style: none;
  }

  .level5-level3-option-header-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .level5-option-header-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.46875vw;
  }

  .level5-option-header-title {
    display: flex;
    flex-direction: row;
    gap: 0.46875vw;
  }

  .level5-option-title {
    max-width: 27.34375vw;
    overflow: hidden;
    font-size: 1.875vw;
    font-weight: 700;
    line-height: 2.34375vw;
    color: #313131;
    text-overflow: ellipsis;
    letter-spacing: -0.05624vw;
    white-space: nowrap;

    &.dark-mode {
      color: #ebebeb;
    }
  }

  .level5-option-required {
    display: inline-flex;
    align-items: center;
    padding: 0.3125vw 0.46875vw;
    font-size: 1.09375vw;
    font-weight: 700;
    line-height: 1.40625vw;
    color: #f91515;
    letter-spacing: -0.032812vw;
    background: #ffe9ec;
    border-radius: 0.625vw;
  }

  .level5-option-quantity {
    font-size: 1.25vw;
    font-weight: 400;
    color: #7a7a7a;

    &.dark-mode {
      color: #959595;
    }
  }

  .level5-depth-details .level5-level3-option-header-container .list-arrow {
    transform: rotate(90deg);
  }

  .level5-depth-details[open]
  .level5-level3-option-header-container
  .list-arrow {
    transform: rotate(-90deg);
  }
}

.level6-depth-wrapper {
  .level6-depth-title-wrapper {
    display: flex;
    flex-direction: row;
    gap: 0.9375vw;
    align-items: center;
  }

  .level6-depth-item {
    max-width: 27.34375vw;
    overflow: hidden;
    font-size: 1.5625vw;
    font-style: normal;
    font-weight: 500;
    line-height: 1.875vw;
    color: #5b5b5b;
    text-overflow: ellipsis;
    letter-spacing: -0.04687vw;
    white-space: nowrap;

    &.dark-mode {
      color: #ebebeb;
    }
  }

  .level6-depth-list {
    padding: 1.5625vw;
    border-top: 0.078125vw solid #d5d5d5;

    &.dark-mode {
      border-color: #5b5b5b;
    }
  }

  .level6-depth-price {
    font-size: 1.5625vw;
    font-style: normal;
    font-weight: 400;
    line-height: 1.875vw;
    color: #7a7a7a;
    text-align: right;
    letter-spacing: -0.046874vw;

    &.dark-mode {
      color: #ebebeb;
    }
  }

  .level6-details .level6-summary {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    list-style: none;
  }

  .level6-details[open] .active-check-box {
    display: block;
    width: 2.5vw;
    height: 2.5vw;
  }

  .level6-details:not([open]) .active-check-box {
    display: none;
  }

  .level6-details[open] .unActive-check-box {
    display: none;
  }

  .level6-details:not([open]) .unActive-check-box {
    display: block;
    width: 2.5vw;
    height: 2.5vw;
  }
}

.level7-count {
  display: flex;
  flex-direction: row;
  gap: 1.875vw;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1.25vw;
  text-align: right;

  .level7-count-button {
    width: 4.921875vw;
    height: 4.21875vw;
  }

  svg {
    transition: all 0.2s;
  }

  .level7-count-text {
    font-size: 2.8125vw;
    font-style: normal;
    font-weight: 700;
    line-height: 3.75vw;
    color: #313131;
    text-align: center;
    letter-spacing: -0.05624vw;

    &.dark-mode {
      color: #fff;
    }
  }
}

.sheet-footer {
  display: flex;
  gap: 1.25vw;
}

.close-button {
  padding: 1.25vw 7.6172vw;
  font-size: 2.3438vw;
  font-weight: 700;
  line-height: 3.125vw;
  color: #fff;
  background-color: #5b5b5b;
  border: none;
  border-radius: 0.7813vw;
  box-shadow: none;
}

.confirm-button {
  flex-grow: 1;
  padding: 1.25vw 1.875vw;
  font-size: 2.3438vw;
  font-weight: 700;
  line-height: 3.125vw;
  color: v-bind(buttonFontColor);
  background-color: v-bind(buttonBackgroundColor);
  border: none;
  border-radius: 0.7813vw;
  box-shadow: none;

  &.button-active {
    background-color: v-bind(getActiveButtonColor(buttonBackgroundColor));
  }
}
</style>
