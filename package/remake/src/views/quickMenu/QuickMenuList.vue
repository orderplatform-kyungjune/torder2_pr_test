<template>
  <div class="quick-menu-list-container">
    <div class="quick-menu-list-wrap">
      <div class="quick-menu-list-header">
        <p class="quick-menu-list-title">
          한잔 더!
        </p>
        <img
          src="https://static.torder.co.kr/torder2/svg_closebutton_normal_white.svg"
          class="quick-menu-list-close-button"
          @click="pushPage(home)"
        >
      </div>
      <div class="quick-menu-list-grid">
        <div
          v-for="(item, index) in getTargetItemData"
          :key="getItemListKey(item.productCode, index)"
          class="quick-menu-list-item"
          @click="selectProduct(item)"
        >
          <img
            v-if="item.image"
            :src="item.image"
            class="quick-menu-list-item-image"
          >
          <div
            v-else
            class="quick-menu-list-item-no-image"
          >
            <img
              class="quick-menu-list-item-no-image-icon"
              :src="getBasicThemeProductLogoImage()"
            >
          </div>
          <div class="quick-menu-list-item-info">
            <p class="quick-menu-list-item-text">
              {{ newLineHelper(translateLanguage(item.productLanguageShort, item.productLanguage?.ko)) }}
            </p>
            <span class="quick-menu-list-item-text quick-menu-list-item-text-price">
              {{ checkStandardPriceUnit(item.price?.toLocaleString()) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import {
  pushPage,
  pushPageWithParams,
  getRouteName,
} from '@utils/route.helper';
import { getBasicThemeProductLogoImage } from '@utils/logoUtils';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { newLineHelper } from '@torder/common/utils';
import {
  productType,
  productFuncType,
} from '@torder/common/interface/product';
import { cartProductType } from '@torder/common/interface/cartProduct';
import {
  HYATT,
  RESTAURANT_VERTICAL,
  CART,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useProductStore from '@store/storeProduct';
import useOrderListStore from '@store/storeOrderList';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import {
  home,
  basicProductDetail,
  productOption,
} from '@router/routePaths';

const { t } = useI18n();

const { theme } = storeToRefs(useThemeStore());

const { orderList } = storeToRefs(useOrderListStore());

const {
  tableNumBackgroundColor,
  tableNumFontColor,
  init,
} = storeToRefs(useInitStore());

const {
  openModal,
  openAlert,
} = useModalStore();

const { setProductInfo } = useProductStore();

const {
  addCartProduct,
  increaseCartProductQuantity,
  pushUpItemIndex,
} = useCartStore();
const { cartProducts } = storeToRefs(useCartStore());

const isHyatt = computed(() => {
  const isMatchedHyatt = theme.value.type === HYATT;
  return isMatchedHyatt;
});

const checkUseCustomDesignTableNumColor = () => {
  if (isHyatt.value) return `${tableNumFontColor.value}`;
  return `${tableNumBackgroundColor.value}`;
};

const bindBorderColorStyle = computed(checkUseCustomDesignTableNumColor);

// 퀵메뉴 아이템 리스트 filtering
const getTargetItemData = computed(() => {
  const result: productType[] = [];
  orderList.value.quickMenuList.forEach((code) => {
    init.value.goodList.forEach((first) => {
      first.childCategoryList.forEach((second) => {
        second.childCategoryProductList.forEach((item) => {
          if (item.productCode === code) {
            // 중복 상품 제거 로직
            const isExistItem = result.find((item) => item.productCode === code);
            if (!isExistItem) {
              result.push(item);
            }
          }
        });
      });
    });
  });
  return result;
});

// 주문하기 관련 모든 로직
const isTypeRestaurantVertical = computed(() => theme.value.type === RESTAURANT_VERTICAL);

const validationProduct = (product: productType): boolean => {
  const {
    productCode,
    price,
    productLanguageShort,
    productLanguage,
  } = product;
  const name: string = translateLanguage(productLanguageShort, productLanguage.ko);
  const isProductCode = Boolean(productCode);
  const isName = Boolean(name);
  const isPrice: boolean = price !== undefined;
  const isProductValues: boolean = isProductCode && isName && isPrice;

  return isProductValues;
};

const onNextProductDetail = (cartProduct: cartProductType): void => {
  setProductInfo(cartProduct);
  pushPageWithParams(getRouteName(basicProductDetail), { id: cartProduct.id });
};

const onNextProductOption = (cartProduct: cartProductType): void => {
  setProductInfo(cartProduct);
  pushPageWithParams(getRouteName(productOption), { id: cartProduct.id });
};

const selectProduct: productFuncType<void> = (product: productType) => {
  const isProductValues = validationProduct(product);

  if (isProductValues === false) {
    openAlert(t('잘못된 상품 입니다.'));
    return;
  }

  // 상품 품절시 return
  if (product.productSale === 1) {
    openAlert(t('품절되었습니다.'));
    return;
  }

  const {
    productCode,
    price,
    option = [],
    product: products = [],
    image,
    html,
    htmlArray,
    minOrderQty,
    maxOrderQty,
    productLanguage,
    productLanguageShort,
    productLanguageDetail,
    isOptionExist = false,
    isProductExist = false,
    isOrder = false,
    isProduct = false,
    ogSelectAuto = false,
  } = product;
  const name = translateLanguage(productLanguageShort, productLanguage.ko);
  const newProduct = {
    id: productCode,
    name,
    price,
    image,
    quantity: minOrderQty === 0 ? 1 : minOrderQty,
    minQuantity: minOrderQty,
    maxQuantity: maxOrderQty,
    options: option,
    productLanguage,
    productLanguageShort,
    productLanguageDetail,
    description: html,
    descriptionLanguage: htmlArray,
    isProductExist,
    isOptionExist,
    isOrder,
    isProduct,
    products,
    ogSelectAuto,
  };

  const isProductOption: boolean = option?.length > 0;

  // 레스토랑 세로테마 옵션 있을시 상품설명 pass
  if (isTypeRestaurantVertical.value && isProductOption) {
    onNextProductOption(newProduct as unknown as cartProductType);
    return;
  }

  // 상품설명 있을시 상품설명 으로 이동
  if (product.html?.length > 0) {
    onNextProductDetail(newProduct as unknown as cartProductType);
    return;
  }

  // 상품옵션 있을시 상품옵션 으로 이동
  if (isProductOption) {
    onNextProductOption(newProduct as unknown as cartProductType);
    return;
  }

  // 추가할려는 상품이 장바구니에 있는지 확인
  const findProductIndex: number = cartProducts.value.findIndex((cartProduct) => cartProduct.id === product.productCode);
  const isFindProduct: boolean = findProductIndex !== -1;

  // 장바구니에 상품이 있으면 추가할려는 상품 최대갯수 검증
  if (isFindProduct) {
    const findProduct = cartProducts.value[findProductIndex];
    const productQuantity: number = findProduct.quantity;
    const productMaxQuantity: number = findProduct.maxQuantity;
    const isNoLimit: boolean = productMaxQuantity === 0;
    const isProductQuantityMax: boolean = productQuantity === productMaxQuantity;

    if (isProductQuantityMax && !isNoLimit) openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    else {
      pushPage(home);
      openAlert(`"${cartProducts.value[findProductIndex].name}"\n${t('상품을 추가하였습니다.')}`);
      increaseCartProductQuantity(findProductIndex);
      pushUpItemIndex(findProductIndex);
    }

    openModal(CART);
    return;
  }

  // 장바구니에 없다면 바로 장바구니 추가
  pushPage(home);
  addCartProduct(newProduct as unknown as cartProductType);
  openAlert(`${t('상품을 담았습니다.', { item: name })}`);
  openModal(CART);
};

// v-for 방어 코드
const getItemListKey = (code: string, index: number) => (code ? `${code}_${index}` : `item_${index}`);
</script>

<style lang="scss" scoped>
.quick-menu-list-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  border-top: 0.5vw solid;
  border-color: v-bind(bindBorderColorStyle);

  .quick-menu-list-wrap {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1.25vw;
    width: 100vw;
    height: 100vh;
    padding: 1vw 3vw;
    color: #fff;
    background-color: #352c2c;

    .quick-menu-list-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 13%;

      .quick-menu-list-title {
        padding-left: 1.5vw;
        font-size: 3.125vw;
        font-weight: bold;
        line-height: 4.6094vw;
        letter-spacing: -.05859375vw;
        border-left: 0.5vw solid v-bind(bindBorderColorStyle);
      }

      .quick-menu-list-close-button {
        width: 3.5vw;
        height: 3.5vw;
      }
    }

    .quick-menu-list-grid {
      box-sizing: border-box;
      display: grid;
      grid-template-columns: repeat(4,1fr);
      gap: 2.34375vw;
      max-width: 100%;
      overflow: scroll;

      .quick-menu-list-item {
        display: flex;
        flex-direction: column;
        width: 100%;
        background-color: #000;
        border-radius: 0.7813vw;

        .quick-menu-list-item-image {
          width: 100%;
          height: 17.5vw;
          border-top-left-radius: 0.7813vw;
          border-top-right-radius: 0.7813vw;
          object-fit: cover;
        }

        .quick-menu-list-item-no-image {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 17.5vw;
          background-color: #AFAFAF;
          border-top-left-radius: 0.7813vw;
          border-top-right-radius: 0.7813vw;

          .quick-menu-list-item-no-image-icon {
            width: 100%;
            height: 100%;
            opacity: 0.5;
            object-fit: none;
          }
        }

        .quick-menu-list-item-info {
          display: flex;
          flex-direction: column;
          gap: 1vw;
          align-items: center;
          justify-content: center;
          padding: 1.0156vw;

          .quick-menu-list-item-text {
            font-size: 1.6016vw;
            line-height: 1.15;
            text-align: center;
            word-break: break-all;
            white-space: pre-line;
          }

          .quick-menu-list-item-text-price {
            padding: .7813vw 0;
            font-size: 1.7969vw;
          }
        }
      }
    }
  }
}
</style>
