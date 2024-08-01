<template>
  <!-- 기본 세로 테마 -->
  <div
    v-if="isThemeTypeVertical"
    class="product-container vertical middle-body"
    :class="isActiveCartBind"
  >
    <BasicVerticalScrollProductList
      v-for="(category, categoryIndex) in getGoodListData"
      :id="category.categoryCode"
      :key="getCategoryKey(category, categoryIndex)"
    >
      <template v-if="category.childCategoryList.length > 0">
        <BasicVerticalScrollProductChildList
          v-for="(
            childCategory, childCategoryIndex
          ) in category.childCategoryList"
          :id="getChildCategoryId(category, childCategory)"
          :key="getChildCategoryKey(childCategory, childCategoryIndex)"
          :themeColor="getThemeColor"
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
          :productLength="childCategory?.childCategoryProductList?.length"
          :isDarkTheme="isDarkTheme"
        >
          <BasicVerticalScrollProductItem
            v-for="(
              product, productIndex
            ) in childCategory.childCategoryProductList"
            :key="getProductKey(product, productIndex)"
            :themeColor="getThemeColor"
            :productName="
              translateLanguage(
                product.productLanguageShort,
                product.productLanguage.ko,
              )
            "
            :productPrice="getProductPrice(product)"
            :productImage="getProductImg(product)"
            :productLabels="getProductLabels(product)"
            :isProductImage="isProductImg(product)"
            :isProductSoldOut="isProductSoldOut(product)"
            :isProductDescription="isProductDescription(product)"
            :isProductOption="isProductOption(product)"
            :productSpicy="product.spicyRate"
            :isDarkTheme="isDarkTheme"
            :t="t"
            @click="selectProduct(product)"
          />
        </BasicVerticalScrollProductChildList>
      </template>
      <template v-else>
        <BasicVerticalScrollProductChildList
          :id="`${category}-0`"
          key="childCategory0"
          :themeColor="getThemeColor"
          :categoryName="
            translateLanguage(
              category.categoryLanguageName,
              category.categoryName,
            )
          "
          :childCategoryName="''"
          :productLength="0"
          :isDarkTheme="isDarkTheme"
        />
      </template>
    </BasicVerticalScrollProductList>
  </div>
  <!-- 기본 가로 테마 -->
  <div
    v-else-if="isThemeTypeHorizontal"
    class="product-container horizontal middle-body"
  >
    <BasicHorizontalScrollProductList
      v-for="(category, categoryIndex) in getGoodListData"
      :id="category.categoryCode"
      :key="getCategoryKey(category, categoryIndex)"
    >
      <template v-if="category.childCategoryList.length > 0">
        <BasicHorizontalScrollProductChildList
          v-for="(
            childCategory, childCategoryIndex
          ) in category.childCategoryList"
          :id="getChildCategoryId(category, childCategory)"
          :key="getChildCategoryKey(childCategory, childCategoryIndex)"
          :themeColor="getThemeColor"
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
          :productLength="childCategory?.childCategoryProductList?.length"
          :isDarkTheme="isDarkTheme"
        >
          <BasicHorizontalScrollProductItem
            v-for="(
              product, productIndex
            ) in childCategory.childCategoryProductList"
            :key="getProductKey(product, productIndex)"
            :themeColor="getThemeColor"
            :productName="
              translateLanguage(
                product.productLanguageShort,
                product.productLanguage.ko,
              )
            "
            :productPrice="getProductPrice(product)"
            :productImage="getProductImg(product)"
            :productLabels="getProductLabels(product)"
            :isProductImage="isProductImg(product)"
            :isProductSoldOut="isProductSoldOut(product)"
            :isProductDescription="isProductDescription(product)"
            :isProductOption="isProductOption(product)"
            :productSpicy="product.spicyRate"
            :isDarkTheme="isDarkTheme"
            :t="t"
            @click="selectProduct(product)"
          />
        </BasicHorizontalScrollProductChildList>
      </template>
      <template v-else>
        <BasicHorizontalScrollProductChildList
          :id="`${category}-0`"
          key="childCategory0"
          :themeColor="getThemeColor"
          :categoryName="
            translateLanguage(
              category.categoryLanguageName,
              category.categoryName,
            )
          "
          :childCategoryName="''"
          :productLength="0"
          :isDarkTheme="isDarkTheme"
        />
      </template>
    </BasicHorizontalScrollProductList>
  </div>
  <!-- 레스토랑 테마 -->
  <div
    v-else
    class="product-container-restaurant middle-body"
    :class="theme.type"
  >
    <RestaurantProductList
      v-for="(category, categoryIndex) in getGoodListData"
      :id="category.categoryCode"
      :key="getCategoryKey(category, categoryIndex)"
    >
      <RestaurantProductChildList
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
      >
        <RestaurantProductItem
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
          :productImage="getProductImg(product)"
          :productLabels="getProductLabels(product)"
          :isProductOption="isProductOption(product)"
          :isProductImage="isProductImg(product)"
          :isProductSoldOut="isProductSoldOut(product)"
          :isProductDescription="isProductDescription(product)"
          :isTypeRestaurantVertical="isTypeRestaurantVertical"
          :t="t"
          @click="selectProduct(product)"
        />
      </RestaurantProductChildList>
    </RestaurantProductList>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, ComputedRef, onMounted, onUpdated } from 'vue';
import { storeToRefs } from 'pinia';
import { scrollSpyCategory } from '@utils/scrollUtils';
import { getRouteName, pushPageWithParams } from '@utils/route.helper';
import { getBasicThemeProductLogoImage } from '@utils/logoUtils';
import { translateLanguage } from '@utils/langTransfer';
import { convertNodeListsToArray } from '@torder/common/utils';
import { themeStoreType, typeType } from '@torder/common/interface/theme';
import {
  productType,
  productFuncType,
  isProductImgType,
  getProductKeyType,
} from '@torder/common/interface/product';
import {
  categoryType,
  childCategoryType,
  getCategoryKeyType,
  getChildCategoryKeyType,
} from '@torder/common/interface/category';
import { cartProductType } from '@torder/common/interface/cartProduct';
import {
  VERTICAL,
  HORIZONTAL,
  BLACK,
  CART,
  RESTAURANT_HORIZONTAL_CARD,
  RESTAURANT_HORIZONTAL,
  RESTAURANT_VERTICAL,
  BASIC_CONFIRM,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useStoreSelectedCategory from '@store/storeSelectedCategory';
import useProductStore from '@store/storeProduct';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import { basicProductDetail, productOption } from '@router/routePaths';
import {
  BasicVerticalScrollProductList,
  BasicVerticalScrollProductChildList,
  BasicVerticalScrollProductItem,
  BasicHorizontalScrollProductList,
  BasicHorizontalScrollProductChildList,
  BasicHorizontalScrollProductItem,
  RestaurantProductList,
  RestaurantProductChildList,
  RestaurantProductItem,
} from '@components';

const { t } = useI18n();

const { openModal, openAlert, openConfirmModal, setAdditionalProductIndex } =
  useModalStore();

const { addCartProduct } = useCartStore();
const { isActiveCart, cartProducts } = storeToRefs(useCartStore());

const { setProductInfo } = useProductStore();

const { init } = storeToRefs(useInitStore());

const getGoodListData: ComputedRef<categoryType[]> = computed(
  () => init.value.goodList,
);

const { setFirstSelectedCategory, setSubSelectedCategory } =
  useStoreSelectedCategory();

const isActiveCartBind = computed(() => {
  const isOverRide = init.value.storeInfo.cartPageOverride === 1;
  return { 'active-cart': isActiveCart.value && !isOverRide };
});

// 테마 관련 로직
const { theme }: themeStoreType = useThemeStore();

const getThemeColor = computed(() => {
  const { color } = theme;

  if (color) return color;

  return BLACK;
});

const isDarkTheme = () => theme.color === BLACK;

const isThemeTypeVertical: ComputedRef<boolean> = computed(() => {
  const { type } = theme;

  return type === VERTICAL;
});

const isThemeTypeHorizontal: ComputedRef<boolean> = computed(() => {
  const { type } = theme;

  return type === HORIZONTAL;
});

const getThemeStoreType = () => {
  const { type } = theme;

  return type;
};

const type: ComputedRef<typeType> = computed(getThemeStoreType);

const getRestaurantHorizontalFlag = () => type.value === RESTAURANT_HORIZONTAL;

const isTypeRestaurantHorizontal = computed(getRestaurantHorizontalFlag);

const getRestaurantHorizontalCardFlag = () =>
  type.value === RESTAURANT_HORIZONTAL_CARD;

const isTypeRestaurantHorizontalCard = computed(
  getRestaurantHorizontalCardFlag,
);

const getHorizontalFlag = () => type.value === HORIZONTAL;

const isTypeHorizontal = computed(getHorizontalFlag);

const getRestaurantVerticalFlag = () => type.value === RESTAURANT_VERTICAL;

const isTypeRestaurantVertical = computed(getRestaurantVerticalFlag);

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

const getProductPrice: productFuncType<string> = (product) => {
  const { price } = product;
  const isPriceNotUndefined = price !== undefined;
  const isPriceString = typeof price === 'number';
  const isPrice = isPriceNotUndefined && isPriceString;

  if (price === 0) return '';
  if (isPrice) return price?.toLocaleString();

  return '';
};

const getProductLabels: productFuncType<{ [index: string]: boolean }> = (
  product,
) => {
  const {
    label: { typeBest = 0, typeMd = 0, typeSale = 0, typeNew = 0, typeHit = 0 },
  } = product;

  return {
    best: typeBest === 1,
    md: typeMd === 1,
    sale: typeSale === 1,
    new: typeNew === 1,
    hit: typeHit === 1,
  };
};

const validationImg = (url: string): boolean => {
  const regex = /https?:\/\/.*\.(svg$|jpg$|jpeg$|png$|gif$|webp$)/i;

  return regex.test(url);
};

const getProductImg: productFuncType<string> = (product) => {
  const { image } = product;
  const isImage = validationImg(image);

  if (isImage) return image;

  return getBasicThemeProductLogoImage();
};

const isProductImg: isProductImgType = (product) => {
  const { image } = product;
  const notEmpty = { empty: false };
  const isImage = validationImg(image);

  if (isImage) return notEmpty;

  return { empty: true };
};

const isProductDescription: productFuncType<boolean> = (product) => {
  const isDescription = product.html?.length > 0;
  const isAllergyUse = product.allergyUse === 'Y';

  return isDescription || isAllergyUse;
};

const isProductSoldOut: productFuncType<boolean> = (product) =>
  product.productSale === 1;

const isProductOption = (product: productType) => {
  if (!product.option) return false;

  return product.option?.length > 0;
};

const onNextProductDetail = (cartProduct: cartProductType): void => {
  setProductInfo(cartProduct);
  pushPageWithParams(getRouteName(basicProductDetail), { id: cartProduct.id });
};

const onNextProductOption = (cartProduct: cartProductType): void => {
  setProductInfo(cartProduct);
  pushPageWithParams(getRouteName(productOption), { id: cartProduct.id });
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
    countryOfOrigin,
    allergy,
    allergyUse,
  } as unknown as cartProductType;

  const isProductOption: boolean = isOptionExist && option?.length > 0;

  // 레스토랑 세로테마 옵션 있을시 상품설명 pass
  if (isTypeRestaurantVertical.value && isProductOption) {
    onNextProductOption(newProduct);
    return;
  }

  // 상품설명 있을시 상품설명 으로 이동
  if (isProductDescription(product)) {
    onNextProductDetail(newProduct);
    return;
  }

  // 상품옵션 있을시 상품옵션 으로 이동
  if (isProductOption) {
    onNextProductOption(newProduct);
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
      openConfirmModal(BASIC_CONFIRM, translatedName, t('장바구니 담기'));
      setAdditionalProductIndex(findProductIndex);
    }

    openModal(CART);
    return;
  }

  // 장바구니에 없다면 바로 장바구니 추가
  addCartProduct(newProduct);
  openAlert(`${t('상품을 담았습니다.', { item: name })}`);
  openModal(CART);
};

// 스크롤스파이 관련 코드
const scrollCategorySpyFunction = () => {
  const isRestaurant =
    isTypeRestaurantHorizontalCard.value ||
    isTypeRestaurantHorizontal.value ||
    isTypeRestaurantVertical.value;
  // 레스토랑테마는 overflow되는 부모가 달라서 조건부로 선택
  const typeCheckScrollElement = () => {
    const restaurantProductBody = document.querySelector(
      '.middle-body',
    ) as HTMLElement;
    const basicProductBody = document.querySelector(
      '.product-container',
    ) as HTMLElement;

    if (isRestaurant) return restaurantProductBody;

    return basicProductBody;
  };

  // 스크롤 이벤트 되는 엘리먼트
  const scrollElement = typeCheckScrollElement();
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

  const typeCheckSubCategoryScrollElement = () => {
    const categorySub = document.querySelector(
      '.main-sub-category-wrap-sub',
    ) as HTMLElement;
    const category = document.querySelector(
      '.main-sub-category',
    ) as HTMLElement;

    if (isRestaurant) return categorySub;

    return category;
  };

  // 서브카테고리컨테이너 서브카테고리
  const subCategoryScrollContainer = typeCheckSubCategoryScrollElement();

  const directionCallback = () => {
    if (isTypeHorizontal.value || isTypeRestaurantVertical.value)
      return HORIZONTAL;
    return VERTICAL;
  };

  const directionConvert = computed(directionCallback);

  const mainCategoryObserveCallback = (mainCategory: Element) => {
    scrollSpyCategory(
      mainCategory,
      { scrollElement },
      {
        type: 'main',
        direction: directionConvert.value,
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
  position: absolute;
  bottom: 4.6875vw;
  z-index: 6;
  display: flex;
  margin-top: 3.9063vw;
  overflow: scroll;

  &.horizontal {
    top: 11.4969vw;
    left: 0;
    flex-direction: row;
    gap: 2.5vw;
    width: 100%;
    padding: 0 54vw 0 1.5625vw;
  }

  &.vertical {
    top: 5vw;
    left: 17.8906vw;
    flex-direction: column;
    gap: 2.5vw;
    width: 80.5469vw;
    padding-bottom: 17.1875vw;

    &.active-cart {
      width: 57vw;
      padding-right: 1vw;
    }

    .product-main-category-observe {
      display: flex;
      flex-direction: column;
      gap: 2.5vw;
    }

    .product-main-category-observe:last-child {
      padding-bottom: 17.1875vw;
    }
  }
}

.product-container-restaurant {
  &.restaurant-vertical {
    padding-bottom: 93.75vw;

    &:deep(.product-list) {
      display: grid;
      grid-template-columns: 48% 48%;
      justify-content: space-between;
      .product-category-wrap {
        flex-direction: row;
        gap: 1vw;
        align-items: center;

        .main-category-name {
          font-size: 1.4063vw;
        }

        .sub-category-name {
          padding-top: 0;
          font-size: 1.875vw;
        }
      }
    }
  }

  .product-main-category-observe:last-child {
    padding-bottom: 35.5vw;
  }
}
</style>
