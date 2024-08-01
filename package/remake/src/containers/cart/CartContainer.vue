<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, ComputedRef, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import VisitPeople from '@views/visitPeople/VisitPeople.vue';
import {
  getRouteName,
  pushPage,
  pushPageWithParams,
} from '@utils/route.helper';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import {
  getStorage,
  getStoreName,
  getInitTableName,
  generateProductCode,
  makeOrderForm,
  getInitTableCreditUse,
  getStoreCode,
  getInitTableId,
} from '@torder/common/utils';
import {
  cartProductFuncType,
  cartProductType,
  cartProductOptionFuncType,
  CartProductOptionType,
  CartProductOptionGroupType,
} from '@torder/common/interface/cartProduct';
import {
  BLACK,
  CACHE_DATA,
  CART,
  CART_CONFIRM,
  STAFF_CALL_CHECK,
  RESTAURANT_HORIZONTAL,
  RESTAURANT_HORIZONTAL_CARD,
  RESTAURANT_VERTICAL,
  TABLE,
  VISIT_PEOPLE,
  U_CODE,
} from '@torder/common/constant';
import { productOptionItemType } from '@torder/common';
import useVisitPeopleStore from '@store/storeVisitPeople';
import useThemeStore from '@store/storeTheme';
import useTableStore from '@store/storeTable';
import useProductStore from '@store/storeProduct';
import usePaymentStore from '@store/storePayment';
import useOrderListStore from '@store/storeOrderList';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import {
  orderComplete,
  productOptionView,
  staffCall,
} from '@router/routePaths';
import i18n from '@i18n';
import useOrderConfig from '@composables/useOrderConfig';
import { useSecret } from '@composables/secret';
import postCreditWebLogs from '@composables/creditLog';
import {
  CartModal,
  CartModalListOptionItem,
  CartModalListItem,
  CartConfirmModal,
  CartConfirmModalListOptionItem,
  CartConfirmModalListItem,
  RestaurantVerticalScreenCartModal,
  RestaurantVerticalScreenCartModalItem,
  RestaurantVerticalScreenCartModalOptionItem,
} from '@components';
import { requestOrders } from '@apis/order';
import { requestCreditReady } from '@apis/credit';

const { t } = useI18n();

const { onNextSecret } = useSecret();

const {
  init,
  getStoreInfo: initStoreInfo,
  getVisitConfig,
} = storeToRefs(useInitStore());

const { theme } = storeToRefs(useThemeStore());

const {
  flag,
  openModal,
  closeModal,
  openAlert,
  openConfirmAlert,
  openPaymentRefundAlarmModal,
  setBeforeOrder,
} = useModalStore();

const { setProductInfo } = useProductStore();
const {
  cartProducts,
  cartConfirmStatus,
  isActiveCart,
  duplicateCartCode,
  isHaveCartProduct,
} = storeToRefs(useCartStore());
const {
  spliceCartProduct,
  deleteCartProductAll,
  increaseCartProductQuantity,
  decreaseCartProductQuantity,
  createDuplicateCartCode,
  clearDuplicateCartCode,
} = useCartStore();

const { orderList, isHaveOrderList } = storeToRefs(useOrderListStore());

const { setIsHaveOrderExist, orderPayload } = useOrderConfig();
const isSpread = ref(false);

const isSpreadActive = computed(() => {
  const isActive = { spread: isSpread.value };

  return isActive;
});

const spreadOut = () => {
  isSpread.value = true;
};

const spreadIn = () => {
  isSpread.value = false;
};

const storeInfo = getStorage(CACHE_DATA) as string;

const masterStaffCallOption = computed(() => {
  const { serviceCategoryType: staffCallOption } = initStoreInfo.value;

  if (staffCallOption === undefined) {
    return JSON.parse(storeInfo).storeInfo?.serviceCategoryType;
  }

  return staffCallOption;
});

const isThemeColorBlack = computed(() => theme.value.color === BLACK);

const isFetching = ref(false);

const startFetching = () => {
  isFetching.value = true;
};

const endFetching = () => {
  isFetching.value = false;
};

const orderButtonText = computed(() => {
  const order = t('주문하기');
  const notOrder = t('주문 진행 중');
  const disableOrder = t('주문불가');

  if (isFetching.value) return notOrder;
  if (init.value.storeInfo?.closeOrder === 1) return disableOrder;

  return order;
});
const confirmOrderButtonText = computed(() => {
  const order = t('주문하기');
  const notOrder = t('주문 진행 중');

  if (isFetching.value) return notOrder;

  return order;
});
const isForestCardTheme: ComputedRef<boolean> = computed(() => {
  const { type } = theme.value;
  const isForest = type === RESTAURANT_HORIZONTAL_CARD;

  return isForest;
});
const isForestTheme: ComputedRef<boolean> = computed(() => {
  const { type } = theme.value;
  const isForest = type === RESTAURANT_HORIZONTAL;

  return isForest;
});
const isRestaurantVerticalTheme: ComputedRef<boolean> = computed(() => {
  const { type } = theme.value;
  const isRestaurantVertical = type === RESTAURANT_VERTICAL;

  return isRestaurantVertical;
});

const openStaffCall = () => {
  if (masterStaffCallOption.value === 0) openModal(STAFF_CALL_CHECK);
  else pushPage(staffCall);
};

const closeCartConfirmModal = (): void => {
  closeModal(CART_CONFIRM);
};

const onNextProductOptionView = (cartProduct: cartProductType): void => {
  closeModal(CART);
  setProductInfo(cartProduct as unknown as cartProductType);
  pushPageWithParams(getRouteName(productOptionView), { id: cartProduct.id });
};

const getStoreInfo = () => {
  const { storeCode } = init.value.storeInfo;
  const isStoreCode = storeCode === undefined;
  const tableString = getStorage(TABLE);
  const isTableString = tableString === null;

  if (isTableString || isStoreCode) {
    openAlert(t('테이블을 찾을수 없습니다'));

    return {
      storeCode: undefined,
      tableNumber: null,
    };
  }

  const table = JSON.parse(tableString);
  const tableNumber = table.tabletId;
  const storeInfo = {
    storeCode,
    tableNumber,
  };

  return storeInfo;
};

const orderCartConfirm = (): void => {
  deleteCartProductAll();
  closeModal(CART);
  closeCartConfirmModal();
};

const isCartConfirmModal: ComputedRef<boolean> = computed(() => {
  const flagCartConfirmStatus: boolean = flag.cartConfirm;
  const cartProductLength: number = cartProducts.value.length;
  const isShowCartConfirmModal = flagCartConfirmStatus && cartProductLength;

  if (isShowCartConfirmModal) return true;

  return false;
});

const isSingleProduct = (product: cartProductType): boolean => {
  const isSingle = product.maxQuantity === 1;

  return isSingle;
};

const isProductOption = (product: cartProductType): boolean => {
  if (!product.options) return false;
  const isOption = product.options?.length > 0;

  return isOption;
};

const isItemType = (
  option:
    | CartProductOptionGroupType
    | CartProductOptionType
    | productOptionItemType,
) => !option.isOptionExist && !option.isProductExist;

const deleteProduct = (productIndex: number) => {
  spliceCartProduct(productIndex);

  if (cartProducts.value.length === 0) closeModal(CART);
};

const deleteProductAll = () => {
  deleteCartProductAll();
  closeModal(CART);
};

const increaseProductQuantity = (productIndex: number): void => {
  const productQuantity: number = cartProducts.value[productIndex].quantity;
  const productMaxQuantity: number =
    cartProducts.value[productIndex].maxQuantity;
  const isProductQuantityMax: boolean = productQuantity === productMaxQuantity;
  const isNoLimit: boolean = productMaxQuantity === 0;

  if (isProductQuantityMax && !isNoLimit) {
    openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    return;
  }

  increaseCartProductQuantity(productIndex);
};

const decreaseProductQuantity = (productIndex: number): void => {
  const productQuantity = cartProducts.value[productIndex].quantity;
  const productMinQuantity = cartProducts.value[productIndex].minQuantity;
  const isProductQuantityMin: boolean = productQuantity === productMinQuantity;
  const isProductQuantity = productQuantity !== 0;
  const isProductSingle = productQuantity === 1;

  if ((isProductQuantityMin && isProductQuantity) || isProductSingle) {
    deleteProduct(productIndex);

    if (cartProducts.value.length === 0) closeModal(CART);
    return;
  }

  decreaseCartProductQuantity(productIndex);
};

const sumOptionPrice = (
  accumulateOptionPrice: number,
  option: CartProductOptionType,
): number => {
  if (!option.checked) return accumulateOptionPrice;
  const optionPrice = option.price * option.quantity;
  const totalOptionPrice = accumulateOptionPrice + optionPrice;

  return totalOptionPrice;
};

const sumProductPrice = (
  accumulateProductPrev: number,
  product: cartProductType,
) => {
  const productPrice = product.price * product.quantity;
  const productOptionsPrice = product.options
    ? product.options?.reduce((groupTotalPrice, nextGroup) => {
        if (
          nextGroup.checked &&
          isItemType(nextGroup as unknown as CartProductOptionType)
        ) {
          const optionItem = nextGroup;
          return groupTotalPrice + optionItem.price;
        }

        const optionGroup = nextGroup;
        const options = optionGroup.items;
        const optionsTotal = options.reduce(sumOptionPrice as any, 0);
        return groupTotalPrice + optionsTotal;
      }, 0) * product.quantity
    : 0;
  const sum = accumulateProductPrev + productPrice + productOptionsPrice;

  return sum;
};

// 선택한 옵션 아이템만 필터링한 상품 데이터
const getFilteredCartProductInfo = computed(() => {
  const optionGroup = cartProducts.value.map((product) => {
    const productOptionInfo = product.options;

    const filteredOptionGroup = productOptionInfo.map((options) => {
      const productOptionItemsInfo = options.items;
      const filteredOptionItem = productOptionItemsInfo.filter(
        (items) => items.code !== 'not_select' && items.checked,
      );

      return {
        ...options,
        items: filteredOptionItem,
      };
    });

    return {
      ...product,
      options: filteredOptionGroup,
    };
  });

  return optionGroup;
});

const getProductTotalPrice: cartProductFuncType<number> = (product) => {
  const { price, quantity, options } = product;

  const productPrice = price * quantity;
  const productOptionsPrice = options
    ? product.options.reduce((groupTotalPrice, nextGroup) => {
        if (isItemType(nextGroup as unknown as CartProductOptionType)) {
          const optionItem = nextGroup;
          return groupTotalPrice + optionItem.price;
        }

        const optionGroup = nextGroup;
        const options = optionGroup.items;
        const optionsTotal = options.reduce(sumOptionPrice as any, 0);
        return groupTotalPrice + optionsTotal;
      }, 0) * product.quantity
    : 0;
  const sum = productPrice + productOptionsPrice;

  return sum;
};

const getProductsTotalPrice: ComputedRef<number> = computed(() => {
  const sumProductsPrice = cartProducts.value.reduce(sumProductPrice, 0);

  return sumProductsPrice;
});

const getProductOptionPrice: cartProductOptionFuncType<number> = (option) => {
  const { price, quantity } = option;
  const sum = price * quantity;

  return sum;
};

const getProductsQuantityText: ComputedRef<string> = computed(() => {
  const getQuantity = (acQuantity: number, current: cartProductType) =>
    acQuantity + current.quantity;
  const sumProductsQuantity = cartProducts.value.reduce(getQuantity, 0);
  const sumProductsLength = cartProducts.value.length;
  const text = `${sumProductsLength}${t('가지')} ${sumProductsQuantity}${t('개')}`;

  return text;
});

const { tableInfo } = storeToRefs(useTableStore());
const { totalVisitPeople, isOccupied } = storeToRefs(useVisitPeopleStore());

const { updatePaymentOrderKey } = usePaymentStore();
const { currentPaymentOrderKey } = storeToRefs(usePaymentStore());

// [선결제 리메이크] 2단계. 안드로이드 결제요청 호출
const callAndroidReadyPayment = () => {
  const businessNumber = initStoreInfo.value.saupjaNumber;
  const deviceId = tableInfo.value.creditSerialNumber;
  const serialNo = initStoreInfo.value.posSerialNumber;
  const vanType = tableInfo.value.van;
  const orderKey = currentPaymentOrderKey.value;
  const storeCode = getStoreCode();
  const tabletCode = getInitTableId();

  if (window.UUID) {
    window.UUID.readyPayment(
      businessNumber,
      deviceId,
      serialNo,
      vanType,
      orderKey,
      storeCode,
      tabletCode,
    );
  } else {
    console.log('callAndroidReadyPayment 안드로이드 결제요청 호출');
  }
};

// [선결제 리메이크] 1단계. 결제 준비하기
const postReadyCredit = async () => {
  startFetching();
  try {
    // 결제준비 api
    const payload = orderPayload(cartProducts.value);

    const res = await requestCreditReady(payload);

    const { resultCode, resultMessage, errorData, resultData } = res.data;

    // 500 = 서버 에러, 400 = 프론트 Payload 에러
    if (resultCode === 500 || resultCode === 400) {
      openConfirmAlert(resultMessage);
    }
    // 412 = 예외처리
    if (resultCode === 412) {
      const errorCode = Number(errorData.errorCode);

      if (errorCode === -301) {
        // -301: 이어서 결제 (결제 필요 안내 알럿 노출)
        updatePaymentOrderKey(errorData.data.orderKey);

        const saveConfirmActive = async () => {
          // 확인 누르면 안드로이드 호출, 웹 로그 전송
          callAndroidReadyPayment();
          await postCreditWebLogs('SEND_ORDER_KEY_TO_ANDROID');
        };

        openConfirmAlert(errorData.errorMessage, saveConfirmActive);
      } else if (errorCode === -303) {
        // -303: 포스 접수 실패 (주문실패 & 결제취소 안내 팝업 노출)
        updatePaymentOrderKey(errorData.data.orderKey);
        openPaymentRefundAlarmModal();
      } else if (errorCode > -200 && errorCode !== -109) {
        // -100 ~: 장바구니 비우기 & configData update(-109 제외)
        openConfirmAlert(errorData.errorMessage);
        deleteCartProductAll();
        // (configData update는 추후 API 생성 시 연결 예정)
      } else {
        openConfirmAlert(errorData.errorMessage);
      }
    }
    // 결제준비 성공
    if (resultCode === 200) {
      updatePaymentOrderKey(resultData.orderKey);
      callAndroidReadyPayment();
      // [선결제 리메이크] 3단계. 안드로이드 결제요청 호출 후 서버로 웹 로그 전송
      await postCreditWebLogs('SEND_ORDER_KEY_TO_ANDROID');
    }
  } catch (error) {
    console.log(error);
  } finally {
    closeModal(CART_CONFIRM);
    endFetching();
  }
};

const clickGoodsOrder = async (_: Event, isConfirmOrder = false) => {
  // 장바구니에 상품이 없을 경우 return
  if (!isHaveCartProduct.value) return;

  // 중복 요정 방지 코드
  if (isFetching.value) {
    openAlert(t('요청중 입니다.'));
    return;
  }

  // 주문 금지 설정이 되어있으면 return
  const closeOrder = init.value.storeInfo?.closeOrder || 0;
  if (closeOrder === 1) {
    openAlert(t('주문이 불가능합니다.'));
    return;
  }

  // 주문 내역 확인 사용시 return
  if (cartConfirmStatus.value && !isConfirmOrder && !flag.cartConfirm) {
    openModal(CART_CONFIRM);
    return;
  }

  // 방문 인원 미입력시 return
  /*
   1. 인원수 미입력시
   2. 인원수 입력 사용 여부 (1: 사용, 0: 미사용) - visitBookUse
   3. 인원수 미입력시 주문 불가 여부 (1: 주문 불가, 0: 주문 가능) - visitOrderAble
   4. 인원수 입력창 노출 방법 (order: 주문하기 클릭시 노출, storeLogo: 첫 인터랙션 적용시) - visitGroupOpenType
   5. 주문 내역이 없을 경우 - !isHaveOrderList
  */
  if (
    !isOccupied.value &&
    !isHaveOrderList.value &&
    totalVisitPeople.value === 0 &&
    getVisitConfig.value?.visitBookUse === 1 &&
    getVisitConfig.value?.visitGroupOpenType === 'order' &&
    !isConfirmOrder
  ) {
    if (getVisitConfig.value?.visitOrderAble === 1) {
      openAlert(t('주문을 위해서 인원 수 선택이 필요합니다.'));
    }
    setBeforeOrder();
    openModal(VISIT_PEOPLE);

    return;
  }

  // 최소 주문금액 미달시 return
  // 최소금액 조건 체크 -> (장바구니 상품금액 총합 + 기존주문 상품금액 총합 (직원호출 상품 제외)  >  min)
  const cartTotalPrice = getProductsTotalPrice.value;
  const billsTotalPrice = orderList?.value.order_info?.reduce((sum, item) => {
    if (item.good_code !== '99999') {
      return sum + parseInt(item.good_price, 10) * item.order_qty;
    }
    return sum;
  }, 0);

  const orderTotalPriceSum = cartTotalPrice + billsTotalPrice;

  const minPrice = init.value.storeInfo?.minOrderPrice || 0;

  if (orderTotalPriceSum < minPrice) {
    openAlert(
      `${t('0원 이상 주문해주세요.', { price: checkStandardPriceUnit(minPrice?.toLocaleString()) })}`,
    );
    return;
  }

  // 상점 정보가 없을시 return
  const formData = makeOrderForm(
    cartProducts.value,
    getStoreInfo(),
    'legacy',
    duplicateCartCode.value,
  );
  if (formData === false) return;

  // 선결제 여부 판단(선결제매장 && 선결제테이블)하여 선결제 로직 실행
  if (getInitTableCreditUse() && initStoreInfo.value.prePaymentUse === 'Y') {
    postReadyCredit();

    return;
  }

  startFetching();

  try {
    const payload = orderPayload(cartProducts.value);
    const res = await requestOrders(payload);

    // 주문 성공 (완료처리)
    if (res.data.result) {
      if (!isHaveOrderList.value) setIsHaveOrderExist();
      // 주문완료 광고영상 페이지 이동
      pushPage(orderComplete);
    }

    // 장바구니 비우기 & 닫기
    deleteCartProductAll();
    closeModal(CART);
  } catch {
    openAlert(t('요청을 실패하였습니다.'));
  } finally {
    closeModal(CART_CONFIRM);
    endFetching();
  }
};

const checkEnglishLanguage = () => {
  const { locale } = i18n.global;

  if (locale.value === 'en') return true;

  return false;
};

const isEnglish = computed(checkEnglishLanguage);

// 장바구니 열림 여부에 따라, 주문 중복 방지 코드 생성/제거
const isCartOpened = computed(
  () => isActiveCart.value && !isRestaurantVerticalTheme.value,
);
watch(isCartOpened, (curr, prev) => {
  if (!prev && curr) {
    const storeCode = getStoreCode();
    const tableId = tableInfo.value.tabletId;
    const uCode = getStorage(U_CODE) ?? '';
    createDuplicateCartCode(storeCode, tableId, uCode);
    return;
  }
  if (prev && !curr) {
    clearDuplicateCartCode();
  }
});

const isLastItem = (productList: cartProductType[], index: number) =>
  productList.length - 1 === index;

// v-for 방어 코드
const getCartItemKey = (
  optionGroup: CartProductOptionGroupType | CartProductOptionType,
  optionGroupIndex: number,
) =>
  optionGroup
    ? `${optionGroup.name}-${optionGroupIndex}`
    : `option-group-${optionGroupIndex}`;
const getOptionItemKey = (parentGroupIndex: number, code: string): string =>
  `${parentGroupIndex}:${code}`;
const getCartConfirmItemKey = (
  cartItem: cartProductType,
  cartItemIndex: number,
) =>
  cartItem ? `${cartItem.id}-${cartItemIndex}` : `cart-item-${cartItemIndex}`;
const getCartConfirmGroupItemKey = (
  cartGroup: CartProductOptionGroupType | CartProductOptionType,
  cartGroupIndex: number,
) =>
  cartGroup
    ? `${cartGroup.name}-${cartGroupIndex}`
    : `cart-Group-${cartGroupIndex}`;
const getCartConfirmOptionItemKey = (
  optionItem: productOptionItemType,
  optionIndex: number,
) =>
  optionIndex ? `${optionItem}-${optionIndex}` : `option-item-${optionIndex}`;
</script>

<template>
  <VisitPeople
    v-if="flag.visitPeople && getVisitConfig?.visitGroupOpenType === 'order'"
    :order="clickGoodsOrder"
  />
  <!-- 기본 장바구니 모달 -->
  <CartModal
    v-show="isActiveCart && !isRestaurantVerticalTheme"
    :order="clickGoodsOrder"
    :getProductsTotalPrice="getProductsTotalPrice"
    :getProductsQuantityText="getProductsQuantityText"
    :closeCartModal="() => closeModal(CART)"
    :storeName="getStoreName()"
    :tableName="getInitTableName()"
    :isForestTheme="isForestCardTheme || isForestTheme"
    :orderButtonText="orderButtonText"
    :t="t"
    :goToSecret="onNextSecret"
  >
    <CartModalListItem
      v-for="(product, productIndex) in getFilteredCartProductInfo"
      :key="generateProductCode(product)"
      :product="product"
      :productIndex="productIndex"
      :deleteProduct="deleteProduct"
      :getProductTotalPrice="getProductTotalPrice"
      :increaseProductQuantity="increaseProductQuantity"
      :decreaseProductQuantity="decreaseProductQuantity"
      :isSingleProduct="isSingleProduct(product)"
      :data-cy-min="product.minQuantity"
      :data-cy-max="product.maxQuantity"
      :t="t"
      :isLastItem="isLastItem(getFilteredCartProductInfo, productIndex)"
    >
      <div
        v-for="(optionGroup, optionGroupIndex) in product.options"
        :key="
          getCartItemKey(
            optionGroup as unknown as CartProductOptionType,
            optionGroupIndex,
          )
        "
      >
        <template
          v-if="isItemType(optionGroup as unknown as CartProductOptionType)"
        >
          <CartModalListOptionItem
            :key="
              getOptionItemKey(
                productIndex,
                (optionGroup as unknown as CartProductOptionType).code,
              )
            "
            :option="optionGroup as unknown as CartProductOptionType"
            :getProductOptionPrice="getProductOptionPrice"
            :t="t"
          />
        </template>
        <template v-else>
          <CartModalListOptionItem
            v-for="option in (
              optionGroup as unknown as CartProductOptionGroupType
            ).items as CartProductOptionType[]"
            :key="getOptionItemKey(productIndex, option.code)"
            :option="option"
            :getProductOptionPrice="getProductOptionPrice"
            :t="t"
          />
        </template>
      </div>
    </CartModalListItem>
  </CartModal>
  <!-- 레스토랑 세로 장바구니 모달 -->
  <RestaurantVerticalScreenCartModal
    v-show="isActiveCart && isRestaurantVerticalTheme"
    :class="[isSpreadActive, theme.color]"
    :spreadOut="spreadOut"
    :spreadIn="spreadIn"
    :isSpread="isSpread"
    :openStaffCall="openStaffCall"
    :masterStaffCallOption="masterStaffCallOption"
    :order="clickGoodsOrder"
    :getProductsTotalPrice="getProductsTotalPrice"
    :getProductsQuantityText="getProductsQuantityText"
    :closeCartModal="() => closeModal(CART)"
    :orderButtonText="orderButtonText"
    :deleteProductAll="deleteProductAll"
    :t="t"
  >
    <RestaurantVerticalScreenCartModalItem
      v-for="(product, productIndex) in getFilteredCartProductInfo"
      :key="generateProductCode(product)"
      :class="[isSpreadActive, theme.color]"
      :isThemeColorBlack="isThemeColorBlack"
      :isSpread="isSpread"
      :product="product"
      :productIndex="productIndex"
      :isProductOption="isProductOption(product)"
      :deleteProduct="deleteProduct"
      :getProductTotalPrice="getProductTotalPrice"
      :increaseProductQuantity="increaseProductQuantity"
      :decreaseProductQuantity="decreaseProductQuantity"
      :onNextProductOptionView="onNextProductOptionView"
      :t="t"
    >
      <div
        v-for="(optionGroup, optionGroupIndex) in product.options"
        :key="`${optionGroupIndex}-${optionGroup.name}`"
      >
        <template
          v-if="isItemType(optionGroup as unknown as CartProductOptionType)"
        >
          <RestaurantVerticalScreenCartModalOptionItem
            :key="
              getOptionItemKey(
                (optionGroup as unknown as CartProductOptionType)
                  .parentGroupIndex,
                (optionGroup as unknown as CartProductOptionType).code,
              )
            "
            :option="optionGroup as unknown as CartProductOptionType"
            :getProductOptionPrice="getProductOptionPrice"
            :t="t"
          />
        </template>
        <template v-else>
          <RestaurantVerticalScreenCartModalOptionItem
            v-for="option in (
              optionGroup as unknown as CartProductOptionGroupType
            ).items as CartProductOptionType[]"
            :key="getOptionItemKey(option.parentGroupIndex, option.code)"
            :option="option"
            :getProductOptionPrice="getProductOptionPrice"
            :t="t"
          />
        </template>
      </div>
    </RestaurantVerticalScreenCartModalItem>
  </RestaurantVerticalScreenCartModal>

  <!-- 장바구니 확인 모달 -->
  <teleport to="#modal">
    <CartConfirmModal
      v-if="isCartConfirmModal"
      :getProductsTotalPrice="getProductsTotalPrice"
      :getProductsQuantityText="getProductsQuantityText"
      :orderCartConfirm="orderCartConfirm"
      :closeCartConfirmModal="closeCartConfirmModal"
      :confirmOrderButtonText="confirmOrderButtonText"
      :order="clickGoodsOrder"
      :t="t"
      :isEnglish="isEnglish"
    >
      <CartConfirmModalListItem
        v-for="(product, productIndex) in getFilteredCartProductInfo"
        :key="getCartConfirmItemKey(product, productIndex)"
        :product="product"
        :getProductTotalPrice="getProductTotalPrice"
        :t="t"
      >
        <div
          v-for="(optionGroup, optionGroupIndex) in product.options"
          :key="
            getCartConfirmGroupItemKey(
              optionGroup as unknown as CartProductOptionType,
              optionGroupIndex,
            )
          "
        >
          <template
            v-if="isItemType(optionGroup as unknown as CartProductOptionType)"
          >
            <CartConfirmModalListOptionItem
              :option="optionGroup as unknown as CartProductOptionType"
              :getProductOptionPrice="getProductOptionPrice"
              :t="t"
            />
          </template>
          <template v-else>
            <CartConfirmModalListOptionItem
              v-for="(option, optionIndex) in (
                optionGroup as unknown as CartProductOptionGroupType
              ).items as CartProductOptionType[]"
              :key="getCartConfirmOptionItemKey(option, optionIndex)"
              :option="option"
              :getProductOptionPrice="getProductOptionPrice"
              :t="t"
            />
          </template>
        </div>
      </CartConfirmModalListItem>
    </CartConfirmModal>
  </teleport>
</template>
