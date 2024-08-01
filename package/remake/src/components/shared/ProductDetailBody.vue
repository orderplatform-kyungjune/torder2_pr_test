<template>
  <div class="menu-detail-body-wrap">
    <div
      class="menu-detail-img-wrap"
      :class="isProductImg"
    >
      <img
        :src="productImg"
        class="menu-detail-img"
      >
    </div>
    <div class="menu-detail-wrap">
      <div class="menu-detail-header">
        <div
          class="menu-detail-title"
          :class="{ 'japanese-lang': isJapaneseLanguage }"
        >
          {{ newLineHelper(productName) }}
        </div>
        <div class="menu-detail-price">
          <span class="text">
            {{ t('기본가격') }}
          </span>
          <span class="price">
            {{ checkStandardPriceUnit(productPrice?.toLocaleString()) }}
          </span>
        </div>
        <div
          v-if="hasProductDescription"
          class="menu-detail-description"
          :class="{ 'japanese-lang': isJapaneseLanguage }"
        >
          {{ productDescription }}
        </div>
      </div>
      <div class="menu-detail-cart-button-wrap">
        <div
          v-if="isProductOption"
          class="menu-detail-cart-button"
          @click="onNextProductOption"
        >
          {{ t('옵션 선택하기') }}
        </div>
        <div
          v-else
          class="menu-detail-cart-button"
          @click="addCart"
        >
          {{ t('장바구니 담기') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { newLineHelper } from '@torder/common/utils';

defineProps<{
  productName: string,
  productPrice: string | number,
  productDescription: string,
  productImg: string,
  hasProductDescription: boolean,
  isProductImg: {empty: boolean},
  isProductOption: boolean,
  isJapaneseLanguage: boolean,
  onNextRoot: () => void,
  onNextProductOption: () => void,
  addCart: () => void,
  t: (str: string) => string,
}>();

</script>

<style scoped lang='scss'>
.menu-detail-body-wrap {
  display: flex;
  width: 96.09vw;
  padding: 1.9531vw;
  margin-top: 1.9531vw;
  background-color: #fff;
  border-radius: 1.5625vw;

  .menu-detail-img-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 48.3594vw;
    border-radius: .7813vw;

    &.empty {
      text-align: center;
      background-color: #222;

      .menu-detail-img {
        height: 3.75vw;
        margin: auto;
      }
    }

    .menu-detail-img {
      width: 100%;
      height: 100%;
      border-radius: .7813vw;
    }
  }

  .menu-detail-wrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    max-height: 80vh;
    padding-top: 0.7813vw;
    margin-left: 1.5625vw;

    .menu-detail-header {
      display: flex;
      flex-direction: column;
      max-height: 43.6719vw;
      .menu-detail-title {
        margin-bottom: 2.1875vw;
        font-size: 2.0313vw;
        font-weight: 600;
        word-break: break-all;
        white-space: pre-wrap;

        &.japanese-lang {
          word-break: break-all;
        }
      }

      .menu-detail-price {
        display: flex;
        justify-content: space-between;
        padding-top: 1.875vw;
        margin-bottom: 3.125vw;
        font-family: Pretendard, serif;
        border-top: .2344vw solid rgb(186, 186, 186);

        .text {
          font-size: 1.5625vw;
        }

        .price {
          width: 70%;
          font-size: 1.7188vw;
          font-weight: 700;
          text-align: right;
          word-break: break-all;
        }
      }
      .menu-detail-description {
        height: auto;
        margin-bottom: 2vw;
        overflow-y: scroll;
        font-family: Pretendard, serif;
        font-size: 1.5625vw;
        font-weight: 300;
        line-height: 1.6;
        word-break: break-all;
        white-space: pre-wrap;

        &.japanese-lang {
          word-break: break-all;
        }
      }
    }

    .menu-detail-description::-webkit-scrollbar {
      display: none;
    }

    .menu-detail-cart-button-wrap {
      display: flex;
      align-items: flex-end;
      justify-content: center;

      .menu-detail-cart-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25.7813vw;
        height: 4.6875vw;
        font-size: 2.0313vw;
        color: #fff;
        background-color: #F91515;
        border-radius: 0.7813vw;

        &.button-active {
          background-color: #D60505;
        }
      }
    }
  }
}
</style>
