<template>
  <div
    class="product-option-container"
    :class="theme.color"
  >
    <div class="product-option-view-wrap">
      <div class="option-view-title">
        {{ t('옵션보기') }}
      </div>
      <div class="option-view-product-name">
        {{ product.name }}
      </div>
      <div class="option-view-price-wrap">
        <div class="text">
          {{ t('기본가격') }}
        </div>
        <div class="price">
          {{ product.price?.toLocaleString() }}
        </div>
      </div>
      <div class="option-view-list-wrap">
        <RestaurantVerticalScreenCartModalOptionItem
          v-for="option in product.options"
          :key="option.code"
          :option="option"
          :getProductOptionPrice="getProductOptionPrice"
          :t="t"
        />
      </div>
      <div class="option-view-total-price-wrap">
        <div class="text">
          {{ t('합계') }}
        </div>
        <div class="price">
          {{ checkStandardPriceUnit(getProductTotalPrice()?.toLocaleString()) }}
        </div>
      </div>
      <div
        class="close"
        @click="onNextCart"
      >
        {{ t('닫기') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, Ref, ref } from 'vue';
import { pushPage } from '@utils/route.helper';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import {
  productOptionItemType,
  productOptionType,
} from '@torder/common/interface/product';
import {
  cartProductOptionFuncType,
  cartProductType,
} from '@torder/common/interface/cartProduct';
import { CART } from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useProductStore from '@store/storeProduct';
import useModalStore from '@store/storeModal';

import { home } from '@router/routePaths';
import { RestaurantVerticalScreenCartModalOptionItem } from '@components';

const { t } = useI18n();

const { openModal } = useModalStore();

const { theme } = useThemeStore();

const { productInfo } = useProductStore();

const toItemsCallback = () => ({
  ...productInfo,
  options: productInfo.options.flatMap<any>((value) => {
    if (!value.isOptionExist && !value.isProductExist) {
      const item = value;
      return [item];
    }

    const group = value as productOptionType;

    return group.items as productOptionItemType[];
  }),
});
const convertOptionItems = computed(toItemsCallback);

const product: Ref<cartProductType | any> = ref(convertOptionItems.value);

const onNextCart = (): void => {
  openModal(CART);
  pushPage(home);
};

const getProductOptionPrice: cartProductOptionFuncType<number> = (option) => {
  const { price, quantity } = option;
  const sum = price * quantity;

  return sum;
};

const getProductTotalPrice = (): number => {
  const { price } = product.value;
  const productPrice = price;
  const optionsPrice = (
    product.value.options as productOptionItemType[]
  ).reduce((acc, current) => acc + current.price * current.quantity, 0);
  const sum = productPrice + optionsPrice;

  return sum;
};
</script>

<style scoped lang="scss">
.product-option-container {
  position: absolute;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 70%);
  box-shadow: 0.1563vw 0.1563vw 0.2344vw 0 rgba(0, 0, 0, 0.26);

  &.black .product-option-view-wrap {
    color: #fff;
    background-color: #2f2a26;
    .option-view-title {
      border-bottom: 0.2344vw solid #333;
    }

    .option-view-product-name {
      border-color: #333;
    }

    .option-view-price-wrap {
      border-bottom: 0.2344vw solid #333;
    }

    .option-view-total-price-wrap {
      border-top: 0.2344vw solid #333;

      .price {
        color: #f33619;
      }
    }

    .close {
      background-color: #222;
    }
  }

  .product-option-view-wrap {
    display: flex;
    flex-direction: column;
    width: 67.5vw;
    height: 90vw;
    padding: 3.75vw;
    background-color: #fff;
    border-radius: 0.7813vw;

    .option-view-title {
      width: 100%;
      padding-bottom: 3vw;
      margin-bottom: 3.25vw;
      font-family: 'Noto Serif KR', serif;
      font-size: 2.3438vw;
      font-weight: 700;
      text-align: center;
    }

    .option-view-product-name {
      padding-bottom: 2vw;
      margin-bottom: 2.875vw;
      font-family: 'Pretendard', sans-serif;
      font-size: 2.1875vw;
      font-weight: 700;
      border-bottom: solid 0.2344vw #444;
    }

    .option-view-price-wrap {
      display: flex;
      justify-content: space-between;
      padding-bottom: 2vw;
      margin-bottom: 2.5vw;
      font-family: 'Pretendard', sans-serif;

      .text {
        font-size: 1.7188vw;
      }

      .price {
        font-size: 1.875vw;
        font-weight: 700;
      }
    }

    .option-view-list-wrap {
      flex: 1;
      overflow: scroll;

      &:deep(.cart-option-item-wrap) {
        font-size: 1.7188vw;

        .quantity-wrap {
          gap: 0;
        }
      }
    }

    .option-view-total-price-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2.4vw 0;
      font-weight: 700;

      .text {
        font-family: 'Pretendard', sans-serif;
        font-size: 1.875vw;
      }

      .price {
        font-family: 'Noto Serif KR', serif;
        font-size: 2.1875vw;
        color: #ab240f;
      }
    }

    .close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 8.75vw;
      font-family: 'Pretendard', sans-serif;
      font-size: 2.0313vw;
      color: #fff;
      background-color: #2f2a26;
      border-radius: 1.1719vw;
    }
  }
}
</style>
