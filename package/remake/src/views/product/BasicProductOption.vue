<template>
  <div class="basic-option-layout-hub-container">
    <!-- 이미지형 옵션 레이아웃 -->
    <BasicImageOptionLayout
      v-if="getOptionLayout.type === IMAGE"
      :targetProductInfo="targetProductInfo"
      :clickOptionGroupTab="clickOptionGroupTab"
      :getTargetOptionInfo="getTargetOptionInfo"
      :getOptionGroupKey="getOptionGroupKey"
      :getOptionItemKey="getOptionItemKey"
      :clickOptionItem="clickOptionItem"
      :getFilteredTargetList="getFilteredTargetList"
      :getFilteredTargetItemList="getFilteredTargetItemList"
      :deleteOptionItem="deleteOptionItem"
      :clickOptionItemPlus="clickOptionItemPlus"
      :clickOptionItemMinus="clickOptionItemMinus"
      :clickProductCountPlus="clickProductCountPlus"
      :clickProductCountMinus="clickProductCountMinus"
      :getTotalPriceCount="getTotalPriceCount"
      :clickAddCartProduct="clickAddCartProduct"
      :optionLayout="getOptionLayout"
      :getProductDescription="getProductDescription"
      :getCountLimitText="getCountLimitText"
      :isCompleteSelect="isCompleteSelect"
      :isUseDescription="isUseDescription"
      :isWhiteTheme="isWhiteTheme"
      :getArrowIcon="getArrowIcon"
      :getCountButtonColor="getCountButtonColor"
      :getEmptyImageLogo="getBasicThemeProductLogoImage"
      :getDividerCount="getDividerCount"
      :getScrollElementId="getScrollElementId"
      :getScrollGroupElementId="getScrollGroupElementId"
      :getOptionItemPrice="getOptionItemPrice"
    />
    <!-- 텍스트형 옵션 레이아웃 -->
    <BasicTextOptionLayout
      v-else-if="getOptionLayout.type === TEXT"
      :targetProductInfo="targetProductInfo"
      :clickOptionGroupTab="clickOptionGroupTab"
      :getTargetOptionInfo="getTargetOptionInfo"
      :getOptionGroupKey="getOptionGroupKey"
      :getOptionItemKey="getOptionItemKey"
      :clickOptionItem="clickOptionItem"
      :getFilteredTargetList="getFilteredTargetList"
      :getFilteredTargetItemList="getFilteredTargetItemList"
      :deleteOptionItem="deleteOptionItem"
      :clickOptionItemPlus="clickOptionItemPlus"
      :clickOptionItemMinus="clickOptionItemMinus"
      :clickProductCountPlus="clickProductCountPlus"
      :clickProductCountMinus="clickProductCountMinus"
      :getTotalPriceCount="getTotalPriceCount"
      :clickAddCartProduct="clickAddCartProduct"
      :optionLayout="getOptionLayout"
      :getProductDescription="getProductDescription"
      :getCountLimitText="getCountLimitText"
      :isCompleteSelect="isCompleteSelect"
      :isUseDescription="isUseDescription"
      :isWhiteTheme="isWhiteTheme"
      :getArrowIcon="getArrowIcon"
      :getCountButtonColor="getCountButtonColor"
      :getEmptyImageLogo="getBasicThemeProductLogoImage"
      :getDividerCount="getDividerCount"
      :getScrollElementId="getScrollElementId"
      :getScrollGroupElementId="getScrollGroupElementId"
      :getOptionItemPrice="getOptionItemPrice"
    />
    <!-- 기본 옵션 레이아웃-->
    <BasicDefaultOptionLayout
      v-else
      :targetProductInfo="targetProductInfo"
      :activeOptionGroupIndex="activeOptionGroupIndex"
      :clickOptionGroupTab="clickOptionGroupTab"
      :getTargetOptionInfo="getTargetOptionInfo"
      :getActiveOptionItemList="getActiveOptionItemList"
      :getTargetItemsInfo="getTargetItemsInfo"
      :getOptionGroupKey="getOptionGroupKey"
      :getOptionItemKey="getOptionItemKey"
      :clickOptionItem="clickOptionItem"
      :getFilteredTargetList="getFilteredTargetList"
      :getFilteredTargetItemList="getFilteredTargetItemList"
      :deleteOptionItem="deleteOptionItem"
      :clickOptionItemPlus="clickOptionItemPlus"
      :clickOptionItemMinus="clickOptionItemMinus"
      :clickProductCountPlus="clickProductCountPlus"
      :clickProductCountMinus="clickProductCountMinus"
      :getTotalPriceCount="getTotalPriceCount"
      :clickAddCartProduct="clickAddCartProduct"
      :getCountLimitText="getCountLimitText"
      :isCompleteSelect="isCompleteSelect"
      :getDividerCount="getDividerCount"
      :getScrollElementId="getScrollElementId"
      :getScrollGroupElementId="getScrollGroupElementId"
      :getOptionItemPrice="getOptionItemPrice"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Ref, ref, computed, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { pushPage } from '@utils/route.helper';
import { getBasicThemeProductLogoImage } from '@utils/logoUtils';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import {
  cartProductType,
  productOptionType,
  productOptionItemType,
  CartProductOptionType,
  CartProductOptionGroupType,
  BASIC_CONFIRM,
  CART,
  IMAGE,
  BLACK_IMAGE,
  BLACK_TEXT,
  WHITE_IMAGE,
  WHITE_TEXT,
  BASIC,
  BLACK,
  TEXT,
  WHITE,
  removeSpecialCharacters,
} from '@torder/common';
import useProductStore from '@store/storeProduct';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import { home } from '@router/routePaths';
import {
  BasicDefaultOptionLayout,
  BasicImageOptionLayout,
  BasicTextOptionLayout,
} from '@containers';
import requestDescription from '@apis/description';

const { t } = useI18n();

const { productInfo } = useProductStore();

const { openAlert, openModal, openConfirmModal, setAdditionalProductIndex } =
  useModalStore();

const { getStoreInfo } = storeToRefs(useInitStore());

const { addCartProduct } = useCartStore();
const { cartProducts } = storeToRefs(useCartStore());

const getOptionLayout = computed(() => {
  const { optionLayout } = getStoreInfo.value;

  switch (optionLayout) {
    case BLACK_IMAGE:
      return {
        type: IMAGE,
        color: BLACK,
      };
    case BLACK_TEXT:
      return {
        type: TEXT,
        color: BLACK,
      };
    case WHITE_IMAGE:
      return {
        type: IMAGE,
        color: WHITE,
      };
    case WHITE_TEXT:
      return {
        type: TEXT,
        color: WHITE,
      };
    default:
      return {
        type: BASIC,
        color: '',
      };
  }
});

// 옵션 아이템 선택 기능을 위해 변형된 옵션 데이터
const targetProductInfo: Ref<cartProductType> = ref({} as cartProductType);

// 옵션 아이템 선택,미선택 키값, 선택안함 추가를 위한 로직
const setProductDataFormat = () => {
  const targetProduct = JSON.parse(JSON.stringify(productInfo));

  targetProduct.options?.forEach((group: productOptionType) => {
    const groupItem = group.items as productOptionItemType[];
    groupItem.forEach((item: productOptionItemType) => {
      if (!Object.keys(item).includes('quantity')) {
        Object.assign(item, {
          quantity: 1,
          checked: false,
        });
      }
    });
    if (
      group.require === 0 &&
      !group.items.find((item) => item.name === '선택안함')
    ) {
      groupItem.unshift({
        code: 'not_select',
        name: '선택안함',
        nameArray: {
          ko: '선택안함',
          en: 'Regular',
          jp: '選択しない',
          zh_hans: '未选中的',
          zh_hant: '未選中的',
        },
        price: 0,
        limitQty: 1,
        isSale: 1,
        sort: 0,
        image: '',
        isOrder: false,
        isProduct: false,
        isProductExist: false,
        isOptionExist: false,
        isPreSet: false,
        quantity: 0,
        parentGroupIndex: 0,
        checked: true,
        isOptionProduct: false,
        require: 0,
        items: [],
        options: [],
      });
    }
  });

  targetProductInfo.value = targetProduct;
};

setProductDataFormat();

// 옵션 그룹 인덱스
const activeOptionGroupIndex = ref(0);

// 옵션 그룹 배열
const getTargetOptionInfo = computed(() => targetProductInfo.value?.options);

// 선택된 옵션 그룹 정보
const getActiveOptionItemList = computed(
  () => targetProductInfo.value?.options?.[activeOptionGroupIndex.value],
);

// 옵션 아이템 배열
const getTargetItemsInfo = computed(() => {
  const groupData = targetProductInfo.value?.options;
  const itemData = groupData?.[activeOptionGroupIndex.value];
  return itemData?.items;
});

// 옵션 그룹 클릭시 로직
const clickOptionGroupTab = (index: number) => {
  activeOptionGroupIndex.value = index;
};

// id 방어 코드
const getScrollElementId = (
  selectGroupName: string,
  selectItemCode: string,
  itemIndex: number,
) => {
  const changedGroupName = removeSpecialCharacters(selectGroupName);
  const changedItemCode = removeSpecialCharacters(selectItemCode);

  return selectItemCode
    ? `item-${changedGroupName}-${changedItemCode}-${itemIndex}`
    : `item-${changedGroupName}-${itemIndex}`;
};

// 옵션 아이템 선택
const clickOptionItem = async (
  group: CartProductOptionGroupType,
  item: CartProductOptionType,
  itemIndex: number,
) => {
  // 선택한 옵션 아이템 리스트로 포커싱 되도록 위치 찾아서 스크롤 시키는 로직
  const setScrollMove = () => {
    const targetElement = document.querySelector(
      `#${getScrollElementId(group.name, item.code, itemIndex)}`,
    ) as HTMLElement;
    const parentElement = document.querySelector(
      '.basic-option-body-product-selected-list-wrap',
    );
    parentElement?.scrollTo({
      top:
        targetElement?.offsetTop -
        (getStoreInfo.value.optionLayout === 'basic' ? 225 : 150),
      behavior: 'smooth',
    });
  };
  const scrollMoveEvent = async () => {
    setScrollMove();

    await nextTick(setScrollMove);
  };

  // 품절된 상품일 경우
  if (item.isSale === 0) {
    openAlert(t('품절되었습니다.'));
    return;
  }

  const getGroupType = targetProductInfo.value.options;
  const getGroupInfo = getGroupType?.[activeOptionGroupIndex.value];
  const getItemType = getGroupType?.[activeOptionGroupIndex.value]?.items;
  const checkedItemKindCount = getItemType?.filter(
    (item) => item.checked,
  )?.length; // 선택한 아이템 수량;
  const checkedItemQuantityCount = getItemType?.reduce(
    (acc, cur) => (cur.checked ? acc + cur.quantity : acc),
    0,
  ); // 선택한 아이템 총 수량

  // 선택 옵션일 경우
  if (getGroupType?.[activeOptionGroupIndex.value].require === 0) {
    if (item.checked) {
      item.checked = false;
      item.quantity = 1;
      // 아무 아이템도 선택 안할 경우 선택 안함 선택
      if (!getItemType.some((item) => item.checked)) {
        getItemType[0].checked = true;
      }
      if (item.code !== 'not_select') {
        openAlert(
          `${t('상품을(를) 삭제했습니다.', { item: translateLanguage(item.nameArray, item.name) })}`,
        );
      }
    } else {
      // 선택 안함 클릭시 모든 아이템 선택 해제
      if (item.code === 'not_select') {
        const filteredItem = getItemType.filter(
          (item) => item.code !== 'not_select' && item.checked,
        );
        const typicalItem = filteredItem[0];
        const totalCountItem = filteredItem.length;

        getItemType[0].checked = true;
        getItemType.forEach((item: cartProductType) => {
          if (item.code !== 'not_select') {
            item.checked = false;
          }
        });

        if (totalCountItem === 1) {
          openAlert(
            `${t('상품을(를) 삭제했습니다.', { item: translateLanguage(filteredItem[0].nameArray, filteredItem[0].name) })}`,
          );
        } else {
          openAlert(
            `${t('상품외 옵션 n개를 삭제했습니다.', {
              item:
                translateLanguage(typicalItem.nameArray, typicalItem.name) ??
                '',
              count: totalCountItem - 1,
            })}`,
          );
        }

        return;
      }

      // 아무 아이템도 선택 안할 경우 선택 안함 선택
      if (!getItemType.some((item) => item.checked)) {
        getItemType[0].checked = true;
      }

      // 옵션 그룹 내 최대 선택 수량, 종류가 1일 경우
      if (getGroupInfo.maxLimitQty === 1 || getGroupInfo.maxLimitSelect === 1) {
        getItemType.forEach((item) => {
          item.checked = false;
        });
        item.checked = true;
        scrollMoveEvent();
        return;
      }

      // 옵션 그룹 내 최대 선택 수량 보다 크게 선택했을 경우
      if (
        getGroupInfo.maxLimitQty !== 0 &&
        checkedItemQuantityCount + 1 > getGroupInfo.maxLimitQty
      ) {
        if (getGroupInfo.minLimitQty === 0) {
          openAlert(
            `${t('그룹에서 n까지 선택해 주세요.', {
              group: translateLanguage(
                getGroupInfo.nameArray,
                getGroupInfo.name,
              ),
              max: getGroupInfo.maxLimitQty,
            })}`,
          );
        } else if (getGroupInfo.minLimitQty === getGroupInfo.maxLimitQty) {
          openAlert(
            `${t('그룹에서 n개 선택해 주세요.', {
              group: translateLanguage(
                getGroupInfo.nameArray,
                getGroupInfo.name,
              ),
              max: getGroupInfo.maxLimitQty,
            })}`,
          );
        } else {
          openAlert(
            `${t('그룹에서 n~m까지 선택해 주세요.', {
              group: translateLanguage(
                getGroupInfo.nameArray,
                getGroupInfo.name,
              ),
              min: getGroupInfo.minLimitQty,
              max: getGroupInfo.maxLimitQty,
            })}`,
          );
        }
        return;
      }

      // 옵션 그룹 내 최대 선택 종류 보다 많이 선택했을 경우
      if (
        getGroupInfo.maxLimitSelect !== 0 &&
        checkedItemKindCount >= getGroupInfo.maxLimitSelect
      ) {
        if (getGroupInfo.minLimitSelect === 0) {
          openAlert(
            `${t('그룹에서 옵션 종류를 n까지 선택해 주세요.', {
              group: translateLanguage(
                getGroupInfo.nameArray,
                getGroupInfo.name,
              ),
              max: getGroupInfo.maxLimitSelect,
            })}`,
          );
        } else if (
          getGroupInfo.minLimitSelect === getGroupInfo.maxLimitSelect
        ) {
          openAlert(
            `${t('그룹에서 옵션 종류를 n개 선택해 주세요.', {
              group: translateLanguage(
                getGroupInfo.nameArray,
                getGroupInfo.name,
              ),
              max: getGroupInfo.maxLimitSelect,
            })}`,
          );
        } else {
          openAlert(
            `${t('그룹에서 옵션 종류를 n~m까지 선택해 주세요.', {
              group: translateLanguage(
                getGroupInfo.nameArray,
                getGroupInfo.name,
              ),
              min: getGroupInfo.minLimitSelect,
              max: getGroupInfo.maxLimitSelect,
            })}`,
          );
        }
        return;
      }

      item.checked = true;
      getItemType[0].checked = false;
      scrollMoveEvent();
    }
  }

  // 필수 옵션일 경우
  if (getGroupType?.[activeOptionGroupIndex.value].require === 1) {
    // 이미 선택한 상품일 경우
    if (item.checked) {
      item.checked = !item.checked;
      item.quantity = 1;
      openAlert(
        `${t('상품을(를) 삭제했습니다.', { item: translateLanguage(item.nameArray, item.name) })}`,
      );
    } else {
      // 옵션 그룹 내 최대 선택 수량, 종류가 1일 경우
      if (getGroupInfo.maxLimitQty === 1 || getGroupInfo.maxLimitSelect === 1) {
        getItemType.forEach((item) => {
          item.checked = false;
        });
        item.checked = true;
        scrollMoveEvent();
        return;
      }

      // 옵션 그룹 내 최대 선택 수량 보다 크게 선택했을 경우
      if (
        getGroupInfo.maxLimitQty !== 0 &&
        checkedItemQuantityCount + 1 > getGroupInfo.maxLimitQty
      ) {
        if (getGroupInfo.minLimitQty === 0) {
          openAlert(
            `${t('그룹에서 n까지 선택해 주세요.', {
              group: translateLanguage(
                getGroupInfo.nameArray,
                getGroupInfo.name,
              ),
              max: getGroupInfo.maxLimitQty,
            })}`,
          );
        } else if (getGroupInfo.minLimitQty === getGroupInfo.maxLimitQty) {
          openAlert(
            `${t('그룹에서 n개 선택해 주세요.', {
              group: translateLanguage(
                getGroupInfo.nameArray,
                getGroupInfo.name,
              ),
              max: getGroupInfo.maxLimitQty,
            })}`,
          );
        } else {
          openAlert(
            `${t('그룹에서 n~m까지 선택해 주세요.', {
              group: translateLanguage(
                getGroupInfo.nameArray,
                getGroupInfo.name,
              ),
              min: getGroupInfo.minLimitQty,
              max: getGroupInfo.maxLimitQty,
            })}`,
          );
        }
        return;
      }

      // 옵션 그룹 내 최대 선택 종류 보다 많이 선택했을 경우
      if (
        getGroupInfo.maxLimitSelect !== 0 &&
        checkedItemKindCount >= getGroupInfo.maxLimitSelect
      ) {
        if (getGroupInfo.minLimitSelect === 0) {
          openAlert(
            `${t('그룹에서 옵션 종류를 n까지 선택해 주세요.', {
              group: translateLanguage(
                getGroupInfo.nameArray,
                getGroupInfo.name,
              ),
              max: getGroupInfo.maxLimitSelect,
            })}`,
          );
        } else if (
          getGroupInfo.minLimitSelect === getGroupInfo.maxLimitSelect
        ) {
          openAlert(
            `${t('그룹에서 옵션 종류를 n개 선택해 주세요.', {
              group: translateLanguage(
                getGroupInfo.nameArray,
                getGroupInfo.name,
              ),
              max: getGroupInfo.maxLimitSelect,
            })}`,
          );
        } else {
          openAlert(
            `${t('그룹에서 옵션 종류를 n~m까지 선택해 주세요.', {
              group: translateLanguage(
                getGroupInfo.nameArray,
                getGroupInfo.name,
              ),
              min: getGroupInfo.minLimitSelect,
              max: getGroupInfo.maxLimitSelect,
            })}`,
          );
        }
        return;
      }

      item.checked = !item.checked;
      scrollMoveEvent();
    }
  }
};

// 선택한 옵션 그룹 배열
const getFilteredTargetList = computed(() => {
  const isHaveSelectedItem = (items: cartProductType[]) =>
    items?.some((item) => item.code !== 'not_select' && item.checked);
  const result = getTargetOptionInfo.value?.filter((option) =>
    isHaveSelectedItem(option.items),
  );
  return result;
});

// 선택한 옵션 아이템 배열
const getFilteredTargetItemList = (optionItem: CartProductOptionGroupType) =>
  optionItem?.items as CartProductOptionType[];

// 옵션 아이템 삭제 버튼 클릭
const deleteOptionItem = (
  item: CartProductOptionType,
  group: CartProductOptionGroupType,
) => {
  item.checked = false;
  item.quantity = 1;

  const getItemsType = group.items as productOptionItemType[];

  // 선택 옵션시 아무 아이템도 미선택시 선택안함 선택
  if (group.require === 0 && !getItemsType.some((item) => item.checked)) {
    getItemsType[0].checked = true;
  }

  openAlert(
    `${t('상품을(를) 삭제했습니다.', { item: translateLanguage(item.nameArray, item.name) })}`,
  );
};

// 옵션 아이템 더하기 버튼 클릭
const clickOptionItemPlus = (
  e: Event,
  item: CartProductOptionType,
  group: CartProductOptionGroupType,
) => {
  e.stopPropagation();

  const checkedItemQuantityCount = group.items?.reduce(
    (acc, cur) => (cur.checked ? acc + cur.quantity : acc),
    0,
  ); // 선택한 아이템 총 수량

  // 옵션 그룹 내 최대 선택 수량 보다 크게 선택했을 경우
  if (
    group.maxLimitQty !== 0 &&
    checkedItemQuantityCount + 1 > group.maxLimitQty
  ) {
    if (group.minLimitQty === 0) {
      openAlert(
        `${t('그룹에서 n까지 선택해 주세요.', {
          group: translateLanguage(group.nameArray, group.name),
          max: group.maxLimitQty,
        })}`,
      );
    } else if (group.minLimitQty === group.maxLimitQty) {
      openAlert(
        `${t('그룹에서 n개 선택해 주세요.', {
          group: translateLanguage(group.nameArray, group.name),
          max: group.maxLimitQty,
        })}`,
      );
    } else {
      openAlert(
        `${t('그룹에서 n~m까지 선택해 주세요.', {
          group: translateLanguage(group.nameArray, group.name),
          min: group.minLimitQty,
          max: group.maxLimitQty,
        })}`,
      );
    }
    return;
  }

  // 옵션 아이템 최대 선택 수량보다 크게 선택했을 경우
  if (item.limitQty !== 0 && item.quantity >= item.limitQty) {
    openAlert(`${t('n개까지 선택 가능합니다.', { count: item.limitQty })}`);
    return;
  }

  item.quantity += 1;
};

// 옵션 아이템 빼기 버튼 클릭
const clickOptionItemMinus = (
  e: Event,
  item: productOptionItemType,
  group: CartProductOptionGroupType,
) => {
  e.stopPropagation();

  if (item.quantity <= 1) {
    deleteOptionItem(item, group);
    openAlert(
      `${t('상품을(를) 삭제했습니다.', { item: translateLanguage(item.nameArray, item.name) })}`,
    );
    return;
  }
  item.quantity -= 1;
};

// 상품 수량 추가
const clickProductCountPlus = () => {
  if (
    targetProductInfo.value.maxQuantity !== 0 &&
    targetProductInfo.value.quantity >= targetProductInfo.value.maxQuantity
  ) {
    openAlert(
      `${t('n개까지 선택 가능합니다.', { count: productInfo.maxQuantity })}`,
    );
    return;
  }
  targetProductInfo.value.quantity += 1;
};

// 상품 수량 감소
const clickProductCountMinus = () => {
  if (targetProductInfo.value.quantity < 2) {
    return;
  }
  if (
    productInfo.minQuantity !== 0 &&
    targetProductInfo.value.quantity <= productInfo.minQuantity
  ) {
    openAlert(
      `${t('n개 이상부터 주문 가능합니다.', { min: productInfo.minQuantity })}`,
    );
    return;
  }

  targetProductInfo.value.quantity -= 1;
};

// 옵션 가격을 포함한 총 금액
const getTotalPriceCount = () => {
  let optionTotalPrice = 0;
  const getGroupType = targetProductInfo.value.options;
  getGroupType?.forEach((group) => {
    const getItemType = group.items;
    getItemType.forEach((item) => {
      if (item.code !== 'not_select' && item.checked) {
        optionTotalPrice += item.price * item.quantity;
      }
    });
  });

  const totalCount =
    (productInfo.price + optionTotalPrice) * targetProductInfo.value.quantity;

  return checkStandardPriceUnit(totalCount.toLocaleString());
};

// 선택하지 않은 옵션 아이템 필터링 하는 로직
const filterOptionItemInfo = (options: cartProductType[]) => {
  const getTargetGroupType = JSON.parse(
    JSON.stringify(options),
  ) as CartProductOptionGroupType[];

  const filteredTargetItemList = getTargetGroupType?.map((group) => {
    const getTargetItemType = group.items as CartProductOptionType[];
    const filteredTargetItemType = getTargetItemType.filter(
      (item) => item.checked && item.code !== 'not_select',
    );

    group.items = filteredTargetItemType;

    return group;
  });

  return filteredTargetItemList;
};

// 장바구니 중복 상품 체크
const checkCartProducts = (): number => {
  if (cartProducts.value?.length === 0) return -1;
  const targetIndex = cartProducts.value?.findIndex((cartProduct) => {
    const cartProductToString = JSON.stringify(
      filterOptionItemInfo(cartProduct?.options),
    );
    const productToString = JSON.stringify(
      filterOptionItemInfo(targetProductInfo.value.options),
    );

    return (
      cartProduct.id === targetProductInfo.value.id &&
      cartProductToString === productToString
    );
  });

  return targetIndex;
};

// id 방어 코드
const getScrollGroupElementId = (groupName: string, groupIndex: number) => {
  const changedGroupName = removeSpecialCharacters(groupName);

  return groupName
    ? `optionGroup-${changedGroupName}-${groupIndex}`
    : `optionGroup-${groupIndex}`;
};

// 옵션 상품 최대, 최소 수량 벨리데이션 체크하는 로직
const checkOptionValidation = () => {
  const optionData = targetProductInfo.value.options;
  const checkValidation = optionData.findIndex((group, groupsIndex) => {
    // 선택하지 않은 옵션 그룹 위치로 스크롤 이동 시키는 로직
    const scrollMoveEvent = () => {
      const getActiveElement = document.querySelector(
        `#${getScrollGroupElementId(group.name, groupsIndex)}`,
      ) as HTMLElement;
      const getParentsElement = document.querySelector(
        '.basic-option-group-list-wrap',
      );
      if (getParentsElement && getActiveElement) {
        getParentsElement.scrollTo({
          top: getActiveElement.offsetTop - 100,
          behavior: 'smooth',
        });
      }
    };

    // 필수 옵션 여부
    const isRequireGroup = group.requireFlag === 1;

    // 필수 옵션일 경우
    if (isRequireGroup) {
      const isAnyCheckItem = group.items.some((item) => item.checked); // 선택한 아이템 존재 여부
      const checkedItemKindCount = group.items?.filter(
        (item) => item.checked,
      )?.length; // 선택한 아이템 종류 수량;
      const checkedItemQuantityCount = group.items?.reduce(
        (acc, cur) => (cur.checked ? acc + cur.quantity : acc),
        0,
      ); // 선택한 아이템 총 수량

      // 필수 옵션을 선택하지 않은 경우
      if (!isAnyCheckItem) {
        activeOptionGroupIndex.value = groupsIndex;
        scrollMoveEvent();
        openAlert(
          `${t('필수 옵션을 선택해 주세요.', { name: translateLanguage(group.nameArray, group.name) })}`,
        );
        return isRequireGroup && !isAnyCheckItem;
      }

      // 옵션 그룹 내 최소 선택 수량 보다 적게 선택했을 경우
      if (
        group.minLimitQty !== 0 &&
        group.minLimitQty > checkedItemQuantityCount
      ) {
        activeOptionGroupIndex.value = groupsIndex;

        if (group.maxLimitQty === 0) {
          openAlert(
            `${t('그룹에서 n개이상 선택해 주세요.', {
              group: translateLanguage(group.nameArray, group.name),
              count: group.minLimitQty,
            })}`,
          );
        } else if (group.minLimitQty === group.maxLimitQty) {
          openAlert(
            `${t('그룹에서 n개 선택해 주세요.', {
              group: translateLanguage(group.nameArray, group.name),
              max: group.minLimitQty,
            })}`,
          );
        } else {
          openAlert(
            `${t('그룹에서 n~m까지 선택해 주세요.', {
              group: translateLanguage(group.nameArray, group.name),
              min: group.minLimitQty,
              max: group.maxLimitQty,
            })}`,
          );
        }
        scrollMoveEvent();
        return (
          group.minLimitQty !== 0 &&
          group.minLimitQty > checkedItemQuantityCount
        );
      }

      // 옵션 그룹 내 최대 선택 수량 보다 크게 선택했을 경우
      if (
        group.maxLimitQty !== 0 &&
        checkedItemQuantityCount > group.maxLimitQty
      ) {
        activeOptionGroupIndex.value = groupsIndex;

        if (group.minLimitQty === 0) {
          openAlert(
            `${t('그룹에서 n까지 선택해 주세요.', {
              group: translateLanguage(group.nameArray, group.name),
              max: group.maxLimitQty,
            })}`,
          );
        } else if (group.minLimitQty === group.maxLimitQty) {
          openAlert(
            `${t('그룹에서 n개 선택해 주세요.', {
              group: translateLanguage(group.nameArray, group.name),
              max: group.maxLimitQty,
            })}`,
          );
        } else {
          openAlert(
            `${t('그룹에서 n~m까지 선택해 주세요.', {
              group: translateLanguage(group.nameArray, group.name),
              min: group.minLimitQty,
              max: group.maxLimitQty,
            })}`,
          );
        }
        scrollMoveEvent();
        return (
          group.minLimitQty !== 0 &&
          checkedItemQuantityCount > group.maxLimitQty
        );
      }

      // 옵션 그룹 내 최소 선택 종류 보다 적게 선택했을 경우
      if (
        group.minLimitSelect !== 0 &&
        group.minLimitSelect > checkedItemKindCount
      ) {
        activeOptionGroupIndex.value = groupsIndex;

        if (group.maxLimitSelect === 0) {
          openAlert(
            `${t('그룹에서 옵션 종류를 n개이상 선택해 주세요.', {
              group: translateLanguage(group.nameArray, group.name),
              count: group.minLimitSelect,
            })}`,
          );
        } else if (group.minLimitSelect === group.maxLimitSelect) {
          openAlert(
            `${t('그룹에서 옵션 종류를 n개 선택해 주세요.', {
              group: translateLanguage(group.nameArray, group.name),
              max: group.maxLimitQty,
            })}`,
          );
        } else {
          openAlert(
            `${t('그룹에서 옵션 종류를 n~m까지 선택해 주세요.', {
              group: translateLanguage(group.nameArray, group.name),
              min: group.minLimitSelect,
              max: group.maxLimitSelect,
            })}`,
          );
        }
        scrollMoveEvent();
        return (
          group.minLimitSelect !== 0 &&
          group.minLimitSelect > checkedItemKindCount
        );
      }

      // 옵션 그룹 내 최대 선택 종류 보다 많이 선택했을 경우
      if (
        group.maxLimitSelect !== 0 &&
        checkedItemKindCount > group.maxLimitSelect
      ) {
        activeOptionGroupIndex.value = groupsIndex;

        if (group.minLimitSelect === 0) {
          openAlert(
            `${t('그룹에서 옵션 종류를 n까지 선택해 주세요.', {
              group: translateLanguage(group.nameArray, group.name),
              max: group.maxLimitSelect,
            })}`,
          );
        } else if (group.minLimitSelect === group.maxLimitSelect) {
          openAlert(
            `${t('그룹에서 옵션 종류를 n개 선택해 주세요.', {
              group: translateLanguage(group.nameArray, group.name),
              max: group.maxLimitSelect,
            })}`,
          );
        } else {
          openAlert(
            `${t('그룹에서 옵션 종류를 n~m까지 선택해 주세요.', {
              group: translateLanguage(group.nameArray, group.name),
              min: group.minLimitSelect,
              max: group.maxLimitSelect,
            })}`,
          );
        }
        scrollMoveEvent();
        return (
          group.maxLimitSelect !== 0 &&
          checkedItemKindCount > group.maxLimitSelect
        );
      }
    } else {
      // 선택 옵션이면서 최소 갯수가 설정되어 있을 경우 알럿 노출 (선택 안함일 경우에는 미노출)
      const isSelectedItem = group.items[0].checked !== true;

      if (isSelectedItem) {
        const checkedItemQuantityCount = group.items?.reduce(
          (acc, cur) => (cur.checked ? acc + cur.quantity : acc),
          0,
        ); // 선택한 아이템 총 수량
        activeOptionGroupIndex.value = groupsIndex;

        if (group.minLimitQty > checkedItemQuantityCount) {
          openAlert(
            `${t('그룹에서 n개이상 선택해 주세요.', {
              group: translateLanguage(group.nameArray, group.name),
              count: group.minLimitQty,
            })}`,
          );
        }

        scrollMoveEvent();
        return (
          group.minLimitQty !== 0 &&
          group.minLimitQty > checkedItemQuantityCount
        );
      }
    }

    return false;
  });

  if (checkValidation === -1) return false;

  return true;
};

// 상세 설명 번역 관련 로직 (번역 정보가 JSON 경로로 넘어와 axios 요청이 필요함)
const description = ref<string>('');
const getProductDescription = () => {
  requestDescription(targetProductInfo).then((res: string) => {
    description.value = res;
  });

  return description.value;
};

// 옵션 아이템 선택 제한 텍스트를 반환하는 로직
const getCountLimitText = (optionGroup: CartProductOptionGroupType) => {
  const minSelectQuantity = optionGroup?.minLimitQty;
  const maxSelectQuantity = optionGroup?.maxLimitQty;

  if (maxSelectQuantity === 0 && minSelectQuantity > 1) {
    return t('최소 n개 선택 가능', { min: minSelectQuantity });
  }
  if (maxSelectQuantity !== 0 && maxSelectQuantity === minSelectQuantity) {
    return t('n개 선택 가능', { count: maxSelectQuantity });
  }
  if (minSelectQuantity > 0 && maxSelectQuantity > 0) {
    return t('n ~ m개 선택 가능', {
      min: minSelectQuantity,
      max: maxSelectQuantity,
    });
  }

  return '';
};

// 옵션 아이템을 최소 수량 이상보다 선택했는지(선택완료) 확인하는 로직
const isCompleteSelect = (optionGroup: CartProductOptionGroupType) => {
  const minimumSelectCount = optionGroup?.minLimitQty;
  const selectedItemList = optionGroup?.items as productOptionItemType[];

  const selectedTotalCount = selectedItemList.reduce((sum, item) => {
    if (item.code !== 'not_select' && item.checked) {
      return sum + item.quantity;
    }

    return sum;
  }, 0);

  // 필수일 경우
  if (optionGroup.require === 1)
    return selectedTotalCount >= minimumSelectCount;

  // 선택일 경우
  return selectedTotalCount > 0;
};

// 상품 상세설명 기능 사용 여부
const isUseDescription = computed(
  () => targetProductInfo.value?.description?.length > 0,
);

// 화이트 테마 여부
const isWhiteTheme = () => {
  if (getOptionLayout.value?.color == 'white') return 'white-theme';

  return 'black-theme';
};

// 블랙, 화이트 테마별 화살표 이미지 가져오는 로직
const getArrowIcon = () => {
  if (getOptionLayout.value?.color == 'white')
    return 'https://static.torder.co.kr/torder2/icn_arrow_black.svg';

  return 'https://static.torder.co.kr/torder2/icn_arrow_white.svg';
};

// 블랙, 화이트 테마별 버튼 색상 가져오는 로직
const getCountButtonColor = () => {
  if (getOptionLayout.value?.color == 'white') return '#5B5B5B';

  return '#0A0A0A';
};

// 옵션 아이템 구분선 마지막 여부 판단
const getDividerCount = (items: CartProductOptionType[], index: number) => {
  const range = items.slice(index + 1, items.length);
  return range.some((item) => item.checked);
};

// 벨리데이션 검증 후 장바구니 담기 로직
const clickAddCartProduct = () => {
  // 장바구니에 존재하는 상품 여부 확인
  const checkIndex = checkCartProducts();

  // 벨리데이션 검증
  const checkRequire = checkOptionValidation();
  if (checkRequire) return;

  // 이미 존재하는 상품일 경우
  if (checkIndex !== -1) {
    if (
      targetProductInfo.value.maxQuantity !== 0 &&
      cartProducts.value[checkIndex].quantity >=
        targetProductInfo.value.maxQuantity
    ) {
      openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    } else {
      const translatedName = translateLanguage(
        targetProductInfo.value.productLanguage,
        targetProductInfo.value.name,
      );
      // 수량 추가 확인창
      openConfirmModal(BASIC_CONFIRM, translatedName, t('장바구니 담기'));
      setAdditionalProductIndex(checkIndex);
    }

    return;
  }

  // 옵션을 추가하는 경우
  addCartProduct(targetProductInfo.value);
  openModal(CART);
  openAlert(
    `${translateLanguage(targetProductInfo.value.productLanguage, targetProductInfo.value.name)}\n${t('상품을 추가하였습니다.')}`,
  );
  pushPage(home);
};

// 상품 총 가격 (가격 x 수량)
const getOptionItemPrice = (selectItem: productOptionItemType) =>
  checkStandardPriceUnit(
    (selectItem.price * selectItem.quantity)?.toLocaleString(),
  );

// v-for 방어 코드
const getOptionGroupKey = (group: CartProductOptionGroupType, index: number) =>
  group ? `${group.name}-${index}` : `option-group-${index}`;
const getOptionItemKey = (item: productOptionItemType, index: number) =>
  item ? `${item.name}-${index}` : `option-item-${index}`;
</script>

<style lang="scss" scoped>
.basic-option-layout-hub-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 30;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
