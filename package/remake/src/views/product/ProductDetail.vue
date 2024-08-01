<template>
  <!-- 레스토랑 세로 테마 -->
  <div
    v-if="isThemeRestaurantVertical"
    class="vertical-menu-detail-container"
  >
    <RestaurantVerticalScreenProductDetailHeader
      :class="theme.color"
      :onNextRoot="onNextRoot"
      :productImg="getRestaurantVerticalProductImg()"
      :isProductImg="isProductImg()"
    />
    <RestaurantVerticalScreenProductDetailDescription
      :class="theme.color"
      :productName="product.name"
      :productDescription="getProductDescription()"
      :hasProductDescription="hasProductDescription()"
    />
    <RestaurantVerticalScreenProductDetailQuantity
      :class="theme.color"
      :isThemeColorBlack="isThemeColorBlack"
      :productPrice="product.price"
      :productQuantity="product.quantity"
      :increaseProductQuantity="increaseProductQuantity"
      :decreaseProductQuantity="decreaseProductQuantity"
      :t="t"
    />
    <RestaurantVerticalScreenProductDetailButton
      :productPrice="product.price"
      :onNextRoot="onNextRoot"
      :addCart="addCart"
      :addCardButtonText="addCardButtonText"
      :t="t"
    />
  </div>
  <!-- 그 외 테마 -->
  <div
    v-else
    class="menu-detail-container"
    :class="{ restaurant: isThemeRestaurant }"
  >
    <ProductDetailHeader
      :productName="translateLanguage(product.productLanguageShort, product.productLanguage?.ko)"
      :onNextRoot="onNextRoot"
      :t="t"
    />
    <ProductDetailBody
      :productName="translateLanguage(product.productLanguageShort, product.productLanguage?.ko)"
      :productPrice="product.price"
      :productDescription="getProductDescription()"
      :productImg="getProductImg()"
      :hasProductDescription="hasProductDescription()"
      :isProductImg="isProductImg()"
      :isProductOption="isProductOption()"
      :onNextRoot="onNextRoot"
      :onNextProductOption="onNextProductOption"
      :addCart="addCart"
      :isJapaneseLanguage="isJapaneseLanguage"
      :t="t"
    />
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import {
  computed,
  ComputedRef,
  Ref,
  ref,
} from 'vue';
import { storeToRefs } from 'pinia';

import {
  getRouteName,
  pushPage,
  pushPageWithParams,
} from '@utils/route.helper';
import { getBasicThemeProductLogoImage } from '@utils/logoUtils';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { removeSymbol } from '@torder/common/utils';
import { cartProductType } from '@torder/common/interface/cartProduct';
import {
  BASIC_CONFIRM,
  CART,
  RESTAURANT_VERTICAL,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useProductStore from '@store/storeProduct';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import {
  home,
  productOption,
} from '@router/routePaths';
import i18n from '@i18n';
import {
  ProductDetailHeader,
  ProductDetailBody,
  RestaurantVerticalScreenProductDetailHeader,
  RestaurantVerticalScreenProductDetailDescription,
  RestaurantVerticalScreenProductDetailQuantity,
  RestaurantVerticalScreenProductDetailButton,
} from '@components';
import requestDescription from '@apis/description';

const { t } = useI18n();

const {
  openModal,
  openAlert,
  openConfirmModal,
  setAdditionalProductIndex,
} = useModalStore();

const { theme } = useThemeStore();
const { isThemeColorBlack } = storeToRefs(useThemeStore());

const { addCartProduct } = useCartStore();
const { cartProducts } = storeToRefs(useCartStore());

const { setProductInfo } = useProductStore();
const { productInfo } = storeToRefs(useProductStore());

const product: Ref<cartProductType> = ref(productInfo.value);

const isThemeRestaurant = computed(() => theme.type.includes('restaurant'));

const isThemeRestaurantVertical = computed(() => theme.type === RESTAURANT_VERTICAL);

const addCardButtonText: ComputedRef<string> = computed(() => {
  const {
    quantity = 0,
    price = 0,
  } = product.value;
  const total = price * quantity;
  const text = `${quantity}${t('개')} ${t('담기')} / ${checkStandardPriceUnit(total?.toLocaleString())}`;

  return text;
});

const description = ref<string>('');

const setDescription = (descriptionValue: string) => {
  description.value = descriptionValue;
};

const getProductDescription = () => {
  requestDescription(product).then(setDescription);

  return removeSymbol(description.value);
};

const hasProductDescription = (): boolean => {
  const isDescription = product.value.description?.length > 0;

  return isDescription;
};

const validationImg = (url: string): boolean => {
  const regex = /https?:\/\/.*\.(svg$|jpg$|jpeg$|png$|gif$|webp$)/i;
  const isImage = regex.test(url);

  return isImage;
};

const getProductImg = (): string => {
  const { image } = product.value;
  const isImage = validationImg(image);

  if (isImage) return image;

  return getBasicThemeProductLogoImage();
};

const getRestaurantVerticalProductImg = (): string => {
  const { image } = product.value;
  const isImage = validationImg(image);

  if (isImage) return image;

  return getBasicThemeProductLogoImage();
};

const isProductImg = (): { empty: boolean } => {
  const { image } = product.value;
  const isEmpty = { empty: !validationImg(image) };

  return isEmpty;
};

const isProductOption = (): boolean => {
  const { options } = product.value;

  if (options?.length > 0) return true;

  return false;
};

const onNextRoot = (): void => pushPage(home);

const onNextProductOption = (): void => {
  setProductInfo(product.value);
  pushPageWithParams(getRouteName(productOption), { id: product.value.id });
};

const addCart = (): void => {
  const findProductIndex = cartProducts.value?.findIndex((cartProduct) => product.value.id === cartProduct.id);
  const isFindProduct = findProductIndex !== -1;

  if (isFindProduct) {
    const findProduct = cartProducts.value[findProductIndex];
    const productQuantity: number = findProduct.quantity;
    const productMaxQuantity: number = findProduct.maxQuantity;
    const isNoLimit: boolean = productMaxQuantity === 0;
    const isProductQuantityMax: boolean = productQuantity === productMaxQuantity;

    if (isProductQuantityMax && !isNoLimit) openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    else {
      // 수량 추가 확인창
      openConfirmModal(BASIC_CONFIRM, product.value.name, t('장바구니 담기'));
      setAdditionalProductIndex(findProductIndex);
    }

    return;
  }

  openAlert(`${t('상품을 담았습니다.', { item: product.value.name })}`);
  openModal(CART);
  onNextRoot();
  addCartProduct(product.value as unknown as cartProductType);
};

const increaseProductQuantity = (): void => {
  const productQuantity: number = product.value.quantity;
  const productMaxQuantity: number = product.value.maxQuantity;
  const isNoLimit: boolean = productMaxQuantity === 0;
  const isProductQuantityMax: boolean = productQuantity === productMaxQuantity;

  if (isProductQuantityMax && !isNoLimit) {
    openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    return;
  }

  product.value.quantity += 1;
};

const decreaseProductQuantity = (): void => {
  const productQuantity = product.value.quantity;
  const productMinQuantity = product.value.minQuantity;
  const isProductQuantityMin: boolean = productQuantity === productMinQuantity;
  const isProductQuantity = productQuantity !== 0;
  const isProductSingle = productQuantity === 1;

  if ((isProductQuantityMin && isProductQuantity) || isProductSingle) return;

  product.value.quantity -= 1;
};

const isJapaneseLanguage = computed(() => {
  const { locale } = i18n.global;

  if (locale.value === 'jp') return true;
  return false;
});
</script>

<style scoped lang='scss'>
.menu-detail-container {
  z-index: 26;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 2.3438vw 1.9531vw 1.9531vw;
  font-family: pretendard, sans-serif;
  background-color: #302a26;

  &.restaurant{
    font-family: 'Noto Sans KR', serif;
  }
}
.vertical-menu-detail-container {
  position: fixed;
  z-index: 25;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  word-break: break-all;
  background-color: #fff;
}
</style>
