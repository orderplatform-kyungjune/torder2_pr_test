<!--
<template>
  <div class="option-select-container">
    <aside class="left-container">
      <div class="left-container-background"/>
      <div class="left-container-content">
        <div class="option-layout-menu-wrap">
          <img
            class="main-layout-logo"
            src="https://static.torder.co.kr/torder2/svg_torderlogo_all_white_82px.svg"
          >
          <div
            v-if="getInitTableName()"
            class="tablet-number"
            @click="onNextSecret"
          >
            <div class="tablet-info">
              {{ getInitTableName() }}
            </div>

          </div>
        </div>
        <div class="option-first-category">
          <div class="option-first-category-wrap">
            <HyattProductOptionGroupList
              :optionList="[product]"
              :changeSelectOptionIndex="changeSelectOptionIndex"
            />
          </div>
        </div>
      </div>
    </aside>

    <main class="middle-container">
      <HyattProductOptionBody
        :product="product"
        :getTotalPrice="getTotalPrice"
        :increaseProductQuantity="increaseProductQuantity"
        :decreaseProductQuantity="decreaseProductQuantity"
        :addCart="addCart"
        :closeProductOption="close"
        :t="t"
        :isShowSelected="modalState.show"
        :goHome="onNextRoot"
        :openProductOption="open"
        :selectedOptionLength="selectOptionPageCartLength"
        :isSetMenu="isProductSetMenu"
        :isEnglishLanguage="isEnglishLanguage"
        :isJapaneseLanguage="isJapaneseLanguage"
      >
        <template #navigation>
          <div class="navigation-wrap">
            <div class="navigation-button-scroll">
              <template
                v-for="(groups, groupsIndex) in showGroups"
                :key="groupsIndex"
              >
                <div
                  v-if="groups.length !== 0"
                  class="navigation-groups-wrapper"
                >
                  <template
                    v-for="(group, groupIndex) in groups"
                    :key="group.id"
                  >
                    <template v-if="selectedTopGroup === groupsIndex">
                      <div
                        v-if="groupIndex === 0"
                        :id="group.id"
                        class="navigation-button select"
                        :class="{ finish: group.isGroupSelected }"
                        @click="navigationSelect(group, groupsIndex)"
                      >
                        <span>
                          {{ translateLanguage(group.nameArray, group.name) }}
                        </span>
                        <span class="name-select-info">
                          {{ groupNameConvertor(group, groupsIndex) }}
                        </span>
                      </div>
                    </template>
                    <template v-else>
                      <div
                        v-if="groupIndex === 0"
                        :id="group.id"
                        class="navigation-button"
                        :class="{ finish: group.isGroupSelected }"
                        @click="navigationSelect(group, groupsIndex)"
                      >
                        <span>
                          {{ translateLanguage(group.nameArray, group.name) }}
                        </span>
                        <span class="name-select-info">
                          {{ groupNameConvertor(group, groupsIndex) }}
                        </span>
                      </div>
                    </template>
                  </template>
                </div>
              </template>
            </div>
          </div>
        </template>
        <template
          v-if="selectCurrentShowGroup"
          #select
        >
          <div
            :key="selectCurrentShowGroup.id"
            ref="selectWraps"
            class="select-container"
          >
            <div
              :id="selectCurrentShowGroup.id"
              class="select-wrap"
            >
              <div class="option-group-wrap">
                <div
                  class="option-list-wrap"
                  @scroll="close"
                >
                  <div class="select-list-wrap">
                    <ul
                      class="select-list"
                      :class="{ image: isOptionImageType, text: !isOptionImageType, over: selectCurrentShowGroup.items?.length > 6 }"
                      @click="close"
                    >
                      <template
                        v-for="(item, itemIndex) in selectCurrentShowGroup.items"
                        :key="getKeyFromCartItem(item)"
                      >
                        <li
                          v-if="!isSelectOptionRequire(selectCurrentShowGroup) && itemIndex === 0"
                          class="select-item"
                          :class="{ active: isNoSelect(selectCurrentShowGroup) && !isOptionImageType }"
                          @click="noSelectOption(selectCurrentShowGroup, currentNavigationIndex, itemIndex)"
                        >
                          <div
                            v-if="!isOptionImageType"
                            class="name"
                          >
                            <div
                              class="select-item-icon"
                              :class="{ active: isNoSelect(selectCurrentShowGroup) }"
                            >
                              <img
                                class="img"
                                :src="optionCheckImage(isNoSelect(selectCurrentShowGroup))"
                              >
                            </div>
                            <span class="text">
                              {{ t('선택 안 함') }}
                            </span>
                          </div>
                          <div
                            v-else
                            class="image-type-no-select-wrap"
                          >
                            <div class="image-type-no-select">
                              <img
                                src="https://static.torder.co.kr/torder2/icon_image_no_select_gray_177x176.svg"
                                alt="no-select-image"
                              >
                              <div
                                v-if="isNoSelect(selectCurrentShowGroup)"
                                class="checked-image"
                              />
                              <div
                                v-if="isNoSelect(selectCurrentShowGroup)"
                                class="checked-message"
                              >
                                <img
                                  class="check-icon"
                                  src="https://static.torder.co.kr/torder2/icon_check_btn_white_52x52.svg"
                                  alt="check"
                                >
                                <span>
                                  {{ t('선택') }}
                                </span>
                              </div>
                            </div>
                            <div class="no-select-text-wrap">
                              <span class="text">
                                {{ t('선택 안 함') }}
                              </span>
                            </div>
                          </div>
                        </li>
                        <HyattProductOptionSelectList
                          :increaseOptionQuantity="() => increaseOptionQuantity(isGroupSetGroup(selectCurrentShowGroup), selectCurrentShowGroup, item, 'list')"
                          :decreaseOptionQuantity="() => decreaseOptionQuantity(isGroupSetGroup(selectCurrentShowGroup), selectCurrentShowGroup, currentNavigationIndex, item, itemIndex, selectedTopGroup, 'list')"
                          :optionCheckImage="optionCheckImage(item.checked)"
                          :isChecked="item.checked"
                          :isNoLimitOne="isNoLimitOne(item)"
                          :isSetMenu="isProductSetMenu"
                          :t="t"
                          :optionItemName="convertItemName(item)"
                          :optionItemPrice="convertItemPrice(item, selectedTopGroup)"
                          :optionItemQuantity="convertItemQuantity(item, selectedTopGroup)"
                          :optionImage="convertItemImage(item)"
                          :isHasChildGroup="isHasChildGroup(selectCurrentShowGroup, item)"
                          :isOptionGroup="isOptionGroupType(selectCurrentShowGroup)"
                          :isGroupSetGroup="isGroupSetGroup(selectCurrentShowGroup)"
                          :isOptionImageType="isOptionImageType"
                          :isProductSoldOut="isProductSoldOut(item)"
                          :isOptionImage="isItemImg(item)"
                          :isNonOrderTable="isNonOrderTable"
                          :isGroupType="isGroupType(item)"
                          @click="selectOption(selectCurrentShowGroup, currentNavigationIndex, item, itemIndex)"
                        />
                      </template>
                    </ul>
                  </div>
                </div>
                <div class="button-wrapper">
                  <li
                    v-if="isFinishSelect(selectCurrentShowGroup, selectedTopGroup) && !isNonOrderTable"
                    class="select-finish-button"
                    @click="finishSelectOption()"
                  >
                    <img
                      class="check-icon"
                      src="https://static.torder.co.kr/torder2/icon_check_btn_white_52x52.svg"
                      alt="check"
                    >
                    <span>
                      {{ t('선택완료') }}
                    </span>
                  </li>
                  <li
                    v-if="!isFinishSelect(selectCurrentShowGroup, selectedTopGroup) && !isNonOrderTable"
                    class="select-finish-button not"
                  >
                    <img
                      class="check-icon"
                      src="https://static.torder.co.kr/torder2/icon_check_btn_white_52x52.svg"
                      alt="check"
                    >
                    <span>
                      {{ t('선택완료') }}
                    </span>
                  </li>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #selected>
          <div v-if="isProductSetMenu">
            <div
              v-for="(groups, groupsIndex) in optionPageCart"
              :key="groupsIndex"
            >
              <HyattSetProductOptionSelectedList
                v-if="groups[0]"
                :selectedOptionGroupName="convertSelectedOptionName(groups[0])"
                :deleteOptionGroupByIndex="() => deleteOptionGroupByIndex(groupsIndex, groups[0])"
                :t="t"
              >
                <template
                  v-for="(group, groupIndex) in groups"
                  :key="getKeyFromCartItem(group)"
                >
                  <div
                    v-if="group.checked && (groupIndex !== 0)"
                    class="set-cart-group"
                    :class="{
                      product: group.isProduct || group.isOptionProduct,
                      'group-type': group.isOptionExist || group.isProductExist,
                    }"
                  >
                    <span>
                      {{ convertSetSelectedOptionInfo(group, groupsIndex) }}
                    </span>
                    <span v-if="!group.isProduct && !group.isOptionProduct">
                      {{ convertItemPrice(group, groupsIndex) }}
                    </span>
                  </div>
                  <template v-if="!isItemType(group)">
                    <template v-if="(group as CartProductOptionGroupType).items.filter(item=>item.checked).length > 0">
                      <template
                        v-for="(item) in (group as CartProductOptionGroupType).items"
                        :key="getKeyFromCartItem(item)"
                      >
                        <div
                          v-if="item.checked && isItemType(item)"
                          class="set-cart-group"
                          :class="{ product: item.isProduct }"
                        >
                          <span>
                            {{ convertSetSelectedOptionInfo(item, groupsIndex) }}
                          </span>
                          <span v-if="!item.isProduct && !group.isOptionProduct">
                            {{ convertItemPrice(item, groupsIndex) }}
                          </span>
                        </div>
                      </template>
                    </template>
                    <template v-else>
                      <div class="set-cart-group">
                        {{ t('선택 안 함') }}
                      </div>
                    </template>
                  </template>
                </template>
              </HyattSetProductOptionSelectedList>
            </div>
          </div>
          <div v-else>
            <div
              v-for="(groups, groupsIndex) in optionPageCart"
              :key="groupsIndex"
            >
              <template
                v-for="(group, groupIndex) in groups"
                :key="getKeyFromCartItem(group)"
              >
                <template v-if="isItemType(group)">
                  <HyattProductOptionSelectedList
                    v-if="(group as (productType | CartProductOptionType)).checked"
                    :increaseOptionQuantity="() => increaseOptionQuantity(isGroupSetGroup(group), group, group, 'cart')"
                    :decreaseOptionQuantity="() => decreaseOptionQuantity(isGroupSetGroup(group), group, groupIndex, group, groupIndex, groupsIndex, 'cart')"
                    :selectedOptionGroupName="convertSelectedOptionName(group)"
                    :deleteOptionItemByIndex="() => deleteTopGroupItemType(group as (productType | CartProductOptionType), groupsIndex)"
                    :t="t"
                    :isNoLimitOne="isNoLimitOne(group)"
                    :isNoPrice="isNoPrice(group.isProduct, group)"
                    :optionItemName="convertItemName(group)"
                    :optionItemPrice="convertItemPrice(group, groupsIndex)"
                    :optionItemQuantity="convertItemQuantity(group, groupsIndex)"
                  />
                </template>
                <template v-else>
                  <template
                    v-for="(item, itemIndex) in (group as CartProductOptionGroupType).items"
                    :key="getKeyFromCartItem(item)"
                  >
                    <HyattProductOptionSelectedList
                      v-if="item.checked && isItemType(item)"
                      :increaseOptionQuantity="() => increaseOptionQuantity(isGroupSetGroup(group), group, item, 'cart')"
                      :decreaseOptionQuantity="() => decreaseOptionQuantity(isGroupSetGroup(group), group, groupIndex, item, itemIndex, groupsIndex, 'cart')"
                      :selectedOptionGroupName="convertSelectedOptionName(group)"
                      :deleteOptionItemByIndex="() => deleteOptionItemByIndex(groupsIndex, group as CartProductOptionGroupType, groupIndex, item as OptionType)"
                      :t="t"
                      :isNoLimitOne="isNoLimitOne(item)"
                      :isNoPrice="isNoPrice(item.isProduct, item)"
                      :optionItemName="convertItemName(item)"
                      :optionItemPrice="convertItemPrice(item, groupsIndex)"
                      :optionItemQuantity="convertItemQuantity(item, groupsIndex)"
                    />
                  </template>
                </template>
              </template>
            </div>
          </div>
        </template>
      </HyattProductOptionBody>
    </main>
  </div>
</template>

<script setup lang='ts'>
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  computed,
  ComputedRef,
  Ref,
  ref,
  reactive,
  nextTick,
} from 'vue';
import { v4 } from 'uuid';
import { storeToRefs } from 'pinia';
import { scrollMove } from '@utils/scrollUtils';
import { pushPage } from '@utils/route.helper';
import { translateLanguage } from '@utils/langTransfer';
import {
  nullishCheck,
  getInitTableName,
  convertNodeListsToArray,
} from '@torder/common/utils';
import type {
  productType,
  productOptionType,
} from '@torder/common/interface/product';
import {
  CartProductOptionGroupType,
  cartProductType,
} from '@torder/common/interface/cartProduct';
import type { CartProductOptionType } from '@torder/common/interface/cartProduct';
import {
  CART,
  CHINESE_BUN,
  CHINESE_GAN,
  ENGLISH,
  HYATT,
  HYATT_IMAGE,
} from '@torder/common/constant';
import { useModal } from '@torder/common/composables';
import useTableStore from '@store/storeTable';
import useProductStore from '@store/storeProduct';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import { home } from '@router/routePaths';
import i18n from '@i18n';
import { HyattProductOptionGroupList } from '@containers';
import { useSecret } from '@composables/secret';
import {
  HyattProductOptionBody,
  HyattProductOptionSelectList,
  HyattProductOptionSelectedList,
  HyattSetProductOptionSelectedList,
} from '@components';

const {
  addCartProduct,
  multiIncreaseCartProductQuantity,
  pushUpItemIndex,
  replaceCartProduct,
} = useCartStore();
const { cartProducts } = storeToRefs(useCartStore());

const {
  buttonBackgroundColor,
  buttonFontColor,
  categoryBackgroundColor,
  categoryBackgroundImage,
  backgroundColor,
  getStoreInfo,
} = storeToRefs(useInitStore());

type CartItemType = productType | CartProductOptionType | CartProductOptionGroupType

type OptionType = CartProductOptionType | CartProductOptionGroupType

const { locale } = i18n.global;

const isOptionImageType = computed(() => getStoreInfo.value.optionLayout === HYATT_IMAGE);

const { t } = useI18n();

const {
  openModal,
  openAlert,
} = useModalStore();

const {
  modalState,
  open,
  close,
} = useModal();

const { tableInfo } = useTableStore();

const { onNextSecret } = useSecret();

const { productInfo } = useProductStore();

const onNextRoot = () => {
  pushPage(home);
};

const product: Ref<cartProductType> = ref({ ...productInfo });

const isProductSetMenu = computed(() => productInfo.isProductExist);

const selectedTopGroup: Ref<number> = ref(0);

const isGroupSetMenu = (group: CartItemType) => !group.isOptionExist && group.isProductExist && group.isProduct;

const isGroupSetGroup = (group: CartItemType) => !group.isOptionExist && group.isProductExist && !group.isProduct;

const isOptionProductType = (option: CartItemType) => option.isProduct && option.isOptionExist && !option.isProductExist;

const isOptionGroupType = (option: CartItemType) => option.isOptionExist && !option.isProductExist;

const isGroupType = (option: CartItemType) => !option.isProduct && (option.isOptionExist || option.isProductExist);

const isItemType = (option: CartItemType) => !option.isOptionExist && !option.isProductExist;

const isProductItemType = (option: CartItemType) => option.isProduct && !option.isOptionExist && !option.isProductExist;

const isOptionItemType = (option: CartItemType) => !option.isProduct && !option.isOptionExist && !option.isProductExist;

const isProductSoldOut = (product: CartItemType) => {
  if (isOptionProductType(product)) {
    const optionProduct = product as productType;

    return optionProduct.productSale === 1;
  }

  if (isGroupType(product)) return false;

  if (isProductItemType(product)) {
    const singleProduct = product as productType;

    return singleProduct.productSale === 1;
  }

  const optionItem = product as CartProductOptionType;

  // 옵션아이템은 0이 품절
  return optionItem.isSale === 0;
};

const validationImg = (url: string): boolean => {
  const regex = /https?:\/\/.*\.(svg$|jpg$|jpeg$|png$|gif$|webp$)/i;
  const isImage = regex.test(url);

  return isImage;
};

const isItemImg = (item: CartItemType) => {
  const { image } = item;
  const notEmpty = { empty: false };
  const isImage = validationImg(image);

  if (isImage) return notEmpty;
  const empty = { empty: true };

  return empty;
};

function convertOptionItems(item: OptionType, itemIndex: number): OptionType {
  if (isOptionGroupType(item)) {
    const groupType = item as CartProductOptionGroupType;
    // eslint-disable-next-line no-use-before-define
    return convertOptions(groupType, itemIndex);
  }

  return {
    ...item,
    checked: item.isPreSet ? true : item.checked ?? false,
    quantity: 1,
    isOrder: item.isOrder ?? false,
    isProduct: item.isProduct ?? false,
    isProductExist: item.isProductExist ?? false,
    isOptionExist: item.isOptionExist ?? false,
    isOptionProduct: (item.isProduct && item.isOptionExist) ?? false,
  } as CartProductOptionType;
}

function convertOptions(option: CartProductOptionGroupType | CartProductOptionType, optionIndex: number) {
  if (isOptionItemType(option)) {
    return {
      ...option,
      checked: option.isPreSet ? true : option.checked ?? false,
      quantity: 1,
    } as CartProductOptionType;
  }
  const group = option as CartProductOptionGroupType;

  const options = group.items as OptionType[];

  return {
    ...option,
    checked: option.isPreSet ? true : option.checked ?? false,
    quantity: 1,
    items: options?.map((item, itemIndex) => {
      if (isItemType(item)) {
        return {
          ...item,
          checked: item.isPreSet ? true : item.checked ?? false,
          quantity: 1,
        } as CartProductOptionType;
      }
      const newOption = {
        ...item,
        index: group.index ? `${group.index}-${String(optionIndex + 1)}` : String(optionIndex + 1),
      } as CartProductOptionGroupType;

      return convertOptionItems(newOption, itemIndex);
    }),
    isOrder: option.isOrder ?? false,
    isProduct: option.isProduct ?? false,
    isProductExist: option.isProductExist ?? false,
    isOptionExist: option.isOptionExist ?? false,
    id: v4(),
    index: group.index && isProductSetMenu.value ? `${group.index}-${String(optionIndex + 1)}` : String(optionIndex + 1),
    isOptionProduct: (option.isProduct && option.isOptionExist) ?? false,
    isGroupSelected: false,
  } as CartProductOptionGroupType;
}

function convertProductItems(item: productType | CartProductOptionGroupType, itemIndex: number, groupsIndex: number, index: string):(productType | CartProductOptionGroupType) {
  if (isGroupSetGroup(item)) {
    const productGroup = item as CartProductOptionGroupType;

    const products = productGroup.items as (productType | CartProductOptionGroupType)[];

    return {
      ...productGroup,
      checked: productGroup.isPreSet ? true : productGroup.checked ?? false,
      items: products?.map((optionProduct, optionProductIndex) => convertProductItems(optionProduct, optionProductIndex, groupsIndex, `${String(groupsIndex + 1)}-${String(itemIndex + 1)}`)),
      isOrder: productGroup.isOrder ?? false,
      isProduct: productGroup.isProduct ?? false,
      isProductExist: productGroup.isProductExist ?? false,
      isOptionExist: productGroup.isOptionExist ?? false,
      id: v4(),
      index: index ? `${index}-${String(itemIndex + 1)}` : `${String(itemIndex + 1)}`,
      isOptionProduct: (productGroup.isProduct && productGroup.isOptionExist) ?? false,
      isGroupSelected: false,
    } as CartProductOptionGroupType;
  }

  const product = item as productType;

  const options = product.option as OptionType[];

  return {
    ...product,
    option: options.map((option, optionIndex) => {
      if (isItemType(option)) {
        return {
          ...option,
          checked: option.isPreSet ? true : option.checked ?? false,
          quantity: 1,
        } as CartProductOptionType;
      }
      const groupType = option as CartProductOptionGroupType;
      const newOption = {
        ...groupType,
        index: groupType.index ? `${index}-${String(itemIndex + 1)}` : `${String(itemIndex + 1)}`,
        isGroupSelected: false,
      } as CartProductOptionGroupType;
      return convertOptions(newOption, optionIndex);
    }) as productOptionType[],
    checked: product.isPreSet ? true : product.checked ?? false,
    quantity: 1,
    isOrder: product.isOrder ?? false,
    isProduct: product.isProduct ?? false,
    isProductExist: product.isProductExist ?? false,
    isOptionExist: product.isOptionExist ?? false,
    isOptionProduct: (product.isProduct && product.isOptionExist) ?? false,
  } as productType;
}

function convertProducts(productGroup: CartProductOptionGroupType | productType, groupIndex: number) {
  if (isProductItemType(productGroup)) {
    return {
      ...productGroup,
      quantity: productGroup.quantity ?? 1,
      checked: productGroup.isPreSet ? true : productGroup.checked ?? false,
      isOrder: productGroup.isOrder ?? false,
      isProduct: productGroup.isProduct ?? false,
      isProductExist: productGroup.isProductExist ?? false,
      isOptionExist: productGroup.isOptionExist ?? false,
      isOptionProduct: (productGroup.isProduct && productGroup.isOptionExist) ?? false,
    } as productType;
  }

  if (isOptionProductType(productGroup)) {
    const optionProduct = productGroup as productType;
    const options = optionProduct.option as (CartProductOptionGroupType | CartProductOptionType)[];

    optionProduct.option = options.map(convertOptions) as (productOptionType | CartProductOptionType)[];
  }

  const group = productGroup as CartProductOptionGroupType;

  const products = group.items as (productType | CartProductOptionGroupType)[];

  return {
    ...group,
    checked: group.isPreSet ? true : group.checked ?? false,
    items: products?.map((optionProduct, optionProductIndex) => convertProductItems(optionProduct, optionProductIndex, groupIndex, String(groupIndex + 1))),
    isOrder: group.isOrder ?? false,
    isProduct: group.isProduct ?? false,
    isProductExist: group.isProductExist ?? false,
    isOptionExist: group.isOptionExist ?? false,
    id: v4(),
    index: String(groupIndex + 1),
    isOptionProduct: (group.isProduct && group.isOptionExist) ?? false,
    isGroupSelected: false,
  };
}

productInfo.products = productInfo?.products?.map(convertProducts);
productInfo.options = productInfo?.options?.map(convertOptions);

// 실 데이터
const realProductGroups: Ref<(CartProductOptionGroupType | productType)[]> = ref({ ...productInfo }.products);
const realOptionGroups: Ref<(CartProductOptionGroupType | CartProductOptionType)[]> = ref({ ...productInfo }.options);

// 세트 구성 변경하러 들어온 경우 체크된 그룹 세팅
const route = useRoute();

const {
  changedOption,
  targetIndex,
} = route.params;

const isChangedOption = changedOption === '1';

// 사용자 UI
const showGroups = ref<(CartProductOptionGroupType[])[]>(isProductSetMenu.value ? [...realProductGroups.value].map((group, groupIndex) => {
  if (isItemType(group)) return [] as CartProductOptionGroupType[];

  if (isOptionProductType(group)) {
    const optionItemType = group as productType;

    const optionGroup = reactive(
      {
        name: optionItemType.productLanguageShort.ko,
        require: optionItemType.option.some((option) => {
          if (!option.isProduct && !option.isOptionExist && !option.isProductExist) return true;
          const optionGroup = option as productOptionType;
          return optionGroup.require === 1;
        }) ? 1 : 0,
        minLimitSelect: optionItemType.option.reduce((acc, cur) => {
          if (!cur.isProduct && !cur.isOptionExist && !cur.isProductExist) return acc;
          const optionGroup = cur as productOptionType;
          if (optionGroup.require === 1) return acc + 1;
          return acc;
        }, 0) || 1,
        maxLimitSelect: 0,
        minLimitQty: 0,
        maxLimitQty: 0,
        requireFlag: optionItemType.option.some((option) => {
          if (!option.isProduct && !option.isOptionExist && !option.isProductExist) return true;
          const optionGroup = option as productOptionType;
          return optionGroup.require === 1;
        }) ? 1 : 0,
        sort: 0,
        items: optionItemType.option,
        quantity: 1,
        nameArray: optionItemType.productLanguageShort,
        isProductExist: optionItemType.isProductExist,
        isOptionExist: optionItemType.isOptionExist,
        isProduct: false,
        checked: optionItemType.checked,
        id: optionItemType.productCode,
        parentGroupId: productInfo.id,
        index: String(groupIndex),
        isOptionProduct: true,
        isPreSet: optionItemType.isPreSet,
        isGroupSelected: false,
      } as CartProductOptionGroupType,
    );

    return [optionGroup];
  }

  const groupType = group as CartProductOptionGroupType;

  return [groupType];
}) : [...realOptionGroups.value].map((group) => {
  if (isItemType(group)) return [] as CartProductOptionGroupType[];

  const groupType = group as CartProductOptionGroupType;
  return [groupType];
}));

// 선택완료된 장바구니
const optionPageCart = ref<((CartItemType)[])[]>(isProductSetMenu.value ? realProductGroups.value.map(() => []) : realOptionGroups.value.map(() => []));

const selectShowGroups = computed(() => showGroups.value[selectedTopGroup.value]);
const currentNavigationIndex: Ref<number> = ref(0);

const navigationScrollMove = (group: CartProductOptionGroupType, groupsIndex: number) => {
  const findTargetIndex = optionPageCart.value[groupsIndex].findIndex((item) => {
    if (item.isProduct) return false;

    if (!item.isOptionExist && !item.isProductExist) return false;

    const groupType = item as CartProductOptionGroupType;

    return group.id === groupType.id;
  });

  const scrollParent = document.querySelector('.navigation-wrap') as HTMLElement;

  const targetLists = [...convertNodeListsToArray(document.querySelectorAll('.navigation-button'))] as HTMLElement[];

  targetLists.forEach((group) => group.setAttribute('class', group.className));

  const targetElementIndex = targetLists.findIndex((list) => list.id === group.id);

  const targetElement = targetLists[targetElementIndex];

  if (targetElement) {
    targetElement.setAttribute('class', `navigation-button select ${findTargetIndex < 0 ? '' : 'finish'}`);

    scrollMove({
      parent: scrollParent,
      child: targetElement,
      direction: 'left',
      behavior: 'smooth',
      type: HYATT,
    });
  }
};

const optionMove = async (group: CartProductOptionGroupType, groupsIndex: number) => {
  const targetGroupIndex = showGroups.value[groupsIndex].findIndex((list) => list.id === group.id);
  const targetGroup = showGroups.value[groupsIndex][targetGroupIndex];

  if (targetGroupIndex < 0) return;
  selectedTopGroup.value = groupsIndex;
  currentNavigationIndex.value = targetGroupIndex;
  await nextTick();
  const targetList = [...convertNodeListsToArray(document.querySelectorAll('.select-wrap'))] as HTMLElement[];
  const targetElement = targetList.find(((list) => list.id === targetGroup.id));

  if (targetElement) {
    navigationScrollMove(group, groupsIndex);
  }
};

const changeSelectOptionIndex = (selectGroupIndex: number): void => {
  selectedTopGroup.value = selectGroupIndex;

  if (selectShowGroups.value.length === 0) {
    if (isProductSetMenu.value) {
      const targetProductGroup = realProductGroups.value[selectedTopGroup.value] as CartProductOptionGroupType;
      showGroups.value[selectedTopGroup.value].push({
        ...targetProductGroup,
        items: targetProductGroup.items.map((item) => {
          const list = item;
          list.checked = false;
          return list;
        }),
        parentGroupId: targetProductGroup.id,
      });
      return;
    }

    const targetOptionGroup = realOptionGroups.value[selectedTopGroup.value] as CartProductOptionGroupType;

    showGroups.value[selectedTopGroup.value].push({
      ...targetOptionGroup,
      items: targetOptionGroup.items.map((item) => {
        const list = item;
        list.checked = false;
        return list;
      }),
      parentGroupId: targetOptionGroup.id,
    });
  }

  currentNavigationIndex.value = 0;
  navigationScrollMove(showGroups.value[selectedTopGroup.value][0], selectGroupIndex);
};

const isTopGroupSelectedOptionCart = (topGroupIndex: number) => optionPageCart.value[topGroupIndex].length > 0;

const moveTopGroupIndex = () => {
  const lastTopGroupIndex = showGroups.value.length - 1;
  const findTopGroupIndex = showGroups.value.findIndex((_, groupsIndex) => !isTopGroupSelectedOptionCart(groupsIndex));

  const isAllGroupInOptionCart = showGroups.value.every((_, groupsIndex) => isTopGroupSelectedOptionCart(groupsIndex));

  if (isAllGroupInOptionCart) open();

  if (findTopGroupIndex < 0) {
    selectedTopGroup.value += 1;
  } else {
    selectedTopGroup.value = findTopGroupIndex;
  }

  if (selectedTopGroup.value > lastTopGroupIndex) {
    selectedTopGroup.value = lastTopGroupIndex;
  }

  changeSelectOptionIndex(selectedTopGroup.value);
};

const pushSelectShowGroups = (group: CartProductOptionGroupType, groupsIndex: number) => {
  const findFirstIndex = showGroups.value[groupsIndex].findIndex((showGroup) => showGroup.id === group.parentGroupId);
  const targetGroupDepth = group.index.length >= 3 ? group.index.slice(0, -2) : group.index;
  const targetGroupDepthIndex = Number(group.index.slice(-1));
  const lastIndex = showGroups.value[groupsIndex].length - 1;
  const isFindNotLast = lastIndex !== findFirstIndex;

  const reverseShowGroups = [...showGroups.value[groupsIndex]].reverse();
  const findSameDepthReverseIndex = reverseShowGroups.findIndex((showGroup) => {
    const currentGroupDepth = showGroup.index.length >= 3 ? showGroup.index.slice(0, -2) : showGroup.index;
    return targetGroupDepth === currentGroupDepth;
  });

  if (findFirstIndex >= 0 && isFindNotLast) {
    if (findSameDepthReverseIndex < 0) {
      const findParentGroupIndex = showGroups.value[groupsIndex].findIndex((group) => group.index === targetGroupDepth);
      showGroups.value[groupsIndex].splice(findParentGroupIndex + 1, 0, group);
      return;
    }

    let insertFlag = false;

    const insertIndex = showGroups.value[groupsIndex].findIndex(((showGroup, index) => {
      const isAfterFindFirstIndex = (index >= findFirstIndex);

      const currentGroupDepth = showGroup.index.length >= 3 ? showGroup.index.slice(0, -2) : showGroup.index;
      const currentGroupDepthIndex = showGroup.index.length < group.index.length ? 0 : Number(showGroup.index.slice(-1));

      const isDepthLowerThanTarget = (currentGroupDepthIndex < targetGroupDepthIndex);
      const isCurrentDepthSame = (targetGroupDepth === currentGroupDepth);

      const nextGroup = showGroups.value[groupsIndex][index + 1] as CartProductOptionGroupType;
      if (!nextGroup) return isAfterFindFirstIndex && isDepthLowerThanTarget;
      const nextGroupDepth = nextGroup.index.length >= 3 ? nextGroup.index.slice(0, -2) : nextGroup.index;
      const nextGroupDepthIndex = nextGroup.index.length < group.index.length ? 0 : Number(nextGroup.index.slice(-1));
      const isNextDepthSame = (targetGroupDepth === nextGroupDepth);

      if (!isNextDepthSame) {
        const lastContainTargetIndexGroupIndex = showGroups.value[groupsIndex].findIndex((searchGroup) => {
          if (isItemType(searchGroup)) return false;

          const groupType = searchGroup as CartProductOptionGroupType;

          const isDepthContain = (groupType.index.length === group.index.length) && (Number(groupType.index.slice(-1)) > targetGroupDepthIndex);

          return isDepthContain;
        });

        const isFindLastContainIndex = lastContainTargetIndexGroupIndex >= 0 && (index >= lastContainTargetIndexGroupIndex);

        if (isFindLastContainIndex) insertFlag = true;
        return isAfterFindFirstIndex && isFindLastContainIndex;
      }

      const isNextDepthHigherThanTarget = (nextGroupDepthIndex > targetGroupDepthIndex);

      if (!isCurrentDepthSame) {
        return isAfterFindFirstIndex && isNextDepthSame && isNextDepthHigherThanTarget;
      }

      return isAfterFindFirstIndex && isDepthLowerThanTarget && isNextDepthSame && isNextDepthHigherThanTarget;
    }));

    if (insertIndex < 0) {
      showGroups.value[groupsIndex].push(group);
      return;
    }

    showGroups.value[groupsIndex].splice(insertFlag ? insertIndex : insertIndex + 1, 0, group);
  } else {
    showGroups.value[groupsIndex].push(group);
  }
};

// 프리셋, 선택옵션 변경 관련 로직
const recursiveGroupPush = (group: CartProductOptionGroupType, groupsIndex: number, isPreSet: boolean) => {
  group.items.forEach((item) => {
    if (!item.checked) return;
    if (isItemType(item)) return;

    if (isOptionProductType(item)) {
      const optionProductType = item as productType;

      const optionGroup = reactive(
        {
          name: optionProductType.productLanguageShort.ko,
          require: optionProductType.option.some((option) => {
            if (!option.isProduct && !option.isOptionExist && !option.isProductExist) return true;
            const optionGroup = option as productOptionType;
            return optionGroup.require === 1;
          }) ? 1 : 0,
          minLimitSelect: optionProductType.option.reduce((acc, cur) => {
            if (!cur.isProduct && !cur.isOptionExist && !cur.isProductExist) return acc;
            const optionGroup = cur as productOptionType;
            if (optionGroup.require === 1) return acc + 1;
            return acc;
          }, 0) || 1,
          maxLimitSelect: 0,
          minLimitQty: 0,
          maxLimitQty: 0,
          requireFlag: optionProductType.option.some((option) => {
            if (!option.isProduct && !option.isOptionExist && !option.isProductExist) return true;
            const optionGroup = option as productOptionType;
            return optionGroup.require === 1;
          }) ? 1 : 0,
          sort: 0,
          items: optionProductType.option.filter(((option) => {
            if (!option.isOptionExist && !option.isProductExist) return option as CartProductOptionType;

            const groupType = option as CartProductOptionGroupType;

            return groupType.isType === 'G';
          })),
          quantity: 1,
          nameArray: optionProductType.productLanguageShort,
          isProductExist: optionProductType.isProductExist,
          isOptionExist: optionProductType.isOptionExist,
          isProduct: false,
          checked: isPreSet ? optionProductType.isPreSet : optionProductType.checked,
          id: optionProductType.productCode,
          parentGroupId: productInfo.id,
          index: group.index,
          isOptionProduct: true,
          isPreSet: optionProductType.isPreSet,
          isGroupSelected: false,
        } as CartProductOptionGroupType,
      );

      optionProductType.option.forEach((option) => {
        if (!option.isOptionExist && !option.isProductExist) return;

        const groupType = option as CartProductOptionGroupType;

        if (groupType.isType === 'G') return;

        optionGroup.require = groupType.require;
        optionGroup.requireFlag = groupType.requireFlag;

        if (optionGroup.items.length === 0) {
          optionGroup.minLimitSelect = groupType.minLimitSelect;
          optionGroup.minLimitQty = groupType.minLimitQty;
          optionGroup.maxLimitSelect = groupType.maxLimitSelect;
          optionGroup.maxLimitQty = groupType.maxLimitQty;
        } else {
          optionGroup.minLimitSelect += groupType.minLimitSelect;
          optionGroup.minLimitQty += groupType.minLimitQty;
          optionGroup.maxLimitSelect += groupType.maxLimitSelect;
          optionGroup.maxLimitQty += groupType.maxLimitQty;
        }

        optionGroup.items.push(...groupType.items);
      });

      if (isPreSet && optionGroup.isPreSet) {
        optionGroup.isGroupSelected = true;
      }

      showGroups.value[groupsIndex].push(optionGroup);
      optionMove(optionGroup, groupsIndex);
      if (optionGroup.checked) recursiveGroupPush(optionGroup, groupsIndex, isPreSet);
      return;
    }

    const groupType = item as CartProductOptionGroupType;

    if (isPreSet && groupType.isPreSet) {
      groupType.isGroupSelected = true;
    }

    showGroups.value[groupsIndex].push(groupType);
    optionMove(groupType, groupsIndex);
    if (groupType.checked) recursiveGroupPush(groupType, groupsIndex, isPreSet);
  });

  const checkedItems = group.items.filter((item) => item.checked);

  const allItemsProductOrItemType = checkedItems.length > 0 ? checkedItems.every((item) => isItemType(item)) : false;

  if (allItemsProductOrItemType) {
    if (isProductSetMenu.value) {
      const targetTopGroup = realProductGroups.value[groupsIndex];
      if (isProductItemType(targetTopGroup)) return;
      const productGroupType = targetTopGroup as CartProductOptionGroupType;
      productGroupType.isGroupSelected = true;
      optionPageCart.value[groupsIndex].push(...JSON.parse(JSON.stringify(showGroups.value[groupsIndex])));
      moveTopGroupIndex();
    } else {
      const targetTopGroup = realOptionGroups.value[groupsIndex];
      if (isOptionItemType(targetTopGroup)) return;
      const productGroupType = targetTopGroup as CartProductOptionGroupType;
      productGroupType.isGroupSelected = true;
      optionPageCart.value[groupsIndex].push(...JSON.parse(JSON.stringify(showGroups.value[groupsIndex])));
      moveTopGroupIndex();
    }
  }
};

const setCheckedGroupToShowGroups = (isPreSet: boolean) => {
  if (isProductSetMenu.value) {
    realProductGroups.value.forEach((group, groupIndex) => {
      if (isItemType(group)) return;

      if (isOptionProductType(group)) {
        const optionProductType = group as productType;

        const optionGroup = reactive(
          {
            name: optionProductType.productLanguageShort.ko,
            require: optionProductType.option.some((option) => {
              if (!option.isProduct && !option.isOptionExist && !option.isProductExist) return true;
              const optionGroup = option as productOptionType;
              return optionGroup.require === 1;
            }) ? 1 : 0,
            minLimitSelect: optionProductType.option.reduce((acc, cur) => {
              if (!cur.isProduct && !cur.isOptionExist && !cur.isProductExist) return acc;
              const optionGroup = cur as productOptionType;
              if (optionGroup.require === 1) return acc + 1;
              return acc;
            }, 0) || 1,
            maxLimitSelect: 0,
            minLimitQty: 0,
            maxLimitQty: 0,
            requireFlag: optionProductType.option.some((option) => {
              if (!option.isProduct && !option.isOptionExist && !option.isProductExist) return true;
              const optionGroup = option as productOptionType;
              return optionGroup.require === 1;
            }) ? 1 : 0,
            sort: 0,
            items: optionProductType.option,
            quantity: 1,
            nameArray: optionProductType.productLanguageShort,
            isProductExist: optionProductType.isProductExist,
            isOptionExist: optionProductType.isOptionExist,
            isProduct: false,
            checked: isPreSet ? optionProductType.isPreSet : optionProductType.checked,
            id: optionProductType.productCode,
            parentGroupId: productInfo.id,
            index: String(groupIndex + 1),
            isOptionProduct: true,
            isPreSet: optionProductType.isPreSet,
            isGroupSelected: false,
          } as CartProductOptionGroupType,
        );

        if (optionGroup.checked) recursiveGroupPush(optionGroup, groupIndex, isPreSet);
        return;
      }

      const productGroup = group as CartProductOptionGroupType;

      if (productGroup.checked) recursiveGroupPush(productGroup, groupIndex, isPreSet);
    });
  } else {
    realOptionGroups.value.forEach((group, groupIndex) => {
      if (isItemType(group)) return;

      const optionGroup = group as CartProductOptionGroupType;
      if (optionGroup.checked) recursiveGroupPush(optionGroup, groupIndex, isPreSet);
    });
  }
};

if (isChangedOption) setCheckedGroupToShowGroups(false);
else setCheckedGroupToShowGroups(true);

const selectOptionPageCartLength = computed(() => {
  if (!isProductSetMenu.value) {
    return optionPageCart.value
      .flatMap((cart) => cart)
      .flatMap((group) => {
        if (isItemType(group)) return [group];

        const groupType = group as CartProductOptionGroupType;

        return groupType.items;
      }).filter((group) => isItemType(group) && group.checked).length;
  }

  return optionPageCart.value.filter((group) => group.length > 0).length;
});

const selectCurrentShowGroup = computed(() => selectShowGroups.value[currentNavigationIndex.value]);

// 최상위 아이템 고정 상품으로 들어올 경우 바로 장바구니 넣는 로직
if (isProductSetMenu.value) {
  realProductGroups.value.forEach((group, groupIndex) => {
    if (!isProductItemType(group)) return;

    const topProduct = group as productType;
    open();

    topProduct.checked = true;

    optionPageCart.value[groupIndex].push(topProduct);
  });
} else {
  realOptionGroups.value.forEach((group, groupIndex) => {
    if (!isOptionItemType(group)) return;

    const topOptionItem = group as CartProductOptionType;
    open();

    topOptionItem.checked = true;

    optionPageCart.value[groupIndex].push(topOptionItem);
  });
}

const navigationSelect = (group: CartProductOptionGroupType, groupsIndex: number) => {
  optionMove(group, groupsIndex);
};

const checkOption = (group: CartProductOptionGroupType, groupsIndex: number) => {
  if (!group.checked) return false;

  if (isGroupSetGroup(group)) {
    const products = group.items as (productType | CartProductOptionGroupType)[];

    const selectCount = products.filter((item) => item.checked).length;

    const selectItemQty = products.filter((item) => item.checked).reduce((acc, item) => {
      if (isOptionProductType(item)) {
        const productType = item as productType;
        return acc + productType.quantity;
      }

      if (isGroupType(item)) return acc;

      const productType = item as productType;

      return acc + productType.quantity;
    }, 0);

    const isNoLimitSelect = group.maxLimitSelect === 0;
    const isNoLimitQty = group.maxLimitQty === 0;

    let isCheckSelect = false;
    let isCheckItemQty = false;

    if (selectCount === 0) isCheckSelect = true;
    else isCheckSelect = isNoLimitSelect ? group.minLimitSelect <= selectCount : group.minLimitSelect <= selectCount && group.maxLimitSelect >= selectCount;

    if (selectItemQty === 0) isCheckItemQty = true;
    else isCheckItemQty = isNoLimitQty ? group.minLimitQty <= selectItemQty : group.minLimitQty <= selectItemQty && group.maxLimitQty >= selectItemQty;

    if (!isCheckSelect || !isCheckItemQty) {
      const isHaveItemType = group.items.some((item) => isItemType(item));

      let moveCheckTarget = {} as CartProductOptionGroupType;

      if (isHaveItemType) moveCheckTarget = group;
      else {
        const noCheckFirstRequireItem = group.items.filter(((item) => {
          if (item.checked) return false;

          if (isOptionProductType(item)) return true;

          const groupType = item as CartProductOptionGroupType;

          return groupType.requireFlag === 1;
        })).map((item, itemIndex) => {
          if (isGroupType(item)) return item as CartProductOptionGroupType;

          const optionProduct = item as productType;

          const optionGroup = reactive(
            {
              name: optionProduct.productLanguageShort.ko,
              require: optionProduct.option.some((option) => {
                if (!option.isProduct && !option.isOptionExist && !option.isProductExist) return true;
                const optionGroup = option as productOptionType;
                return optionGroup.require === 1;
              }) ? 1 : 0,
              minLimitSelect: optionProduct.option.reduce((acc, cur) => {
                if (!cur.isProduct && !cur.isOptionExist && !cur.isProductExist) return acc;
                const optionGroup = cur as productOptionType;
                if (optionGroup.require === 1) return acc + 1;
                return acc;
              }, 0) || 1,
              maxLimitSelect: 0,
              minLimitQty: 0,
              maxLimitQty: 0,
              requireFlag: optionProduct.option.some((option) => {
                if (!option.isProduct && !option.isOptionExist && !option.isProductExist) return true;
                const optionGroup = option as productOptionType;
                return optionGroup.requireFlag === 1;
              }) ? 1 : 0,
              sort: 0,
              items: optionProduct.option.filter(((option) => {
                if (!option.isOptionExist && !option.isProductExist) return option as CartProductOptionType;

                const groupType = option as CartProductOptionGroupType;

                return groupType.isType === 'G';
              })),
              quantity: 1,
              nameArray: optionProduct.productLanguageShort,
              isProductExist: optionProduct.isProductExist,
              isOptionExist: optionProduct.isOptionExist,
              isProduct: false,
              isOrder: optionProduct.isOrder,
              checked: optionProduct.checked,
              id: optionProduct.productCode,
              parentGroupId: group.id,
              index: `${group.index}-${String(itemIndex + 1)}`,
              isOptionProduct: true,
              isPreSet: optionProduct.isPreSet,
              isGroupSelected: false,
            } as CartProductOptionGroupType,
          );

          optionProduct.option.forEach((option) => {
            if (!option.isOptionExist && !option.isProductExist) return;

            const groupType = option as CartProductOptionGroupType;

            if (groupType.isType === 'G') return;

            optionGroup.require = groupType.require;
            optionGroup.requireFlag = groupType.requireFlag;

            if (optionGroup.items.length === 0) {
              optionGroup.minLimitSelect = groupType.minLimitSelect;
              optionGroup.minLimitQty = groupType.minLimitQty;
              optionGroup.maxLimitSelect = groupType.maxLimitSelect;
              optionGroup.maxLimitQty = groupType.maxLimitQty;
            } else {
              optionGroup.minLimitSelect += groupType.minLimitSelect;
              optionGroup.minLimitQty += groupType.minLimitQty;
              optionGroup.maxLimitSelect += groupType.maxLimitSelect;
              optionGroup.maxLimitQty += groupType.maxLimitQty;
            }

            optionGroup.items.push(...groupType.items);
          });

          return optionGroup;
        })[0];

        moveCheckTarget = noCheckFirstRequireItem;
      }

      const isMinMaxSelectSame = moveCheckTarget.minLimitSelect === moveCheckTarget.maxLimitSelect;
      const isMinMaxQtySame = moveCheckTarget.minLimitQty === moveCheckTarget.maxLimitQty;

      if (locale.value === CHINESE_GAN || locale.value === CHINESE_BUN) {
        if (!isCheckSelect) {
          if (isNoLimitSelect || isMinMaxSelectSame) openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${t('종류')} ${moveCheckTarget.minLimitSelect}${t('개')}${isMinMaxSelectSame ? '' : t('이상')}`);
          else openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${t('종류')} ${moveCheckTarget.minLimitSelect} ~ ${moveCheckTarget.maxLimitSelect}${t('개 까지')}`);
        }

        if (!isCheckItemQty) {
          if (isNoLimitQty || isMinMaxQtySame) openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${moveCheckTarget.minLimitQty}${t('개')}${isMinMaxQtySame ? '' : t('이상')}`);
          else openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${moveCheckTarget.minLimitQty} ~ ${moveCheckTarget.maxLimitQty}${t('개 까지')}`);
        }
      } else if (locale.value === ENGLISH) {
        if (!isCheckSelect) {
          if (isNoLimitSelect || isMinMaxSelectSame) openAlert(`${t('선택 가능합니다.')}\n ${isMinMaxSelectSame ? '' : t('이상')} ${t('종류')} ${moveCheckTarget.minLimitSelect}${t('개')} ${t('에서')} ${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}.`);
          else openAlert(`${t('선택 가능합니다.')}\n ${t('종류')} ${moveCheckTarget.minLimitSelect} ~ ${moveCheckTarget.maxLimitSelect}${t('개 까지')} ${t('에서')} ${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}.`);
        }

        if (!isCheckItemQty) {
          if (isNoLimitQty || isMinMaxQtySame) openAlert(`${t('선택 가능합니다.')}\n ${isMinMaxSelectSame ? '' : t('이상')} ${moveCheckTarget.minLimitQty}${t('개')} ${t('에서')} ${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}.`);
          else openAlert(`${t('선택 가능합니다.')}\n ${moveCheckTarget.minLimitQty} ~ ${moveCheckTarget.maxLimitQty}${t('개 까지')} ${t('에서')} ${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}.`);
        }
      } else {
        if (!isCheckSelect) {
          if (isNoLimitSelect || isMinMaxSelectSame) openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${t('종류')} ${moveCheckTarget.minLimitSelect}${t('개')}${isMinMaxSelectSame ? '' : t('이상')} ${t('선택 가능합니다.')}`);
          else openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${t('종류')} ${moveCheckTarget.minLimitSelect} ~ ${moveCheckTarget.maxLimitSelect}${t('개 까지')} ${t('선택 가능합니다.')}`);
        }

        if (!isCheckItemQty) {
          if (isNoLimitQty || isMinMaxQtySame) openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${moveCheckTarget.minLimitQty}${t('개')}${isMinMaxQtySame ? '' : t('이상')} ${t('선택 가능합니다.')}`);
          else openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${moveCheckTarget.minLimitQty} ~ ${moveCheckTarget.maxLimitQty}${t('개 까지')} ${t('선택 가능합니다.')}`);
        }
      }

      const isExistGroup = showGroups.value[groupsIndex].findIndex((group) => group.id === moveCheckTarget.id);

      if (isExistGroup < 0) pushSelectShowGroups(moveCheckTarget, groupsIndex);
      optionMove(moveCheckTarget, groupsIndex);
      return true;
    }
  } else {
    const options = group.items as OptionType[];

    const selectCount = options.filter((item) => item.checked).length;

    const selectItemQty = options.filter((item) => item.checked).reduce((acc, item) => {
      if (isGroupType(item)) return acc;

      const itemType = item as CartProductOptionType;

      return acc + itemType.quantity;
    }, 0);

    const isNoLimitSelect = group.maxLimitSelect === 0;
    const isNoLimitQty = group.maxLimitQty === 0;

    let isCheckSelect = false;
    let isCheckItemQty = false;

    if (selectCount === 0) isCheckSelect = true;
    else isCheckSelect = isNoLimitSelect ? group.minLimitSelect <= selectCount : group.minLimitSelect <= selectCount && group.maxLimitSelect >= selectCount;

    if (selectItemQty === 0) isCheckItemQty = true;
    else isCheckItemQty = isNoLimitQty ? group.minLimitQty <= selectItemQty : group.minLimitQty <= selectItemQty && group.maxLimitQty >= selectItemQty;

    if (!isCheckSelect || !isCheckItemQty) {
      const isHaveItemType = group.items.some((item) => isItemType(item));

      let moveCheckTarget = {} as CartProductOptionGroupType;

      if (isHaveItemType) moveCheckTarget = group;
      else {
        const optionItems = group.items as CartProductOptionGroupType[];
        const noCheckFirstRequireItem = optionItems.filter(((item) => {
          if (item.checked) return false;

          if (item.isProduct) return false;

          const groupType = item as CartProductOptionGroupType;

          return groupType.requireFlag === 1;
        }))[0];

        moveCheckTarget = noCheckFirstRequireItem;
      }

      const isMinMaxSelectSame = moveCheckTarget.minLimitSelect === moveCheckTarget.maxLimitSelect;
      const isMinMaxQtySame = moveCheckTarget.minLimitQty === moveCheckTarget.maxLimitQty;

      if (locale.value === CHINESE_GAN || locale.value === CHINESE_BUN) {
        if (!isCheckSelect) {
          if (isNoLimitSelect || isMinMaxSelectSame) openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${t('종류')} ${moveCheckTarget.minLimitSelect}${t('개')}${isMinMaxSelectSame ? '' : t('이상')}`);
          else openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${t('종류')} ${moveCheckTarget.minLimitSelect} ~ ${moveCheckTarget.maxLimitSelect}${t('개 까지')}`);
        }

        if (!isCheckItemQty) {
          if (isNoLimitQty || isMinMaxQtySame) openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${moveCheckTarget.minLimitQty}${t('개')}${isMinMaxQtySame ? '' : t('이상')}`);
          else openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${moveCheckTarget.minLimitQty} ~ ${moveCheckTarget.maxLimitQty}${t('개 까지')}`);
        }
      } else if (locale.value === ENGLISH) {
        if (!isCheckSelect) {
          if (isNoLimitSelect || isMinMaxSelectSame) openAlert(`${t('선택 가능합니다.')}\n ${isMinMaxSelectSame ? '' : t('이상')} ${t('종류')} ${moveCheckTarget.minLimitSelect}${t('개')} ${t('에서')} ${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}.`);
          else openAlert(`${t('선택 가능합니다.')}\n ${t('종류')} ${moveCheckTarget.minLimitSelect} ~ ${moveCheckTarget.maxLimitSelect}${t('개 까지')} ${t('에서')} ${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}.`);
        }

        if (!isCheckItemQty) {
          if (isNoLimitQty || isMinMaxQtySame) openAlert(`${t('선택 가능합니다.')}\n ${isMinMaxSelectSame ? '' : t('이상')} ${moveCheckTarget.minLimitQty}${t('개')} ${t('에서')} ${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}.`);
          else openAlert(`${t('선택 가능합니다.')}\n ${moveCheckTarget.minLimitQty} ~ ${moveCheckTarget.maxLimitQty}${t('개 까지')} ${t('에서')} ${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}.`);
        }
      } else {
        if (!isCheckSelect) {
          if (isNoLimitSelect || isMinMaxSelectSame) openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${t('종류')} ${moveCheckTarget.minLimitSelect}${t('개')}${isMinMaxSelectSame ? '' : t('이상')} ${t('선택 가능합니다.')}`);
          else openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${t('종류')} ${moveCheckTarget.minLimitSelect} ~ ${moveCheckTarget.maxLimitSelect}${t('개 까지')} ${t('선택 가능합니다.')}`);
        }

        if (!isCheckItemQty) {
          if (isNoLimitQty || isMinMaxQtySame) openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${moveCheckTarget.minLimitQty}${t('개')}${isMinMaxQtySame ? '' : t('이상')} ${t('선택 가능합니다.')}`);
          else openAlert(`${translateLanguage(moveCheckTarget.nameArray, moveCheckTarget.name)}${t('에서')}\n ${moveCheckTarget.minLimitQty} ~ ${moveCheckTarget.maxLimitQty}${t('개 까지')} ${t('선택 가능합니다.')}`);
        }
      }
      const isExistGroup = showGroups.value[groupsIndex].findIndex((group) => group.id === moveCheckTarget.id);

      if (isExistGroup < 0) pushSelectShowGroups(moveCheckTarget, groupsIndex);
      optionMove(moveCheckTarget, groupsIndex);
      return true;
    }
  }

  return false;
};

const finishSelectOption = () => {
  const currentOptionCart = optionPageCart.value[selectedTopGroup.value];
  let stopFlag = false;

  const isLastDepth = selectCurrentShowGroup.value.items.every((item) => isItemType(item));

  selectShowGroups.value.forEach((group, index) => {
    if (isLastDepth && index < currentNavigationIndex.value - 1) return;
    if (!isLastDepth && index < currentNavigationIndex.value) return;
    if (stopFlag) return;

    stopFlag = checkOption(group, selectedTopGroup.value);
  });

  selectShowGroups.value.forEach((group, index) => {
    if (index >= currentNavigationIndex.value) return;
    if (stopFlag) return;

    stopFlag = checkOption(group, selectedTopGroup.value);
  });

  if (stopFlag) return;

  if (isProductSetMenu.value) currentOptionCart.splice(0, currentOptionCart.length);

  selectShowGroups.value.forEach((group) => {
    const targetGroup = group;
    targetGroup.isGroupSelected = true;

    const findIndex = currentOptionCart.findIndex((option) => {
      if (option.isProduct) {
        const productType = option as productType;

        return productType.productCode === targetGroup.id;
      }

      if (!option.isOptionExist && !option.isProductExist) {
        const optionItem = option as CartProductOptionType;

        return optionItem.code === targetGroup.id;
      }

      const groupType = option as CartProductOptionGroupType;

      return groupType.id === targetGroup.id;
    });

    if (findIndex >= 0 && !isProductSetMenu.value) {
      currentOptionCart.splice(findIndex, 1, JSON.parse(JSON.stringify(targetGroup)));
      return;
    }

    currentOptionCart.push(JSON.parse(JSON.stringify(targetGroup)));
  });

  moveTopGroupIndex();
};

const isFinishSelect = (group: CartProductOptionGroupType, topGroupIndex: number) => {
  const isHaveTopGroupInOptionCart = optionPageCart.value[topGroupIndex].length > 0;
  const options = group.items;
  const checkedOptions = options.filter((option) => option.checked);
  const isAnyChecked = checkedOptions.length > 0;
  const isOptionalGroup = group.requireFlag === 0;

  if (isOptionalGroup) return !isHaveTopGroupInOptionCart && !modalState.show;

  if (!isProductSetMenu.value) {
    const isCheckedOptionInOptionCart = checkedOptions.every((option) => {
      if (!isItemType(option)) return false;

      const optionItem = option as CartProductOptionType;

      const optionItemTypeCart = optionPageCart.value
        .flatMap((cart) => cart)
        .flatMap((group) => {
          if (isItemType(group)) return [group];

          const groupType = group as CartProductOptionGroupType;

          return groupType.items;
        }).filter((group) => isItemType(group) && group.checked);

      const isExistOptionCart = optionItemTypeCart.findIndex((item) => {
        if (!isItemType(option)) return false;
        if (isProductItemType(option)) return false;

        const itemType = item as CartProductOptionType;

        return optionItem.code === itemType.code;
      });

      return isExistOptionCart < 0;
    });

    return isAnyChecked && (isCheckedOptionInOptionCart || !group.isGroupSelected) && !modalState.show;
  }

  return isAnyChecked && !modalState.show && !group.isGroupSelected;
};

const getKeyFromCartItem = (item: CartItemType) => {
  if (item.isProduct) {
    const product = item as productType;

    return product.productCode;
  }

  if (isGroupType(item)) {
    const group = item as CartProductOptionGroupType;

    return group.id;
  }

  const optionItem = item as CartProductOptionType;
  return optionItem.code;
};

const convertItemName = (item: CartItemType) => {
  if (item.isProduct) {
    const targetProduct = item as productType;

    return translateLanguage(targetProduct.productLanguageShort, targetProduct.productLanguageShort.ko);
  }

  const targetOption = item as OptionType;

  return translateLanguage(targetOption.nameArray, targetOption.name);
};

const findOptionProductInParentGroupItems = (topGroupsIndex: number, parentId: string, id: string) => {
  const parentGroup = showGroups.value[topGroupsIndex].find((group) => group.id === parentId);

  if (!parentGroup) return undefined;

  const targetItem = parentGroup.items.find((item) => {
    if (!item.isProduct) return false;

    const product = item as productType;

    return product.productCode === id;
  });

  return targetItem as productType;
};

const convertItemPrice = (item: CartItemType, topGroupIndex: number) => {
  if (item.isProduct) {
    const targetProduct = item as productType;

    return targetProduct.price === 0 ? '' : `+${targetProduct?.price.toLocaleString()}`;
  }

  if (item.isOptionProduct) {
    const targetGroup = item as CartProductOptionGroupType;
    const {
      parentGroupId,
      id,
    } = targetGroup;
    const optionProduct = findOptionProductInParentGroupItems(topGroupIndex, parentGroupId, id);

    if (!optionProduct) return '';

    return optionProduct?.price === 0 ? '' : `+${optionProduct?.price.toLocaleString()}`;
  }

  if (!item.isOptionExist && !item.isProductExist) {
    const targetOption = item as OptionType;

    if (isOptionGroupType(targetOption)) return '';

    const optionItem = targetOption as CartProductOptionType;

    return optionItem?.price === 0 ? '' : `+${optionItem?.price.toLocaleString()}`;
  }

  return '';
};

const convertItemQuantity = (item: CartItemType, topGroupIndex: number) => {
  if (item.isProduct) {
    const targetProduct = item as productType;

    return targetProduct?.quantity;
  }

  if (item.isOptionProduct) {
    const targetGroup = item as CartProductOptionGroupType;
    const {
      parentGroupId,
      id,
    } = targetGroup;
    const optionProduct = findOptionProductInParentGroupItems(topGroupIndex, parentGroupId, id);

    if (!optionProduct) return 0;

    return optionProduct?.quantity;
  }

  if (!item.isOptionExist && !item.isProductExist) {
    const targetOption = item as OptionType;

    return targetOption?.quantity;
  }

  return 0;
};

const convertItemImage = (item: CartItemType) => {
  if (item.isProduct) {
    const targetProduct = item as productType;

    return targetProduct?.image;
  }

  const targetOption = item as OptionType;

  return targetOption?.image;
};

const convertSetSelectedOptionInfo = (item: CartItemType, topGroupIndex: number) => {
  const name = convertItemName(item);
  const quantity = convertItemQuantity(item, topGroupIndex);

  if (!name && !quantity) return '';

  const multiQuantity = quantity > 0 ? String(quantity) : '';

  if (multiQuantity) return `${name}(${multiQuantity}${t('개')})`;
  return `${name}`;
};

const isHasChildGroup = (group: CartProductOptionGroupType, selectItem: CartItemType) => {
  if (isGroupSetMenu(group)) {
    const targetProduct = selectItem as productType;

    return targetProduct.isOptionExist && targetProduct.option?.length > 0;
  }

  const targetOption = selectItem as OptionType;

  if (isOptionGroupType(targetOption)) return true;

  return false;
};

const isNoSelect = (group: CartProductOptionGroupType) => {
  if (isGroupSetMenu(group)) {
    const list = group.items as productType[];
    return list.every((item) => !item.checked);
  }

  const list = group.items as OptionType[];
  return list.every((item) => !item.checked);
};

const isNoLimitQty = (group: CartProductOptionGroupType) => group.maxLimitQty === 0;

const groupNameConvertor = (group: CartProductOptionGroupType, groupsIndex: number) => {
  if (selectedTopGroup.value === groupsIndex && currentNavigationIndex.value !== 0) {
    return `(${t('옵션 선택')})`;
  }

  if (group.isGroupSelected) {
    return `(${t('선택완료')})`;
  }

  if (isNoLimitQty(group)) {
    if (locale.value === ENGLISH) {
      return `(${`${t('선택')} ${group.items.length}${t('개')}`})`;
    }

    return `(${group.items.length}${t('개')} ${t('선택')})`;
  }

  if (locale.value === ENGLISH) {
    return `(${`${t('선택')} ${group.maxLimitQty}${t('개')}`})`;
  }

  return `(${group.maxLimitQty}${t('개')} ${t('선택')})`;
};

const optionCheckImage = (checked?: boolean): string => {
  if (checked) return 'https://static.torder.co.kr/torder2/icn_hyatt_check_white.svg';

  return 'https://static.torder.co.kr/torder2/restaurant-checkbox-white-34x34.svg';
};

const isSelectOptionRequire = (group: CartProductOptionGroupType) => {
  const isRequire = group.requireFlag === 1;
  return isRequire;
};

const getTotalPrice: ComputedRef<string> = computed(() => {
  const productOptionItemTotalPrice = optionPageCart.value.reduce((acc, cur) => acc + cur.reduce((groupOptionTotal, currentGroup) => {
    let currentGroupOptionTotalPrice = 0;

    if (isItemType(currentGroup)) {
      const itemType = currentGroup as productType | CartProductOptionType;
      currentGroupOptionTotalPrice += (itemType.price * itemType.quantity);

      return groupOptionTotal + currentGroupOptionTotalPrice;
    }

    if (isGroupSetGroup(currentGroup)) {
      const groupType = currentGroup as CartProductOptionGroupType;
      const products = groupType.items as (productType | CartProductOptionGroupType)[];

      currentGroupOptionTotalPrice += products.reduce((acc, current) => {
        if (!current.checked) return acc;
        if (isGroupSetGroup(current)) return acc;
        if (!current.isProduct) return acc;

        const product = current as productType;

        return acc + (product.price * product.quantity);
      }, 0);
    } else {
      const groupType = currentGroup as CartProductOptionGroupType;
      const options = groupType.items as OptionType[];

      currentGroupOptionTotalPrice += options.reduce((acc, current) => {
        if (!current.checked) return acc;
        if (isOptionGroupType(current)) return acc;
        if (current.isProduct) return acc;

        const optionItem = current as CartProductOptionType;
        return acc + (optionItem.price * optionItem.quantity);
      }, 0);
    }

    return groupOptionTotal + currentGroupOptionTotalPrice;
  }, 0), 0);

  const totalPrice = (product.value.price + productOptionItemTotalPrice) * product.value.quantity;

  return totalPrice.toLocaleString();
});

// 사용자 UI 그룹에서 재귀로 관련 옵션그룹에서 나온 자식들 전부 지우는 함수
const deleteRelateShowGroup = (option: CartProductOptionGroupType | productType, parentGroup: CartProductOptionGroupType, itemIndex: number) => {
  if (isOptionProductType(option)) {
    const optionProduct = option as productType;

    const optionGroup = reactive(
      {
        name: optionProduct.productLanguageShort.ko,
        require: optionProduct.option.some((option) => {
          if (!option.isProduct && !option.isOptionExist && !option.isProductExist) return true;
          const optionGroup = option as productOptionType;
          return optionGroup.require === 1;
        }) ? 1 : 0,
        minLimitSelect: optionProduct.option.reduce((acc, cur) => {
          if (!cur.isProduct && !cur.isOptionExist && !cur.isProductExist) return acc;
          const optionGroup = cur as productOptionType;
          if (optionGroup.require === 1) return acc + 1;
          return acc;
        }, 0) || 1,
        maxLimitSelect: 0,
        minLimitQty: 0,
        maxLimitQty: 0,
        requireFlag: optionProduct.option.some((option) => {
          if (!option.isProduct && !option.isOptionExist && !option.isProductExist) return true;
          const optionGroup = option as productOptionType;
          return optionGroup.requireFlag === 1;
        }) ? 1 : 0,
        items: optionProduct.option.filter(((option) => {
          if (!option.isOptionExist && !option.isProductExist) return option as CartProductOptionType;

          const groupType = option as CartProductOptionGroupType;

          return groupType.isType === 'G';
        })),
        quantity: 1,
        nameArray: optionProduct.productLanguageShort,
        isProductExist: optionProduct.isProductExist,
        isOptionExist: optionProduct.isOptionExist,
        isProduct: false,
        checked: optionProduct.checked,
        id: optionProduct.productCode,
        parentGroupId: parentGroup.id,
        index: `${parentGroup.index}-${String(itemIndex + 1)}`,
        isOptionProduct: true,
        isPreSet: optionProduct.isPreSet,
        isGroupSelected: false,
      } as CartProductOptionGroupType,
    );

    optionProduct.option.forEach((option) => {
      if (!option.isOptionExist && !option.isProductExist) return;

      const groupType = option as CartProductOptionGroupType;

      if (groupType.isType === 'G') return;

      optionGroup.require = groupType.require;
      optionGroup.requireFlag = groupType.requireFlag;

      if (optionGroup.items.length === 0) {
        optionGroup.minLimitSelect = groupType.minLimitSelect;
        optionGroup.minLimitQty = groupType.minLimitQty;
        optionGroup.maxLimitSelect = groupType.maxLimitSelect;
        optionGroup.maxLimitQty = groupType.maxLimitQty;
      } else {
        optionGroup.minLimitSelect += groupType.minLimitSelect;
        optionGroup.minLimitQty += groupType.minLimitQty;
        optionGroup.maxLimitSelect += groupType.maxLimitSelect;
        optionGroup.maxLimitQty += groupType.maxLimitQty;
      }

      optionGroup.items.push(...groupType.items);
    });

    deleteRelateShowGroup(optionGroup, parentGroup, itemIndex);
    return;
  }

  const optionGroup = option as CartProductOptionGroupType;

  const findIndex = selectShowGroups.value.findIndex((group) => group.id === optionGroup.id);

  if (findIndex < 0) return;

  selectShowGroups.value.splice(findIndex, 1);

  if (!isProductSetMenu.value) optionPageCart.value[selectedTopGroup.value].splice(findIndex, 1);

  const options = optionGroup.items as OptionType[];

  options.forEach((option, optionIndex) => {
    const list = option;
    list.checked = false;
    list.quantity = 1;

    if (!option.isOptionExist && !option.isProductExist) return;

    const groupOrOptionProduct = option as CartProductOptionGroupType | productType;

    deleteRelateShowGroup(groupOrOptionProduct, optionGroup, optionIndex);
  });
};

const convertSelectedOptionName = (item: CartItemType) => {
  if (item.isProduct) {
    const product = item as productType;

    return `${translateLanguage(product.productLanguageShort, product.productLanguageShort.ko)}`;
  }

  if (isOptionItemType(item)) {
    const optionItem = item as CartProductOptionType;

    return `${translateLanguage(optionItem.nameArray, optionItem.name)}`;
  }

  const groupType = item as CartProductOptionGroupType;

  return `${translateLanguage(groupType.nameArray, groupType.name)}`;
};

const deleteOptionGroupByIndex = (groupsIndex: number, group: CartItemType) => {
  if (isGroupType(group)) {
    const groupType = group as CartProductOptionGroupType;

    const targetShowGroupIndex = showGroups.value[groupsIndex].findIndex((showGroup) => showGroup.id === groupType.id);

    const targetGroup = showGroups.value[groupsIndex][targetShowGroupIndex];

    targetGroup.isGroupSelected = false;
    optionMove(groupType, groupsIndex);
  }

  const targetGroup = group;
  targetGroup.checked = false;

  // 해당 그룹 사용자 UI에서 그룹 체크 해제
  showGroups.value[groupsIndex]?.forEach((group) => {
    const showGroup = group;
    showGroup.items.forEach((item) => {
      const list = item;
      list.checked = false;
    });
  });

  if (!isItemType(group)) {
    showGroups.value[groupsIndex] = [showGroups.value[groupsIndex][0]];
  }

  // 옵션장바구니에서도 삭제
  optionPageCart.value[groupsIndex] = [];
};

const deleteTopGroupItemType = (item: productType | CartProductOptionType, groupsIndex: number) => {
  if (isProductSetMenu.value) {
    const product = item as productType;
    product.checked = false;
  } else {
    const optionItem = item as CartProductOptionType;
    optionItem.checked = false;
  }

  optionPageCart.value[groupsIndex] = [];
};

const findParentAndCheck = (group: CartProductOptionGroupType, groupsIndex: number) => {
  const target = group;

  target.checked = false;
  target.isGroupSelected = false;

  const targetParentGroup = showGroups.value[groupsIndex].find((showGroup) => showGroup.id === target.parentGroupId);

  if (targetParentGroup && isGroupType(targetParentGroup)) {
    const groupTypeTarget = targetParentGroup as CartProductOptionGroupType;

    groupTypeTarget.items.forEach((item) => {
      if (!isGroupType(item)) return;

      const optionGroup = item as CartProductOptionGroupType;

      if (optionGroup.id !== target.id) return;
      optionGroup.checked = false;
      optionGroup.isGroupSelected = false;
    });

    const isNoCheckedParentGroup = groupTypeTarget.items.every((item) => !item.checked);

    groupTypeTarget.checked = isNoCheckedParentGroup;

    if (isNoCheckedParentGroup) {
      const findParentIndex = optionPageCart.value[groupsIndex].findIndex((group) => {
        if (isItemType(group)) return false;

        const groupType = group as CartProductOptionGroupType;
        return groupType.id === targetParentGroup.id;
      });

      if (findParentIndex < 0) return;
      optionPageCart.value[groupsIndex].splice(findParentIndex, 1);
      findParentAndCheck(targetParentGroup, groupsIndex);
    }
  }
};

const deleteOptionItemByIndex = (groupsIndex: number, group: CartProductOptionGroupType, groupIndex: number, item: OptionType) => {
  const targetShowGroupIndex = showGroups.value[groupsIndex].findIndex((showGroup) => showGroup.id === group.id);

  const targetGroup = showGroups.value[groupsIndex][targetShowGroupIndex];

  targetGroup.isGroupSelected = false;

  const findItemIndex = targetGroup.items.findIndex((option) => {
    if (isGroupType(item) || isGroupType(option)) return false;

    const itemType = item as CartProductOptionType;
    const optionItemType = option as CartProductOptionType;

    return itemType.code === optionItemType.code;
  });

  if (findItemIndex >= 0) {
    targetGroup.items[findItemIndex].checked = false;
    targetGroup.items[findItemIndex].quantity = 1;
  }

  // 해당 그룹 사용자 UI에서 그룹 체크 해제
  const targetShowGroupItems = group.items as OptionType[];

  const targetItem = item;
  targetItem.checked = false;
  targetItem.quantity = 1;

  const isNoSelect = targetShowGroupItems.every((item) => !item.checked);

  if (isNoSelect) {
    const resetCheckUserUI = (item: CartItemType, itemIndex: number) => {
      const list = item;
      list.checked = false;
      list.quantity = 1;

      if (item.isOptionExist || item.isProductExist) {
        const groupType = item as CartProductOptionGroupType;

        deleteRelateShowGroup(groupType, group, itemIndex);
      }
    };

    findParentAndCheck(targetGroup, groupsIndex);

    targetGroup.items.forEach(resetCheckUserUI);
    optionPageCart.value[groupsIndex].splice(groupIndex, 1);

    if (!isProductSetMenu.value && optionPageCart.value[groupsIndex].length === 1) optionPageCart.value[groupsIndex] = [];

    if (optionPageCart.value[groupsIndex].length === 0) {
      selectedTopGroup.value = groupsIndex;
      currentNavigationIndex.value = 0;
    }
  }
};

const addCustomKeyOrPushShowGroup = async (group: CartProductOptionGroupType, item: CartItemType, itemIndex: number) => {
  if (isProductItemType(item)) {
    const product = item as productType;
    product.quantity = 1;
    product.parentGroupIndex = selectedTopGroup.value;
  } else if (isGroupSetGroup(item)) {
    const optionGroup = item as CartProductOptionGroupType;
    optionGroup.parentGroupId = group.id;
    if (optionGroup.checked) {
      pushSelectShowGroups(optionGroup, selectedTopGroup.value);
      if (selectShowGroups.value.length > 2) close();
      await nextTick();
      optionMove(optionGroup, selectedTopGroup.value);
    }
  } else if (isOptionGroupType(item)) {
    const haveOption = item as (CartProductOptionGroupType & productType);

    // 옵션상품일 경우
    if (haveOption.isProduct) {
      const optionProduct = haveOption as productType;

      const optionGroup = reactive(
        {
          name: optionProduct.productLanguageShort.ko,
          require: optionProduct.option.some((option) => {
            if (!option.isProduct && !option.isOptionExist && !option.isProductExist) return true;
            const optionGroup = option as productOptionType;
            return optionGroup.require === 1;
          }) ? 1 : 0,
          minLimitSelect: optionProduct.option.reduce((acc, cur) => {
            if (!cur.isProduct && !cur.isOptionExist && !cur.isProductExist) return acc;
            const optionGroup = cur as productOptionType;
            if (optionGroup.require === 1) return acc + 1;
            return acc;
          }, 0) || 1,
          maxLimitSelect: 0,
          minLimitQty: 0,
          maxLimitQty: 0,
          requireFlag: optionProduct.option.some((option) => {
            if (!option.isProduct && !option.isOptionExist && !option.isProductExist) return true;
            const optionGroup = option as productOptionType;
            return optionGroup.requireFlag === 1;
          }) ? 1 : 0,
          sort: 0,
          items: optionProduct.option.filter(((option) => {
            if (!option.isOptionExist && !option.isProductExist) return option as CartProductOptionType;

            const groupType = option as CartProductOptionGroupType;

            return groupType.isType === 'G';
          })),
          quantity: 1,
          nameArray: optionProduct.productLanguageShort,
          isProductExist: optionProduct.isProductExist,
          isOptionExist: optionProduct.isOptionExist,
          isProduct: false,
          isOrder: optionProduct.isOrder,
          checked: optionProduct.checked,
          id: optionProduct.productCode,
          parentGroupId: group.id,
          index: `${group.index}-${String(itemIndex + 1)}`,
          isOptionProduct: true,
          isPreSet: optionProduct.isPreSet,
          isGroupSelected: false,
        } as CartProductOptionGroupType,
      );

      optionProduct.option.forEach((option) => {
        if (!option.isOptionExist && !option.isProductExist) return;

        const groupType = option as CartProductOptionGroupType;

        if (groupType.isType === 'G') return;

        optionGroup.require = groupType.require;
        optionGroup.requireFlag = groupType.requireFlag;

        if (optionGroup.items.length === 0) {
          optionGroup.minLimitSelect = groupType.minLimitSelect;
          optionGroup.minLimitQty = groupType.minLimitQty;
          optionGroup.maxLimitSelect = groupType.maxLimitSelect;
          optionGroup.maxLimitQty = groupType.maxLimitQty;
        } else {
          optionGroup.minLimitSelect += groupType.minLimitSelect;
          optionGroup.minLimitQty += groupType.minLimitQty;
          optionGroup.maxLimitSelect += groupType.maxLimitSelect;
          optionGroup.maxLimitQty += groupType.maxLimitQty;
        }

        optionGroup.items.push(...groupType.items);
      });

      if (haveOption.checked) {
        pushSelectShowGroups(optionGroup, selectedTopGroup.value);
        if (selectShowGroups.value.length > 2) close();
        await nextTick();
        if (optionProduct.ogSelectAuto) {
          const groupItems = optionGroup.items;
          const firstItem = groupItems[0];

          if (isGroupType(firstItem)) {
            const groupType = firstItem as CartProductOptionGroupType;
            pushSelectShowGroups(groupType, selectedTopGroup.value);
            await nextTick();
            optionMove(groupType, selectedTopGroup.value);
          } else {
            optionMove(optionGroup, selectedTopGroup.value);
          }
        } else {
          optionMove(optionGroup, selectedTopGroup.value);
        }
      }
    } else {
      const optionGroup = haveOption as CartProductOptionGroupType;
      optionGroup.parentGroupId = group.id;
      if (haveOption.checked) {
        pushSelectShowGroups({
          ...optionGroup,
          index: `${group.index}-${String(itemIndex + 1)}`,
        }, selectedTopGroup.value);
        if (selectShowGroups.value.length > 2) close();
        await nextTick();
        optionMove(optionGroup, selectedTopGroup.value);
      }
    }
  } else {
    // 옵션아이템일 경우
    const option = item as CartProductOptionType;
    option.quantity = 1;
    option.parentGroupIndex = selectedTopGroup.value;
  }
};

const deleteRelateGroupsInItems = (group: CartProductOptionGroupType, itemIndex: number, isDeleteAll = false) => {
  const groupItems = group.items as CartItemType[];
  const resetCheckUserUI = (item: CartItemType, itemIndex: number) => {
    const list = item;
    list.checked = false;
    list.quantity = 1;

    // 상품그룹일 경우
    if (isGroupSetGroup(item)) {
      const productGroup = item as CartProductOptionGroupType;
      deleteRelateShowGroup(productGroup, group, itemIndex);
      return;
    }

    if (isOptionGroupType(item)) {
      const haveOption = item as (CartProductOptionGroupType & productType);

      // 옵션그룹 또는 옵션상품일 경우
      deleteRelateShowGroup(haveOption, group, itemIndex);
    }
  };

  const nonCheckGroupItems = groupItems.filter((list) => {
    if (isDeleteAll) return true;
    return !list.checked;
  });
  nonCheckGroupItems.forEach(resetCheckUserUI);
};

const noSelectOption = (group: CartProductOptionGroupType, groupIndex: number, itemIndex: number) => {
  currentNavigationIndex.value = groupIndex;
  const targetGroup = group;
  const isGroupExistOptionCart = optionPageCart.value.find((topGroup) => {
    const findGroup = topGroup.find((group) => {
      if (isItemType(group)) return false;

      const groupType = group as CartProductOptionGroupType;

      return groupType.id === targetGroup.id;
    });

    return findGroup;
  });

  if (isGroupExistOptionCart) {
    openAlert(t('선택완료한 옵션입니다.'));
    return;
  }

  deleteRelateGroupsInItems(group, itemIndex, true);
};

const itemCheckChangeOnlyOneLimit = (group: CartProductOptionGroupType) => {
  const {
    minLimitQty,
    minLimitSelect,
    maxLimitQty,
    maxLimitSelect,
  } = group;

  const isOnlyOneLimit = minLimitQty === 1 && minLimitSelect === 1 && maxLimitSelect === 1 && maxLimitQty === 1;

  if (!isOnlyOneLimit) return;

  group.items.forEach((item, itemIndex) => {
    const option = item;
    if (!option.checked) return;
    deleteRelateGroupsInItems(group, itemIndex, true);
  });
};

const selectOption = (group: CartProductOptionGroupType, groupIndex: number, item: CartItemType, itemIndex: number): void => {
  currentNavigationIndex.value = groupIndex;
  const targetGroup = group;

  // 옵션 장바구니 닫기
  close();

  if (isProductSoldOut(item)) {
    openAlert(t('해당 상품은 품절입니다.'));
    return;
  }

  const selectCount = group.items.filter((item) => item.checked).length;

  const selectItemQty = group.items.filter((item) => item.checked).reduce((acc, item) => {
    if (isOptionProductType(item)) {
      const productType = item as productType;
      return acc + productType.quantity;
    }

    if (isGroupType(item)) return acc;

    if (isProductItemType(item)) {
      const productType = item as productType;

      return acc + productType.quantity;
    }

    const optionItem = item as CartProductOptionType;

    return acc + optionItem.quantity;
  }, 0);

  const {
    minLimitQty,
    minLimitSelect,
    maxLimitQty,
    maxLimitSelect,
  } = group;

  const isOnlyOneLimit = minLimitQty === 1 && minLimitSelect === 1 && maxLimitSelect === 1 && maxLimitQty === 1;

  const isMaxGroupItemQuantity = selectItemQty === maxLimitQty;

  const isMaxGroupItemSelect = selectCount === maxLimitSelect;

  const target = item;

  if (!target.checked && isMaxGroupItemQuantity && maxLimitQty !== 0 && !isOnlyOneLimit) {
    if (locale.value === CHINESE_GAN || locale.value === CHINESE_BUN) {
      openAlert(`${t('선택 가능합니다.')} ${maxLimitQty}${t('개 까지')}`);
    } else if (locale.value === ENGLISH) {
      openAlert(`${t('선택 가능합니다.')} ${t('개 까지')} ${maxLimitQty}`);
    } else {
      openAlert(`${maxLimitQty}${t('개 까지')} ${t('선택 가능합니다.')}`);
    }
    return;
  }

  if (!target.checked && isMaxGroupItemSelect && maxLimitSelect !== 0 && !isOnlyOneLimit) {
    if (locale.value === CHINESE_GAN || locale.value === CHINESE_BUN || locale.value === ENGLISH) {
      openAlert(`${t('선택 가능합니다.')} ${t('종류')} ${maxLimitSelect}${t('개 까지')}`);
    } else {
      openAlert(`${t('종류')} ${maxLimitSelect}${t('개 까지')} ${t('선택 가능합니다.')}`);
    }
    return;
  }

  if (!target.checked) itemCheckChangeOnlyOneLimit(targetGroup);

  if (target.checked && (target.isOptionExist || target.isProductExist)) {
    const groupType = item as CartProductOptionGroupType;
    deleteRelateShowGroup(groupType, targetGroup, itemIndex);
  }

  target.checked = !target.checked;
  targetGroup.isGroupSelected = false;

  if (!target.checked) {
    optionMove(group, selectedTopGroup.value);
    return;
  }

  targetGroup.checked = targetGroup.items.some((item) => item.checked);
  addCustomKeyOrPushShowGroup(group, item, itemIndex);
};

const increaseProductQuantity = (): void => {
  const productQuantity: number = product.value.quantity;
  const productMaxQuantity: number = product.value.maxQuantity;
  const isProductQuantityMax: boolean = productQuantity === productMaxQuantity;
  const isNoLimit: boolean = product.value.maxQuantity === 0;

  if (isProductQuantityMax && !isNoLimit) {
    openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    return;
  }

  product.value.quantity += 1;
};

const decreaseProductQuantity = (): void => {
  const productQuantity: number = product.value.quantity;
  const productMinQuantity: number = product.value.minQuantity;
  const isProductQuantityMin: boolean = productQuantity === productMinQuantity;
  const isProductQuantity = productQuantity !== 0;
  const isProductSingle = productQuantity === 1;

  if ((isProductQuantityMin && isProductQuantity) || isProductSingle) return;

  product.value.quantity -= 1;
};

const increaseOptionQuantity = (isProductGroup: boolean, group: CartItemType, item: CartItemType, eventOrigin: 'list' | 'cart'): void => {
  if (isProductItemType(item) || isOptionProductType(item)) {
    const productItem = item as productType;
    const productItemQuantity: number = productItem.quantity;
    const productItemMaxQuantity: number = productItem.maxOrderQty;
    const isNoLimit: boolean = productItem.maxOrderQty === 0;
    const isProductQuantityMax: boolean = productItemQuantity === productItemMaxQuantity;
    let selectItemQty = 0;
    let isMaxGroupItemQuantity = false;
    let isNoLimitGroupMaxQty = false;

    if (isGroupType(group)) {
      const groupType = group as CartProductOptionGroupType;
      const products = groupType.items;

      selectItemQty = products.filter((item) => item.checked).reduce((acc, item) => {
        if (isOptionProductType(item)) {
          const productType = item as productType;
          return acc + productType.quantity;
        }

        if (isGroupType(item)) return acc;

        const productType = item as productType;

        return acc + productType.quantity;
      }, 0);

      isMaxGroupItemQuantity = selectItemQty === groupType.maxLimitQty;
      isNoLimitGroupMaxQty = groupType.maxLimitQty === 0;
    }

    if (!productItem.checked) return;

    if ((isProductQuantityMax && !isNoLimit) || (isMaxGroupItemQuantity && !isNoLimitGroupMaxQty)) {
      openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
      return;
    }

    if (isProductGroup) {
      const targetGroup = group as CartProductOptionGroupType;

      const isGroupExistOptionCart = optionPageCart.value.find((topGroup) => {
        const findGroup = topGroup.find((group) => {
          if (isItemType(group)) return false;

          const groupType = group as CartProductOptionGroupType;

          return groupType.id === targetGroup.id;
        });

        return findGroup;
      });

      if (isGroupExistOptionCart) {
        openAlert(t('선택완료한 옵션입니다.'));
        return;
      }
    }
    productItem.quantity += 1;

    if (!isGroupType(group)) return;

    const groupType = group as CartProductOptionGroupType;

    const currentGroupArray = eventOrigin === 'list' ? optionPageCart.value[selectedTopGroup.value] : selectShowGroups.value;
    const findCartTargetGroup = currentGroupArray.find((group) => {
      if (!isGroupType(group)) return false;
      const groupTypeCart = group as CartProductOptionGroupType;

      return groupType.id === groupTypeCart.id;
    }) as CartProductOptionGroupType;

    if (!findCartTargetGroup) return;

    const findTargetItemInTargetGroup = findCartTargetGroup.items.find((item) => {
      if (isGroupType(item)) return false;

      const itemType = item as productType;

      return itemType.productCode === productItem.productCode;
    });

    if (!findTargetItemInTargetGroup) return;

    findTargetItemInTargetGroup.quantity += 1;
    return;
  }

  const optionItem = item as CartProductOptionType;
  const optionItemQuantity: number = optionItem.quantity;
  const optionItemMaxQuantity: number = optionItem.limitQty;
  const isNoLimit: boolean = optionItem.limitQty === 0;
  const isProductQuantityMax: boolean = optionItemQuantity === optionItemMaxQuantity;

  let selectItemQty = 0;
  let isMaxGroupItemQuantity = false;
  let isNoLimitGroupMaxQty = false;

  if (isGroupType(group)) {
    const groupType = group as CartProductOptionGroupType;
    const options = groupType.items;

    selectItemQty = options.filter((item) => item.checked).reduce((acc, item) => {
      if (isGroupType(item)) return acc;

      const itemType = item as CartProductOptionType;

      return acc + itemType.quantity;
    }, 0);

    isMaxGroupItemQuantity = selectItemQty === groupType.maxLimitQty;
    isNoLimitGroupMaxQty = groupType.maxLimitQty === 0;
  }

  if (!optionItem.checked) return;

  if ((isProductQuantityMax && !isNoLimit) || (isMaxGroupItemQuantity && !isNoLimitGroupMaxQty)) {
    openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    return;
  }

  optionItem.quantity += 1;

  if (!isGroupType(group)) return;

  const groupType = group as CartProductOptionGroupType;

  const currentGroupArray = eventOrigin === 'list' ? optionPageCart.value[selectedTopGroup.value] : selectShowGroups.value;

  const findCartTargetGroup = currentGroupArray.find((group) => {
    if (!isGroupType(group)) return false;
    const groupTypeCart = group as CartProductOptionGroupType;

    return groupType.id === groupTypeCart.id;
  }) as CartProductOptionGroupType;

  if (!findCartTargetGroup) return;

  const findTargetItemInTargetGroup = findCartTargetGroup.items.find((item) => {
    if (isGroupType(item)) return false;

    const itemType = item as CartProductOptionType;

    return itemType.code === optionItem.code;
  });

  if (!findTargetItemInTargetGroup) return;

  findTargetItemInTargetGroup.quantity += 1;
};

const decreaseOptionQuantity = (isProductGroup: boolean, group: CartItemType, groupIndex: number, item: CartItemType, itemIndex: number, groupsIndex: number, eventOrigin: 'list' | 'cart'): void => {
  if (!item.checked) return;

  if (item.isProduct) {
    const product = item as productType;
    const productQuantity = product.quantity;

    if (isProductGroup) {
      const targetGroup = group as CartProductOptionGroupType;

      const isGroupExistOptionCart = optionPageCart.value.find((topGroup) => {
        const findGroup = topGroup.find((group) => {
          if (isItemType(group)) return false;

          const groupType = group as CartProductOptionGroupType;

          return groupType.id === targetGroup.id;
        });

        return findGroup;
      });

      if (isGroupExistOptionCart) {
        openAlert(t('선택완료한 옵션입니다.'));
        return;
      }
    }

    if (productQuantity === 1) {
      product.checked = !product.checked;
      close();

      if (!isGroupType(group)) return;

      const groupType = group as CartProductOptionGroupType;
      groupType.isGroupSelected = false;
      const itemGroupType = item as CartProductOptionGroupType;
      deleteRelateShowGroup(itemGroupType, groupType, itemIndex);
      return;
    }

    product.quantity -= 1;

    if (!isGroupType(group)) return;

    const groupType = group as CartProductOptionGroupType;

    const currentGroupArray = eventOrigin === 'list' ? optionPageCart.value[selectedTopGroup.value] : selectShowGroups.value;

    const findCartTargetGroup = currentGroupArray.find((group) => {
      if (!isGroupType(group)) return false;
      const groupTypeCart = group as CartProductOptionGroupType;

      return groupType.id === groupTypeCart.id;
    }) as CartProductOptionGroupType;

    if (!findCartTargetGroup) return;

    const findTargetItemInTargetGroup = findCartTargetGroup.items.find((item) => {
      if (isGroupType(item)) return false;

      const itemType = item as productType;

      return itemType.productCode === product.productCode;
    });

    if (!findTargetItemInTargetGroup) return;

    findTargetItemInTargetGroup.quantity += 1;
    return;
  }

  const optionItem = item as CartProductOptionType;
  const optionItemQuantity = optionItem.quantity;

  if (optionItemQuantity === 1 && !isProductSetMenu.value && !isItemType(item)) {
    const groupType = item as CartProductOptionGroupType;
    deleteOptionItemByIndex(groupsIndex, groupType, groupIndex, optionItem);
    return;
  }

  if (optionItem.quantity === 1) {
    optionItem.checked = !optionItem.checked;
    close();

    if (!isGroupType(group)) return;

    const groupType = group as CartProductOptionGroupType;
    groupType.isGroupSelected = false;
    const itemGroupType = item as CartProductOptionGroupType;
    deleteRelateShowGroup(itemGroupType, groupType, itemIndex);
    return;
  }

  optionItem.quantity -= 1;

  if (!isGroupType(group)) return;

  const groupType = group as CartProductOptionGroupType;

  const currentGroupArray = eventOrigin === 'list' ? optionPageCart.value[selectedTopGroup.value] : selectShowGroups.value;

  const findCartTargetGroup = currentGroupArray.find((group) => {
    if (!isGroupType(group)) return false;
    const groupTypeCart = group as CartProductOptionGroupType;

    return groupType.id === groupTypeCart.id;
  }) as CartProductOptionGroupType;

  if (!findCartTargetGroup) return;

  const findTargetItemInTargetGroup = findCartTargetGroup.items.find((item) => {
    if (isGroupType(item)) return false;

    const itemType = item as CartProductOptionType;

    return itemType.code === optionItem.code;
  });

  if (!findTargetItemInTargetGroup) return;

  findTargetItemInTargetGroup.quantity -= 1;
};

const isNoLimitOne = (item: CartItemType) => {
  if (item.isProduct) {
    const product = item as productType;
    return product.maxOrderQty !== 1;
  }

  // 그룹 타입일 경우 상품 수량이 없으므로 false 반환
  if (isGroupType(item)) return false;

  const option = item as CartProductOptionType;
  return option.limitQty !== 1;
};

const isNoPrice = (isProduct: boolean, item: CartItemType) => {
  if (isProduct) {
    const product = item as productType;
    return product.price === 0;
  }

  const option = item as CartProductOptionType;
  return option.price === 0;
};

// 장바구니 중복 상품 체크
const checkCartProducts = (product: cartProductType): number => {
  if (cartProducts.value?.length === 0) return -1;

  const targetIndex = cartProducts.value?.findIndex((cartProduct) => {
    if (cartProduct.isProductExist) {
      const cartProductToString = JSON.stringify(cartProduct.products);
      const productToString = JSON.stringify(realProductGroups.value);

      return cartProduct.id === product.id && cartProductToString === productToString;
    }

    const cartProductToString = JSON.stringify(cartProduct.options);
    const productToString = JSON.stringify(realOptionGroups.value);

    return cartProduct.id === product.id && cartProductToString === productToString;
  });

  return targetIndex;
};

// 필수 옵션 체크
const checkRequireOptionGroup = (): boolean => {
  const checkOptionGroups: number = showGroups.value.findIndex((groups, groupsIndex) => {
    const checkOptionGroup = groups.findIndex((group: CartProductOptionGroupType) => {
      const isGroupInOptionCart = optionPageCart.value[groupsIndex].length > 0;

      const isRequireGroup = group.requireFlag === 1;
      if (!isRequireGroup) {
        const isAnyCheckItem = group.items.some((item) => item.checked);

        if (isAnyCheckItem && !isGroupInOptionCart) {
          openAlert(`${t('상품을 선택해주세요.', { product: translateLanguage(group.nameArray, group.name) })}`);
        }
        close();
        return isAnyCheckItem && !isGroupInOptionCart;
      }

      let selectedOptionLength = 0;
      let selectedOptionItemQtyLength = 0;

      if (isGroupSetGroup(group)) {
        const products = group.items as productType[];
        selectedOptionLength = products.filter((item) => item.checked)?.length;
        selectedOptionItemQtyLength = products.filter((item) => item.checked).reduce((acc, item) => {
          if (isOptionProductType(item)) {
            const productType = item as productType;
            return acc + productType.quantity;
          }

          if (isGroupType(item)) return acc;

          const productType = item as productType;

          return acc + productType.quantity;
        }, 0);
      } else {
        const options = group.items as OptionType[];
        selectedOptionLength = options.filter((item) => item.checked)?.length;
        selectedOptionItemQtyLength = options.filter((item) => item.checked).reduce((acc, item) => {
          if (isGroupType(item)) return acc;

          const itemType = item as CartProductOptionType;

          return acc + itemType.quantity;
        }, 0);
      }

      if (selectedOptionLength === 0) {
        openAlert(`${t('상품을 선택해주세요.', { product: translateLanguage(group.nameArray, group.name) })}`);
        selectedTopGroup.value = groupsIndex;
        close();
        return true;
      }

      if (!isGroupInOptionCart) {
        openAlert(`${t('상품을 선택해주세요.', { product: translateLanguage(group.nameArray, group.name) })}`);
        selectedTopGroup.value = groupsIndex;
        close();
        return true;
      }

      const isNoLimitSelect = group.maxLimitSelect === 0;
      const isNoLimitQty = group.maxLimitQty === 0;

      let isCheckSelect = false;
      let isCheckItemQty = false;

      if (selectedOptionLength === 0) isCheckSelect = true;
      else isCheckSelect = isNoLimitSelect ? group.minLimitSelect <= selectedOptionLength : group.minLimitSelect <= selectedOptionLength && group.maxLimitSelect >= selectedOptionLength;

      if (selectedOptionItemQtyLength === 0) isCheckItemQty = true;
      else isCheckItemQty = isNoLimitQty ? group.minLimitQty <= selectedOptionItemQtyLength : group.minLimitQty <= selectedOptionItemQtyLength && group.maxLimitQty >= selectedOptionItemQtyLength;

      const isMinMaxSelectSame = group.minLimitSelect === group.maxLimitSelect;
      const isMinMaxQtySame = group.minLimitQty === group.maxLimitQty;

      if (!isCheckSelect || !isCheckItemQty) {
        if (locale.value === CHINESE_GAN || locale.value === CHINESE_BUN) {
          if (!isCheckSelect) {
            if (isNoLimitSelect || isMinMaxSelectSame) openAlert(`${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${t('종류')} ${group.minLimitSelect}${t('개')}${isMinMaxSelectSame ? '' : t('이상')}`);
            else openAlert(`${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${t('종류')} ${group.minLimitSelect} ~ ${group.maxLimitSelect}${t('개 까지')}`);
          }

          if (!isCheckItemQty) {
            if (isNoLimitQty || isMinMaxQtySame) openAlert(`${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${group.minLimitQty}${t('개')}${isMinMaxQtySame ? '' : t('이상')}`);
            else openAlert(`${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${group.minLimitQty} ~ ${group.maxLimitQty}${t('개 까지')}`);
          }
        } else if (locale.value === ENGLISH) {
          if (!isCheckSelect) {
            if (isNoLimitSelect || isMinMaxSelectSame) openAlert(`${t('선택 가능합니다.')}\n ${isMinMaxSelectSame ? '' : t('이상')} ${t('종류')} ${group.minLimitSelect}${t('개')} ${t('에서')} ${translateLanguage(group.nameArray, group.name)}.`);
            else openAlert(`${t('선택 가능합니다.')}\n ${t('종류')} ${group.minLimitSelect} ~ ${group.maxLimitSelect}${t('개 까지')} ${t('에서')} ${translateLanguage(group.nameArray, group.name)}.`);
          }

          if (!isCheckItemQty) {
            if (isNoLimitQty || isMinMaxQtySame) openAlert(`${t('선택 가능합니다.')}\n ${isMinMaxSelectSame ? '' : t('이상')} ${group.minLimitQty}${t('개')} ${t('에서')} ${translateLanguage(group.nameArray, group.name)}.`);
            else openAlert(`${t('선택 가능합니다.')}\n ${group.minLimitQty} ~ ${group.maxLimitQty}${t('개 까지')} ${t('에서')} ${translateLanguage(group.nameArray, group.name)}.`);
          }
        } else {
          if (!isCheckSelect) {
            if (isNoLimitSelect || isMinMaxSelectSame) openAlert(`${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${t('종류')} ${group.minLimitSelect}${t('개')}${isMinMaxSelectSame ? '' : t('이상')} ${t('선택 가능합니다.')}`);
            else openAlert(`${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${t('종류')} ${group.minLimitSelect} ~ ${group.maxLimitSelect}${t('개 까지')} ${t('선택 가능합니다.')}`);
          }

          if (!isCheckItemQty) {
            if (isNoLimitQty || isMinMaxQtySame) openAlert(`${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${group.minLimitQty}${t('개')}${isMinMaxQtySame ? '' : t('이상')} ${t('선택 가능합니다.')}`);
            else openAlert(`${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${group.minLimitQty} ~ ${group.maxLimitQty}${t('개 까지')} ${t('선택 가능합니다.')}`);
          }
        }

        selectedTopGroup.value = groupsIndex;
        close();
        return true;
      }

      return false;
    });

    if (checkOptionGroup === -1) return false;

    return true;
  });

  if (checkOptionGroups === -1) return false;

  return true;
};

const searchOptionAndInsertItems = (options: CartItemType[], targetCart: CartItemType, topGroupIndex?: number) => {
  options.forEach((option, optionIndex) => {
    if (topGroupIndex && topGroupIndex !== optionIndex) return;
    const item = option as CartItemType;

    if (isItemType(targetCart) || isItemType(item)) {
      item.isPreSet = false;
      return;
    }

    const targetGroupType = targetCart as CartProductOptionGroupType;

    if (isOptionProductType(option)) {
      const productType = item as productType;
      productType.isPreSet = false;

      const isTargetGroup = productType.productCode === targetGroupType.id;

      if (isTargetGroup) {
        productType.option = targetGroupType.items as (CartProductOptionType | productOptionType)[];
      } else {
        const options = productType.option as CartItemType[];
        searchOptionAndInsertItems(options, targetGroupType);
      }

      return;
    }

    let groupType = option as CartProductOptionGroupType;
    groupType.isPreSet = false;

    const isTargetGroup = groupType.id === targetGroupType.id;

    if (isTargetGroup) {
      groupType = targetGroupType;
    } else {
      const groupItems = groupType.items as CartItemType[];
      searchOptionAndInsertItems(groupItems, targetGroupType);
    }
  });
};

const convertCartGroup = (carts: CartItemType[], cartsIndex: number) => {
  carts.forEach((cart) => {
    const targetCart = cart;

    searchOptionAndInsertItems(isProductSetMenu.value ? realProductGroups.value : realOptionGroups.value, targetCart, cartsIndex);
  });

  if (isProductSetMenu.value) {
    realProductGroups.value.forEach((group) => {
      if (isItemType(group)) return;
      if (isOptionProductType(group)) {
        const optionProduct = group as productType;

        const isAnyChecked = optionProduct.option.some((option) => option.checked);
        optionProduct.checked = isAnyChecked;
        return;
      }

      const groupType = group as CartProductOptionGroupType;
      const isAnyChecked = groupType.items.some((item) => item.checked);
      groupType.checked = isAnyChecked;
    });
  } else {
    realOptionGroups.value.forEach((group) => {
      if (isItemType(group)) return;

      const groupType = group as CartProductOptionGroupType;
      const isAnyChecked = groupType.items.some((item) => item.checked);
      groupType.checked = isAnyChecked;
    });
  }
};

const addCart = (): void => {
  const cartProduct = { ...product.value } as cartProductType;

  // 선택한 사용자 UI 원본데이터에서 찾아서 카트상품에 넣어주는 로직
  const copyOptionPageCart = JSON.parse(JSON.stringify(optionPageCart.value));
  copyOptionPageCart.forEach(convertCartGroup);

  if (isProductSetMenu.value) {
    cartProduct.products = realProductGroups.value;
  } else {
    cartProduct.options = realOptionGroups.value;
  }

  // 필수옵션 검증
  const checkRequire = checkRequireOptionGroup();

  if (checkRequire) return;

  // 장바구니에 동일한 상품 있는지 검증
  const {
    name,
    quantity,
  } = cartProduct;

  // 동일한 상품 && 옵션이 담겨져 있을때 수량만 증가
  const checkIndex = checkCartProducts(cartProduct);

  if (checkIndex !== -1) {
    multiIncreaseCartProductQuantity(checkIndex, quantity);
    pushUpItemIndex(checkIndex);
  } else if (isChangedOption) replaceCartProduct(cartProduct, Number(targetIndex));
  else addCartProduct(cartProduct);

  if (locale.value === CHINESE_GAN || locale.value === CHINESE_BUN || locale.value === ENGLISH) {
    openAlert(`"${t('담았습니다.')} ${quantity}${t('개')}\n${name}"`);
  } else {
    openAlert(`"${name}"\n${quantity}${t('개')} ${t('담았습니다.')}`);
  }

  onNextRoot();
  openModal(CART);
};

const isEnglishLanguage = computed(() => {
  const { locale } = i18n.global;

  if (locale.value === 'en') return true;
  return false;
});
const isJapaneseLanguage = computed(() => {
  const { locale } = i18n.global;

  if (locale.value === 'jp') return true;
  return false;
});

const isNonOrderTable = computed(() => {
  if (nullishCheck(tableInfo.orderAble)) return false;
  if (tableInfo.orderAble === 1) return false;
  return true;
});
</script>

<style scoped lang='scss'>
.option-select-container {
  display: flex;
  width: 100vw;
  height: 100vh;

  &.else {
    font-family: "Noto Sans SC", sans-serif;
    background-color: #222;
  }

  .left-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 18.5%;

    .left-container-background {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-color: v-bind(categoryBackgroundColor);
      background-image: v-bind(categoryBackgroundImage);
      background-position: center center;
      background-size: cover;
    }

    .left-container-content {
      height: 75%;

      .option-first-category {
        margin-bottom: 0.78125vw;
        overflow: auto;

        .option-first-category-wrap {
          height: 100%;
          overflow: auto;
        }
      }
    }

    .option-layout-menu-wrap {
      display: flex;
      gap: 1.1719vw;
      align-items: center;
      justify-content: flex-start;
      margin: 3.125vw 0 0.78125vw 1.4vw;
    }

    .main-layout-logo {
      width: 6.422vw;
    }

    .tablet-number {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      min-width: 2.3vw;
      max-width: 7.4vw;
      padding: .1563vw .4688vw;
      margin-left: 3.125vw;
      font-size: 1.25vw;
      font-weight: 600;
      color: #fff;
      border: .0781vw solid #fff;
      border-radius: .4688vw;

      .tablet-info {
        overflow: hidden;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .middle-container {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: auto;
    background-color: v-bind(backgroundColor);
  }
}

.product-option-container {
  padding-right: 5vw;
  padding-bottom: 2vw;
  padding-left: 5vw;

  &.black {
    padding-top: 3.375vw;
    color: #fff;
    background-color: #222;
    border-top: .625vw solid #333;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.select-container {
  width: 100%;
}

.select-wrap {
  display: flex;
  width: 100%;
  height: 100%;
  margin-right: 1.5625vw;
  overflow: hidden;
  background-color: v-bind(backgroundColor);
}

.option-group-wrap {
  position: relative;
  width: 100%;
  margin-bottom: .7813vw;
  overflow-y: auto;

  .option-list-wrap {
    overflow-y: auto;
  }
}

.select-list {
  height: 100%;
  margin: 0 2.3438vw;
  border: .0781vw solid #dfdfdf;
  border-radius: .7813vw;

  &.image {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0 .7813vw;
    padding: 0 1.1719vw;
    margin: 0;
    border: none;

    &.over{
      margin-bottom: 6.25vw;
    }

    .select-item {
      border: none;
    }
  }

  &.text{
    .select-item{
      &:first-child{
        border-top-left-radius: .7813vw;
        border-top-right-radius: .7813vw;
      }

      &:last-child{
        border: none;
        border-bottom-right-radius: .7813vw;
        border-bottom-left-radius: .7813vw;
      }
    }

    &.active {
      color: #fff;
      background-color: v-bind(buttonBackgroundColor);
    }
  }

  .select-item {
    padding: .3906vw .7813vw;
    line-height: 1.5vw;
    word-break: break-all;
    border-bottom: .0781vw solid #dfdfdf;

    .image-type-no-select-wrap {
      display: flex;
      flex-direction: column;
      gap: .7813vw;

      .image-type-no-select {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 15.625vw;
        overflow: hidden;
        background-color: #fafafa;
        border-radius: .7813vw;

        img {
          width: 7.8125vw;
          height: 7.8125vw;
        }

        .checked-image {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-color: #cccccc;
          border-radius: .7813vw;
          opacity: 0.8;
        }

        .checked-message {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          gap: 1.5625vw;
          align-items: center;
          justify-content: center;
          font-size: 2.5vw;
          color: #fff;
          opacity: 1;

          .check-icon {
            width: 2.5vw;
            height: 2.5vw;
          }
        }
      }

      .no-select-text-wrap {
        display: flex;
        align-items: center;
        justify-content: center;

        .text {
          font-family: "Noto Sans SC", sans-serif;
          font-size: 1.6406vw;
          font-weight: 500;
          color: #000;
        }
      }
    }

    .select-item-icon {
      display: flex;
      align-items: center;
      justify-content: center;

      &.active {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #000;
        border: .0781vw solid #fff;
        border-radius: .625vw;
      }
    }

    .name {
      display: flex;
      align-items: center;

      .text {
        margin-left: 1.2vw;
        font-family: "Noto Sans SC", sans-serif;
        font-size: 1.6406vw;
      }
    }
  }
}

.select-title {
  display: grid;
  grid-template-columns: auto 3.9063vw;
  gap: .7813vw;
  align-items: center;
  height: 7.8125vw;
  padding: 1.5625vw;
  font-family: "Noto Sans SC", sans-serif;
  font-size: 1.5625vw;
  border-bottom: .0781vw solid #dfdfdf;

  .name {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: .3906vw;
    justify-content: space-between;
    width: 17.1875vw;
    font-weight: 700;

    .name-group {
      width: 100%;
      padding: .3906vw 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.button-wrapper {
  position: fixed;
  right: 0;
  bottom: 0;
  box-sizing: content-box;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.2813vw;
  width: calc(54.33% - 3.4375vw);
  height: 4.6875vw;
  padding: .7813vw 1.7188vw;
  background-color: v-bind(backgroundColor);

  .select-more-button {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    gap: .7813vw;
    place-content: center;
    font-family: "Noto Sans SC", sans-serif;
    font-size: 1.75vw;
    font-weight: 300;
    color: #000;
    background-color: #fff;
    border: .0781vw solid #000;
    border-radius: .7813vw;
    opacity: 0;

    &.not {
      color: #fff;
      background-color: #cccccc;
    }

    &.show {
      opacity: 1;
    }
  }

  .select-finish-button {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    gap: .7813vw;
    place-content: center;
    font-family: "Noto Sans SC", sans-serif;
    font-size: 2vw;
    font-weight: 500;
    color: #fff;
    background-color: v-bind(buttonBackgroundColor);
    border-radius: .7813vw;

    &.not {
      color: #fff;
      background-color: #cccccc;
    }
  }

  .check-icon {
    width: 2.5vw;
    height: 2.5vw;
  }

  span {
    display: flex;
    align-items: center;
  }
}

.set-cart-group {
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding: 0 .7813vw;
  font-size: 1.25vw;

  &.product {
    font-size: 1.5625vw;
    font-weight: 700;
  }

  &.group-type {
    font-size: 1.5625vw;
  }
}

.navigation-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  height: 4.6875vw;
  padding-left: 2.3438vw;
  overflow-x: auto;

  .navigation-button-scroll {
    display: flex;
    gap: .7813vw;
  }

  .navigation-groups-wrapper {
    display: flex;
    gap: .7813vw;
  }

  .navigation-button {
    display: flex;
    gap: .3906vw;
    align-items: center;
    width: max-content;
    height: 3.9063vw;
    padding: .7813vw;
    font-size: 1.75vw;
    font-weight: 700;
    color: v-bind(buttonBackgroundColor);
    background-color: v-bind(backgroundColor);
    border: .0781vw solid v-bind(buttonBackgroundColor);
    border-radius: .7813vw;

    .require {
      padding: .7813vw;
      font-size: 1.25vw;
      font-weight: 700;
      color: #eda95b;
      text-align: center;
      background-color: #fff;
      border: .1563vw solid #eda95b;
      border-radius: .3906vw;

      &.not {
        color: #000;
        border-color: #000;
      }
    }

    &.select {
      font-weight: 700;
      color: v-bind(buttonFontColor);
      background-color: v-bind(buttonBackgroundColor);
      border: none;
    }

    &.finish {
      font-weight: 500;
      color: #000;
      background-color: #f0f0f0;
      border: none;
    }
  }
}
</style> --> -->
