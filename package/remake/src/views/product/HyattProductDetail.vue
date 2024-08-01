<!-- <template>
  <div class="menu-detail-container">
    <HyattProductDetailHeader
      :onNextRoot="onNextRoot"
      :t="t"
    />
    <HyattProductDetailBody
      :productName="translateLanguage(product.productLanguage, product.productLanguage?.ko as string)"
      :productPrice="product.price"
      :productImg="getProductImg()"
      :productDescription="getProductDescription()"
      :hasProductDescription="hasProductDescription()"
      :isProductImg="isProductImg()"
      :isProductOption="isProductOption()"
      :onNextRoot="onNextRoot"
      :onNextProductOption="onNextInternationalProductOption"
      :addCart="addCart"
      :t="t"
      :isNotKorean="isNotKorean"
      :isJapaneseLanguage="isJapaneseLanguage"
      :isNonOrderTable="isNonOrderTable"
    />
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import {
  computed,
  Ref,
  ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import {
  getRouteName,
  pushPage,
  pushPageWithParams,
} from '@utils/route.helper';
import { getCustomThemeProductLogoImage } from '@utils/logoUtils';
import { translateLanguage } from '@utils/langTransfer';
import {
  nullishCheck,
  removeNewLine,
} from '@torder/common/utils';
import { cartProductType } from '@torder/common/interface/cartProduct';
import {
  CART,
  CUSTOM_CONFIRM,
} from '@torder/common/constant';
import useTableStore from '@store/storeTable';
import useProductStore from '@store/storeProduct';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import {
  home,
  internationalTextOption,
  internationalImageOption,
} from '@router/routePaths';
import i18n from '@i18n';
import {
  HyattProductDetailHeader,
  HyattProductDetailBody,
} from '@components';
import requestDescription from '@apis/description';

const { t } = useI18n();

const {
  addCartProduct,
  multiIncreaseCartProductQuantity,
  pushUpItemIndex,
} = useCartStore();
const { cartProducts } = storeToRefs(useCartStore());

const {
  openModal,
  openAlert,
  openConfirmModal,
  setAdditionalProductIndex,
} = useModalStore();

const { tableInfo } = storeToRefs(useTableStore());

const { setProductInfo } = useProductStore();
const { productInfo } = storeToRefs(useProductStore());

const product: Ref<cartProductType> = ref(productInfo.value);

// 커스텀 스타일
const { init } = storeToRefs(useInitStore());

const hasProductDescription = () => {
  const isDescription = product.value.description?.length > 0;

  return isDescription;
};

const validationImg = (url: string): boolean => {
  const regex = /https?:\/\/.*\.(svg$|jpg$|jpeg$|png$|gif$|webp$)/i;
  const isImage = regex.test(url);

  return isImage;
};

const description = ref<string>('');

const setDescription = (descriptionValue: string) => {
  description.value = descriptionValue;
};

const getProductDescription = () => {
  requestDescription(product).then(setDescription);

  return removeNewLine(description.value);
};

const getProductImg = (): string => {
  const { image } = product.value;

  const isImage = validationImg(image);

  if (isImage) return image;

  return getCustomThemeProductLogoImage('200');
};

const isProductImg = (): { empty: boolean } => {
  const { image } = product.value;
  const isEmpty = { empty: !validationImg(image) };

  return isEmpty;
};

const isProductOption = (): boolean => {
  const {
    options,
    products,
  } = product.value;

  if (options?.length > 0 || products?.length > 0) return true;

  return false;
};

const onNextRoot = (): void => {
  pushPage(home);
};

const onNextInternationalProductOption = (): void => {
  setProductInfo(product.value);

  if (init.value?.storeInfo?.optionLayout === 'customImage') {
    pushPageWithParams(getRouteName(internationalImageOption), { id: product.value.id });
  } else {
    pushPageWithParams(getRouteName(internationalTextOption), { id: product.value.id });
  }
};

const addCart = (): void => {
  // 장바구니에 상품이 있으면 추가할려는 상품 최대갯수 검증

  const findProductIndex: number = cartProducts.value.findIndex((cartProduct) => cartProduct.id === product.value.id);
  const isFindProduct: boolean = findProductIndex !== -1;

  if (isFindProduct) {
    const findProduct = cartProducts.value[findProductIndex];
    const productQuantity: number = findProduct.quantity;
    const productMaxQuantity: number = findProduct.maxQuantity;
    const isNoLimit: boolean = productMaxQuantity === 0;
    const isProductQuantityMax: boolean = productQuantity === productMaxQuantity;
    const translatedName = translateLanguage(cartProducts.value[findProductIndex].productLanguageShort, cartProducts.value[findProductIndex].name);

    if (isProductQuantityMax && !isNoLimit) openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    else {
      // 수량 추가 확인창
      openConfirmModal(CUSTOM_CONFIRM, translatedName, t('장바구니 담기'));
      setAdditionalProductIndex(findProductIndex);
    }
    return;
  }

  openAlert(`${t('상품을 담았습니다.', { item: product.value.name })}`);
  openModal(CART);
  onNextRoot();

  if (findProductIndex !== -1) {
    multiIncreaseCartProductQuantity(findProductIndex, product.value.quantity);
    pushUpItemIndex(findProductIndex);
    return;
  }

  addCartProduct(product.value as unknown as cartProductType);
};

const isNotKorean = computed(() => {
  const { locale } = i18n.global;

  if (locale.value === 'jp' || locale.value === 'en' || locale.value === 'chGan' || locale.value === 'chBun') return true;
  return false;
});

const isJapaneseLanguage = computed(() => {
  const { locale } = i18n.global;

  if (locale.value === 'jp') return true;
  return false;
});

const isNonOrderTable = computed(() => {
  if (nullishCheck(tableInfo.value.orderAble)) return false;
  if (tableInfo.value.orderAble === 1) return false;
  return true;
});
</script>

<style scoped lang='scss'>
.menu-detail-container {
  position: absolute;
  z-index: 25;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 2.3438vw 1.9531vw 1.9531vw;
  background-color: rgba(0,0,0,0.8);
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
</style> -->
