<template>
  <div
    class="option-select-body"
    :class="{ 'not-basic': optionLayout.type !== BASIC }"
  >
    <div
      class="option-wrap"
      :class="{ 'not-basic': optionLayout.type !== BASIC }"
    >
      <slot name="group"/>
    </div>
    <div
      v-if="optionLayout.type === BASIC"
      class="select-wrap"
    >
      <div class="select-title">
        <p
          v-if="isNoLimit && isItemType"
          class="comment"
        >
          *{{ t('갯수 제한이 없습니다.') }}
        </p>
        <p
          v-else
          class="comment"
        >
          *{{ getLimitSelectString((options[selectedOptionGroup] as CartProductOptionGroupType).maxLimitQty) }}
        </p>
      </div>
      <ul class="select-list">
        <li
          v-if="!isSelectOptionRequire"
          class="select-item"
          :class="{
            active: isEmptySelectOptionItems(getSelectOptionItems),
            'not-basic': optionLayout.type !== BASIC,
          }"
          @click="deleteOptionItemAll"
        >
          <div class="name">
            <img :src="isOptionChecked(isEmptySelectOptionItems(getSelectOptionItems))">
            <span class="text">
              {{ t('선택 안 함') }}
            </span>
          </div>
        </li>
        <slot name="select"/>
      </ul>
      <div class="button-wrap">
        <div
          v-if="isNotZeroSelectedOptionGroup"
          class="prev-button"
          @click="changeSelectOptionIndex(prevSelectedOptionGroup)"
        >
          {{ t('이전') }}
        </div>
        <div
          v-if="isNotLastSelectedOptionGroup"
          class="next-button"
          :class="{ active: !isEmptySelectOptionItems(getSelectOptionItems) }"
          @click="changeSelectOptionIndex(selectedOptionGroupNum)"
        >
          {{ t('다음') }}
        </div>
      </div>
    </div>
    <div
      class="product-wrap"
      :class="{
        'not-basic': optionLayout.type !== BASIC,
        black: optionLayout.color === BLACK,
        white: optionLayout.color === WHITE,
      }"
    >
      <div
        v-if="optionLayout.type !== BASIC && tabActive === 'detail'"
        class="product-detail"
      >
        <img
          v-if="product.image"
          class="product-image"
          :src="product.image"
          alt="product-image"
        >
        <div
          v-else
          class="product-empty-image"
        >
          <img src="https://s3.ap-northeast-2.amazonaws.com/images.good.orderhae.com/logo/torder_logo_white.svg">
        </div>
        <span class="product-detail-name">{{ newLineHelper(translateLanguage(product.productLanguageDetail, product.productLanguageDetail.ko)) }}</span>
        <span class="product-detail-text">{{ productDetail }}</span>
      </div>
      <div v-if="optionLayout.type === BASIC">
        <div class="product-name">
          {{ removeNewLine(translateLanguage(product?.productLanguageDetail, product.productLanguageDetail?.ko)) }}
        </div>
        <div class="product-price">
          <div class="text">
            {{ t('기본 가격') }}
          </div>
          <div class="price">
            {{ checkStandardPriceUnit(product.price?.toLocaleString()) }}
          </div>
        </div>
      </div>
      <ul
        v-if="optionLayout.type === BASIC || tabActive === 'selectOption'"
        class="product-selected-option-list"
      >
        <slot name="selected"/>
      </ul>
      <div v-if="optionLayout.type === BASIC">
        <div class="product-price-all">
          <div
            v-if="isSingleProduct"
            class="quantity"
          >
            {{ `1${t('개')}` }}
          </div>
          <div
            v-else
            class="option-item-quantity-wrap"
          >
            <img
              class="quantity-img"
              src="https://static.torder.co.kr/torder2/goods-increase-black-42x42.svg"
              @click="increaseProductQuantity"
            >
            <div class="quantity">
              {{ product.quantity }}
              {{ t('개') }}
            </div>
            <img
              class="quantity-img"
              src="https://static.torder.co.kr/torder2/goods-decrease-black-42x42.svg"
              @click="decreaseProductQuantity"
            >
          </div>
          <div class="price">
            {{ checkStandardPriceUnit(getTotalPrice) }}
          </div>
        </div>
        <div
          class="cart-add-button"
          @click="addCart"
        >
          {{ t('장바구니 담기') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import {
  removeNewLine,
  newLineHelper,
  getSubPrimaryColor,
} from '@torder/common/utils';
import {
  CartProductOptionGroupType,
  CartProductOptionType,
  cartProductType,
} from '@torder/common/interface/cartProduct';
import {
  BASIC,
  BLACK,
  WHITE,
} from '@torder/common/constant';
import useInitStore from '@store/storeInit';

const {
  buttonBackgroundColor,
  buttonFontColor,
  activeFontColor,
} = storeToRefs(useInitStore());

defineProps<{
  product: cartProductType,
  options: (CartProductOptionGroupType | CartProductOptionType)[],
  getTotalPrice: string,
  selectOptionItems: CartProductOptionType[],
  selectedOptionGroup: number,
  selectedOptionGroupNum: number,
  prevSelectedOptionGroup: number,
  changeSelectOptionIndex: (index: number) => void,
  isOptionChecked: (checked: boolean) => string,
  isSingleProduct: boolean,
  isEmptySelectOptionItems: (optionItems: CartProductOptionType[]) => boolean,
  isNotZeroSelectedOptionGroup: boolean,
  isNotLastSelectedOptionGroup: boolean,
  isSelectOptionRequire: boolean,
  deleteOptionItemAll: () => void,
  getSelectOptionItems: CartProductOptionType[],
  increaseProductQuantity: () => void,
  decreaseProductQuantity: () => void,
  addCart: () => void,
  isNoLimit: boolean,
  isItemType: boolean,
  t: (str: string) => string,
  optionLayout: {type: string; color: string},
  tabActive: string,
  productDetail: string,
  getLimitSelectString: (count: number) => string,
}>();

const getActiveButtonColor = () => getSubPrimaryColor(buttonBackgroundColor.value, 10, 'Y');

</script>

<style scoped lang='scss'>
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-select-body {
  display: flex;
  flex-direction: row;
  gap: 1.5625vw;
  justify-content: space-around;
  height: 90%;
  margin: 0 1vw 1vw 1vw;

  &.not-basic{
    justify-content: space-between;
    height: auto;
    margin: 0 1vw 1.5vw 1.5vw;
  }
}

.option-wrap {
  display: flex;
  flex-direction: column;
  width: 23%;
  overflow: scroll;
  border-radius: .3906vw;

  &.not-basic{
    gap: .7813vw;
    width: 63%;
    overflow: scroll;
  }
}

.select-wrap {
  display: flex;
  flex-direction: column;
  width: 40%;
  padding: 1vw 2vw;
  overflow: auto;
  background-color: #fff;
  border-radius: .3906vw;

  .select-list {
    flex: 1;
    flex-basis: 0;
    overflow: auto;

    .select-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.4vw 2vw;
      margin-bottom: 1vw;
      line-height: 1.5vw;
      word-break: break-all;
      background-color: #f5f5f5;
      border: .0781vw solid #dcdcdc;
      border-radius: .7813vw;

      &.active {
        border: .2344vw solid v-bind(activeFontColor);

        &.not-basic{
          border: none;
        }
      }

      .name {
        display: flex;
        align-items: center;

        .text {
          margin-left: 0.3vw;
          font-size: 1.6406vw;
        }
      }
    }
  }

  .button-wrap {
    display: flex;
    gap: 1.3vw;

    .prev-button {
      @include flex-center();
      width: 100%;
      height: 4vw;
      margin-top: 1vw;
      font-size: 2vw;
      color: #fff;
      background-color: black;
      border-radius: .7813vw;

      &.button-active {
        filter: opacity(0.8);
      }
    }

    .next-button {
      @include flex-center();
      width: 100%;
      height: 4vw;
      margin-top: 1vw;
      font-size: 2vw;
      color: v-bind(buttonFontColor);
      background-color: black;
      border-radius: .7813vw;

      // 다음버튼을 누를 수 있는 경우
      &.active {
        background-color: v-bind(buttonBackgroundColor);
      }
      // 버튼 pressed 효과
      &.button-active {
        filter: opacity(0.8);
      }
    }
  }

  .select-title {
    display: flex;
    flex-direction: column;

    .comment {
      padding-left: 1.5vw;
      margin-top: 1.9vw;
      margin-bottom: 2.1vw;
      font-size: 1.4063vw;
    }

    .title-wrap {
      display: flex;

      .number {
        @include flex-center();
        width: 2vw;
        height: 2vw;
        margin-right: 0.5vw;
        font-size: 1.4vw;
        font-weight: 700;
        color: v-bind(buttonFontColor);
        background-color: v-bind(buttonBackgroundColor);
        border-radius: .3906vw;
      }

      .name {
        font-size: 2.125vw;
      }

      .require {
        @include flex-center();
        margin-left: 1vw;
        font-weight: 700;
        color: v-bind(activeFontColor);
      }
    }
  }
}

.product-wrap {
  display: flex;
  flex-direction: column;
  width: 31.875vw;
  padding: 1vw 2vw;
  background-color: #fff;
  border-radius: .3906vw;

  &.not-basic{
    width: 34.5%;
    padding: 0;
    background-color: transparent;

    &.black{
      .product-detail{
        color: #fff;

        .product-detail-name {
          word-break: break-all;
          white-space: pre-wrap;
        }
      }
    }

    &.white{
      .product-detail{
        color: #000;

        .product-detail-name {
          word-break: break-all;
          white-space: pre-wrap;
        }
      }
    }

    .product-selected-option-list{
      gap: 1.9531vw;
      padding-top: .7813vw;
      padding-right: .7813vw;
    }

    .product-detail{
      display: flex;
      flex-direction: column;
      gap: 1.5625vw;
      height: 100%;
      font-size: 2.125vw;
      font-weight: 500;

      .product-image{
        width: 100%;
        height: 23.4375vw;
        border-radius: .7813vw;
        object-fit: fill;
        object-position: center;
      }

      .product-empty-image {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 31.55vw;
        height: 23.4375vw;
        border-radius: .7813vw;
      }

      .product-detail-text{
        overflow: scroll;
        font-size: 1.25vw;
        font-weight: 300;
        line-height: 1.5;
        word-break: break-word;
        white-space: pre-wrap;
      }
    }
  }

  .product-name {
    padding: 1vw 0;
    font-size: 2.0313vw;
    font-weight: 500;
    word-break: break-all;
    white-space: pre-line;
    border-bottom: 0.2vw solid #202020;
  }

  .product-price {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1vw 0;
    margin-top: 1vw;
    font-size: 1.7188vw;
    border-bottom: .0781vw solid gray;

    .text {
      font-weight: 500;
    }

    .price {
      font-weight: 700;
    }
  }

  .product-selected-option-list {
    display: flex;
    flex: 1;
    flex-basis: 0;
    flex-direction: column;
    overflow: auto;
  }

  .product-price-all {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1vw;
    margin: 0 0 0.7813vw;
    border-top: 0.1vw solid #202020;

    .quantity {
      margin-left: 1vw;
      font-size: 2vw;
    }

    .price {
      font-size: 2.6563vw;
      font-weight: 700;
      color: v-bind(activeFontColor);
    }
  }

  .cart-add-button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4.8vw;
    padding: 0 1vw;
    font-size: 2vw;
    font-weight: 700;
    color: #fff;
    background-color: v-bind(buttonBackgroundColor);
    border-radius: .7813vw;

    &.button-active {
      background-color: v-bind(getActiveButtonColor());
    }
  }
}

.option-item-quantity-wrap {
  display: flex;
  gap: 1vw;
  align-items: center;

  .quantity {
    font-size: 2vw;
  }

  .quantity-img {

    &.button-active {
      filter: opacity(0.7);
    }
  }
}
</style>
