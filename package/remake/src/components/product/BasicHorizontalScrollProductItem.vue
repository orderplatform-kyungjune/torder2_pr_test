<template>
  <div
    class="product-item-wrap"
    :class="themeColor"
  >
    <div
      class="product-img-wrap"
      :class="{ black: isDarkTheme() }"
    >
      <img
        v-memo="productImage"
        v-lazyload
        class="product-img"
        :data-lazy="productImage"
        data-root=".product-container"
        data-margin="2000px"
        :class="[isProductImage, { 'us-east': IS_US_EAST }]"
        alt="상품"
      >
      <div class="product-top-wrap">
        <img
          v-if="productSpicy !== 0"
          class="product-spicy"
          :src="`https://static.torder.co.kr/torder2/goods-spicy-${productSpicy}.svg`"
        >
        <div v-else/>
        <div
          v-if="isProductOption && isProductDescription"
          class="product-description"
        >
          {{ t('옵션+메뉴설명') }}
        </div>
        <div
          v-else-if="isProductOption"
          class="product-description"
        >
          {{ t('옵션') }}
        </div>
        <div
          v-else-if="isProductDescription"
          class="product-description"
        >
          {{ t('메뉴 설명') }}
        </div>
      </div>
      <div
        v-if="isProductSoldOut"
        class="product-sold-out"
      >
        {{ t('해당 상품은 품절입니다.') }}
      </div>
      <div
        v-else
        class="product-label-wrap"
      >
        <img
          v-if="productLabels.best"
          class="product-label"
          src="https://static.torder.co.kr/torder2/product_label_best_68x21.svg"
        >
        <img
          v-if="productLabels.md"
          class="product-label"
          src="https://static.torder.co.kr/torder2/product_label_md_68x21.svg"
        >
        <img
          v-if="productLabels.new"
          class="product-label"
          src="https://static.torder.co.kr/torder2/product_label_new_68x21.svg"
        >
        <img
          v-if="productLabels.hit"
          class="product-label"
          src="https://static.torder.co.kr/torder2/product_label_hit_68x21.svg"
        >
        <img
          v-if="productLabels.sale"
          class="product-label"
          src="https://static.torder.co.kr/torder2/product_label_sale_68x21.svg"
        >
      </div>
    </div>
    <div
      class="product-info-wrap"
      :class="themeColor"
    >
      <span class="product-name ellipsis-text-3">
        {{ newLineHelper(productName) }}
      </span>
      <span class="product-price">
        {{ checkStandardPriceUnit(productPrice) }}
      </span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { newLineHelper } from '@torder/common/utils';
import { IS_US_EAST } from '@common/mode';

defineProps<{
  themeColor: string,
  productName: string,
  productPrice: string,
  productImage: string,
  productLabels: {[index: string]: boolean},
  isProductImage: {empty: boolean},
  isProductSoldOut: boolean,
  isProductDescription: boolean,
  isProductOption: boolean,
  productSpicy: number,
  isDarkTheme: () => boolean,
  t: (str: string) => string,
}>();
</script>

<style scoped lang='scss'>
.product-item-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 25.807vw;
  max-height: 31.4063vw;
  margin: 1.0156vw 0.7813vw 1.1719vw;
  background-color: #202020;
  border-radius: 0.7813vw;
  box-shadow: 0 0.3125vw 0.3125vw 0 rgba(0, 0, 0, 0.25), 0.0781vw -0.1563vw 0.0781vw 0 rgba(255, 255, 255, 0.15) inset;

  &.white {
    background-color: initial;
  }
}

.product-img-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 17.96875vw;
  background-color: #AFAFAF;
  border-radius: 0.7813vw 0.7813vw 0 0;

  &.black {
    background-color: #313131;
  }

  .product-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.7813vw 0.7813vw 0 0;

    &.empty {
      opacity: 0.5;
      object-fit: none;
    }
  }

  &.loading {

    .product-img {
      height: 3.75vw;
      opacity: 0.5;
      object-fit: none;
    }
  }

  &.error {

    .product-img {
      width: 30%;
      height: auto;
    }
  }

  .product-top-wrap {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0.9375vw 1.25vw;

    .product-spicy {
      width: 7.1875vw;
      height: 3.2813vw;
    }

    .product-description {
      padding: 0.4688vw 0.7813vw;
      font-size: 1.4063vw;
      font-weight: 700;
      line-height: 2.0313vw;
      letter-spacing: -0.0281vw;
      background-color: #fff;
      border: 0.1563vw solid #121212;
      border-radius: 0.7813vw;
    }
  }

  .product-sold-out {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.625vw 0.3125vw;
    font-size: 1.4063vw;
    font-weight: 700;
    line-height: 2.0313vw;
    color: #fff;
    text-align: center;
    letter-spacing: -0.0281vw;
    background: #F91515;
  }

  .product-label-wrap {
    position: absolute;
    bottom: 0;
    z-index: 3;
    display: flex;
    flex-wrap: wrap-reverse;
    gap: 0.6vw;
    padding: 0 0.7813vw;
    margin-bottom: 0.7vw;
    text-align: center;

    .product-label {
      width: 7.3vw;
    }
  }
}

.product-info-wrap {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.625vw;
  align-items: center;
  justify-content: center;
  padding: 1.25vw 0.9375vw;
  color: #fff;
  background-color: #121212;
  border-radius: 0 0 0.7813vw 0.7813vw;

  .product-name {
    font-size: 1.875vw;
    font-weight: 600;
    line-height: 2.5vw;
    text-align: center;
    letter-spacing: -0.0375vw;
    word-break: break-word;
    white-space: pre-wrap;
  }

  .product-price {
    font-size: 2.1875vw;
    font-weight: 700;
    line-height: 2.8125vw;
    text-align: center;
    letter-spacing: -0.0438vw;
    word-break: break-word;
    white-space: pre-wrap;
  }

  &.white {
    color: #313131;
    background-color: #fff;
  }
}

</style>
