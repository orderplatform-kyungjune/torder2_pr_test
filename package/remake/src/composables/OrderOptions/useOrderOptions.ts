import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';
import { cloneDeep, isEqual, isEqualWith } from 'lodash';
import { translateLanguage } from '@utils/langTransfer';

import useModalStore from '@store/storeModal';
import { cartProductType } from '@torder/common';

const NOT_SELECTED_OPTIONS = {
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
} as unknown as cartProductType;

const useOrderDepthOptions = () => {
  const { openAlert } = useModalStore();
  const optionItemCart = ref<cartProductType[]>([]);
  const isOpenOptionSheet = ref<boolean>(false);
  const depthOptionInfo = ref();
  const editCartItemTarget = ref<cartProductType | null>(null);
  const { t } = useI18n();

  // 최대 수량이 1 이상이면 카운트 박스 노출
  const isShowCountBox = computed(
    () => (item: cartProductType) => item.limitQty > 1,
  );
  // 필수 값 확인 flag
  const isRequiredOption = computed(
    () => (item: cartProductType) => item.requireFlag === 1,
  );
  // 기본 설정 flag
  const isPresetOptions = computed(
    () => (item: cartProductType) => item.isPreSet,
  );
  // 상품의 타입이 'G'이면 그룹 옵션임
  const isGroupOptions = computed(
    () => (item: cartProductType) => item.isType === 'G',
  );

  const toggleOptionSheet = () => {
    isOpenOptionSheet.value = !isOpenOptionSheet.value;
  };

  const rangeSelectText = (item: cartProductType): string => {
    const { minLimitQty, maxLimitQty } = item;

    if (maxLimitQty === 0 && minLimitQty > 1) {
      return t('최소 n개 선택 가능', { min: minLimitQty });
    }
    if (maxLimitQty !== 0 && maxLimitQty === minLimitQty) {
      return `${t('n개 선택 가능', { count: maxLimitQty })}`;
    }
    if (minLimitQty > 0 && maxLimitQty > 0) {
      return `${t('n ~ m개 선택 가능', {
        min: minLimitQty,
        max: maxLimitQty,
      })}`;
    }

    return '';
  };

  const countCheckedItems = (items: cartProductType[]) => {
    let count = 0;
    items.filter((item) => {
      if (item.checked && item.code !== 'not_select') {
        count += item.quantity;
      }
    });
    return count;
  };

  const validateCheckedAddItems = (items: cartProductType[]) => {
    items[0].checked = true;

    const validate = (item: cartProductType): boolean => {
      const { minLimitQty, maxLimitQty } = item;
      const isRequired = isRequiredOption.value(item);
      const minimumQuantity = minLimitQty > 1 && maxLimitQty === 0;
      const rangeQuantity = minLimitQty > 1 && maxLimitQty > 1;
      const isCheckNotSelect = item.items.some(
        (child) => child.name === '선택안함' && child.checked,
      );
      if (isCheckNotSelect) {
        return true;
      }
      if (!item.checked && !isRequired) {
        return true;
      }

      if (item.checked || isRequired) {
        if (item.items && item.items.length > 0) {
          const checkedCount = countCheckedItems(item.items);
          if (isRequired) {
            if (checkedCount === 0) {
              openAlert(
                `${t('필수 옵션을 선택해 주세요.', { name: translateLanguage(item.nameArray, item.name) })}`,
              );
              return false;
            }
          }
          if (minimumQuantity) {
            if (checkedCount < minLimitQty) {
              openAlert(
                `${t('그룹에서 n개 선택해 주세요.', {
                  group: translateLanguage(item.nameArray, item.name),
                  max: minLimitQty,
                })}`,
              );
              return false;
            }
          }
          if (rangeQuantity) {
            if (checkedCount < minLimitQty || checkedCount > maxLimitQty) {
              openAlert(
                `${t('그룹에서 n~m까지 선택해 주세요.', {
                  group: translateLanguage(item.nameArray, item.name),
                  min: minLimitQty,
                  max: maxLimitQty,
                })}`,
              );
              return false;
            }
          }
          items[0].checked = false;
          return item.items.every(validate as any);
        }
      }

      items[0].checked = false;
      return item.items.every(validate as any);
    };

    return items.every(validate as any);
  };

  const canCheckItem = (item: cartProductType, parent: cartProductType) => {
    const { minLimitQty, maxLimitQty } = parent;
    const checkedCount = countCheckedItems(parent.items);
    if (maxLimitQty === 0) return true;

    if (minLimitQty <= maxLimitQty) {
      return checkedCount < maxLimitQty || item.checked;
    }
    return false;
  };

  const disableOption = (item: cartProductType, parent: cartProductType) => {
    if (item.isSale === 0) return true;
    if (!canCheckItem(item, parent) && !item.checked) return true;
    return false;
  };

  const handleCheckOptionalOption = (
    item: cartProductType,
    parent: cartProductType,
  ) => {
    const optionalItem = parent.items.find(
      (child) => child.name === '선택안함',
    );

    const otherItemsChecked = parent.items.filter(
      (child) => child.name !== '선택안함' && child.checked,
    ).length;

    if (item === optionalItem) {
      parent.items.forEach((child) => {
        if (child === optionalItem) {
          child.checked = true;
        } else {
          child.checked = false;
        }
      });
    } else if (otherItemsChecked === 0) {
      if (optionalItem) optionalItem.checked = true;
    } else {
      if (optionalItem) optionalItem.checked = false;
    }
  };
  const handleCheckOptions = (
    item: cartProductType,
    parent: cartProductType | null = null,
  ) => {
    if (!parent) {
      item.checked = !item.checked;
      return;
    }

    if (item.isSale === 0) {
      openAlert(t('품절되었습니다.'));
      return;
    }

    // 옵션 체크 유효성 검사
    if (canCheckItem(item, parent)) {
      item.checked = !item.checked;

      // 선택 옵션 선택 안함 클릭 로직
      if (!isRequiredOption.value(parent)) {
        handleCheckOptionalOption(item, parent);
      }
    } else {
      openAlert(
        `${t('n개까지 선택 가능합니다.', { count: parent?.maxLimitQty })}`,
      );
    }
  };

  const setDepthOrderOptionFlags = (depthOptionInfo: cartProductType[]) => {
    const setFlags = (options: cartProductType[], depth: number): any[] =>
      options.map((item) => {
        const newItem = {
          ...item,
          items: item.items ? [...item.items] : [],
        };

        // 조건1 : 두번째 depth는 무조건 오픈
        if (depth === 2) {
          newItem.checked = true;
        } else {
          newItem.checked =
            newItem.isSale !== 0 &&
            (newItem.checked || newItem.require === 1 || newItem.isPreSet);
        }
        newItem.quantity = 1;

        // 조건2 : 필수 옵션이 아닌 경우 4차 6차 뎁스에 선택안함 옵션 제공
        if (!isRequiredOption.value(newItem) && isGroupOptions.value(newItem)) {
          if (!newItem.items.some((subItem) => subItem.name === '선택안함')) {
            newItem.items = [NOT_SELECTED_OPTIONS, ...newItem.items];
          }
        }

        if (newItem.items && newItem.items.length > 0) {
          newItem.items = setFlags(newItem.items, depth + 1);
        }

        return newItem;
      });

    const updatedDepthOptionInfo = setFlags([...depthOptionInfo], 1);

    return updatedDepthOptionInfo[0];
  };

  const onClickOptionCountMinus = (item: cartProductType, detailRef?: any) => {
    if (item.quantity === 1) {
      item.checked = false;
      // 펼쳐짐 닫기
      detailRef[0].open = false;
    } else if (item.quantity > 0) item.quantity -= 1;
  };

  const onClickOptionCountPlus = (
    item: cartProductType,
    parent: cartProductType,
  ) => {
    const { maxLimitQty, minLimitQty } = parent;
    const rangeQuantity = minLimitQty > 1 && maxLimitQty > 1;
    const checkedCount = countCheckedItems(parent.items);

    if (maxLimitQty !== 0 && checkedCount >= maxLimitQty) {
      if (rangeQuantity) {
        openAlert(
          `${t('그룹에서 n~m까지 선택해 주세요.', {
            group: translateLanguage(parent.nameArray, parent.name),
            min: minLimitQty,
            max: maxLimitQty,
          })}`,
        );
        return;
      }
      openAlert(
        `${t('그룹에서 n까지 선택해 주세요.', {
          group: translateLanguage(parent.nameArray, parent.name),
          max: maxLimitQty,
        })}`,
      );
      return;
    }

    if (item.limitQty > item.quantity) {
      item.quantity += 1;
      return;
    }

    openAlert(`${t('n개까지 선택 가능합니다.', { count: item.limitQty })}`);
  };

  const onClickCloseButton = () => {
    editCartItemTarget.value = null;
    toggleOptionSheet();
  };

  const isEqualIgnoringQuantity = (obj1: any, obj2: any) =>
    isEqualWith(obj1, obj2, (value1, value2, key) => {
      if (key === 'quantity') {
        return undefined;
      }

      return undefined;
    });

  const isEqualIgnoringCheck = (items1: any[], items2: any[]): boolean => {
    const checkedItems1 = items1.filter((item) => item.checked);
    const checkedItems2 = items2.filter((item) => item.checked);

    if (checkedItems1.length !== checkedItems2.length) return false;

    return checkedItems1.every((item1, index) => {
      const item2 = checkedItems2[index];

      // 기본 속성 비교
      if (item1.id !== item2.id || item1.name !== item2.name) {
        return false;
      }

      if (!isEqual(item1, item2)) {
        return false;
      }

      // items 재귀적 비교
      if (item1.items && item2.items) {
        return isEqualIgnoringCheck(item1.items, item2.items);
      } else if (!item1.items && !item2.items) {
        return true;
      } else {
        return false;
      }
    });
  };

  const updateItemWithChangedOption = (
    cartItems: cartProductType[],
    editTarget: cartProductType,
    newItem: cartProductType,
  ): cartProductType[] => {
    return cartItems.reduce((acc: cartProductType[], item: cartProductType) => {
      if (isEqualIgnoringCheck(item.items, editTarget.items)) {
        const existingItem = acc.find((cartItem) =>
          isEqualIgnoringCheck(cartItem.items, newItem.items),
        );

        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          acc.push({
            ...newItem,
            quantity: item.quantity,
            parentName: item.parentName,
            checked: true,
          });
        }
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
  };

  const updateOrAddFirstDepthItem = (
    cartItems: cartProductType[],
    newItem: cartProductType,
    itemGroup: cartProductType,
  ) => {
    let updatedCartItems: cartProductType[];

    if (editCartItemTarget.value) {
      // 옵션 변경 로직
      updatedCartItems = updateItemWithChangedOption(
        cartItems,
        editCartItemTarget.value,
        newItem,
      );
    } else {
      // 기존 로직
      let itemFound = false;
      updatedCartItems = cartItems.map((item: cartProductType) => {
        if (isEqualIgnoringCheck(item.items, newItem.items)) {
          itemFound = true;
          return {
            ...newItem,
            quantity: item.quantity + 1,
            parentName: item.parentName,
            checked: true,
          };
        }
        return { ...item, parentName: item.parentName };
      });

      if (!itemFound) {
        updatedCartItems.push({
          ...newItem,
          parentName: newItem.parentName ?? itemGroup.name,
          checked: true,
        });
      }
    }

    editCartItemTarget.value = null;

    return updatedCartItems;
  };

  const plusCartOptionItem = (
    item: cartProductType,
    group: cartProductType,
  ) => {
    // 2차 그룹 최대 조건
    if (group.maxLimitQty !== 0 && group.maxLimitQty <= item.quantity) {
      openAlert(
        `${t('n개까지 선택 가능합니다.', { count: group.maxLimitQty })}`,
      );
      return;
    }
    // 3차 아이템 최대 조건
    if (item.limitQty !== 0 && item.quantity >= item.limitQty) {
      openAlert(`${t('n개까지 선택 가능합니다.', { count: item.limitQty })}`);
      return;
    }

    optionItemCart.value = optionItemCart.value.map((cartItem) => {
      if (
        cartItem.parentName === item.parentName &&
        isEqualIgnoringQuantity(cartItem, item)
      ) {
        return {
          ...cartItem,
          quantity: cartItem.quantity + 1,
        };
      }
      return cartItem;
    });
  };

  const removeCartOptionItem = (item: cartProductType) => {
    optionItemCart.value = optionItemCart.value.filter(
      (cartItem) =>
        !(
          cartItem.parentName === item.parentName &&
          isEqualIgnoringQuantity(cartItem, item)
        ),
    );

    if (item.quantity <= 1) {
      openAlert(
        `${t('상품을(를) 삭제했습니다.', { item: translateLanguage(item.nameArray, item.name) })}`,
      );
    }
  };

  const minusCartOptionItem = (item: cartProductType) => {
    optionItemCart.value = optionItemCart.value
      .map((cartItem) => {
        if (
          cartItem.parentName === item.parentName &&
          isEqualIgnoringQuantity(cartItem, item)
        ) {
          const updatedQuantity = cartItem.quantity - 1;
          if (updatedQuantity > 0) {
            return {
              ...cartItem,
              quantity: updatedQuantity,
            };
          }
          removeCartOptionItem(item);

          return null as unknown as cartProductType;
        }
        return cartItem as cartProductType;
      })
      .filter((cartItem) => cartItem !== null);
  };

  const onClickConfirmButton = (
    item: cartProductType,
    itemGroup: cartProductType,
  ) => {
    if (validateCheckedAddItems([item])) {
      const updatedCart = updateOrAddFirstDepthItem(
        optionItemCart.value,
        item,
        itemGroup,
      );

      optionItemCart.value = updatedCart;

      toggleOptionSheet();
      return true;
    }
    return false;
  };

  const onClickEditCartOption = (item: cartProductType) => {
    editCartItemTarget.value = item;
    depthOptionInfo.value = cloneDeep(item);
    toggleOptionSheet();
  };

  const calculateOptionTotalPrice = (items: cartProductType[]): number => {
    let total = 0;
    items.forEach((item) => {
      if (item.checked && item.code !== 'not_select') {
        if (item.price !== undefined && item.quantity !== undefined) {
          total += item.price * item.quantity;
        }

        if (item.items && item.items.length > 0) {
          total += calculateOptionTotalPrice(item.items);
        }
      }
    });

    return total;
  };

  const separateItemsByParentName = (cartTargetItems: cartProductType) => {
    const withParentName: cartProductType[] = [];
    let withoutParentName: cartProductType;

    withoutParentName = {
      ...cartTargetItems,
      options: cartTargetItems.options.map((cart) => ({
        ...cart,
        items: cart.items.filter((item) => {
          if (item.parentName) {
            withParentName.push(item);
            return false;
          } else {
            return true;
          }
        }),
      })),
    };

    return { withParentName, withoutParentName };
  };

  return {
    optionItemCart,
    isOpenOptionSheet,
    depthOptionInfo,
    toggleOptionSheet,
    onClickConfirmButton,
    onClickCloseButton,
    isRequiredOption,
    isShowCountBox,
    rangeSelectText,
    handleCheckOptions,
    isPresetOptions,
    setDepthOrderOptionFlags,
    onClickOptionCountPlus,
    onClickOptionCountMinus,
    canCheckItem,
    disableOption,
    plusCartOptionItem,
    minusCartOptionItem,
    removeCartOptionItem,
    onClickEditCartOption,
    calculateOptionTotalPrice,
    separateItemsByParentName,
    updateOrAddFirstDepthItem,
  };
};

export default useOrderDepthOptions;
