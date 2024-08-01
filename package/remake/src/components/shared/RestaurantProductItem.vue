<template>
  <div
    class="product-item-wrap"
    :class="[theme.type, theme.color]"
  >
    <div
      class="product-img-wrap"
      :class="isProductImage"
    >
      <img
        v-memo="productImage"
        v-lazyload
        :data-lazy="productImage"
        data-root=".middle-body"
        data-margin="2000px"
        class="product-img"
        :src="productImage"
        alt="상품"
      >
      <div
        v-if="isProductOption && !isTypeRestaurantVertical"
        class="product-option"
      >
        {{ t('옵션') }}
      </div>
      <div
        v-if="isProductDescription && !isTypeRestaurantVertical"
        class="product-description"
      >
        {{ t('메뉴 설명') }}
      </div>
      <div
        v-if="isProductSoldOut"
        class="sold-out"
      >
        SOLD OUT
      </div>
      <div
        v-else-if="!isTypeRestaurantVertical"
        class="product-label-wrap"
      >
        <div
          v-if="productLabels.hit"
          class="product-label-icon"
        >
          HIT
        </div>
        <div
          v-if="productLabels.best"
          class="product-label-icon"
        >
          BEST
        </div>
        <div
          v-if="productLabels.md"
          class="product-label-icon"
        >
          추천
        </div>
        <div
          v-if="productLabels.new"
          class="product-label-icon"
        >
          신메뉴
        </div>
        <div
          v-if="productLabels.sale"
          class="product-label-icon"
        >
          할인
        </div>
      </div>
    </div>
    <div class="product-info-wrap">
      <div
        v-if="isTypeRestaurantVertical"
        class="product-option-description-label-wrap"
      >
        <div v-if="isProductOption && isProductDescription">
          옵션/상세설명
        </div>
        <div v-else-if="isProductOption">
          옵션
        </div>
        <div v-else-if="isProductDescription">
          상세설명
        </div>
      </div>
      <p class="product-name">
        {{ productName }}
      </p>
      <p class="product-price">
        {{ productPrice }}
      </p>
      <div
        v-if="isTypeRestaurantVertical"
        class="vertical-product-label-wrap"
      >
        <div
          v-if="productLabels.hit"
          class="product-label-icon"
        >
          HIT
        </div>
        <div
          v-if="productLabels.best"
          class="product-label-icon"
        >
          BEST
        </div>
        <div
          v-if="productLabels.md"
          class="product-label-icon"
        >
          추천
        </div>
        <div
          v-if="productLabels.new"
          class="product-label-icon"
        >
          신메뉴
        </div>
        <div
          v-if="productLabels.sale"
          class="product-label-icon"
        >
          할인
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { themeStoreType } from '@torder/common';
import useThemeStore from '@store/storeTheme';

// 테마 관련 로직
const { theme }: themeStoreType = useThemeStore();

defineProps<{
  productName: string,
  productPrice: string,
  productImage: string,
  productLabels: {[index: string]: boolean},
  isProductImage: {empty: boolean},
  isProductSoldOut: boolean,
  isProductDescription: boolean,
  isProductOption: boolean,
  isTypeRestaurantVertical: boolean,
  t: (str: string) => string,
}>();
</script>

<style scoped lang='scss'>
.product-item-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5vw;
  border: none;
  border-radius: 0.7813vw;

  &.restaurant-horizontal-card {
    .product-img-wrap {
      height: 14vw;
    }
  }

  &.restaurant-horizontal {
    .product-img-wrap {
      height: 19vw;
    }
  }

  &.restaurant-vertical {

    .product-img-wrap {
      height: 35vw;
      border-radius: .7813vw;

      .sold-out {
        height: 5vw;
        font-size: 1.4063vw;
      }
    }

    &.black {
      .product-info-wrap {
        color: #fff;

        .product-option-description-label-wrap > div {
          color: black;
          background-color: #fff;
        }

        .vertical-product-label-wrap .product-label-icon{
          color: #fff;
          background-color: #444;
        }
      }

      .product-img-wrap {
        background-color: #ccc;

        .product-option {
          padding: 1.5vw 1.5vw;
          font-size: 1.5625vw;
        }

        .product-description {
          padding: 1vw 2vw;
          font-size: 1.7188vw;
        }

        .product-label-wrap .product-label-icon {
          padding: 0.5vw 1.5vw;
          font-size: 1.4063vw;
          font-weight: 300;
          color: #fff;
          background-color: #444;
        }
      }
    }
  }
}

.product-img-wrap {
  position: relative;
  display: flex;
  overflow: hidden;
  border-radius: .7813vw;

  &.empty {
    background-color: #efefef;

    .product-img {
      width: 30%;
      margin: auto;
    }
  }

  &.loading {
    background-color: #efefef;
    border-radius: 0.7813vw;

    .product-img {
      width: 30%;
      margin: auto;
    }
  }

  &.error {
    background-color: #d3d2d2;
    border-radius: 0.7813vw;

    .product-img {
      width: 30%;
      margin: auto;
    }
  }

  .product-img {
    width: 100%;
    object-fit: cover;
  }

  .product-description {
    position: absolute;
    top: 0.6vw;
    right: 0.6vw;
    padding: .3125vw .8594vw .3906vw;
    margin-top: 0.5vw;
    margin-right: 0.5vw;
    font-family: 'Noto Serif KR',serif;
    font-size: 1.3281vw;
    font-weight: 400;
    color: black;
    text-align: center;
    background-color: #fff;
    border: solid .0781vw #2f2a26;
    border-radius: .7813vw;
    box-shadow: 0 0 .1563vw 0 rgba(47, 42, 38, 0.5);
  }

  .product-option {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.6vw 0.8vw;
    font-family: 'Noto Serif KR',serif;
    font-weight: 500;
    color: #fff;
    background-color: #2f2a26;
    border-radius: 0 0 .7813vw 0;
  }

  .sold-out {
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 2.5781vw;
    font-family: 'Noto Serif KR', sans-serif;
    color: #fff;
    text-align: center;
    background-color: #000;
    border-radius: 0 0 .625vw .625vw;
    opacity: 0.8;
  }
}

.product-label-wrap {
  position: absolute;
  right: 0;
  bottom: .3906vw;
  left: 0;
  display: flex;
  flex-wrap: wrap-reverse;
  gap: 0.5vw;
  justify-content: center;
  margin-top: 1.5vw;

  .product-label-icon {
    padding: 0.235vw 1.24vw;
    font-family: 'Noto Serif KR', sans-serif;
    font-size: 1.0938vw;
    background-color: #fff;
    border: .0781vw solid #2f2a26;
    border-radius: 1.0156vw;
  }
}

.vertical-product-label-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5vw;
  justify-content: center;
  margin-top: 1.5vw;

  .product-label-icon {
    padding: .375vw 2.625vw;
    font-family: 'Noto Serif KR', sans-serif;
    color: #2f2a26;
    background-color: #fff;
    border: solid .0781vw #2f2a26;
    border-radius: 1.0156vw;
  }
}

.product-quantity-wrap {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  gap: 1vw;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
}

.product-quantity-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4vw;
  height: 4vw;
  font-size: 2vw;
  font-weight: 500;
  color: #fafafa;
}

.product-quantity-icon {
  width: 3.2vw;
  height: 3.2vw;
}

.product-info-wrap {
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Serif KR', sans-serif;
  text-align: center;
  word-break: normal;

  .product-option-description-label-wrap {
    margin-top: 2.125vw;

    > div {
      padding: .625vw 1.25vw;
      font-size: 1.0938vw;
      color: #fff;
      background-color: #2f2a26;
      border-radius: .3906vw;
    }
  }
}

.product-name {
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 2vw;
  margin-top: 0.63vw;
  overflow: hidden;
  font-size: 1.75vw;
  font-weight: 500;
  line-height: 1.36;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  align-items: center;
  margin-top: 0.53vw;
  font-size: 2.125vw;
  font-weight: bold;
}
</style>
