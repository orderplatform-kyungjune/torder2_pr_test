<template>
  <div
    class="option-select-header"
    :class="{
      'not-basic': optionLayout.type !== BASIC,
      black: optionLayout.color === BLACK,
      white: optionLayout.color === WHITE,
    }"
  >
    <div
      class="option-select-title"
      :class="{
        'not-basic': optionLayout.type !== BASIC,
        black: optionLayout.color === BLACK,
        white: optionLayout.color === WHITE,
      }"
    >
      <span class="option-select-title-name">
        {{ removeNewLine(translateLanguage(product?.productLanguageDetail, product?.productLanguageDetail?.ko)) }}
      </span>
      <div
        v-if="optionLayout.type !== BASIC"
        class="title-price"
      >
        <img
          v-if="optionLayout.color === WHITE"
          src="https://static.torder.co.kr/torder2/icn_right_triangle_black.png"
          alt="option-head-arrow"
        >
        <img
          v-else
          src="https://static.torder.co.kr/torder2/icn_right_triangle_white.png"
          alt="option-head-arrow"
        >
        <span class="option-select-title-price">
          {{ `${t('기본금액')} ${checkStandardPriceUnit(basicPrice)}` }}
        </span>
      </div>
    </div>
    <div
      v-if="optionLayout.type === BASIC"
      class="option-select-close"
      @click="closeProductOption"
    >
      <img
        class="img"
        src="https://static.torder.co.kr/torder2/svg_closebutton_normal_white.svg"
      >
      <div class="text">
        {{ t('닫기') }}
      </div>
    </div>
    <div
      v-else
      class="option-page-tab"
      :class="{
        black: optionLayout.color === BLACK,
        white: optionLayout.color === WHITE,
      }"
    >
      <div
        class="tab-button"
        :class="{ 'button-active': tabActive === 'detail' }"
        name="detail"
        @click="clickTab"
      >
        {{ t('상품설명') }}
      </div>
      <div
        class="tab-button"
        :class="{ 'button-active': tabActive === 'selectOption' }"
        name="selectOption"
        @click="clickTab"
      >
        {{ t('선택한 옵션') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { removeNewLine } from '@torder/common/utils';
import { cartProductType } from '@torder/common/interface/cartProduct';
import {
  BASIC,
  BLACK,
  WHITE,
} from '@torder/common/constant';
import useInitStore from '@store/storeInit';

const { buttonBackgroundColor } = storeToRefs(useInitStore());

defineProps<{
  product: cartProductType,
  closeProductOption: () => void,
  t: (str: string) => string,
  basicPrice: string,
  optionLayout: {type: string; color: string},
  tabActive: string,
  clickTab: (e: MouseEvent) => void,
}>();
</script>

<style scoped lang="scss">
.option-select-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 10%;
  margin-top: 1vw;
  margin-right: 1vw;
  margin-bottom: 1vw;
  margin-left: 1.7vw;
  color: #fff;

  &.not-basic{
    display: grid;
    grid-template-columns: 63% 35.5%;
    height: auto;
  }

  .option-select-close {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 2vw;

    .img {
      width: 2.5vw;
    }

    .text {
      margin-left: 0.6vw;
      font-size: 2.375vw;
      line-height: 1.9531vw;
    }
  }

  .option-select-title {
    display: flex;
    align-items: center;
    width: 82vw;
    padding-left: 1.2vw;
    border-left: .3906vw solid v-bind(buttonBackgroundColor);

    .option-select-title-name {
      overflow: hidden;
      font-size: 2.3438vw;
      font-weight: 500;
      line-height: 1.2;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &.not-basic{
      width: 58.3125vw;
      padding-left: 0vw;
      font-weight: 700;
      color: v-bind(buttonBackgroundColor);
      border: none;

      .title-price{
        display: flex;
        align-items: center;
        font-weight: 500;

        .option-select-title-price {
          white-space: nowrap;
        }
      }

      &.white{
        .title-price{
          color: #000;
        }
      }
    }

    .title-price{
      padding-left: 1.5625vw;
      color: #fff;

      img{
        padding-right: .7813vw;
      }
    }
  }

  .option-page-tab{
    display: grid;
    grid-template-columns: 49% 49%;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 0 .7813vw;

    &.black{
      .tab-button{
        color: #ccc;
        background-color: #1e1a1a;
        border: .0781vw solid #000;

        &.button-active{
          color: #fff;
          background-color: #362c2c;
        }
      }
    }
    &.white{
      .tab-button{
        color: #666;
        background-color: #f5f5f5;
        border: .0781vw solid #b9b9b9;

        &.button-active{
          color: #fff;
          background-color: #000;
        }
      }
    }

    .tab-button{
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.875vw;
      font-weight: 500;
      border-radius: .7813vw;

      &.button-active{
        color: #fff;
        background-color: #362c2c;
      }
    }
  }
}
</style>
