<template>
  <div class="option-select-body">
    <div class="option-wrap">
      <div class="option-group-title">
        {{ t('옵션선택') }}
      </div>
      <slot name="group"/>
    </div>
    <div class="select-wrap">
      <div class="select-title">
        <div class="title">
          <span class="name">{{ translateLanguage(options[selectedOptionGroup].nameArray, options[selectedOptionGroup].name) }}</span>
          <span
            v-if="isSelectOptionRequire"
            class="require"
          >/{{ t('필수선택') }}</span>
        </div>
        <div
          v-if="isNoLimit"
          class="comment"
          :data-cy-min=" isItemType ? 1 : (options[selectedOptionGroup] as CartProductOptionGroupType).require"
          :data-cy-max="isItemType ? 0 : (options[selectedOptionGroup] as CartProductOptionGroupType).maxLimitQty"
        >
          *{{ t('갯수 제한이 없습니다.') }}
        </div>
        <div
          v-else
          class="comment"
          :data-cy-min=" isItemType ? 1 : (options[selectedOptionGroup] as CartProductOptionGroupType).require"
          :data-cy-max="isItemType ? 0 : (options[selectedOptionGroup] as CartProductOptionGroupType).maxLimitQty"
        >
          *{{ (options[selectedOptionGroup] as CartProductOptionGroupType).maxLimitQty }}
          {{ `${t('개 까지')} ${t('선택 가능')}` }}
        </div>
      </div>
      <ul class="select-list">
        <li
          v-if="!isSelectOptionRequire"
          class="select-item"
          :class="{ active: isEmptySelectOptionItems(getSelectOptionItems) }"
          @click="deleteOptionItemAll"
        >
          <div class="name">
            <img :src="optionCheckImgRestaurant(isEmptySelectOptionItems(getSelectOptionItems))">
            <span class="text">{{ t('선택 안 함') }}
            </span>
          </div>
        </li>
        <slot name="select"/>
      </ul>
    </div>
    <div class="product-wrap">
      <div class="product-selected-wrap">
        <div class="product-name">
          {{ translateLanguage(product?.productLanguageDetail, product?.productLanguageDetail?.ko) }}
        </div>
        <div class="product-price">
          <div class="text">
            {{ t('기본 가격') }}
          </div>
          <div class="price">
            {{ product.price?.toLocaleString() }}
          </div>
        </div>
        <ul class="product-selected-option-list">
          <slot name="selected"/>
        </ul>
        <div class="option-item-quantity-wrap">
          <img
            class="quantity-img"
            src="https://static.torder.co.kr/torder2/cart-increase-black-80x60.svg"
            @click="increaseProductQuantity"
          >
          <div class="quantity">
            {{ product.quantity }}
            {{ t('개') }}
          </div>
          <img
            class="quantity-img"
            src="https://static.torder.co.kr/torder2/cart-decrease-black-80x60.svg"
            @click="decreaseProductQuantity"
          >
        </div>
        <div class="product-price-all">
          <div class="text">
            {{ t('합계') }}
          </div>
          <div class="price">
            {{ checkStandardPriceUnit(getTotalPrice) }}
          </div>
        </div>
      </div>
      <div class="cart-button-wrap">
        <div
          class="close-cart-button"
          @click="closeProductOption"
        >
          {{ t('닫기') }}
        </div>
        <div
          class="add-cart-button"
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
  CartProductOptionGroupType,
  CartProductOptionType,
  cartProductType,
} from '@torder/common/interface/cartProduct';
import useInitStore from '@store/storeInit';

const {
  categoryBackgroundColor,
  categoryBackgroundImage,
  buttonBackgroundColor,
  buttonFontColor,
} = storeToRefs(useInitStore());

defineProps<{
  product: cartProductType,
  options: (CartProductOptionGroupType | CartProductOptionType)[],
  getTotalPrice: string,
  selectOptionItems: CartProductOptionType[],
  selectedOptionGroup: number,
  changeSelectOptionIndex: (index: number) => void,
  optionCheckImgRestaurant: (checked: boolean) => string,
  isEmptySelectOptionItems: (optionItems: CartProductOptionType[]) => boolean,
  isSelectOptionRequire: boolean,
  deleteOptionItemAll: () => void,
  getSelectOptionItems: CartProductOptionType[],
  increaseProductQuantity: () => void,
  decreaseProductQuantity: () => void,
  closeProductOption: () => void,
  addCart: () => void,
  isNoLimit: boolean,
  isItemType: boolean,
  t: (str: string) => string,
}>();
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
  justify-content: space-around;
  height: 100%;
}

.option-wrap {
  display: flex;
  flex-direction: column;
  width: 20%;
  padding-top: 3.0469vw;
  padding-left: 1.5731vw;
  overflow: auto;
  background-color: v-bind(categoryBackgroundColor);
  background-image: v-bind(categoryBackgroundImage);
  border-radius: 0 3.125vw 0 0;

  .option-group-title {
    margin-bottom: 4.2188vw;
    font-family: 'Noto Serif KR',serif;
    font-size: 2.8125vw;
    font-weight: 500;
    color: #fff;
    background-color: v-bind(categoryBackgroundColor);
  }
}

.select-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1vw 2vw;
  padding-top: 3.0469vw;
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
      border: .1563vw solid #dcdcdc;
      border-radius: .7813vw;

      &.active {
        border: solid .1563vw #2f2a26;
      }

      .name {
        display: flex;
        align-items: center;

        .text {
          margin-left: 1.2vw;
          font-family: 'Noto Serif KR', sans-serif;
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
    }

    .next-button {
      @include flex-center();
      width: 100%;
      height: 4vw;
      margin-top: 1vw;
      font-size: 2vw;
      color: #fff;
      background-color: black;
      border-radius: .7813vw;

      &.active{
        background-color: red;
      }
    }
  }

  .select-title {
    display: grid;
    grid-template-columns: 1fr 15.625vw;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.3438vw;

    .comment {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      font-size: 1.5625vw;
      color: #999;
    }

    .title {
      font-family: 'Noto Serif KR', serif;
      font-size: 2.0313vw;
    }
  }
}

.product-wrap {
  display: flex;
  flex-direction: column;
  width: 34%;
  padding-top: 3.0469vw;
  background-color: #f6f6f6;
  border-radius: .3906vw;

  .product-selected-wrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0 2.3438vw;

    .product-name {
      padding-bottom: 1vw;
      font-family: 'Noto Serif KR', serif;
      font-size: 2.0313vw;
      font-weight: bold;

      line-height: 1.85;
      word-break: break-all;
      border-bottom: 0.2vw solid #202020
    }

    .product-price {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1vw 0;
      margin-top: 1vw;

      .text {
        font-size: 1.5625vw;
      }

      .price {
        font-size: 1.7188vw;
        font-weight: bold
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
      padding-top: 1.1719vw;
      padding-bottom: 1.5625vw;
      font-weight: 500;

      .quantity {
        margin-left: 1vw;
        font-size: 2vw;
      }

      .text {
        font-family: 'Pretendard', sans-serif;
        font-size: 1.5625vw;
      }

      .price {
        font-family: 'Noto Serif KR', sans-serif;
        font-size: 1.875vw;
      }
    }
  }

  .cart-button-wrap {
    display: flex;
    width: 100%;
    height: 4.8vw;
    font-family: 'Pretendard', sans-serif;
    font-size: 2vw;
    font-weight: 500;
    color: #fff;

    .add-cart-button {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      padding: 0 1vw;
      color: v-bind(buttonFontColor);
      background-color: v-bind(buttonBackgroundColor);
    }

    .close-cart-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32.5%;
      background-color: #999;
    }
  }
}

.option-item-quantity-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.4844vw;
  background-color: #fff;
  border-top: solid .1563vw #2f2a26;
  border-bottom: solid .1563vw #2f2a26;
  border-radius: .7813vw;

  .quantity {
    font-size: 2vw;
  }
}
</style>
