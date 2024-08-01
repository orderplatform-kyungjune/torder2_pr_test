<template>
  <div
    class="product-item-wrap"
    :class="[theme.type, theme.color]"
  >
    <div
      class="product-img-wrap"
      :class="[isProductImage, getDarkModeClass()]"
    >
      <img
        v-memo="productImage"
        v-lazyload
        :data-lazy="productImage"
        data-root=".middle-body"
        data-margin="2000px"
        alt="상품"
        class="product-img"
      >
      <div
        v-if="isProductSoldOut"
        class="sold-out-wrap"
        :class="getDarkModeClass()"
      >
        <span class="sold-out-text">
          {{ t('품절') }}
        </span>
      </div>
      <div v-else>
        <div
          v-if="isProductOption && hasProductDescription"
          class="product-option"
        >
          {{ t('옵션+메뉴설명') }}
        </div>
        <div
          v-else-if="isProductOption"
          class="product-option"
        >
          {{ t('옵션') }}
        </div>
        <div
          v-else-if="hasProductDescription"
          class="product-option"
        >
          {{ t('메뉴 설명') }}
        </div>
        <div class="product-sticker-wrap">
          <div
            v-if="productLabels.typeNew === 1"
            class="product-sticker-new"
            :class="{ first: productLabels.typeBest === 0 }"
          >
            NEW
          </div>
          <div
            v-if="productLabels.typeBest === 1"
            class="product-sticker-best"
            :class="{ first: productLabels.typeNew === 0 }"
          >
            BEST
          </div>
        </div>
      </div>
    </div>
    <div class="product-info-wrap">
      <div class="product-info-spicy">
        <img
          v-if="!isProductSoldOut && productSpicy !== 0"
          :src="`https://static.torder.co.kr/torder2/goods-spicy-white-${productSpicy}.svg`"
        >
      </div>
      <div
        class="product-name ellipsis-text-3"
        :class="getDarkModeClass()"
      >
        {{ newLineHelper(productName) }}
      </div>
      <div
        v-if="retailPriceUse === 'Y'"
        class="product-price-wrap"
      >
        <div class="product-retail-price">
          {{ retailPrice?.toLocaleString() }}
        </div>
        <div class="product-price-box">
          <div class="product-price-sale">
            {{ t('할인가') }}
          </div>
          <div
            class="product-price"
            :class="getDarkModeClass()"
          >
            {{ checkStandardPriceUnit(productPrice) === '' ? checkStandardPriceUnit(0) : checkStandardPriceUnit(productPrice) }}
          </div>
        </div>
      </div>
      <div
        v-else
        class="product-price"
        :class="getDarkModeClass()"
      >
        {{ checkStandardPriceUnit(productPrice) }}
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { newLineHelper } from '@torder/common/utils';
import { productLabelType } from '@torder/common';
import useThemeStore from '@store/storeTheme';
import useInitStore from '@store/storeInit';

const { getDarkModeClass } = useInitStore();

const { subCategoryFontColor } = storeToRefs(useInitStore());

const { theme } = useThemeStore();

defineProps<{
  productName: string,
  productPrice: string,
  productImage: string,
  productLabels: productLabelType,
  isProductImage: {empty: boolean},
  isProductSoldOut: boolean,
  hasProductDescription: boolean,
  isProductOption: boolean,
  isJapaneseLanguage: boolean,
  productSpicy: number,
  retailPrice: number,
  retailPriceUse: string,
  t: (str: string) => string,
}>();
</script>

<style scoped lang='scss'>
.product-item-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.product-img-wrap {
  position: relative;
  display: flex;
  height: 18.75vw;
  font-family: 'Pretendard', sans-serif;
  border: 0.0781vw solid #D5D5D5;
  border-radius: 1.25vw;

  &.dark-mode {
    border: 0.0781vw solid #5B5B5B;
  }

  &.empty, &.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 18.75vw;
    background-color: #efefef;
    border-radius: 1.25vw;

    .product-img {
      object-fit: none;
    }
    &.dark-mode {
      background-color: #7A7A7A;
    }
  }

  &.error {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #d3d2d2;
    border-radius: 1.25vw;

    .product-img {
      width: 30%;
      height: auto;
    }
  }

  .product-option {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.7813vw 1.0938vw;
    font-size: 1.5625vw;
    line-height: 1.875vw;
    color: #fff;
    letter-spacing: -0.0469vw;
    background-color: #373D49;
    border-radius: 0 1.25vw 0 0.625vw;
  }

  .sold-out-wrap {
    position: absolute;
    bottom: -0.0781vw;
    left: -0.0781vw;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25.3125vw;
    padding: 0.625vw 0;
    background-color: #5B5B5B;
    border: 0.0781vw solid #D5D5D5;
    border-top: none;
    border-bottom: none;
    border-radius: 0 0 1.25vw 1.25vw;

    .sold-out-text {
      font-size: 2.1875vw;
      font-weight: 700;
      line-height: 2.5vw;
      color: #fff;
      letter-spacing: -0.0469vw;
    }

    &.dark-mode {
      border-color: #5B5B5B;
    }
  }

  .product-sticker-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;

    .product-sticker-new {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.7813vw 0.9375vw;
      font-size: 1.4063vw;
      font-weight: 500;
      line-height: 1.875vw;
      color: #fff;
      letter-spacing: -0.0422vw;
      background-color: #d50101;
      border-bottom-left-radius: 1.25vw;

      &.first {
        border-top-right-radius: 0.625vw;
      }
    }

    .product-sticker-best {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.7813vw 0.9375vw;
      font-size: 1.4063vw;
      font-weight: 500;
      line-height: 1.875vw;
      color: #fff;
      letter-spacing: -0.0422vw;
      background-color: #FA5F23;
      border-top-right-radius: 0.625vw;

      &.first {
        border-bottom-left-radius: 1.25vw;
      }
    }
  }

  .product-img {
    width: 100%;
    border-radius: 1.25vw;
    object-fit: cover;
  }
}

.product-label-wrap {
  position: absolute;
  top: -1.5625vw;
  right: 0;
  display: flex;
  flex-wrap: wrap-reverse;
  gap: 0.5vw;
  justify-content: center;
  margin: 1.5vw 0 .3906vw;

  .product-label {
    width: 6.25vw;
  }

  .no-show {
    display: none;
  }
}

.product-info-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: .7813vw;
  font-family: 'Pretendard', sans-serif;
  color: v-bind(subCategoryFontColor);

  .product-info-spicy {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 1.7578vw;
    margin-top: 0.7813vw;
  }

  .product-name {
    width: 100%;
    height: calc(100% - 1.7578vw - 2.5vw);
    font-size: 1.875vw;
    font-weight: 400;
    line-height: 2.3438vw;
    color: #313131;
    text-align: left;
    letter-spacing: -0.0562vw;
    white-space: pre-wrap;

    &.dark-mode {
      color: #fff;
    }
  }

  .product-price-wrap {
    display: flex;
    align-items: end;
    justify-content: space-between;
    height: 2.5vw;

    .product-retail-price {
      font-size: 1.5625vw;
      font-weight: 400;
      line-height: 1.875vw;
      color: #959595;
      text-decoration: line-through;
      letter-spacing: -0.0469vw;
    }

    .product-price-box {
      display: flex;
      gap: 0.7813vw;
      align-items: end;

      .product-price-sale {
        font-size: 1.5625vw;
        font-weight: 400;
        line-height: 1.875vw;
        color: #F52179;
        letter-spacing: -0.0469vw;
      }
    }
  }

}

.product-price {
  font-size: 2.1875vw;
  font-weight: 700;
  line-height: 2.5vw;
  color: #313131;
  text-align: end;
  letter-spacing: -0.0438vw;

  &.dark-mode {
    color: #fff;
  }
}

</style>
