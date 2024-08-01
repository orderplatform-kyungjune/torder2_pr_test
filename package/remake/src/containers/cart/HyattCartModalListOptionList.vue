<script setup lang="ts">
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import {
  productOptionItemType,
  productOptionType,
  productType,
} from '@torder/common/interface/product';
import {
  CartProductOptionGroupType,
  cartProductType,
} from '@torder/common/interface/cartProduct';
import useInitStore from '@store/storeInit';

const { getDarkModeClass } = useInitStore();

const { group, option, t, price, isSetMenu } = defineProps<{
  group:
    | productOptionItemType
    | productType
    | CartProductOptionGroupType
    | cartProductType;
  option: productOptionItemType | productType;
  t: (str: string) => string;
  price: number;
  isSetMenu: boolean;
}>();

const getPriceOfOptionItem = (subOption: productOptionItemType) => {
  const optionItem = subOption as productOptionItemType;

  if (optionItem.price !== 0) return optionItem.price;
  return optionItem.price;
};

const getNameOfOptionItem = (subOption: productOptionItemType) => {
  const optionItem = subOption as productOptionItemType;
  return optionItem.nameArray;
};

const isProduct = (
  option: productOptionItemType | productType | CartProductOptionGroupType,
) => {
  if (option.isProduct) return true;
  return false;
};

const hasOptionPrice = (
  option:
    | productOptionItemType
    | productType
    | CartProductOptionGroupType
    | productOptionType,
) => {
  if ('price' in option && option.price !== 0) return true;

  return false;
};

const isNotSelected = (option: productOptionItemType) =>
  option.code !== 'not_select';
</script>

<template>
  <div class="cart-item-options">
    <div class="option-list">
      <!-- 상품일 경우 -->
      <!-- {{ option }} -->
      <div
        v-if="isProduct(option)"
        class="no-more-option"
      >
        <span class="option-title ellipsis-text-2">
          {{
            translateLanguage(
              (option as productType).productLanguageDetail,
              (option as productType).productLanguageDetail?.ko,
            )
          }}({{ option.quantity }}{{ t('개') }})
        </span>
        <span
          v-if="hasOptionPrice(option)"
          class="option-price"
        >
          {{ price?.toLocaleString() }}
        </span>
      </div>
      <!-- 상품이 아닐 경우 -->
      <template v-else>
        <div
          v-if="isSetMenu"
          class="sub-option-list"
        >
          <span class="sub-option-name">
            └
            {{
              translateLanguage(
                getNameOfOptionItem(option as productOptionItemType),
                getNameOfOptionItem(option as productOptionItemType)?.ko,
              )
            }}({{ option.quantity }}{{ t('개') }})
          </span>
          <span
            v-if="hasOptionPrice(option)"
            class="sub-option-price"
          >
            {{
              getPriceOfOptionItem(
                option as productOptionItemType,
              )?.toLocaleString()
            }}
          </span>
        </div>
        <!-- 티오더2에서 사용중인 컴포넌트 -->
        <div
          v-else-if="isNotSelected(option as productOptionItemType)"
          class="no-more-option"
          :class="getDarkModeClass()"
        >
          <span>
            <!-- <p>기본</p> -->
            - {{ group?.name }} /
            {{
              translateLanguage(
                (option as productOptionItemType).nameArray,
                (option as productOptionItemType)?.name,
              )
            }}
            x{{ option.quantity }} ({{
              checkStandardPriceUnit(price?.toLocaleString())
            }})
          </span>

          <!-- <span class="option-container">
            <div class="option-title ellipsis-text-2">
              {{ translateLanguage((option as productOptionItemType).nameArray, (option as productOptionItemType)?.name) }}
            </div>
            <div class="option-info-wrap">
              <span class="option-count">
                ({{ option.quantity }}{{ t('개') }})
              </span>
              <span class="option-price">
                {{ checkStandardPriceUnit(price?.toLocaleString()) }}
              </span>
            </div>
          </span> -->
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-item-options {
  font-size: 1.4063vw;
  color: #000;

  .option-list {
    font-size: 1.5625vw;
    word-break: break-word;

    .no-more-option {
      font-size: 1.25vw;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      color: #246ff4;
      letter-spacing: -0.0375vw;

      &.dark-mode {
        color: #42a4ff;
      }

      .option-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.3125vw;
        justify-content: space-between;
        width: 100%;

        .option-title {
          font-size: 1.5625vw;
          font-weight: 400;
          line-height: normal;
          text-align: left;
          letter-spacing: -0.0375vw;
        }

        .option-info-wrap {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: space-between;

          .option-count {
            font-size: 1.5625vw;
            font-weight: 700;
            letter-spacing: -0.0375vw;
            white-space: nowrap;
          }

          .option-price {
            font-weight: 700;
            line-height: 1.875vw;
            letter-spacing: -0.0313vw;
            white-space: nowrap;
          }
        }
      }
    }
  }

  .sub-option-list {
    display: grid;
    grid-template-columns: 70% 30%;
    color: #000;
    word-break: break-word;

    .sub-option-name {
      margin: 0.1563vw 0 0.1563vw -0.3906vw;
    }

    .sub-option-price {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
