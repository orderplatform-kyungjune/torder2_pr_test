<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ref, Ref, onMounted, computed, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { pushPage } from '@utils/route.helper';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { removeNewLine, removeSpecialCharacters } from '@torder/common/utils';
import {
  productOptionType,
  productOptionItemType,
} from '@torder/common/interface/product';
import {
  cartProductType,
  CartProductOptionGroupType,
  CartProductOptionType,
} from '@torder/common/interface/cartProduct';
import { CART, CUSTOM_CONFIRM } from '@torder/common/constant/string';
import { getSubPrimaryColor } from '@torder/common';
import useProductStore from '@store/storeProduct';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import { home } from '@router/routePaths';
import useOrderDepthOptions from '@composables/OrderOptions/useOrderOptions';
import CheckBox from '@assets/btn_option_checkbox.vue';
import Trash from '@assets/btn_darkgray_trash.vue';
import GrayPlus from '@assets/btn_darkgray_plus.vue';
import GrayMinus from '@assets/btn_darkgray_minus.vue';
import UnCheckedBox from '@assets/btn_checkbox_uncheck.vue';
import UnCheckedLightBox from '@assets/btn_checkbox_uncheck_light.vue';
import CustomDepthOptionSheet from './components/CustomDepthOptionSheet.vue';
import { isEqual } from 'lodash';

const { t } = useI18n();
const { isDarkMode } = useInitStore();
const { getDarkModeClass } = useInitStore();
const { openAlert, openModal, openConfirmModal, setAdditionalProductIndex } =
  useModalStore();
const { productInfo } = useProductStore();
const { addCartProduct, replaceCartProduct } = useCartStore();
const { cartProducts } = storeToRefs(useCartStore());
const {
  mainCategoryActiveFontColor,
  mainCategoryFontColor,
  categoryBackgroundColor,
  buttonBackgroundColor,
  buttonFontColor,
  categoryBackgroundImage,
} = storeToRefs(useInitStore());
const route = useRoute();
const { changedOption, targetIndex } = route.params;
const moreDetailFlag = ref(false);
const {
  optionItemCart,
  depthOptionInfo,
  isOpenOptionSheet,
  toggleOptionSheet,
  onClickCloseButton,
  onClickConfirmButton,
  setDepthOrderOptionFlags,
  plusCartOptionItem,
  minusCartOptionItem,
  removeCartOptionItem,
  onClickEditCartOption,
  calculateOptionTotalPrice,
  separateItemsByParentName,
  updateOrAddFirstDepthItem,
} = useOrderDepthOptions();

const getActiveButtonColor = (color: string) =>
  getSubPrimaryColor(color, 10, 'Y');

// 선택한 옵션 그룹 index
const activeOptionGroupIndex = ref(0);

// 옵션 그룹 리스트 데이터
const targetProductInfo: Ref<cartProductType> = ref({} as cartProductType);
const getTargetOptionInfo = computed(() => targetProductInfo.value.options);

// 선택된 옵션 그룹 정보
const getActiveOptionItemList = computed(
  () => targetProductInfo.value?.options?.[activeOptionGroupIndex.value],
);

const isGroupSelectedItem = (groups: cartProductType[]) =>
  groups.some((group) =>
    group.items.some((item) => item.code !== 'not_select' && item.checked),
  );
const isOptionSelectedItem = (options: cartProductType) =>
  options.items?.some((item) => item.code !== 'not_select' && item.checked);

const optionCartItems = computed(() => {
  const targetOptionInfoCopy = targetProductInfo?.value.options;

  if (targetOptionInfoCopy && optionItemCart.value.length > 0) {
    const updatedOptions = targetOptionInfoCopy.map((option) => {
      const matchingCartItems = optionItemCart.value.filter(
        (cartItem) => cartItem.parentName === option.name,
      );
      if (matchingCartItems.length > 0) {
        return {
          ...option,
          items: [...matchingCartItems, ...option.items],
        };
      }
      return option;
    });

    return updatedOptions;
  }

  return targetOptionInfoCopy;
});

const getTargetItemsInfo = computed(() => {
  const groupData = targetProductInfo?.value.options;
  const itemData = groupData?.[activeOptionGroupIndex.value];
  return itemData?.items;
});

// 옵션 그룹 선택
const setActiveOptionIndex = (index: number) => {
  document
    .querySelector('.text-option-detail-item-container')
    ?.scrollTo({ top: 0 });
  activeOptionGroupIndex.value = index;
};

// id 방어 코드 (특수문자 이스케이프 처리 - id 지정 부분)
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

let depthOptionGroup: cartProductType;

const onConfirmSheet = () => {
  const result = onClickConfirmButton(depthOptionInfo.value, depthOptionGroup);
  if (result) {
    const getGroupType = targetProductInfo.value.options;
    const getGroupInfo = getGroupType?.[activeOptionGroupIndex.value];
    const getItemType = getGroupType?.[activeOptionGroupIndex.value]?.items;
    if (getGroupType?.[activeOptionGroupIndex.value].require === 0) {
      getItemType[0].checked = false;
    }
  }
};

const onCloseSheet = () => {
  onClickCloseButton();
};

// 옵션 아이템 선택
const clickOptionItem = async (
  group: cartProductType,
  item: cartProductType,
  itemIndex: number,
) => {
  const isDepthOptionItem = item.items?.length > 0;
  const isPresetGroup = group.isPreSet;
  depthOptionGroup = group;

  // 선택한 옵션 아이템 리스트로 포커싱 되도록 위치 찾아서 스크롤 시키는 로직
  const setScrollMove = () => {
    const targetElement = document.querySelector(
      `#${getScrollElementId(group.name, item.code, itemIndex)}`,
    ) as HTMLElement;
    const parentElement = document.querySelector('.text-option-bill');
    parentElement?.scrollTo({
      top: targetElement?.offsetTop - 45,
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

  const getGroupType = optionCartItems.value;
  const getGroupInfo = getGroupType?.[activeOptionGroupIndex.value];
  const getItemType = getGroupType?.[activeOptionGroupIndex.value]?.items;

  // 선택한 아이템 종류 갯수
  const checkedItemKindCount = getItemType?.filter(
    (item) => item.code !== 'not_select' && item.checked,
  )?.length;

  // 선택한 아이템 총 수량
  const checkedItemQuantityCount = getItemType?.reduce(
    (acc, cur) =>
      cur.checked && cur.code !== 'not_select' ? acc + cur.quantity : acc,
    0,
  );

  const isMaxGroupQuantity =
    getGroupInfo.maxLimitQty !== 0 &&
    getGroupInfo.maxLimitQty <= checkedItemQuantityCount;

  if (isDepthOptionItem) {
    // 선택한 n차 옵션 장바구니 총 수량
    const checkedDepthItemQuantityCount = getItemType?.reduce(
      (acc, cur) =>
        cur.checked && cur.code !== 'not_select' && cur.name === item.name
          ? acc + cur.quantity
          : acc,
      0,
    );

    const itemLimitReached =
      item.limitQty !== 0 && item.limitQty <= checkedDepthItemQuantityCount;

    //2차 그룹 옵션 수량 제한
    if (isMaxGroupQuantity) {
      if (getGroupInfo.maxLimitQty) {
        openAlert(
          `${t('그룹에서 n개 선택해 주세요.', { group: getGroupInfo.name, max: getGroupInfo.maxLimitQty })}`,
        );
      } else {
        openAlert(
          `${t('그룹에서 n~m까지 선택해 주세요.', { group: getGroupInfo.name, min: getGroupInfo.minLimitQty, max: getGroupInfo.maxLimitQty })}`,
        );
      }
      return;
    }

    //3차 옵션 수량 제한
    if (itemLimitReached) {
      openAlert(`${t('n개까지 선택 가능합니다.', { count: item.limitQty })}`);
      return;
    }

    depthOptionInfo.value = setDepthOrderOptionFlags([item]);
    toggleOptionSheet();
    return;
  }

  // 선택 안함 체크 함수
  const updateNotSelectItems = (shouldCheck: boolean): void => {
    group.items.forEach((item) => {
      if (item.code === 'not_select') {
        item.checked = shouldCheck;
      }
    });
  };

  // 장바구니에 선택한 아이템이 있는지 확인 함수
  const isHaveCartItem = () => getItemType.some((item) => item.checked);
  const checkNotSelect = () => updateNotSelectItems(true);
  const unCheckNotSelect = () => updateNotSelectItems(false);
  const isNotSelect = item.code === 'not_select';

  // 선택 옵션일 경우
  if (group.require === 0) {
    // 이미 선택한 상품일 경우
    if (item.checked) {
      item.checked = false;
      item.quantity = 1;

      if (!isHaveCartItem()) {
        checkNotSelect();
      }
      if (!isNotSelect) {
        openAlert(
          `${t('상품을(를) 삭제했습니다.', { item: translateLanguage(item.nameArray, item.name) })}`,
        );
      }
    } else {
      // 선택 안함 클릭시 모든 아이템 선택 해제
      if (isNotSelect) {
        const filteredItem = getItemType.filter(
          (item) => item.code !== 'not_select' && item.checked,
        );
        const filteredCartItems: productOptionItemType[] = [];

        optionItemCart.value = optionItemCart.value.filter((cartItem) => {
          const isDifferentGroup = cartItem.parentName !== group.name;
          if (!isDifferentGroup) {
            filteredCartItems.push(cartItem as any);
          }
          return isDifferentGroup;
        });

        const typicalItem = filteredItem[0];
        const totalCountItem = filteredItem.length;

        getItemType.forEach((item: cartProductType) => {
          if (item.code === 'not_select') {
            item.checked = true;
          } else {
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
      if (!isHaveCartItem()) {
        checkNotSelect();
      }

      // 옵션 그룹 내 최대 선택 수량, 종류가 1일 경우
      if (
        (getGroupInfo.maxLimitQty === 1 || getGroupInfo.maxLimitSelect === 1) &&
        !isPresetGroup
      ) {
        getItemType.forEach((item) => {
          if (item.parentName && item.checked) item.quantity = 0;
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
      unCheckNotSelect();
      scrollMoveEvent();
    }
  }

  // 필수 옵션일 경우
  if (group.require === 1) {
    // 이미 선택한 상품일 경우
    if (item.checked) {
      item.checked = !item.checked;
      item.quantity = 1;
      openAlert(
        `${t('상품을(를) 삭제했습니다.', { item: translateLanguage(item.nameArray, item.name) })}`,
      );
    } else {
      // 옵션 그룹 내 최대 선택 수량, 종류가 1일 경우
      if (
        (getGroupInfo.maxLimitQty === 1 || getGroupInfo.maxLimitSelect === 1) &&
        !isPresetGroup
      ) {
        getItemType.forEach((item) => {
          if (item.parentName && item.checked) item.quantity = 0;
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

// 옵션 아이템 구분선 마지막 여부 판단
const getDividerCount = (items: CartProductOptionType[], index: number) => {
  const range = items.slice(index + 1, items.length);
  return range.some((item) => item.checked);
};

// 옵션 아이템 삭제 버튼 클릭
const deleteOptionItem = (item: cartProductType, group: cartProductType) => {
  if (item.items.length > 0) {
    removeCartOptionItem(item);
  }
  item.checked = false;
  item.quantity = 1;

  const getItemsType = group.items;
  const isCartItems = optionItemCart.value.filter(
    (option) => option.parentName === group.name,
  );

  // 선택 옵션시 아무 아이템도 미선택시 선택안함 선택
  const isEmptyCart =
    !getItemsType.some((item) => item.checked) && isCartItems.length === 0;

  if (group.require === 0 && isEmptyCart) {
    getItemsType.forEach((item) => {
      if (item.code === 'not_select') {
        item.checked = true;
      }
    });
  }
  openAlert(
    `${t('상품을(를) 삭제했습니다.', { item: translateLanguage(item.nameArray, item.name) })}`,
  );
};

// 옵션 아이템 빼기 버튼 클릭
const clickOptionItemMinus = (
  item: cartProductType,
  group: cartProductType,
) => {
  // 프리셋 상품의 경우 삭제 불가
  if (item.quantity <= 1 && item.isPreSet) {
    return;
  }

  if (item.items.length > 0) {
    minusCartOptionItem(item);
    return;
  }
  if (item.quantity <= 1) {
    deleteOptionItem(item, group);
    openAlert(
      `${t('상품을(를) 삭제했습니다.', { item: translateLanguage(item.nameArray, item.name) })}`,
    );
    return;
  }

  item.quantity -= 1;
};

// 옵션 아이템 더하기 버튼 클릭
const clickOptionItemPlus = (
  item: cartProductType,
  group: cartProductType,
  groupIndex: number,
) => {
  const getItemType = optionCartItems.value?.[groupIndex]?.items;

  // 선택한 아이템 총 수량
  const checkedItemQuantityCount = getItemType?.reduce(
    (acc, cur) =>
      cur.checked && cur.code !== 'not_select' ? acc + cur.quantity : acc,
    0,
  );

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

  if (item.items.length > 0) {
    plusCartOptionItem(item, group);
    return;
  }

  item.quantity += 1;
};

const getGroupItemRange = computed(() => {
  const targetOptionGroup =
    targetProductInfo.value?.options?.[activeOptionGroupIndex.value];
  const maxSelectQuantity = targetOptionGroup?.maxLimitQty;
  const minSelectQuantity = targetOptionGroup?.minLimitQty;

  if (maxSelectQuantity === 0 && minSelectQuantity > 1) {
    return t('최소 n개 선택 가능', { min: minSelectQuantity });
  }
  if (maxSelectQuantity !== 0 && maxSelectQuantity === minSelectQuantity) {
    return `${t('n개 선택 가능', { count: maxSelectQuantity })}`;
  }
  if (minSelectQuantity > 0 && maxSelectQuantity > 0) {
    return `${t('n ~ m개 선택 가능', {
      min: minSelectQuantity,
      max: maxSelectQuantity,
    })}`;
  }

  return '';
});

// id 방어 코드
const getScrollGroupElementId = (groupName: string, groupIndex: number) => {
  const changedGroupName = removeSpecialCharacters(groupName);

  return groupName
    ? `optionGroup-${changedGroupName}-${groupIndex}`
    : `optionGroup-${groupIndex}`;
};

// 옵션 상품 벨리데이션 체크
const checkOptionValidation = () => {
  // const optionData = targetProductInfo.value.options as CartProductOptionGroupType[];
  const optionData = optionCartItems.value;

  const checkValidation = optionData.findIndex((group, groupsIndex) => {
    // 선택하지 않은 옵션 그룹 위치로 스크롤 이동 시키는 로직
    const scrollMoveEvent = () => {
      const getActiveElement = document.querySelector(
        `#${getScrollGroupElementId(group.name, groupsIndex)}`,
      ) as HTMLElement;
      const getParentsElement = document.querySelector(
        '.text-option-group-list',
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
const duplicateCartItemIndex = (addCartItems: cartProductType): number => {
  if (cartProducts.value?.length === 0) return -1;

  const targetIndex = cartProducts.value?.findIndex((cartProduct) => {
    const duplicate = isEqual(cartProduct.options, addCartItems.options);
    return cartProduct.id === targetProductInfo.value.id && duplicate;
  });

  return targetIndex;
};

const clickAddCartProduct = () => {
  const addCartItems = {
    ...targetProductInfo.value,
    options: optionCartItems.value as cartProductType[],
    isDepthMenu: optionItemCart.value.length > 0,
  };

  // 장바구니에 존재하는 상품 여부 확인
  const duplicateIndex = duplicateCartItemIndex(addCartItems);

  // 벨리데이션 검증
  const checkRequire = checkOptionValidation();
  if (checkRequire) return;

  // 이미 존재하는 상품일 경우
  if (!changedOption && duplicateIndex !== -1) {
    if (
      targetProductInfo.value.maxQuantity !== 0 &&
      cartProducts.value[duplicateIndex].quantity >=
        targetProductInfo.value.maxQuantity
    ) {
      openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    } else {
      const translatedName = translateLanguage(
        targetProductInfo.value.productLanguage,
        targetProductInfo.value.name,
      );
      // 수량 추가 확인창
      openConfirmModal(CUSTOM_CONFIRM, translatedName, t('장바구니 담기'));
      setAdditionalProductIndex(duplicateIndex);
    }

    return;
  }

  // 옵션을 변경하는 경우
  if (changedOption === '1') {
    replaceCartProduct(addCartItems, Number(targetIndex));
    openAlert(
      `${t('상품의 옵션이 변경되었습니다.', { item: translateLanguage(targetProductInfo.value.productLanguage, targetProductInfo.value.name) })}`,
    );
    openModal(CART);
    pushPage(home);
    return;
  }

  // 옵션을 추가하는 경우
  addCartProduct(addCartItems);
  openModal(CART);
  openAlert(
    `${translateLanguage(targetProductInfo.value.productLanguage, targetProductInfo.value.name)}\n${t('상품을 추가하였습니다.')}`,
  );
  pushPage(home);
};

// 스크롤을 감지해서 마지막 대분류가 노출되었을때 더보기 UI가 사라지도록 하는 로직
// 참고: IntersectionObserver(https://heropy.blog/2019/10/27/intersection-observer/)
const setIntersectionObserver = () => {
  // 열린 대분류가 없을 경우 미노출
  if (getTargetOptionInfo.value?.length === 0) {
    moreDetailFlag.value = false;
    return;
  }

  if (!getTargetOptionInfo.value) return;

  const lastIndex = getTargetOptionInfo.value?.length - 1;

  const getLastIndexId = () =>
    getScrollGroupElementId(
      getTargetOptionInfo.value[lastIndex].name,
      lastIndex,
    );
  const targetElement = document.querySelector(
    `#${getLastIndexId()}`,
  ) as HTMLElement;

  const options = {
    root: document.querySelector('.text-option-group-list'),
    rootMargin: '0px',
    threshold: 0.8,
  };

  const observers = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      moreDetailFlag.value = false;
    } else {
      moreDetailFlag.value = true;
    }
  }, options);

  if (targetElement) {
    observers.disconnect();
    observers.observe(targetElement);
  }
};

const vObserver = {
  mounted() {
    setIntersectionObserver();
  },
  updated() {
    setIntersectionObserver();
  },
};

// v-for 방어 코드
const getOptionGroupKey = (groupInfo: cartProductType, index: number) =>
  groupInfo ? `group-${groupInfo.name}` : `group-${index}`;
const getOptionItemKey = (itemInfo: cartProductType, index: number) =>
  itemInfo ? `item-${itemInfo.code}` : `item-${index}`;

const getItemPrice = (item: cartProductType) => {
  const ItemPrice = item.price;
  const OptionPrice = calculateOptionTotalPrice(item.items);

  return ItemPrice + OptionPrice;
};

// 상품 가격 계산
const getPriceTotalItem = (item: cartProductType) => {
  const ItemPrice = item.price;
  const OptionPrice = calculateOptionTotalPrice(item.items);

  return item.quantity * (ItemPrice + OptionPrice);
};

// 장바구니 총 가격 계산
const getTotalPriceCount = () => {
  let sum = 0;
  if (optionCartItems.value) {
    optionCartItems.value.forEach((options) => {
      options.items.forEach((item) => {
        if (item.checked && item.code !== 'not_select')
          sum += getPriceTotalItem(item as cartProductType);
      });
    });
  }

  return `${t('n원 담기', { price: checkStandardPriceUnit(sum.toLocaleString()) })}`;
};

// 기본 구성 설정 시 로직
const processOptions = (options: cartProductType[]) => {
  const processGroup = (group: cartProductType, depth: number = 0) => {
    const processItems = (items: cartProductType[], currentDepth: number) => {
      items.forEach((item: cartProductType) => {
        if (!Object.prototype.hasOwnProperty.call(item, 'quantity')) {
          Object.assign(item, { quantity: 1 });
        }
        if (
          (currentDepth >= 1 || item.items.length === 0) &&
          !Object.prototype.hasOwnProperty.call(item, 'checked')
        ) {
          Object.assign(item, { checked: item.isPreSet });
        }
        if (group.isPreSet && item.isPreSet && item.items.length > 0) {
          // 기본 설정이면서 n차 그룹의 아이템경우
          const depthOptionItem = updateOrAddFirstDepthItem(
            optionItemCart.value,
            item,
            group,
          ) as cartProductType[];

          optionItemCart.value.push(...depthOptionItem);
        }

        // 재귀적으로 하위 items 처리
        if (item.items && Array.isArray(item.items)) {
          processGroup(
            {
              items: item.items,
              require: item.require,
            } as unknown as cartProductType,
            currentDepth + 1,
          );
        }
      });

      // 현재 그룹에 '선택안함' 옵션 추가
      if (
        group.require === 0 &&
        !items.find((item) => item.name === '선택안함')
      ) {
        items.unshift({
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
          checked: true,
          isOptionProduct: false,
          require: 0,
          items: [],
          options: [],
          productCode: '',
          id: '',
          minQuantity: 0,
          maxQuantity: 0,
          products: [],
          description: '',
          countryOfOrigin: '',
          allergy: [],
          allergyUse: '',
          requireFlag: 0,
          minLimitSelect: 0,
          maxLimitSelect: 0,
          minLimitQty: 0,
          maxLimitQty: 0,
          isType: '',
          isGroupSelected: false,
        } as unknown as cartProductType);
      }
    };

    processItems(group.items, depth);
  };

  options.forEach(processGroup);
};

// 옵션 아이템 선택,미선택 키값, 선택안함 추가를 위한 로직
onMounted(() => {
  let targetProduct = JSON.parse(JSON.stringify(productInfo));
  const isChangedOption = changedOption === '1';

  if (targetProduct.options) {
    processOptions(targetProduct.options);
  }

  if (isChangedOption) {
    const cartTargetItems = cartProducts.value[Number(targetIndex)];
    const { withParentName, withoutParentName } =
      separateItemsByParentName(cartTargetItems);

    optionItemCart.value = withParentName;
    targetProduct = withoutParentName;
  }

  targetProductInfo.value = targetProduct;
});
</script>

<template>
  <div class="text-option-container">
    <div class="text-option-body">
      <div
        class="text-option-list"
        :style="{ 'background-image': `url(${categoryBackgroundImage})` }"
      >
        <div class="text-option-title">
          {{ t('옵션 선택') }}
        </div>
        <div
          v-observer
          class="text-option-group-list"
        >
          <div
            v-for="(optionGroup, groupIndex) in getTargetOptionInfo"
            :id="getScrollGroupElementId(optionGroup.name, groupIndex)"
            :key="getOptionGroupKey(optionGroup, groupIndex)"
          >
            <div
              v-if="activeOptionGroupIndex === groupIndex"
              class="text-option-group-active"
            >
              <div class="text-option-group-active-radius-box">
                <div
                  class="text-option-group-active-radius-top"
                  :class="getDarkModeClass()"
                ></div>
              </div>
              <div
                class="text-option-group-active-container"
                :class="getDarkModeClass()"
              >
                <div
                  v-if="optionGroup.require === 1"
                  class="text-option-group-active-essential"
                  :class="getDarkModeClass()"
                >
                  {{ t('필수') }}
                </div>
                <div class="text-option-group-active-name ellipsis-text-3">
                  {{
                    removeNewLine(
                      translateLanguage(
                        optionGroup.nameArray,
                        optionGroup.name,
                      ),
                    )
                  }}
                </div>
              </div>
              <div class="text-option-group-active-radius-box">
                <div
                  class="text-option-group-active-radius-bottom"
                  :class="getDarkModeClass()"
                ></div>
              </div>
            </div>
            <div
              v-else
              class="text-option-group-box"
              @click="setActiveOptionIndex(groupIndex)"
            >
              <div
                v-if="optionGroup.require === 1"
                class="text-option-group-box-essential"
              >
                {{ t('필수') }}
              </div>
              <p class="text-option-group-name ellipsis-text-2">
                {{
                  removeNewLine(
                    translateLanguage(optionGroup.nameArray, optionGroup.name),
                  )
                }}
              </p>
            </div>
          </div>
        </div>
        <div
          v-if="moreDetailFlag"
          class="more-detail-box"
        >
          <span class="more-detail-box-text">
            {{ t('더보기') }}
          </span>
        </div>
      </div>
      <div
        class="text-option-detail"
        :class="getDarkModeClass()"
      >
        <div class="text-option-detail-title">
          <div
            class="text-option-detail-name"
            :class="getDarkModeClass()"
          >
            {{
              removeNewLine(
                translateLanguage(
                  targetProductInfo.options?.[activeOptionGroupIndex]
                    ?.nameArray,
                  targetProductInfo.options?.[activeOptionGroupIndex]?.name,
                ),
              )
            }}
          </div>
          <div class="text-option-detail-limit">
            {{ getGroupItemRange }}
          </div>
        </div>
        <div class="text-option-detail-item-container">
          <div
            v-for="(optionItem, itemIndex) in getTargetItemsInfo"
            :key="getOptionItemKey(optionItem, itemIndex)"
            @click="
              clickOptionItem(getActiveOptionItemList, optionItem, itemIndex)
            "
            :class="{ 'display-none': optionItem.isPreSet }"
          >
            <div
              v-if="optionItem.isSale !== 0"
              class="text-option-detail-item-wrap"
              :class="[{ active: optionItem.checked }, getDarkModeClass()]"
            >
              <div class="text-option-detail-item">
                <div class="text-option-detail-item-info">
                  <div v-if="optionItem.items?.length === 0">
                    <CheckBox
                      v-if="optionItem.checked"
                      class="text-option-detail-item-checkbox"
                      :fill="categoryBackgroundColor"
                    />
                    <div v-else>
                      <UnCheckedLightBox v-if="isDarkMode" />
                      <UnCheckedBox v-else />
                    </div>
                  </div>
                  <div
                    class="text-option-detail-item-title"
                    :class="getDarkModeClass()"
                  >
                    {{
                      removeNewLine(
                        translateLanguage(
                          optionItem.nameArray,
                          optionItem.name,
                        ),
                      )
                    }}
                  </div>
                </div>
                <div
                  v-if="optionItem.code !== 'not_select'"
                  class="text-option-detail-item-price"
                  :class="getDarkModeClass()"
                >
                  <div class="item-price-wrapper">
                    <span>
                      +{{
                        checkStandardPriceUnit(
                          optionItem.price?.toLocaleString(),
                        )
                      }}
                    </span>
                    <svg
                      v-if="optionItem.items.length > 0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.75137 3.95303C9.22 3.48441 9.9798 3.48441 10.4484 3.95303L17.6484 11.153C18.1171 11.6217 18.1171 12.3815 17.6484 12.8501L10.4484 20.0501C9.9798 20.5187 9.22 20.5187 8.75137 20.0501C8.28275 19.5815 8.28275 18.8217 8.75137 18.353L15.1028 12.0016L8.75137 5.65009C8.28275 5.18146 8.28275 4.42166 8.75137 3.95303Z"
                        :fill="isDarkMode ? '#EBEBEB' : '#313131'"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div
                v-if="
                  optionItem.checked &&
                  optionItem.code !== 'not_select' &&
                  optionItem.limitQty !== 1
                "
                class="text-option-detail-item-count"
              >
                <div class="text-option-detail-item-count-box">
                  <GrayMinus
                    class="text-option-detail-item-count-box-button"
                    @click.stop="
                      () =>
                        clickOptionItemMinus(
                          optionItem,
                          targetProductInfo.options?.[activeOptionGroupIndex],
                        )
                    "
                  />
                  <span
                    class="text-option-detail-item-count-box-text"
                    :class="getDarkModeClass()"
                  >
                    {{ `${optionItem.quantity}${t('개')}` }}
                  </span>
                  <GrayPlus
                    class="text-option-detail-item-count-box-button"
                    @click.stop="
                      () =>
                        clickOptionItemPlus(
                          optionItem,
                          targetProductInfo.options?.[activeOptionGroupIndex],
                          activeOptionGroupIndex,
                        )
                    "
                  />
                </div>
              </div>
            </div>
            <div
              v-if="optionItem.isSale === 0"
              class="text-option-detail-item-sold-out-wrap"
              :class="getDarkModeClass()"
              @click="openAlert(t('품절되었습니다.'))"
            >
              <div class="text-option-detail-item-sold-out-info">
                <img
                  class="text-option-detail-item-sold-out-checkbox"
                  src="https://static.torder.co.kr/torder2/btn_option_uncheckbox.svg"
                />
                <div
                  class="text-option-detail-item-sold-out-title"
                  :class="getDarkModeClass()"
                >
                  {{ translateLanguage(optionItem.nameArray, optionItem.name) }}
                </div>
              </div>
              <div class="text-option-detail-item-sold-out">
                {{ t('품절') }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="text-option-bill"
        :class="getDarkModeClass()"
      >
        <div
          v-if="
            optionCartItems &&
            isGroupSelectedItem(optionCartItems as cartProductType[])
          "
        >
          <div
            v-for="(selectGroup, groupIndex) in optionCartItems"
            :key="getOptionGroupKey(selectGroup as cartProductType, groupIndex)"
          >
            <div
              v-if="isOptionSelectedItem(selectGroup as cartProductType)"
              class="text-option-bill-list-group"
              :class="getDarkModeClass()"
            >
              <div
                class="text-option-bill-list-group-name"
                :class="getDarkModeClass()"
              >
                {{
                  removeNewLine(
                    translateLanguage(selectGroup.nameArray, selectGroup.name),
                  )
                }}
              </div>
              <div
                v-for="(selectItem, itemIndex) in selectGroup?.items"
                :id="
                  getScrollElementId(
                    selectGroup.name,
                    selectItem.code,
                    itemIndex,
                  )
                "
                :key="
                  getOptionItemKey(selectItem as cartProductType, itemIndex)
                "
              >
                <div
                  v-if="selectItem.code !== 'not_select' && selectItem.checked"
                  class="text-option-bill-list-item"
                >
                  <div class="text-option-bill-list-item-name">
                    <div
                      class="text-option-bill-list-item-title ellipsis-text-3"
                      :class="getDarkModeClass()"
                    >
                      {{
                        removeNewLine(
                          translateLanguage(
                            selectItem.nameArray,
                            selectItem.name,
                          ),
                        )
                      }}
                    </div>
                    <div
                      v-if="!selectItem.isPreSet"
                      class="text-option-bill-list-item-delete"
                      :class="getDarkModeClass()"
                      @click.stop="
                        deleteOptionItem(
                          selectItem as cartProductType,
                          selectGroup as cartProductType,
                        )
                      "
                    >
                      {{ t('삭제') }}
                    </div>
                  </div>

                  <div
                    class="image-option-bill-list-item-price"
                    :class="getDarkModeClass()"
                  >
                    <div
                      class="list-detail"
                      :class="getDarkModeClass()"
                    >
                      <p class="list-detail-header">
                        {{ t('기본') }} :
                        {{
                          checkStandardPriceUnit(
                            selectItem.price?.toLocaleString(),
                          )
                        }}
                      </p>
                      <div v-if="selectItem.items.length > 0">
                        <div
                          v-for="(level3, index3) in selectItem.items"
                          :key="index3"
                        >
                          <div
                            v-for="(level4, index4) in level3.items"
                            :key="index4"
                          >
                            <div
                              v-if="
                                level4.checked && level4.name !== '선택안함'
                              "
                            >
                              <span>
                                -
                                {{
                                  translateLanguage(
                                    level4.nameArray,
                                    level4.name,
                                  )
                                }}
                                (+{{
                                  checkStandardPriceUnit(
                                    level4.price?.toLocaleString(),
                                  )
                                }}) x{{ level4.quantity }}
                              </span>
                              <span
                                v-for="(level5, index5) in level4.items"
                                :key="index5"
                              >
                                <span
                                  v-for="(level6, index6) in level5.items"
                                  :key="index6"
                                >
                                  <span
                                    v-if="
                                      level6.checked &&
                                      level6.name !== '선택안함'
                                    "
                                  >
                                    /
                                    {{
                                      translateLanguage(
                                        level6.nameArray,
                                        level6.name,
                                      )
                                    }}
                                    (+{{
                                      checkStandardPriceUnit(
                                        level6.price?.toLocaleString(),
                                      )
                                    }}) x{{ level6.quantity }}
                                  </span>
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p
                      class="list-price"
                      :class="getDarkModeClass()"
                    >
                      {{
                        checkStandardPriceUnit(
                          getItemPrice(selectItem).toLocaleString(),
                        )
                      }}
                    </p>
                    <button
                      v-if="
                        isOptionSelectedItem(selectItem) && !selectItem.isPreSet
                      "
                      class="list-detail-button"
                      :class="getDarkModeClass()"
                      @click="onClickEditCartOption(selectItem)"
                    >
                      {{ t('옵션 변경') }}
                    </button>
                  </div>
                  <div
                    v-if="selectItem.limitQty !== 1"
                    class="image-option-bill-list-item-count"
                  >
                    <Trash
                      v-if="selectItem?.quantity === 1"
                      class="image-option-bill-list-item-count-button"
                      @click.stop="
                        () =>
                          clickOptionItemMinus(
                            selectItem,
                            targetProductInfo.options?.[activeOptionGroupIndex],
                          )
                      "
                    />
                    <GrayMinus
                      v-else
                      class="image-option-bill-list-item-count-button"
                      @click.stop="
                        () =>
                          clickOptionItemMinus(
                            selectItem,
                            targetProductInfo.options?.[activeOptionGroupIndex],
                          )
                      "
                    />
                    <span
                      class="image-option-bill-list-item-count-number"
                      :class="getDarkModeClass()"
                    >
                      {{ `${selectItem.quantity}${t('개')}` }}
                    </span>
                    <GrayPlus
                      class="image-option-bill-list-item-count-button"
                      @click.stop="
                        () =>
                          clickOptionItemPlus(
                            selectItem,
                            selectGroup,
                            groupIndex,
                          )
                      "
                    />
                  </div>
                </div>
                <div
                  v-if="
                    selectItem.checked &&
                    getDividerCount(selectGroup?.items as any, itemIndex)
                  "
                  class="image-option-bill-list-item-divider"
                  :class="getDarkModeClass()"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="text-option-bill-empty"
          :class="getDarkModeClass()"
        >
          {{ t('선택한 옵션이 없습니다. 옵션을 선택해주세요.') }}
        </div>
      </div>
    </div>
    <div
      class="text-option-footer"
      :class="getDarkModeClass()"
    >
      <div
        class="text-option-footer-title"
        :class="getDarkModeClass()"
      >
        {{
          removeNewLine(
            translateLanguage(
              targetProductInfo.productLanguage,
              targetProductInfo.name,
            ),
          )
        }}
      </div>
      <div class="text-option-footer-button-wrap">
        <div
          class="text-option-footer-count-close"
          @click="pushPage(home)"
        >
          {{ t('닫기') }}
        </div>
        <div
          class="text-option-footer-confirm-button"
          @click="clickAddCartProduct"
        >
          {{ getTotalPriceCount() }}
        </div>
      </div>
    </div>

    <CustomDepthOptionSheet
      v-if="isOpenOptionSheet"
      :depthOptionInfo="depthOptionInfo"
      :onCloseSheet="onCloseSheet"
      :onConfirmSheet="onConfirmSheet"
    />
  </div>
</template>

<style lang="scss" scoped>
.text-option-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
  font-family: 'Pretendard', sans-serif;
  background-color: #fff;

  .text-option-body {
    display: flex;
    height: 54.6875vw;

    .text-option-list {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 18.4375vw;
      background-color: v-bind(categoryBackgroundColor);
      background-position: center;
      background-size: cover;

      .text-option-title {
        display: flex;
        flex-shrink: 0;
        gap: 1.875vw;
        align-items: center;
        align-self: stretch;
        padding: 1.5625vw;
        overflow: hidden;
        font-size: 2.34375vw;
        font-style: normal;
        font-weight: 700;
        line-height: 3.125vw;
        color: #fff;
        text-overflow: ellipsis;
        letter-spacing: -0.04687vw;
      }

      .text-option-group-list {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;

        .text-option-group-active {
          display: flex;
          flex-direction: column;
          /* padding: 0.7813vw 0 0.7813vw 1.5625vw; */
          padding-left: 1.5625vw;

          .text-option-group-active-radius-box {
            display: flex;
            justify-content: flex-end;
            width: 100%;
            height: 0.78125vw;

            .text-option-group-active-radius-top {
              width: 1.5625vw;
              height: 1.5625vw;
              background-color: inherit;
              border-bottom-right-radius: 100%;
              box-shadow: 1.5625vw 1.5625vw 0 1.5625vw #fff;

              &.dark-mode {
                box-shadow: 1.5625vw 1.5625vw 0 1.5625vw #181818;
              }
            }

            .text-option-group-active-radius-bottom {
              width: 1.5625vw;
              height: 1.5625vw;
              background-color: inherit;
              border-top-right-radius: 100%;
              box-shadow: 1.5625vw -1.5625vw 0 1.5625vw #fff;

              &.dark-mode {
                box-shadow: 1.5625vw -1.5625vw 0 1.5625vw #181818;
              }
            }
          }

          .text-option-group-active-container {
            display: flex;
            flex-direction: column;
            gap: 0.9375vw;
            padding: 1.5625vw 0 1.5625vw 1.5625vw;
            background-color: #fff;
            border-radius: 1.5625vw 0 0 1.5625vw;

            &.dark-mode {
              background-color: #181818;
            }

            .text-option-group-active-essential {
              display: flex;
              align-items: center;
              justify-content: center;
              width: min-content;
              padding: 0.625vw;
              font-size: 1.5625vw;
              font-weight: 600;
              color: #fff;
              background-color: v-bind(categoryBackgroundColor);
              border-radius: 0.625vw;

              &.dark-mode {
                color: v-bind(categoryBackgroundColor);
                background-color: #fff;
              }
            }

            .text-option-group-active-name {
              width: 14.0625vw;
              font-size: 1.875vw;
              font-weight: 700;
              line-height: 1.3;
              color: v-bind(mainCategoryActiveFontColor);
            }
          }
        }

        .text-option-group-box {
          display: flex;
          flex-direction: column;
          gap: 0.9375vw;
          padding: 1.5625vw;

          .text-option-group-box-essential {
            display: flex;
            align-items: center;
            justify-content: center;
            width: min-content;
            height: 2.8125vw;
            padding: 0.625vw;
            font-size: 1.5625vw;
            font-weight: 500;
            color: v-bind(categoryBackgroundColor);
            background: #fff;
            border-radius: 0.625vw;
          }

          .text-option-group-name {
            width: 14.0625vw;
            font-size: 1.875vw;
            font-weight: 400;
            line-height: 1.3;
            color: v-bind(mainCategoryFontColor);
          }
        }
      }

      .more-detail-box {
        position: absolute;
        bottom: 1.25vw;
        left: 50%;
        z-index: 5;
        display: flex;
        gap: 0.3125vw;
        align-items: center;
        justify-content: center;
        padding: 0.625vw 1.25vw;
        background: rgba(91, 91, 91, 0.85);
        border: 0.0781vw solid #494949;
        border-radius: 0.7813vw;
        box-shadow: 0 0.2344vw 0.3125vw 0 rgba(0, 0, 0, 0.3);
        transform: translateX(-50%);

        .more-detail-box-text {
          font-size: 1.5625vw;
          font-weight: 600;
          line-height: 1.875vw;
          color: #fff;
          letter-spacing: -0.0313vw;
        }
      }
    }

    .text-option-detail {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 1.5625vw;
      padding: 2.3438vw 1.5625vw;
      background-color: #fff;

      &.dark-mode {
        background-color: #181818;
      }

      .text-option-detail-title {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .text-option-detail-name {
          width: 34.53125vw;
          overflow: hidden;
          font-size: 2.0313vw;
          font-weight: 700;
          line-height: 1.3;
          color: #313131;
          text-overflow: ellipsis;
          white-space: nowrap;

          &.dark-mode {
            color: #fff;
          }
        }

        .text-option-detail-limit {
          flex: 1;
          font-size: 1.5625vw;
          font-weight: 400;
          color: v-bind(categoryBackgroundColor);
          text-align: end;
        }
      }

      .text-option-detail-item-container {
        display: flex;
        flex-direction: column;
        gap: 1.1719vw;
        overflow-y: scroll;

        .text-option-detail-item-wrap {
          display: flex;
          flex-direction: column;
          gap: 1.4844vw;
          padding: 1.5625vw;
          background-color: #fff;
          border: 0.1172vw solid #d0d0d0;
          border-radius: 0.7813vw;

          &.active {
            border: 0.1172vw solid v-bind(categoryBackgroundColor);
          }

          &.dark-mode {
            background-color: #313131;
            border: 0.1172vw solid #494949;

            &.active {
              border: 0.1172vw solid v-bind(categoryBackgroundColor);
            }
          }

          .text-option-detail-item {
            display: flex;
            align-items: center;
            align-self: stretch;
            justify-content: space-between;

            .text-option-detail-item-info {
              display: flex;
              gap: 1.25vw;
              align-items: center;

              .text-option-detail-item-checkbox {
                width: 2.6563vw;
                height: 2.6563vw;
              }

              .text-option-detail-item-title {
                width: 27.3438vw;
                overflow: hidden;
                font-size: 1.5625vw;
                font-weight: 500;
                line-height: 1.3;
                color: #313131;
                text-overflow: ellipsis;
                white-space: nowrap;

                &.dark-mode {
                  color: #fff;
                }
              }
            }

            .text-option-detail-item-price {
              font-size: 1.5625vw;
              font-weight: 400;
              color: #313131;
              text-align: right;

              .item-price-wrapper {
                display: flex;
                flex-direction: row;
                gap: 0.625vw;
                align-items: center;
                overflow: hidden;
                font-size: 1.5625vw;
                font-weight: 400;
                color: #7a7a7a;
                text-align: right;
              }

              &.dark-mode {
                color: #fff;
              }
            }
          }

          .text-option-detail-item-count {
            display: flex;
            align-items: center;
            justify-content: end;

            .text-option-detail-item-count-box {
              display: flex;
              gap: 1.1719vw;
              align-items: center;
              justify-content: space-between;

              .text-option-detail-item-count-box-button {
                width: 5.4688vw;
                height: 4.2188vw;
              }

              .text-option-detail-item-count-box-text {
                width: 6.3281vw;
                font-size: 2.8125vw;
                font-weight: 700;
                line-height: 2.1875vw;
                color: #313131;
                text-align: center;
                letter-spacing: -0.0313vw;

                &.dark-mode {
                  color: #fff;
                }
              }
            }
          }
        }

        .text-option-detail-item-sold-out-wrap {
          display: flex;
          align-items: center;
          align-self: stretch;
          justify-content: space-between;
          padding: 1.5625vw;
          background-color: #f5f5f5;
          border: 0.0781vw solid #d0d0d0;
          border-radius: 0.7813vw;

          &.dark-mode {
            background-color: #181818;
            border: 0.0781vw solid #494949;
          }

          .text-option-detail-item-sold-out-info {
            display: flex;
            gap: 1.25vw;
            align-items: center;

            .text-option-detail-item-sold-out-checkbox {
              width: 2.6563vw;
              height: 2.6563vw;
            }

            .text-option-detail-item-sold-out-title {
              width: 25.2344vw;
              overflow: hidden;
              font-size: 1.5625vw;
              font-weight: 500;
              line-height: 1.3;
              color: #d0d0d0;
              text-overflow: ellipsis;
              white-space: nowrap;

              &.dark-mode {
                color: #7a7a7a;
              }
            }
          }

          .text-option-detail-item-sold-out {
            font-size: 1.5625vw;
            font-weight: 500;
            color: #f52179;
          }
        }
      }
    }

    .text-option-bill {
      display: flex;
      flex-direction: column;
      width: 32.1875vw;
      padding: 1.5625vw;
      overflow-y: scroll;
      background-color: #f8f8f8;
      border-left: 0.0781vw solid #d0d0d0;

      &.dark-mode {
        background-color: #313131;
        border-left: 0.0781vw solid #5b5b5b;
      }

      .text-option-bill-list-group {
        display: flex;
        flex-direction: column;
        padding: 1.5625vw;
        margin-bottom: 0.7813vw;
        background-color: #fff;
        border: 0.0781vw solid #d0d0d0;
        border-radius: 1.25vw;

        &.dark-mode {
          background-color: #181818;
          border: 0.0781vw solid #494949;
        }

        .text-option-bill-list-group-name {
          width: 25.9375vw;
          margin-bottom: 0.7813vw;
          overflow: hidden;
          font-size: 1.5625vw;
          font-weight: 400;
          color: #818181;
          text-overflow: ellipsis;
          white-space: nowrap;

          &.dark-mode {
            color: #d5d5d5;
          }
        }

        .text-option-bill-list-item {
          display: flex;
          flex-direction: column;
          gap: 1.875vw;

          .text-option-bill-list-item-name {
            display: flex;
            gap: 1.5625vw;
            align-items: flex-start;
            justify-content: space-between;

            .text-option-bill-list-item-title {
              width: 18.75vw;
              font-size: 1.875vw;
              font-weight: 500;
              line-height: 1.3;
              color: #313131;

              &.dark-mode {
                color: #fff;
              }
            }

            .text-option-bill-list-item-delete {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 5.625vw;
              padding: 0.7813vw 0.625vw;
              margin-bottom: 1.25vw;
              font-size: 1.5625vw;
              font-weight: 500;
              color: v-bind(buttonBackgroundColor);
              background-color: #fff;
              border: 0.1172vw solid v-bind(buttonBackgroundColor);
              border-radius: 0.625vw;

              &.button-active {
                background-color: #ebebeb;
              }

              &.dark-mode {
                background-color: #181818;

                &.button-active {
                  background-color: #313131;
                }
              }
            }
          }

          .text-option-bill-list-item-count {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .text-option-bill-list-item-count-button {
              width: 5.4688vw;
              height: 4.6875vw;
            }

            .text-option-bill-list-item-count-number {
              font-size: 3.125vw;
              font-weight: 700;
              color: #313131;

              &.dark-mode {
                color: #fff;
              }
            }
          }

          .text-option-bill-list-item-price {
            display: flex;
            justify-content: end;
            font-size: 1.5625vw;
            font-weight: 500;
            color: #959595;

            &.dark-mode {
              color: #d5d5d5;
            }
          }
        }

        .text-option-bill-list-item-divider {
          height: 0.0781vw;
          margin: 1.875vw 0;
          background-color: #d0d0d0;

          &.dark-mode {
            background-color: #494949;
          }
        }
      }

      .text-option-bill-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 1.875vw;
        font-weight: 600;
        line-height: 2.5vw;
        color: #d5d5d5;
        text-align: center;
        letter-spacing: -0.0375vw;
        white-space: pre-line;

        &.dark-mode {
          color: #fff;
        }
      }
    }
  }

  .text-option-footer {
    box-sizing: border-box;
    display: flex;
    gap: 2.8125vw;
    align-items: center;
    width: 100vw;
    height: 7.8125vw;
    padding: 0.9375vw 1.5625vw 1.25vw;
    background-color: #fff;
    border-top: 0.0781vw solid #d5d5d5;

    &.dark-mode {
      background-color: #181818;
      border-top: 0.0781vw solid #5b5b5b;
    }

    .text-option-footer-title {
      flex: 1;
      overflow: hidden;
      font-size: 2.3438vw;
      font-weight: 700;
      line-height: 3.125vw;
      text-overflow: ellipsis;
      letter-spacing: -0.0469vw;
      word-break: break-all;
      white-space: nowrap;

      &.dark-mode {
        color: #fff;
      }
    }

    .text-option-footer-button-wrap {
      display: flex;
      gap: 0.9375vw;
      align-items: center;
      justify-content: space-between;

      .text-option-footer-count-close {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.25vw 1.875vw;
        font-size: 2.34375vw;
        font-style: normal;
        font-weight: 700;
        line-height: 3.125vw;
        color: #fff;
        letter-spacing: -0.04687vw;
        background-color: #5b5b5b;
        border-radius: 0.9375vw;

        &.button-active {
          background-color: #494949;
        }
      }

      .text-option-footer-confirm-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 27.5vw;
        padding: 1.25vw 1.875vw;
        font-size: 2.34375vw;
        font-weight: 700;
        line-height: 3.125vw;
        color: v-bind(buttonFontColor);
        letter-spacing: -0.04687vw;
        background-color: v-bind(buttonBackgroundColor);
        border-radius: 0.7813vw;

        &.button-active {
          background-color: v-bind(getActiveButtonColor(buttonBackgroundColor));
        }
      }
    }
  }

  .image-option-bill-list-item-count {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .image-option-bill-list-item-count-button {
      width: 5.4688vw;
      height: 4.6875vw;
    }

    .image-option-bill-list-item-count-number {
      font-size: 3.125vw;
      font-weight: 700;
      color: #313131;

      &.dark-mode {
        color: #fff;
      }
    }
  }

  .image-option-bill-list-item-price {
    display: flex;
    flex-direction: column;
    gap: 0.625vw;
    padding: 1.09375vw;
    font-size: 1.5625vw;
    font-weight: 500;
    color: #959595;
    background: #f8f8f8;
    border: 0.078125vw solid #ebebeb;
    border-radius: 0.78125vw;

    .list-detail-header {
      margin-bottom: 0.3125vw;
    }

    .list-detail {
      font-size: 1.25vw;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      color: #246ff4;
      letter-spacing: -0.0375vw;

      &.dark-mode {
        color: #42a4ff;
      }

      span {
        word-wrap: break-word;
      }
    }

    .list-price {
      font-size: 1.5625vw;
      font-weight: 500;
      line-height: 1.875vw;
      color: #313131;
      text-align: right;
      letter-spacing: -0.04687vw;

      &.dark-mode {
        color: #fff;
      }
    }

    .list-detail-button {
      display: flex;
      gap: 0.9375vw;
      align-items: center;
      align-self: stretch;
      justify-content: center;
      padding: 0.9375vw 1.875vw;
      margin-top: 0.625vw;
      font-size: 1.5625vw;
      font-weight: 700;
      line-height: 1.875vw;
      color: #5b5b5b;
      letter-spacing: -0.03125vw;
      background: #fff;
      border: 0.078125vw solid #5b5b5b;
      border-radius: 0.78125vw;

      &.dark-mode {
        color: #fff;
        background: #494949;
        border-color: #5b5b5b;
      }
    }

    &.dark-mode {
      color: #d5d5d5;
      background-color: #313131;
      border-color: #494949;
    }
  }
}

.image-option-bill-list-item-divider {
  height: 0.0781vw;
  margin: 1.5625vw 0;
  background-color: #d5d5d5;

  &.dark-mode {
    background-color: #494949;
  }
}

.image-option-bill-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 1.875vw;
  font-weight: 600;
  line-height: 2.5vw;
  color: #d5d5d5;
  text-align: center;
  letter-spacing: -0.0375vw;
  white-space: pre-line;

  &.dark-mode {
    color: #fff;
  }
}

.image-option-footer {
  box-sizing: border-box;
  display: flex;
  gap: 0.7031vw;
  align-items: center;
  width: 100vw;
  height: 7.8125vw;
  padding: 0.7813vw 1.875vw;
  background-color: #fff;
  border-top: 0.0781vw solid #d5d5d5;

  &.dark-mode {
    background-color: #181818;
    border-top: 0.0781vw solid #494949;
  }

  .image-option-footer-title {
    width: 30.0625vw;
    overflow: hidden;
    font-size: 2.3438vw;
    font-weight: 700;
    line-height: 3.125vw;
    color: #313131;
    text-overflow: ellipsis;
    letter-spacing: -0.0469vw;
    white-space: nowrap;

    &.dark-mode {
      color: #fff;
    }
  }
}
.display-none {
  display: none !important;
}
</style>
