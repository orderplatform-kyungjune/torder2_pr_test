<template>
  <div
    class="product-container middle-body"
    :class="theme.type"
  >
    <HyattProductList
      v-for="(category, categoryIndex) in getGoodListData"
      :id="category.categoryCode"
      :key="getCategoryKey(category, categoryIndex)"
    >
      <template v-if="category.childCategoryList.length > 0">
        <HyattProductChildList
          v-for="(
            childCategory, childCategoryIndex
          ) in category.childCategoryList"
          :id="getChildCategoryId(category, childCategory)"
          :key="getChildCategoryKey(childCategory, childCategoryIndex)"
          :categoryName="
            translateLanguage(
              category.categoryLanguageName,
              category.categoryName,
            )
          "
          :childCategoryName="
            translateLanguage(
              childCategory.childCategoryLanguageName,
              childCategory.childCategoryName,
            )
          "
          :categoryIndex="categoryIndex"
          :totalLength="init.goodList?.length"
          :productLength="childCategory?.childCategoryProductList?.length"
        >
          <HyattProductItem
            v-for="(
              product, productIndex
            ) in childCategory.childCategoryProductList"
            :key="getProductKey(product, productIndex)"
            :productName="
              translateLanguage(
                product.productLanguageShort,
                product.productLanguage.ko,
              )
            "
            :productPrice="getProductPrice(product)"
            :productImage="getProductImage(product)"
            :productLabels="product.label"
            :isProductOption="isProductOption(product)"
            :isProductImage="isProductImg(product)"
            :isProductSoldOut="isProductSoldOut(product)"
            :hasProductDescription="hasProductDescription(product)"
            :isJapaneseLanguage="isJapaneseLanguage"
            :productSpicy="product.spicyRate"
            :retailPrice="product.retailPrice"
            :retailPriceUse="product.retailPriceUse"
            :t="t"
            @click="selectProduct(product)"
          />
        </HyattProductChildList>
      </template>
      <template v-else>
        <HyattProductChildList
          :id="`${category}-0`"
          key="childCategory0"
          :categoryName="
            translateLanguage(
              category.categoryLanguageName,
              category.categoryName,
            )
          "
          :childCategoryName="''"
          :categoryIndex="categoryIndex"
          :totalLength="init.goodList?.length"
          :productLength="0"
        />
      </template>
    </HyattProductList>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, ComputedRef, onMounted, onUpdated } from 'vue';
import { storeToRefs } from 'pinia';
import { scrollSpyCategory } from '@utils/scrollUtils';
import { getRouteName, pushPageWithParams } from '@utils/route.helper';
import { getCustomThemeProductLogoImage } from '@utils/logoUtils';
import { translateLanguage } from '@utils/langTransfer';
import { convertNodeListsToArray } from '@torder/common/utils';
import { themeStoreType } from '@torder/common/interface/theme';
import {
  productType,
  productFuncType,
  isProductImgType,
  getProductKeyType,
  productGroupType,
  productOptionItemType,
  productOptionType,
} from '@torder/common/interface/product';
import {
  categoryType,
  childCategoryType,
  getCategoryKeyType,
  getChildCategoryKeyType,
} from '@torder/common/interface/category';
import { cartProductType } from '@torder/common/interface/cartProduct';
import { CART, CUSTOM_CONFIRM } from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useTableStore from '@store/storeTable';
import useStoreSelectedCategory from '@store/storeSelectedCategory';
import useProductStore from '@store/storeProduct';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import {
  internationalTextOption,
  internationalImageOption,
  customProductDetail,
} from '@router/routePaths';
import i18n from '@i18n';
import {
  HyattProductList,
  HyattProductChildList,
  HyattProductItem,
} from '@components';

const { t } = useI18n();

const { openModal, openAlert, openConfirmModal, setAdditionalProductIndex } =
  useModalStore();

const { addCartProduct } = useCartStore();
const { cartProducts } = storeToRefs(useCartStore());

const { setProductInfo } = useProductStore();

const { init } = storeToRefs(useInitStore());

const getGoodListData: ComputedRef<categoryType[]> = computed(
  () => init.value.goodList,
);

const { setFirstSelectedCategory, setSubSelectedCategory } =
  useStoreSelectedCategory();

// 테마 관련 로직
const { theme }: themeStoreType = useThemeStore();

const getCategoryKey: getCategoryKeyType = (category, index) => {
  const { categoryCode } = category;

  if (categoryCode) return categoryCode;

  return `category${index}`;
};

const getChildCategoryKey: getChildCategoryKeyType = (childCategory, index) => {
  const { childCategoryCode } = childCategory;

  if (childCategoryCode) return childCategoryCode;

  return `childCategory${index}`;
};

const getChildCategoryId = (
  category: categoryType,
  childCategory: childCategoryType,
) => {
  const { categoryCode } = category;
  const { childCategoryCode } = childCategory;

  if (!categoryCode || !childCategoryCode) return '';

  return `${categoryCode}-${childCategoryCode}`;
};

const getProductKey: getProductKeyType = (product, index) => {
  const { productCode = `product${index}` } = product;

  if (productCode) return productCode;

  return `product${index}`;
};

const getTotalPresetOptionPrice = (
  product:
    | productType
    | productGroupType<productType>
    | productOptionType
    | productOptionItemType,
) => {
  let totalSum = 0;

  // 세트 상품일때
  if (!product.isOptionExist && product.isProductExist && product.isProduct) {
    const setProductType = product as productType;

    setProductType.product.forEach((item) => {
      totalSum += getTotalPresetOptionPrice(item);
    });
  }

  // 단순 상품이고 프리셋일때
  if (
    !product.isOptionExist &&
    !product.isProductExist &&
    product.isProduct &&
    product.isPreSet
  ) {
    const productType = product as productType;

    totalSum += productType.price;
  }

  // 단순 옵션이고 프리셋일때
  if (
    !product.isOptionExist &&
    !product.isProductExist &&
    !product.isProduct &&
    product.isPreSet
  ) {
    const optionItemType = product as productOptionItemType;

    totalSum += optionItemType.price;
  }

  // 옵션 상품이고 프리셋일때
  if (
    product.isOptionExist &&
    !product.isProductExist &&
    product.isProduct &&
    product.isPreSet
  ) {
    const optionProductType = product as productType;

    totalSum += optionProductType.price;

    optionProductType.option.forEach((item) => {
      totalSum += getTotalPresetOptionPrice(item);
    });
  }

  // 상품 그룹일때
  if (
    !product.isOptionExist &&
    product.isProductExist &&
    !product.isProduct &&
    product.isPreSet
  ) {
    const productGroupType = product as productGroupType<productType>;

    productGroupType.items.forEach((item) => {
      totalSum += getTotalPresetOptionPrice(item);
    });
  }

  // 옵션 그룹일때
  if (
    product.isOptionExist &&
    !product.isProductExist &&
    !product.isProduct &&
    product.isPreSet
  ) {
    const optionGroupType = product as productOptionType;

    optionGroupType.items.forEach((item) => {
      totalSum += getTotalPresetOptionPrice(item);
    });
  }

  return totalSum;
};

const getProductPrice: productFuncType<string> = (product) => {
  const { price, priceString, priceStringLanguage } = product;
  const isPriceNotUndefined = price !== undefined;
  const isPriceNumber = typeof price === 'number';
  const isPrice = isPriceNotUndefined && isPriceNumber;
  const presetOptionPrice = getTotalPresetOptionPrice(product);

  const isPriceZero = price === 0;
  const isPresetPriceZero = presetOptionPrice === 0;

  const languagePrice = translateLanguage(priceStringLanguage, priceString);

  if (priceStringLanguage && languagePrice) return languagePrice;

  if (isPrice) {
    if (isPriceZero && isPresetPriceZero) return '';

    if (isPriceZero && !isPresetPriceZero)
      return `+${presetOptionPrice?.toLocaleString()}`;

    if (!isPriceZero && !isPresetPriceZero)
      return `${price?.toLocaleString()}(+${presetOptionPrice?.toLocaleString()})`;

    return price?.toLocaleString();
  }

  return '';
};

const validationImg = (url: string): boolean => {
  const regex = /https?:\/\/.*\.(svg$|jpg$|jpeg$|png$|gif$|webp$)/i;

  return regex.test(url);
};

const getProductImage: productFuncType<string> = (product) => {
  const { image } = product;
  const isImage = validationImg(image);

  if (isImage) return image;

  return getCustomThemeProductLogoImage();
};

const isProductImg: isProductImgType = (product) => {
  const { image } = product;
  const notEmpty = { empty: false };
  const isImage = validationImg(image);

  if (isImage) return notEmpty;

  return { empty: true };
};

const hasProductDescription = (product: productType) => {
  const isDescriptionUse = product.html?.length > 0;
  const isAllergyUse = product.allergyUse === 'Y';

  return isDescriptionUse || isAllergyUse;
};

const isProductSoldOut: productFuncType<boolean> = (product) =>
  product.productSale === 1;

const isProductOption = (product: productType) =>
  product.option?.length > 0 || product.product?.length > 0;

const isJapaneseLanguage = computed(() => {
  const { locale } = i18n.global;

  return locale.value === 'jp';
});

const onNextInternationalProductDetail = (
  cartProduct: cartProductType,
): void => {
  setProductInfo(cartProduct);
  pushPageWithParams(getRouteName(customProductDetail), { id: cartProduct.id });
};

const onNextInternationalProductOption = (
  cartProduct: cartProductType,
): void => {
  setProductInfo(cartProduct);

  if (init.value?.storeInfo?.optionLayout === 'customImage') {
    pushPageWithParams(getRouteName(internationalImageOption), {
      id: cartProduct.id,
    });
  } else {
    pushPageWithParams(getRouteName(internationalTextOption), {
      id: cartProduct.id,
    });
  }
};

const validationProduct = (product: productType): boolean => {
  const { productCode, price, productLanguageShort, productLanguage } = product;
  const name: string = translateLanguage(
    productLanguageShort,
    productLanguage.ko,
  );
  const isProductCode = Boolean(productCode);
  const isName = Boolean(name);
  const isPrice: boolean = price !== undefined;

  return isProductCode && isName && isPrice;
};

const selectProduct: productFuncType<void> = (product: productType) => {
  // 상품 유효성 검사
  const isProductValues = validationProduct(product);

  if (!isProductValues) {
    openAlert(t('잘못된 상품 입니다.'));
    return;
  }

  // 상품 품절시 return
  if (isProductSoldOut(product)) {
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
    countryOfOrigin,
    allergy,
    allergyUse,
  } = product;
  const name = translateLanguage(
    productLanguageDetail,
    productLanguageDetail?.ko,
  );

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
    countryOfOrigin,
    allergy,
    allergyUse,
  } as unknown as cartProductType;

  const isProductOption: boolean = isOptionExist && option?.length > 0;

  // 상품설명 있을시 상품설명 으로 이동
  if (hasProductDescription(product)) {
    onNextInternationalProductDetail(newProduct);
    return;
  }

  // 상품옵션 있을시 상품옵션 으로 이동
  if (isProductOption) {
    onNextInternationalProductOption(newProduct);
    return;
  }

  // 추가할려는 상품이 장바구니에 있는지 확인
  const findProductIndex: number = cartProducts.value?.findIndex(
    (cartProduct) => cartProduct.id === product.productCode,
  );
  const isFindProduct: boolean = findProductIndex !== -1;

  // 장바구니에 상품이 있으면 추가할려는 상품 최대갯수 검증
  if (isFindProduct) {
    const findProduct = cartProducts.value[findProductIndex];
    const productQuantity: number = findProduct.quantity;
    const productMaxQuantity: number = findProduct.maxQuantity;
    const isNoLimit: boolean = productMaxQuantity === 0;
    const isProductQuantityMax: boolean =
      productQuantity === productMaxQuantity;
    const translatedName = translateLanguage(
      cartProducts.value[findProductIndex].productLanguageShort,
      cartProducts.value[findProductIndex].name,
    );

    if (isProductQuantityMax && !isNoLimit)
      openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    else {
      // 수량 추가 확인창
      openConfirmModal(CUSTOM_CONFIRM, translatedName, t('장바구니 담기'));
      setAdditionalProductIndex(findProductIndex);
    }

    openModal(CART);
    return;
  }

  const { tableInfo } = storeToRefs(useTableStore());

  if (tableInfo.value.orderAble === 0) return;

  // 장바구니에 없다면 바로 장바구니 추가
  addCartProduct(newProduct);
  openAlert(`${t('상품을 담았습니다.', { item: name })}`);
  openModal(CART);
};

// 스크롤스파이 관련 코드
const scrollCategorySpyFunction = () => {
  // 스크롤 이벤트 되는 엘리먼트
  const scrollElement = document.querySelector('.middle-body') as HTMLElement;
  // 상품컨테이너 메인카테고리 전체 선택
  const mainCategoryTargetList = document.querySelectorAll(
    '.product-main-category-observe',
  );
  // 상품컨테이너 서브카테고리 전체 선택
  const subCategoryTargetList = document.querySelectorAll(
    '.product-sub-category-observe',
  );
  // 메인카테고리컨테이너 서브카테고리
  const mainCategoryScrollContainer = document.querySelector(
    '.main-first-category-wrap',
  ) as HTMLElement;

  const typeCheckSubCategoryScrollElement = () =>
    document.querySelector('.main-sub-category-wrap-sub') as HTMLElement;

  // 서브카테고리컨테이너 서브카테고리
  const subCategoryScrollContainer = typeCheckSubCategoryScrollElement();

  const mainCategoryObserveCallback = (mainCategory: Element) => {
    scrollSpyCategory(
      mainCategory,
      { scrollElement },
      {
        type: 'main',
        direction: 'vertical',
        className: '.main-first-category-list-item',
        categoryWrapper: mainCategoryScrollContainer,
        fixScroll: 300,
      },
      setFirstSelectedCategory,
    );
  };
  [...convertNodeListsToArray(mainCategoryTargetList)].forEach(
    mainCategoryObserveCallback,
  );

  const subCategoryObserveCallback = (subCategory: Element) => {
    scrollSpyCategory(
      subCategory,
      { scrollElement },
      {
        type: 'sub',
        direction: 'horizontal',
        className: '.sub-list',
        categoryWrapper: subCategoryScrollContainer,
        fixScroll: 300,
      },
      setSubSelectedCategory,
    );
  };
  [...convertNodeListsToArray(subCategoryTargetList)].forEach(
    subCategoryObserveCallback,
  );
};

// html 렌더링 이후의 작업으로 onMounted 훅 안에서 작업
onMounted(() => {
  scrollCategorySpyFunction();
});

// html 렌더링 갱신 이후의 작업으로 onUpMounted 훅 안에서 작업
onUpdated(() => {
  scrollCategorySpyFunction();
});
</script>

<style scoped lang="scss">
.product-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-top: 1.25vw;
  overflow-y: auto;
}
</style>
