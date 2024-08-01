<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, ComputedRef, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import {
  getRouteName,
  pushPage,
  pushPageWithParams,
} from '@utils/route.helper';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import {
  nullishCheck,
  getStorage,
  getStoreName,
  getInitTableName,
  generateProductCode,
  makeOrderForm,
  getStoreCode,
  getInitTableId,
  getInitTableCreditUse,
} from '@torder/common/utils';
import {
  productOptionItemType,
  productOptionType,
  productType,
} from '@torder/common/interface/product';
import {
  cartProductFuncType,
  cartProductType,
  CartProductOptionGroupType,
  CartProductOptionType,
  convertedCartProductType,
  OrderSpecType,
} from '@torder/common/interface/cartProduct';
import {
  CART,
  CUSTOM_VISIT_PEOPLE,
  CUSTOM_CART_CONFIRM,
  RESTAURANT_VERTICAL,
  TABLE,
  U_CODE,
} from '@torder/common/constant';
import {
  getSubPrimaryColor,
  orderInfoOptionType,
  orderInfoType,
} from '@torder/common';
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
  internationalTextOption,
  internationalImageOption,
  orderComplete,
} from '@router/routePaths';
import i18n from '@i18n';
import { CustomVisitPeople } from '@containers';
import useOrderConfig from '@composables/useOrderConfig';
import { useSecret } from '@composables/secret';
import postCreditWebLogs from '@composables/creditLog';
import useOrderDepthOptions from '@composables/OrderOptions/useOrderOptions';
import {
  HyattCartModal,
  HyattCartModalListItem,
  HyattCartModalProductBasicInformation,
  CustomHyattCartConfirmModal,
} from '@components';
import { requestOrders } from '@apis/order';
import { requestCreditReady } from '@apis/credit';

const { t } = useI18n();

const { onNextSecret } = useSecret();

const {
  init,
  getVisitConfig,
  getStoreInfo: initStoreInfo,
} = storeToRefs(useInitStore());
const { getDarkModeClass } = useInitStore();

const {
  flag,
  openModal,
  closeModal,
  openAlert,
  openConfirmAlert,
  openPaymentRefundAlarmModal,
} = useModalStore();

const { cartProducts, cartConfirmStatus, isActiveCart, isHaveCartProduct } =
  storeToRefs(useCartStore());
const {
  spliceCartProduct,
  deleteCartProductAll,
  increaseCartProductQuantity,
  decreaseCartProductQuantity,
  createDuplicateCartCode,
  clearDuplicateCartCode,
} = useCartStore();

const { theme } = storeToRefs(useThemeStore());

const { orderList, isHaveOrderList } = storeToRefs(useOrderListStore());

const { totalVisitPeople, isOccupied } = storeToRefs(useVisitPeopleStore());

const { setIsHaveOrderExist, orderPayload } = useOrderConfig();

const { tabletLogo } = initStoreInfo.value;

const isFetching = ref(false);

const startFetching = () => {
  isFetching.value = true;
};

const endFetching = () => {
  isFetching.value = false;
};

const getKeyFromCartItem = (item: productType | CartProductOptionType) => {
  if (item.isProduct) {
    const product = item as productType;
    return product.productCode;
  }

  const optionItem = item as CartProductOptionType;
  return optionItem.code;
};

const getChangeOptionButtonText = (product: cartProductType) => {
  if (product.isProductExist) return t('세트 구성 변경');
  return t('옵션 변경');
};

/** 옵션그룹에서 최종 선택된 옵션 아이템만 필터링해주는 함수 */
const filterSelectedOptionItemInOptionGroup = (
  optionGroupList:
    | (productOptionItemType | productType | CartProductOptionGroupType)[]
    | (productOptionItemType | productOptionType)[],
  optionItemListInGroups: (productOptionItemType | productType)[],
) => {
  optionGroupList?.forEach((option) => {
    if (!option.checked) return;

    // 단순상품 또는 옵션 아이템일 경우 (기본 옵션처럼 사용할 경우 실행됨)
    if (!option.isOptionExist && !option.isProductExist) {
      const itemType = option as productType;
      if (itemType.code !== 'not_select' && itemType.checked) {
        optionItemListInGroups.push(itemType);
        return;
      }
    }

    // 상품그룹일 경우
    if (option.isProductExist && !option.isProduct) {
      const groupType = option as CartProductOptionGroupType;

      filterSelectedOptionItemInOptionGroup(
        groupType.items,
        optionItemListInGroups,
      );
      return;
    }

    // 옵션상품일 경우
    if (option.isProduct && option.isOptionExist && !option.isProductExist) {
      const itemType = option as productType;

      itemType.option = itemType.option.filter((option) => option.checked);
      optionItemListInGroups.push(itemType);
      filterSelectedOptionItemInOptionGroup(
        itemType.option,
        optionItemListInGroups,
      );
      return;
    }

    // 옵션그룹일 경우
    if (option.isOptionExist && !option.isProduct) {
      const groupType = option as CartProductOptionGroupType;
      filterSelectedOptionItemInOptionGroup(
        groupType.items,
        optionItemListInGroups,
      );
    }
  });

  return optionItemListInGroups;
};

/** 상품그룹일 경우와 옵션일 경우를 나누어 "선택된" 그룹또는 아이템을 필터링 해주는 함수 */
const filterSelectedOptions = (
  optionList: (
    | CartProductOptionGroupType
    | CartProductOptionType
    | productType
  )[],
) => {
  const selectedOptionList: (productOptionItemType | productType)[] = [];

  optionList?.forEach((option) => {
    // if (!option.checked) return;

    // 세트상품이면 단순상품일 경우 옵션상품일 경우는 옵션 아이템일 경우
    if (!option.isOptionExist && !option.isProductExist) {
      const itemType = option as productOptionItemType | productType;
      selectedOptionList.push(itemType);
      return;
    }

    // 상품그룹일 경우
    if (option.isProductExist && !option.isProduct) {
      const groupType = option as CartProductOptionGroupType;
      const optionItemListInGroups: productType[] = [];

      filterSelectedOptionItemInOptionGroup(
        groupType.items,
        optionItemListInGroups,
      );
      selectedOptionList.push(...optionItemListInGroups);
      return;
    }

    // 옵션그룹일 경우 (기본 옵션처럼 사용할 경우 실행됨)
    if (option.isOptionExist && !option.isProduct) {
      const groupType = option as CartProductOptionGroupType;
      const optionItemListInGroups: productType[] = [];

      filterSelectedOptionItemInOptionGroup(
        groupType.items,
        optionItemListInGroups,
      );
      selectedOptionList.push(...optionItemListInGroups);
      return;
    }

    // 옵션 상품일 경우
    if (option.isOptionExist && option.isProduct) {
      const optionProduct = option as productType;

      optionProduct.option = optionProduct.option.filter(
        (option) => option.checked,
      );
      selectedOptionList.push(optionProduct);

      optionProduct?.option.forEach((subOption) => {
        if (!subOption.checked) return;

        // 옵션 아이템일 경우
        if (
          !subOption.isOptionExist &&
          !subOption.isProductExist &&
          !subOption.isProduct
        ) {
          const itemType = subOption as productOptionItemType;
          selectedOptionList.push(itemType);
          return;
        }

        // 옵션그룹일 경우
        if (subOption.isOptionExist && !subOption.isProduct) {
          const groupType = subOption as CartProductOptionGroupType;
          const optionItemListInGroups: (
            | productOptionItemType
            | productType
          )[] = [];
          filterSelectedOptionItemInOptionGroup(
            groupType.items,
            optionItemListInGroups,
          );
          selectedOptionList.push(...optionItemListInGroups);
        }
      });
    }
  });

  return selectedOptionList;
};

/** 상품의 타입이 옵션인지 상품인지 체크하여 선택된 옵션리스트 필터링 */
const convertOptions = (product: cartProductType) => {
  // 옵션 그룹일 경우
  if (product.isOptionExist) {
    return filterSelectedOptions(product.options as any);
  }

  // 상품 그룹일 경우
  return filterSelectedOptions(product.products);
};

const confirmOrderButtonText = computed(() => {
  const order = t('주문하기');
  const notOrder = t('주문 진행 중');

  if (isFetching.value) return notOrder;
  return order;
});

const isRestaurantVerticalTheme: ComputedRef<boolean> = computed(() => {
  const { type } = theme.value;
  const isRestaurantVertical = type === RESTAURANT_VERTICAL;
  return isRestaurantVertical;
});

const closeCartConfirmModal = (): void => {
  closeModal(CUSTOM_CART_CONFIRM);
};

const changeOptions = (product: cartProductType, targetIndex: number) => {
  const productStore = useProductStore();
  const { setProductInfo } = productStore;

  setProductInfo(product);
  closeModal(CART);

  if (init.value?.storeInfo?.optionLayout === 'customImage') {
    pushPageWithParams(getRouteName(internationalImageOption), {
      id: product.id,
      changedOption: 1,
      targetIndex,
    });
  } else {
    pushPageWithParams(getRouteName(internationalTextOption), {
      id: product.id,
      changedOption: 1,
      targetIndex,
    });
  }
};

const orderCartConfirm = (): void => {
  deleteCartProductAll();
  closeModal(CART);
  closeCartConfirmModal();
};

const isCartConfirmModal: ComputedRef<boolean> = computed(() => {
  const flagCartConfirmStatus: boolean = flag.customCartConfirm;
  const cartProductLength: number = cartProducts.value.length;
  const isShowCartConfirmModal = flagCartConfirmStatus && cartProductLength;
  if (isShowCartConfirmModal) return true;
  return false;
});

/** 최대수량이 1개인 경우 단일 선택만 가능한 상품 */
const isSingleProduct = (product: cartProductType): boolean => {
  const isSingle = product.maxQuantity === 1;
  return isSingle;
};

/** 옵션 변경 및 세트구성 변경 버튼이 안보여야하는 조건식 함수 */
const hasNotOptionChangeButton = (product: cartProductType): boolean => {
  const isOption = product.options?.length > 0;

  return !isOption;
};

const deleteProduct = (productIndex: number) => {
  const targetProduct = cartProducts.value[productIndex];

  openAlert(
    `${t('상품을(를) 삭제했습니다.', { item: translateLanguage(targetProduct.productLanguage, targetProduct.productLanguage?.ko) })}`,
  );
  spliceCartProduct(productIndex);

  if (cartProducts.value.length === 0) closeModal(CART);
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

  if (productMinQuantity > 1 && isProductQuantityMin) {
    openAlert(t('최소 주문 수량은 n개 입니다.', { min: productMinQuantity }));
    return;
  }

  if ((isProductQuantityMin && isProductQuantity) || isProductSingle) {
    openAlert(
      `${t('상품을(를) 삭제했습니다.', { item: cartProducts.value[productIndex]?.name })}`,
    );
    deleteProduct(productIndex);

    if (cartProducts.value.length === 0) closeModal(CART);
    return;
  }

  decreaseCartProductQuantity(productIndex);
};

const selectedProductInCartProducts = computed(() => {
  const cartProductList = [...cartProducts.value];

  const convertedCartProductList: convertedCartProductType[] = [];

  cartProductList.forEach((product) => {
    const convertedProduct = {
      ...product,
      convertedItems: convertOptions(product),
    } as convertedCartProductType;

    convertedCartProductList.push(convertedProduct);
  });

  return convertedCartProductList;
});

/** 옵션에서 재귀적으로 총 가격을 더해주는 로직 */
const recursiveSumProductTotalPrice = (
  option: CartProductOptionGroupType | CartProductOptionType | productType,
  totalPrice: number,
): number => {
  if (!option.checked) return totalPrice;

  // 옵션아이템일 경우
  if (!option.isOptionExist && !option.isProductExist) {
    const optionItem = option as CartProductOptionType;
    return totalPrice + optionItem.price * optionItem.quantity;
  }

  // 옵션상품일 경우
  if (option.isProduct && option.isOptionExist && !option.isProductExist) {
    const optionProduct = option as productType;

    // 옵션상품은 가격과 수량이 존재
    let totalSum = 0;
    totalSum += totalPrice + optionProduct.price * optionProduct.quantity;
    totalSum += optionProduct.option.reduce((total, subOption) => {
      if (!subOption.checked) return total;

      // 옵션아이템일 경우
      if (!subOption.isOptionExist && !subOption.isProductExist) {
        const optionItem = subOption as CartProductOptionType;
        return total + optionItem.price * optionItem.quantity;
      }

      // 옵션그룹일 경우
      if (subOption.isOptionExist && !subOption.isProductExist) {
        const optionGroup = subOption as CartProductOptionGroupType;
        return recursiveSumProductTotalPrice(optionGroup, total);
      }

      return total;
    }, 0);

    return totalSum;
  }

  // 상품그룹일 경우
  if (option.isProductExist && !option.isProduct) {
    const optionGroup = option as CartProductOptionGroupType;

    return (
      optionGroup.items.reduce((total, subOption) => {
        if (!subOption.checked) return total;

        // 단순상품일 경우
        if (!subOption.isOptionExist && !subOption.isProductExist) {
          const productItem = subOption as CartProductOptionType;
          return total + productItem.price * productItem.quantity;
        }

        // 상품그룹일 경우
        if (!subOption.isOptionExist && subOption.isProductExist) {
          const optionGroup = subOption as CartProductOptionGroupType;
          return recursiveSumProductTotalPrice(optionGroup, total);
        }

        // 옵션그룹일 경우
        if (subOption.isOptionExist && !subOption.isProductExist) {
          const optionGroup = subOption as CartProductOptionGroupType;
          return recursiveSumProductTotalPrice(optionGroup, total);
        }

        return total;
      }, 0) + totalPrice
    );
  }

  // 옵션그룹일 경우
  if (option.isOptionExist && !option.isProduct) {
    const optionGroup = option as CartProductOptionGroupType;

    return (
      optionGroup.items.reduce((total, subOption) => {
        if (!subOption.checked) return total;

        // 옵션아이템일 경우
        if (!subOption.isOptionExist && !subOption.isProductExist) {
          const optionItem = subOption as CartProductOptionType;
          return total + optionItem.price * optionItem.quantity;
        }

        // 옵션그룹일 경우
        if (subOption.isOptionExist && !subOption.isProductExist) {
          const optionGroup = subOption as CartProductOptionGroupType;
          return recursiveSumProductTotalPrice(optionGroup, total);
        }

        return total;
      }, 0) + totalPrice
    );
  }

  return totalPrice;
};

/** 옵션배열에서 재귀적으로 총 가격을 더해주는 로직 */
const recursiveSumOptionGroupTotalPrice = (
  list: (
    | productOptionItemType
    | productOptionType
    | productOptionItemType
    | productType
    | CartProductOptionGroupType
  )[],
) => {
  const sumPrice = list.reduce((totalSum, nextGroup) => {
    if (!nextGroup.checked) return totalSum;

    // 옵션아이템일 경우
    if (!nextGroup.isOptionExist && !nextGroup.isProductExist) {
      const optionItem = nextGroup as CartProductOptionType;
      return totalSum + optionItem.price * optionItem.quantity;
    }

    // 옵션그룹일 경우
    if (nextGroup.isOptionExist) {
      const optionGroup = nextGroup as CartProductOptionGroupType;
      const sum = recursiveSumProductTotalPrice(optionGroup, totalSum);
      return totalSum + sum;
    }

    return totalSum;
  }, 0);

  return sumPrice;
};

/** 세트메뉴일 경우 총 선택된 아이템 가격을 더해주는 로직 */
const sumProductTotalPrice = (
  products: (CartProductOptionGroupType | productType)[],
) => {
  const totalProductPrice = products.reduce((groupTotalPrice, nextGroup) => {
    if (!nextGroup.checked) return groupTotalPrice;

    // 옵션아이템이거나 단순상품일경우
    if (!nextGroup.isOptionExist && !nextGroup.isProductExist) {
      const optionItem = nextGroup as productType;
      return groupTotalPrice + optionItem.price * optionItem.quantity;
    }

    // 옵션상품일 경우
    if (
      nextGroup.isProduct &&
      nextGroup.isOptionExist &&
      !nextGroup.isProductExist
    ) {
      const product = nextGroup as productType;
      let totalGroupPrice = 0;
      totalGroupPrice += product.price * product.quantity;
      totalGroupPrice += recursiveSumOptionGroupTotalPrice(product.option);
      return groupTotalPrice + totalGroupPrice;
    }

    // 상품그룹일 경우
    if (nextGroup.isProductExist && !nextGroup.isProduct) {
      const productGroup = nextGroup as CartProductOptionGroupType;
      const totalGroupPrice = recursiveSumProductTotalPrice(productGroup, 0);
      return groupTotalPrice + totalGroupPrice;
    }

    // 옵션그룹일 경우
    if (nextGroup.isOptionExist && !nextGroup.isProduct) {
      const optionGroup = nextGroup as CartProductOptionGroupType;
      const totalGroupPrice = recursiveSumProductTotalPrice(optionGroup, 0);
      return groupTotalPrice + totalGroupPrice;
    }

    return groupTotalPrice;
  }, 0);

  return totalProductPrice;
};

/** 세트메뉴가 아닐 경우 총 선택된 아이템 가격을 더해주는 로직 */
const sumOptionTotalPrice = (
  options: (productOptionItemType | CartProductOptionGroupType)[],
) => {
  const totalOptionPrice = options.reduce((groupTotalPrice, nextGroup) => {
    // if (!nextGroup.checked) return groupTotalPrice;

    // 옵션아이템일경우
    if (!nextGroup.isOptionExist && !nextGroup.isProductExist) {
      const optionItem = nextGroup as productOptionItemType;
      return groupTotalPrice + optionItem.price;
    }

    // 옵션 그룹일 경우
    if (nextGroup.isOptionExist && !nextGroup.isProduct) {
      const optionGroup = nextGroup as CartProductOptionGroupType;
      const totalGroupPrice = recursiveSumOptionGroupTotalPrice(
        optionGroup.items,
      );
      return groupTotalPrice + totalGroupPrice;
    }

    return groupTotalPrice;
  }, 0);

  return totalOptionPrice;
};

const { calculateOptionTotalPrice } = useOrderDepthOptions();

const getPriceItem = (item: cartProductType) => {
  const ItemPrice = item.price;
  const OptionPrice = calculateOptionTotalPrice(item.items);

  return item.quantity * (ItemPrice + OptionPrice);
};

const getTotalPriceItem = (item: cartProductType) => {
  let sum = 0;
  const totalQuantity = item.quantity;
  const itemPrice = item.price;
  item.options.forEach((item1) => {
    item1.items?.forEach((item2) => {
      if (item2.checked && item2.code && item2.code !== 'not_select') {
        sum += getPriceItem(item2 as unknown as cartProductType);
      }
    });
  });

  return totalQuantity * (itemPrice + sum);
};

const getProductsTotalPrice = computed(() => {
  let sum = 0;
  cartProducts.value.forEach((cart) => {
    sum += getTotalPriceItem(cart);
  });
  return sum;
});

const getProductTotalPrice: cartProductFuncType<number> = ({
  price,
  quantity,
  options,
  products,
  isProductExist,
  isOptionExist,
}) => {
  const isSetMenu = isProductExist && !isOptionExist;
  const productOptionsPrice = isSetMenu
    ? sumProductTotalPrice(products)
    : sumOptionTotalPrice(options as any);
  const sum = (price + (productOptionsPrice ?? 0)) * quantity;
  return sum;
};

const getCartTotalQuantity = computed(() => {
  const totalCount = cartProducts.value.reduce(
    (acc: number, cur: cartProductType) => acc + cur.quantity,
    0,
  );
  return totalCount;
});

const getProductsQuantityText: ComputedRef<string> = computed(() => {
  const getQuantity = (acQuantity: number, current: cartProductType) =>
    acQuantity + current.quantity;
  const sumProductsQuantity = cartProducts.value.reduce(getQuantity, 0);
  const sumProductsLength = cartProducts.value.length;
  const text = `${sumProductsLength}${t('가지')} ${sumProductsQuantity}${t('개')}`;
  return text;
});

const orderButtonText = computed(() => {
  if (isFetching.value) return t('주문 진행 중');
  if (init.value.storeInfo?.closeOrder === 1) return t('주문불가');

  return t('주문하기');
});

const { tableInfo } = storeToRefs(useTableStore());

const isNonOrderTable = computed(() => {
  if (nullishCheck(tableInfo.value.orderAble)) return false;
  if (tableInfo.value.orderAble === 1) return false;
  return true;
});

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
    closeModal(CUSTOM_CART_CONFIRM);
    endFetching();
  }
};

/** 커스텀테마 주문하기 */
const order = async (_: Event, isConfirmOrder = false) => {
  // 장바구니에 상품이 없을 경우 return
  if (!isHaveCartProduct.value) return;

  // 중복 요청 방지
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

  // 주문 확인 사용
  if (cartConfirmStatus.value && !isConfirmOrder && !flag.customCartConfirm) {
    openModal(CUSTOM_CART_CONFIRM);
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
    openModal(CUSTOM_VISIT_PEOPLE);

    return;
  }

  // 최소 주문금액 미달시 return
  // 최소금액 조건 체크 -> (장바구니 상품금액 총합 + 기존주문 상품금액 총합 (직원호출 상품 제외)  >  min)
  const cartTotalPrice = getProductsTotalPrice.value;
  const billsTotalPrice = orderList.value.order_info?.reduce((sum, item) => {
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
  // const formData = makeOrderForm(cartProducts.value, getStoreInformation(), 'legacy', duplicateCartCode.value);

  // if (formData === false) return;

  // 선결제 여부 판단(선결제매장 && 선결제테이블)하여 선결제 로직 실행
  if (getInitTableCreditUse() && initStoreInfo.value.prePaymentUse === 'Y') {
    postReadyCredit();

    return;
  }

  startFetching();

  try {
    const payload = orderPayload(cartProducts.value);
    const res = await requestOrders(payload);

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
    if (!isHaveOrderList.value) setIsHaveOrderExist();
    closeModal(CUSTOM_VISIT_PEOPLE);
    closeModal(CUSTOM_CART_CONFIRM);
    endFetching();
  }
};

const activeWhiteButtonColor = getSubPrimaryColor('#fff', 10, 'Y');

const checkEnglishLanguage = () => {
  const { locale } = i18n.global;

  if (locale.value === 'en') return true;
  return false;
};

const isEnglish = computed(checkEnglishLanguage);

// 장바구니 열림 여부에 따라, 주문 중복 방지 코드 생성/제거
const isCartOpened = computed(
  () =>
    isActiveCart.value &&
    !isRestaurantVerticalTheme.value &&
    !isNonOrderTable.value,
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

// 마지막 Index 찾는 로직
const isLastItem = (productList: convertedCartProductType[], index: number) =>
  productList.length - 1 === index;
const isFirstItem = (index: number) => index === 0;

// 마지막 check 아이템 찾는 로직
const getLastCheckedItem = (options: cartProductType[]) => {
  for (const option of [...options].reverse()) {
    for (const item of [...option.items].reverse()) {
      if (item.checked && item.code !== 'not_select') {
        return item;
      }
    }
  }
  return null;
};
</script>

<template>
  <CustomVisitPeople
    v-if="
      flag.customVisitPeople &&
      !isOccupied &&
      getVisitConfig?.visitGroupOpenType === 'order'
    "
    :order="order"
  />
  <!-- 기본 장바구니 모달 -->
  <HyattCartModal
    v-show="isActiveCart && !isRestaurantVerticalTheme && !isNonOrderTable"
    :order="order"
    :getProductsQuantityText="getProductsQuantityText"
    :closeCartModal="() => closeModal(CART)"
    :storeName="getStoreName()"
    :tableName="getInitTableName()"
    :orderButtonText="orderButtonText"
    :t="t"
    :goToSecret="onNextSecret"
    :getProductsTotalPrice="getProductsTotalPrice"
    :tabletLogoImage="tabletLogo ?? ''"
  >
    <HyattCartModalListItem
      v-for="(product, productIndex) in selectedProductInCartProducts"
      :key="generateProductCode(product)"
      :product="product"
      :productIndex="productIndex"
      :deleteProduct="deleteProduct"
      :getProductTotalPrice="getProductTotalPrice"
      :increaseProductQuantity="increaseProductQuantity"
      :decreaseProductQuantity="decreaseProductQuantity"
      :isSingleProduct="isSingleProduct(product)"
      :hasNotOptionChangeButton="hasNotOptionChangeButton(product)"
      :minQuantity="product.minQuantity"
      :t="t"
      :changeOptions="changeOptions"
      :getChangeOptionButtonText="getChangeOptionButtonText(product)"
      :isLastItem="isLastItem(selectedProductInCartProducts, productIndex)"
      :isFirstItem="isFirstItem(productIndex)"
      :isTotalPrice="getTotalPriceItem(product)"
    >
      <!-- 상품의 옵션이 있을 경우 옵션 리스트 렌더링 -->
      <div
        class="option-container"
        :class="getDarkModeClass()"
      >
        <HyattCartModalProductBasicInformation
          v-if="!product.convertedItems?.length"
          :basicPrice="product.price"
          :basicQuantity="product.quantity"
          :t="t"
        />
        <div v-else>
          <div class="depth-list">
            <div
              v-for="(level3, index3) in product.options"
              :key="index3"
              class="level3-depth"
            >
              <div
                v-for="(level4, index4) in level3.items"
                class="level4-depth"
                :key="index4"
              >
                <div
                  v-if="level4.checked && level4.code !== 'not_select'"
                  class="level3-item-container"
                >
                  <div
                    class="level3-title ellipsis-text-3"
                    :class="getDarkModeClass()"
                  >
                    {{ translateLanguage(level4.nameArray, level4.name) }}
                  </div>
                  <p
                    class="list-detail-header"
                    :class="getDarkModeClass()"
                  >
                    {{
                      `${t('기본')} : ${checkStandardPriceUnit(level4.price?.toLocaleString())}`
                    }}
                  </p>
                  <div
                    class="option-list-container"
                    :class="getDarkModeClass()"
                  >
                    <span
                      v-for="(level5, index5) in level4.items"
                      :key="index5"
                    >
                      <span
                        v-for="(level6, index6) in level5.items"
                        :key="index6"
                        class="option-list-wrap"
                      >
                        <span
                          v-if="level6.checked && level6.name !== '선택안함'"
                        >
                          -
                          {{ translateLanguage(level6.nameArray, level6.name) }}
                          {{
                            `(+${checkStandardPriceUnit(level6.price.toLocaleString())})`
                          }}
                          x {{ level6.quantity }}
                          <span
                            v-for="(level7, index7) in level6.items"
                            :key="index7"
                          >
                            <span
                              v-for="(level8, index8) in level7.items"
                              :key="index8"
                            >
                              <span
                                v-if="
                                  level8.checked && level8.name !== '선택안함'
                                "
                              >
                                /
                                {{
                                  translateLanguage(
                                    level8.nameArray,
                                    level8.name,
                                  )
                                }}
                                {{
                                  `(+${checkStandardPriceUnit(level8.price.toLocaleString())})`
                                }}
                                x {{ level8.quantity }}
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </div>
                  <p
                    class="list-price"
                    :class="getDarkModeClass()"
                  >
                    <span class="list-price-quantity"
                      >{{ `${level4.quantity}${t('개')}` }}
                    </span>
                    <span>{{
                      checkStandardPriceUnit(
                        getPriceItem(level4)?.toLocaleString(),
                      )
                    }}</span>
                  </p>
                  <div
                    v-if="getLastCheckedItem(product.options) !== level4"
                    class="level4-divider"
                    :class="getDarkModeClass()"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              class="cart-item-option-change-button"
              :class="getDarkModeClass()"
            >
              <div
                id="option-change-sub-element"
                class="change-option-text"
                :class="getDarkModeClass()"
                @click="changeOptions(product, productIndex)"
              >
                {{ t('옵션 변경') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HyattCartModalListItem>
  </HyattCartModal>

  <!-- 장바구니 확인 모달 -->
  <teleport to="#modal">
    <CustomHyattCartConfirmModal
      v-if="isCartConfirmModal"
      :getProductsTotalPrice="getProductsTotalPrice"
      :getProductsQuantityText="getProductsQuantityText"
      :orderCartConfirm="orderCartConfirm"
      :closeCartConfirmModal="closeCartConfirmModal"
      :confirmOrderButtonText="confirmOrderButtonText"
      :order="order"
      :t="t"
      :isEnglish="isEnglish"
      :selectedProductInCartProducts="selectedProductInCartProducts"
      :getCartTotalQuantity="getCartTotalQuantity"
      :getPriceItem="getPriceItem"
      :getTotalPriceItem="getTotalPriceItem"
    />
  </teleport>
</template>

<style scoped lang="scss">
.option-container {
  display: flex;
  flex-direction: column;
  gap: 1.25vw;
  padding: 1.40625vw 1.25vw;
  background-color: #f8f8f8;
  border: 0.0781vw solid #ebebeb;
  border-radius: 0.78125vw;

  &.dark-mode {
    background-color: rgba(255, 255, 255, 0.05);
    border: 0.0781vw solid #4b4b4b;
  }

  .option-list-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.78125vw;

    .list-detail {
      font-size: 1.25vw;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      color: #246ff4;
      letter-spacing: -0.0375vw;

      .list-detail-header {
        margin-bottom: 0.3125vw;
      }

      .list-menu-name {
        word-break: break-all;
      }
      &.dark-mode {
        color: #42a4ff;
      }
    }

    .list-price {
      display: flex;
      flex-direction: row;
      gap: 0.625vw;
      justify-content: flex-end;
      margin-top: 0.7813vw;
      font-size: 1.5625vw;
      font-weight: 500;
      line-height: 1.875vw;
      color: #313131;
      letter-spacing: -0.04687vw;

      .list-price-quantity {
        font-size: 1.5625vw;
        font-weight: 500;
        line-height: 1.875vw;
        color: #afafaf;
      }

      &.dark-mode {
        color: #fff;
      }
    }
  }

  .cart-item-option-change-button {
    display: flex;
    gap: 0.9375vw;
    align-items: center;
    align-self: stretch;
    justify-content: center;
    padding: 0.9375vw 1.875vw;
    margin-top: 1.5625vw;
    background: #fff;
    border: 0.078125vw solid #5b5b5b;
    border-radius: 0.78125vw;

    &.dark-mode {
      color: #fff;
      background-color: #494949;
      border: 0.0781vw solid #5b5b5b;

      &.button-active {
        background-color: #494949;
      }
    }

    &.button-active {
      background-color: v-bind(activeWhiteButtonColor);
    }

    .change-option-text {
      font-size: 1.5625vw;
      font-weight: 700;
      line-height: 1.875vw;
      color: #5b5b5b;
      letter-spacing: -0.03125vw;

      &.dark-mode {
        color: #fff;
      }
    }
  }

  .total-option-price-wrap {
    display: flex;
    justify-content: space-between;
    padding-top: 1.25vw;
    border-top: 0.1563vw solid #ebebeb;

    &.dark-mode {
      border-top: 0.1563vw solid #5b5b5b;
    }

    .total-option-price-title {
      font-size: 1.5625vw;
      font-weight: 500;
      line-height: 1.875vw;
      color: #5b5b5b;
      letter-spacing: -0.0469vw;

      &.dark-mode {
        color: #ebebeb;
      }
    }

    .total-option-price {
      font-size: 1.875vw;
      font-weight: 700;
      line-height: 2.3438vw;
      color: #313131;
      letter-spacing: -0.0562vw;

      &.dark-mode {
        color: #fff;
      }
    }
  }

  .depth-list {
    .level3-item-container {
      display: flex;
      flex-direction: column;
      gap: 0.3125vw;

      .level3-title {
        font-size: 1.5625vw;
        font-weight: 700;
        line-height: 1.875vw;
        color: #313131;
        letter-spacing: -0.03125vw;

        &.dark-mode {
          color: #fff;
        }
      }

      .list-detail-header {
        font-size: 1.25vw;
        font-weight: 400;
        line-height: normal;
        color: #246ff4;
        letter-spacing: -0.0375vw;

        span {
          word-break: break-all;
        }

        &.dark-mode {
          color: #42a4ff;
        }
      }

      .option-list-container {
        display: flex;
        flex-direction: column;
        margin-bottom: 0.7813vw;
        font-size: 1.25vw;
        font-weight: 400;
        line-height: normal;
        color: #246ff4;
        letter-spacing: -0.0375vw;

        &.dark-mode {
          color: #42a4ff;
        }

        .option-list-wrap {
          display: flex;
          flex-direction: column;
          word-break: break-all;
        }
      }
    }

    .level4-divider {
      height: 0.15625vw;
      margin: 1.25vw 0;
      background-color: #ebebeb;

      &.dark-mode {
        background-color: #494949;
      }

      .level4-divider:last-child {
        display: none;
      }
    }

    .list-price {
      display: flex;
      flex-direction: row;
      gap: 0.625vw;
      justify-content: flex-end;
      margin-top: 0.4688vw;
      font-size: 1.5625vw;
      font-weight: 500;
      line-height: 1.875vw;
      color: #313131;
      letter-spacing: -0.04687vw;

      .list-price-quantity {
        font-size: 1.5625vw;
        font-weight: 500;
        line-height: 1.875vw;
        color: #afafaf;
      }

      &.dark-mode {
        color: #fff;
      }
    }
  }
}
</style>
