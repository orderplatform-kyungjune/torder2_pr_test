<template>
  <div>
    <!-- 레스토랑 테마 -->
    <div
      v-if="isThemeTypeRestaurantCard || isThemeTypeRestaurantHorizontal"
      class="option-select-container restaurant-horizontal"
    >
      <RestaurantProductOptionBody
        :product="product"
        :options="options"
        :selectOptionItems="selectOptionItems"
        :getSelectOptionItems="getSelectOptionItems"
        :getTotalPrice="getTotalPrice"
        :selectedOptionGroup="selectedOptionGroup"
        :changeSelectOptionIndex="changeSelectOptionIndex"
        :optionCheckImgRestaurant="optionCheckImgRestaurant"
        :isSelectOptionRequire="isSelectOptionRequire"
        :isEmptySelectOptionItems="isEmptySelectOptionItems"
        :deleteOptionItemAll="deleteOptionItemAll"
        :increaseProductQuantity="increaseProductQuantity"
        :decreaseProductQuantity="decreaseProductQuantity"
        :addCart="addCart"
        :isNoLimit="isNoLimit"
        :closeProductOption="onNextRoot"
        :isItemType="isItemType(options[selectedOptionGroup])"
        :t="t"
      >
        <template #group>
          <RestaurantProductOptionGroupList
            v-for="(option, optionIndex) in options"
            :key="optionIndex"
            :class="isCheckedOptionGroup(optionIndex)"
            :index="add1(optionIndex)"
            :option="option"
            :isActive="isActive(optionIndex)"
            :isSelectOption="isSelectOption(option)"
            :isRequireOption="isRequireOption(option)"
            :t="t"
            @click="changeSelectOptionIndex(optionIndex)"
          />
        </template>
        <template #select>
          <template v-if="!isItemType(options[selectedOptionGroup])">
            <RestaurantProductOptionSelectList
              v-for="(optionItem, optionItemIndex) in (
                options[selectedOptionGroup] as CartProductOptionGroupType
              ).items as CartProductOptionType[]"
              :key="optionItem.code"
              :class="isCheckedOptionSelect(optionItem)"
              :optionItem="optionItem"
              :optionCheckImgRestaurant="
                optionCheckImgRestaurant(optionItem.checked)
              "
              :data-cy-limit="optionItem.limitQty"
              @click="
                selectOption(
                  options[selectedOptionGroup] as CartProductOptionGroupType,
                  optionItem,
                  optionItemIndex,
                )
              "
            />
          </template>
        </template>
        <template #selected>
          <RestaurantProductOptionSelectedList
            v-for="(item, itemIndex) in selectOptionItems"
            :key="getOptionItemKey(item.parentGroupIndex, item.code)"
            :item="item"
            :increaseOptionQuantity="() => increaseOptionQuantity(itemIndex)"
            :decreaseOptionQuantity="
              () => decreaseOptionQuantity(item, itemIndex)
            "
            :selectedOptionGroupName="getSelectedOptionGroupName(item)"
            :deleteOptionItemByIndex="
              () => deleteOptionItemByIndex(item, itemIndex)
            "
            :t="t"
            :customButtonBackgroundColor="buttonBackgroundColor"
          />
        </template>
      </RestaurantProductOptionBody>
    </div>
    <!-- 레스토랑 세로 테마 -->
    <div
      v-else-if="isThemeTypeRestaurantVertical"
      ref="containerRef"
      class="option-select-container restaurant-vertical"
      :class="theme.color"
    >
      <Transition>
        <RestaurantVerticalScreenStickyHeader
          v-show="isStickyHeader"
          :name="
            translateLanguage(
              product.productLanguageShort,
              product.productLanguage?.ko,
            )
          "
          :onNextRoot="onNextRoot"
          :isThemeColorBlack="isThemeColorBlack"
          :class="theme.color"
        />
      </Transition>
      <RestaurantVerticalScreenProductDetailHeader
        :class="theme.color"
        :onNextRoot="onNextRoot"
        :productImg="getRestaurantVerticalProductImg()"
        :isProductImg="isProductImg()"
      />
      <RestaurantVerticalScreenProductDetailDescription
        :class="theme.color"
        :productName="
          translateLanguage(
            product.productLanguageShort,
            product.productLanguage?.ko,
          )
        "
        :productDescription="removeSymbol(product.description)"
        :hasProductDescription="hasProductDescription(product.description)"
      />
      <RestaurantVerticalScreenProductDetailQuantity
        :class="theme.color"
        :isThemeColorBlack="isThemeColorBlack"
        :productPrice="product.price?.toLocaleString()"
        :productQuantity="product.quantity"
        :increaseProductQuantity="increaseProductQuantity"
        :decreaseProductQuantity="decreaseProductQuantity"
        :t="t"
      />
      <div
        class="product-option-container"
        :class="theme.color"
      >
        <RestaurantVerticalScreenProductOptionGroup
          v-for="(option, optionIndex) in options"
          :key="optionIndex"
          :optionName="translateLanguage(option.nameArray, option.name)"
          :isRequireOption="isRequireOption(option)"
          :limitSelect="
            isItemType(option)
              ? 0
              : (option as CartProductOptionGroupType).maxLimitQty
          "
          :getLimitSelectString="(count: number) => getLimitSelectString(count)"
          :t="t"
        >
          <template v-if="isItemType(option)">
            <RestaurantVerticalScreenProductOptionItem
              :key="optionIndex"
              :isThemeColorBlack="isThemeColorBlack"
              :optionItemName="
                translateLanguage(
                  (option as CartProductOptionType).nameArray,
                  option.name,
                )
              "
              :optionItemPrice="
                (option as CartProductOptionType).price?.toLocaleString()
              "
              :optionItemQuantity="option.quantity"
              :optionCheckImgRestaurant="
                optionCheckImgRestaurant(
                  (option as CartProductOptionType).checked,
                )
              "
              :restaurantVerticalIncreaseOptionQty="
                () =>
                  restaurantVerticalIncreaseOptionQty(optionIndex, optionIndex)
              "
              :restaurantVerticalDecreaseOptionQty="
                () =>
                  restaurantVerticalDecreaseOptionQty(optionIndex, optionIndex)
              "
              :class="[
                theme.color,
                { active: (option as CartProductOptionType).checked },
              ]"
              @click="
                restaurantVerticalSelectOption(
                  option as CartProductOptionGroupType,
                  optionIndex,
                  optionIndex,
                )
              "
            />
          </template>
          <template v-else>
            <RestaurantVerticalScreenProductOptionItem
              v-for="(optionItem, optionItemIndex) in (
                option as CartProductOptionGroupType
              ).items"
              :key="optionItemIndex"
              :isThemeColorBlack="isThemeColorBlack"
              :optionItemName="
                translateLanguage(
                  (optionItem as CartProductOptionType).nameArray,
                  (optionItem as CartProductOptionType).name,
                )
              "
              :optionItemPrice="
                (optionItem as CartProductOptionType).price?.toLocaleString()
              "
              :optionItemQuantity="optionItem.quantity"
              :optionCheckImgRestaurant="
                optionCheckImgRestaurant(optionItem.checked)
              "
              :restaurantVerticalIncreaseOptionQty="
                () =>
                  restaurantVerticalIncreaseOptionQty(
                    optionIndex,
                    optionItemIndex,
                  )
              "
              :restaurantVerticalDecreaseOptionQty="
                () =>
                  restaurantVerticalDecreaseOptionQty(
                    optionIndex,
                    optionItemIndex,
                  )
              "
              :class="[theme.color, { active: optionItem.checked }]"
              @click="
                restaurantVerticalSelectOption(
                  option as CartProductOptionGroupType,
                  optionIndex,
                  optionItemIndex,
                )
              "
            />
          </template>
        </RestaurantVerticalScreenProductOptionGroup>
      </div>
      <RestaurantVerticalScreenProductDetailButton
        :productPrice="product.price?.toLocaleString()"
        :onNextRoot="onNextRoot"
        :addCart="addCart"
        :addCardButtonText="addCardButtonText"
        :t="t"
      />
    </div>
    <!-- 그 외 테마 -->
    <div
      v-else
      class="background-wall"
    >
      <div
        class="option-select-container else"
        :class="{
          'not-basic': getOptionLayout.type !== BASIC,
          black: getOptionLayout.color === BLACK,
          white: getOptionLayout.color === WHITE,
        }"
      >
        <ProductOptionHeader
          :product="product"
          :closeProductOption="onNextRoot"
          :t="t"
          :basicPrice="product.price?.toLocaleString()"
          :optionLayout="getOptionLayout"
          :tabActive="tabActive"
          :clickTab="clickTab"
        />
        <ProductOptionBody
          :product="product"
          :options="options"
          :getTotalPrice="getTotalPrice"
          :selectOptionItems="selectOptionItems"
          :selectedOptionGroup="selectedOptionGroup"
          :selectedOptionGroupNum="nextSelectedOptionGroup"
          :prevSelectedOptionGroup="prevSelectedOptionGroup"
          :changeSelectOptionIndex="changeSelectOptionIndex"
          :isNotZeroSelectedOptionGroup="isNotZeroSelectedOptionGroup"
          :isNotLastSelectedOptionGroup="isNotLastSelectedOptionGroup"
          :isOptionChecked="isOptionChecked"
          :isSingleProduct="isSingleProduct"
          :isSelectOptionRequire="isSelectOptionRequire"
          :isEmptySelectOptionItems="isEmptySelectOptionItems"
          :deleteOptionItemAll="deleteOptionItemAll"
          :getSelectOptionItems="getSelectOptionItems"
          :increaseProductQuantity="increaseProductQuantity"
          :decreaseProductQuantity="decreaseProductQuantity"
          :addCart="addCart"
          :isNoLimit="isNoLimit"
          :isItemType="isItemType(options[selectedOptionGroup])"
          :t="t"
          :optionLayout="getOptionLayout"
          :tabActive="tabActive"
          :productDetail="getProductDescription()"
          :getLimitSelectString="(count: number) => getLimitSelectString(count)"
        >
          <template #group>
            <ProductOptionGroupList
              v-for="(option, optionIndex) in options"
              :id="`${option.name}-${optionIndex}`"
              :key="optionIndex"
              :optionIndex="optionIndex"
              :index="add1(optionIndex)"
              :option="option"
              :isSelectOption="isSelectOption(option)"
              :isRequireOption="isRequireOption(option)"
              :t="t"
              :optionLayout="getOptionLayout"
              :isGroupNoLimit="isGroupNoLimit(option)"
              :isItemType="isItemType(option)"
              :changeSelectOptionIndex="changeSelectOptionIndex"
              :isCheckedOptionGroup="isCheckedOptionGroup(optionIndex)"
              :isAnyCheckOptionInGroup="isAnyCheckOptionInGroup(option)"
              :getLimitSelectString="
                (count: number) => getLimitSelectString(count)
              "
            >
              <template
                v-if="getOptionLayout.type !== BASIC"
                #option-list
              >
                <div
                  class="select-wrap"
                  :class="{
                    'not-basic': getOptionLayout.type !== BASIC,
                    black: getOptionLayout.color === BLACK,
                    white: getOptionLayout.color === WHITE,
                    image: getOptionLayout.type === IMAGE,
                  }"
                >
                  <ul class="select-list">
                    <template v-if="!isItemType(option)">
                      <ProductOptionSelectList
                        v-for="(optionItem, optionItemIndex) in (
                          option as CartProductOptionGroupType
                        ).items as CartProductOptionType[]"
                        :id="`${optionIndex}-${optionItem.code}-${optionItemIndex}`"
                        :key="optionItem.code"
                        :class="isCheckedOptionSelect(optionItem)"
                        :optionItem="optionItem"
                        :isOptionChecked="isOptionChecked(optionItem.checked)"
                        :t="t"
                        :customFontActiveColor="activeFontColor"
                        :optionLayout="getOptionLayout"
                        :isOptionImage="isOptionImg(optionItem.image)"
                        :optionImage="optionImg(optionItem.image)"
                        @click="
                          selectOptionInGroup(
                            option as CartProductOptionGroupType,
                            optionIndex,
                            optionItem,
                            optionItemIndex,
                          )
                        "
                      />
                    </template>
                    <li
                      v-if="!isGroupSelectOptionRequire(option)"
                      class="select-item none"
                      :class="{
                        active: isEmptySelectOptionItems(
                          getSelectOptionGroupItems(optionIndex),
                        ),
                        black: getOptionLayout.color === BLACK,
                        white: getOptionLayout.color === WHITE,
                        image: getOptionLayout.type === IMAGE,
                      }"
                      @click="deleteOptionItemAll"
                    >
                      <div
                        v-if="getOptionLayout.type === IMAGE"
                        class="option-image-wrapper"
                        :class="isOptionImg('')"
                      >
                        <img
                          class="option-image"
                          :src="optionImg('')"
                          alt="option-image"
                        />
                        <template
                          v-if="
                            isEmptySelectOptionItems(
                              getSelectOptionGroupItems(optionIndex),
                            )
                          "
                        >
                          <img
                            class="check-option img"
                            :src="
                              isOptionChecked(
                                isEmptySelectOptionItems(
                                  getSelectOptionGroupItems(optionIndex),
                                ),
                              )
                            "
                          />
                        </template>
                        <div
                          v-if="
                            isEmptySelectOptionItems(
                              getSelectOptionGroupItems(optionIndex),
                            )
                          "
                          class="select-item-background-wall"
                        />
                      </div>
                      <div class="name">
                        <img
                          v-if="getOptionLayout.type !== IMAGE"
                          :src="
                            isOptionChecked(
                              isEmptySelectOptionItems(
                                getSelectOptionGroupItems(optionIndex),
                              ),
                            )
                          "
                        />
                        <span class="text">
                          {{ t('선택 안 함') }}
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </template>
            </ProductOptionGroupList>
          </template>
          <template #select>
            <template v-if="!isItemType(options[selectedOptionGroup])">
              <ProductOptionSelectList
                v-for="(optionItem, optionItemIndex) in (
                  options[selectedOptionGroup] as CartProductOptionGroupType
                ).items as CartProductOptionType[]"
                :key="optionItem.code"
                :class="isCheckedOptionSelect(optionItem)"
                :optionItem="optionItem"
                :isOptionChecked="isOptionChecked(optionItem.checked)"
                :t="t"
                :customFontActiveColor="activeFontColor"
                :optionLayout="getOptionLayout"
                :isOptionImage="isOptionImg(optionItem.image)"
                :optionImage="optionImg(optionItem.image)"
                @click="
                  selectOption(
                    options[selectedOptionGroup] as CartProductOptionGroupType,
                    optionItem,
                    optionItemIndex,
                  )
                "
              />
            </template>
          </template>
          <template #selected>
            <ProductOptionSelectedList
              v-for="(item, itemIndex) in selectOptionItems"
              :key="getOptionItemKey(item.parentGroupIndex, item.code)"
              :item="item"
              :isOptionMaxQuantity="isOptionMaxQuantity(item)"
              :increaseOptionQuantity="() => increaseOptionQuantity(itemIndex)"
              :decreaseOptionQuantity="
                () => decreaseOptionQuantity(item, itemIndex)
              "
              :selectedOptionGroupName="getSelectedOptionGroupName(item)"
              :optionGroupName="
                translateLanguage(
                  options[item.parentGroupIndex]?.nameArray,
                  options[item.parentGroupIndex]?.name,
                )
              "
              :deleteOptionItemByIndex="
                () => deleteOptionItemByIndex(item, itemIndex)
              "
              :t="t"
              :optionLayout="getOptionLayout"
              :getItemTotalPrice="getItemTotalPrice"
            />
          </template>
        </ProductOptionBody>
        <div
          v-if="getOptionLayout.type !== BASIC"
          class="not-basic-product-price-all"
          :class="{
            black: getOptionLayout.color === BLACK,
            white: getOptionLayout.color === WHITE,
          }"
        >
          <div class="left-side">
            <div
              v-if="isSingleProduct"
              class="quantity"
            >
              {{ `1${t('개')}` }}
            </div>
            <div
              v-else
              class="option-item-quantity-wrap"
            >
              <img
                class="quantity-img"
                src="https://static.torder.co.kr/torder2/icn_plus_only_white_60x60.svg"
                @click="increaseProductQuantity"
              />
              <div class="quantity">
                {{ product.quantity }}
              </div>
              <img
                class="quantity-img"
                src="https://static.torder.co.kr/torder2/icn_minus_only_white_60x60.svg"
                @click="decreaseProductQuantity"
              />
            </div>
            <div class="price">
              {{ checkStandardPriceUnit(getTotalPrice) }}
            </div>
          </div>
          <div class="right-side">
            <div
              class="close-button"
              @click="onNextRoot"
            >
              {{ t('닫기') }}
            </div>
            <div
              class="product-button"
              @click="addCart"
            >
              {{ t('장바구니 담기') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  ComponentPublicInstance,
  computed,
  ComputedRef,
  onMounted,
  Ref,
  ref,
  watch,
} from 'vue';
import { storeToRefs } from 'pinia';

import { scrollMove } from '@utils/scrollUtils';
import { pushPage } from '@utils/route.helper';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { getSubPrimaryColor, removeSymbol } from '@torder/common/utils';
import { productType } from '@torder/common/interface/product';
import {
  CartProductOptionGroupType,
  CartProductOptionType,
  cartProductType,
} from '@torder/common/interface/cartProduct';
import {
  CART,
  CHINESE_BUN,
  CHINESE_GAN,
  ENGLISH,
  RESTAURANT_HORIZONTAL,
  RESTAURANT_HORIZONTAL_CARD,
  RESTAURANT_VERTICAL,
  TEXT,
  IMAGE,
  BASIC,
  BLACK,
  WHITE,
  BASIC_CONFIRM,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useProductStore from '@store/storeProduct';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import { home } from '@router/routePaths';
import i18n from '@i18n';
import {
  ProductOptionBody,
  ProductOptionHeader,
  ProductOptionGroupList,
  ProductOptionSelectList,
  ProductOptionSelectedList,
  RestaurantProductOptionBody,
  RestaurantProductOptionGroupList,
  RestaurantProductOptionSelectList,
  RestaurantProductOptionSelectedList,
  RestaurantVerticalScreenProductDetailHeader,
  RestaurantVerticalScreenProductDetailDescription,
  RestaurantVerticalScreenProductDetailQuantity,
  RestaurantVerticalScreenProductOptionGroup,
  RestaurantVerticalScreenProductOptionItem,
  RestaurantVerticalScreenProductDetailButton,
  RestaurantVerticalScreenStickyHeader,
} from '@components';
import requestDescription from '@apis/description';

const { getStoreInfo, buttonBackgroundColor, activeFontColor } =
  storeToRefs(useInitStore());

const { openModal, openAlert, openConfirmModal, setAdditionalProductIndex } =
  useModalStore();

const { productInfo } = useProductStore();

const { addCartProduct } = useCartStore();
const { cartProducts } = storeToRefs(useCartStore());

const containerRef = ref<ComponentPublicInstance<HTMLDivElement>>();
const isStickyHeader = ref(false);

// 옵션 레이아웃[basic:기본 / whiteImage:옵션선택_화이트_이미지 / whiteText:옵션선택_화이트_텍스트 / blackImage:옵션선택_블랙_이미지 / blackText:옵션선택_블랙_텍스트]

onMounted(() => {
  const child = containerRef.value?.children[1];

  if (!child) return;

  const option = {
    root: containerRef.value,
    rootMargin: '7.8125vw',
    threshold: 1.0,
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries?.[0].isIntersecting) isStickyHeader.value = false;
    else isStickyHeader.value = true;
  }, option);

  observer.observe(child);
});

type CartItemType =
  | productType
  | CartProductOptionType
  | CartProductOptionGroupType;

type OptionType = CartProductOptionType | CartProductOptionGroupType;

const { t } = useI18n();

const { locale } = i18n.global;

const isGroupType = (option: CartItemType) =>
  !option.isProduct && (option.isOptionExist || option.isProductExist);

const isProductItemType = (option: CartItemType) =>
  option.isProduct && !option.isOptionExist && !option.isProductExist;

const add1 = (num: number) => {
  const result = num + 1;
  return result;
};

const { theme } = useThemeStore();
const { isThemeColorBlack } = storeToRefs(useThemeStore());

const isThemeTypeRestaurantCard: ComputedRef<boolean> = computed(() => {
  const { type } = theme;
  const isVertical = type === RESTAURANT_HORIZONTAL_CARD;

  return isVertical;
});

const isThemeTypeRestaurantHorizontal: ComputedRef<boolean> = computed(() => {
  const { type } = theme;
  const isVertical = type === RESTAURANT_HORIZONTAL;

  return isVertical;
});
const isThemeTypeRestaurantVertical: ComputedRef<boolean> = computed(() => {
  const { type } = theme;
  const isVertical = type === RESTAURANT_VERTICAL;

  return isVertical;
});

const onNextRoot = () => {
  pushPage(home);
};

const tabActive = ref<string>('detail');

const clickTab = (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  const tabName = target.getAttribute('name');

  tabActive.value = tabName ?? '';
};

const getOptionLayout = computed(() => {
  const returnObject = {
    type: 'basic',
    color: getStoreInfo.value.optionLayout?.includes('white')
      ? 'white'
      : 'black',
  };

  const isTextType = getStoreInfo.value.optionLayout?.includes(TEXT);
  const isImageType = getStoreInfo.value.optionLayout?.includes(IMAGE);

  if (isTextType) returnObject.type = TEXT;
  if (isImageType) returnObject.type = IMAGE;

  return returnObject;
});

const hasProductDescription = (description: string): boolean => {
  const isDescription = description?.length > 0;

  return isDescription;
};

const isItemType = (
  option: CartProductOptionGroupType | CartProductOptionType,
) => !option.isOptionExist && !option.isProductExist;

const mapOptionItems = (item: CartProductOptionType, parentIndex: number) => ({
  ...item,
  isOrder: item.isOrder ?? false,
  isProduct: item.isProduct ?? false,
  isOptionExist: item.isOptionExist ?? false,
  isProductExist: item.isProductExist ?? false,
  checked: false,
  quantity: 1,
  parentGroupIndex: parentIndex,
});

const mapOptions = (
  option: CartProductOptionGroupType | CartProductOptionType,
  optionGroupIndex: number,
) => {
  if (isItemType(option)) {
    return option as CartProductOptionType;
  }

  const optionGroup = option as CartProductOptionGroupType;

  return {
    ...optionGroup,
    isOrder: optionGroup.isOrder ?? false,
    isProduct: optionGroup.isProduct ?? false,
    isOptionExist: optionGroup.isOptionExist ?? false,
    isProductExist: optionGroup.isProductExist ?? false,
    items: (optionGroup.items as CartProductOptionType[])?.map((item) =>
      mapOptionItems(item, optionGroupIndex),
    ),
  };
};

productInfo.options = productInfo.options.map(mapOptions as any);

const product: Ref<cartProductType | any> = ref(productInfo);

const description = ref<string>('');

const setDescription = (descriptionValue: string) => {
  description.value = descriptionValue;
};

const getProductDescription = () => {
  requestDescription(product).then(setDescription);

  return removeSymbol(description.value);
};

const validationImg = (url: string): boolean => {
  const regex = /https?:\/\/.*\.(svg$|jpg$|jpeg$|png$|gif$|webp$)/i;
  const isImage = regex.test(url);

  return isImage;
};

const getRestaurantVerticalProductImg = (): string => {
  const { image } = product.value;
  const isImage = validationImg(image);

  if (isImage) return image;

  return 'https://static.torder.co.kr/torder2/logo_white_82x39.svg';
};

const isProductImg = (): { empty: boolean } => {
  const { image } = product.value;
  const isEmpty = { empty: !validationImg(image) };

  return isEmpty;
};

const isOptionImg = (url: string): { empty: boolean } => {
  const isEmpty = { empty: !validationImg(url) };

  return isEmpty;
};

const optionImg = (url: string): string => {
  const isEmpty = !validationImg(url);

  const defaultOptionImage =
    getOptionLayout.value.color === BLACK
      ? 'https://static.torder.co.kr/torder2/logo_all_white_82x39.svg'
      : 'https://static.torder.co.kr/torder2/logo_all_gray_82x39.svg';
  return isEmpty ? defaultOptionImage : url;
};

const options: Ref<
  (CartProductOptionGroupType | CartProductOptionType | any)[]
> = ref(productInfo.options);
const selectOptionItems: Ref<CartProductOptionType[]> = ref([]);
const selectedOptionGroup: Ref<number> = ref(0);

const isSelectOptionGroupZero = () => {
  const targetOption = options.value[selectedOptionGroup.value];

  if (isItemType(targetOption)) {
    return false;
  }

  const optionGroup = targetOption as CartProductOptionGroupType;

  return optionGroup.maxLimitQty === 0;
};

const isNoLimit: ComputedRef<boolean> = computed(isSelectOptionGroupZero);

const isGroupNoLimit = (
  option: CartProductOptionGroupType | CartProductOptionType,
) => {
  const targetOption = option;

  if (isItemType(targetOption)) {
    return false;
  }

  const optionGroup = targetOption as CartProductOptionGroupType;

  return optionGroup.maxLimitQty === 0;
};

const isNotZeroSelectedOptionGroup: ComputedRef<boolean> = computed(
  () => selectedOptionGroup.value !== 0,
);
const isNotLastSelectedOptionGroup: ComputedRef<boolean> = computed(() => {
  const selectOptionGroupLength = selectedOptionGroup.value;
  const optionsLength = options.value.length - 1;
  const isLast = selectOptionGroupLength !== optionsLength;

  return isLast;
});

const prevSelectedOptionGroup: ComputedRef<number> = computed(
  () => selectedOptionGroup.value - 1,
);
const nextSelectedOptionGroup: ComputedRef<number> = computed(
  () => selectedOptionGroup.value + 1,
);

const addCardButtonText: ComputedRef<string> = computed(() => {
  const { quantity = 0, price = 0 } = product.value;
  const productTotal = price;
  const optionTotal = selectOptionItems.value.reduce(
    (acc, cur) => acc + cur.price * cur.quantity,
    0,
  );
  const sum = (productTotal + optionTotal) * quantity;
  const text = `${quantity}${t('개')} ${t('담기')} / ${checkStandardPriceUnit(sum?.toLocaleString())}`;

  return text;
});

const changeSelectOptionIndex = (index: number): void => {
  // 옵션 레이아웃 기본 아니면 스크롤이라 해당 로직 필요 없음
  if (getOptionLayout.value.type !== BASIC) return;

  const targetOption = options.value[
    selectedOptionGroup.value
  ] as CartProductOptionGroupType;
  const isOptionRequire = isItemType(targetOption) ? 1 : targetOption.require;

  if (isOptionRequire) {
    const optionRequireFlag = (targetOption as CartProductOptionGroupType)
      .requireFlag;
    const selectedOptionItem = selectOptionItems.value.filter(
      (item) => item.parentGroupIndex === selectedOptionGroup.value,
    ).length;

    if (optionRequireFlag > selectedOptionItem) {
      openAlert(t('필수 옵션을 선택해주세요.'));
      return;
    }
  }

  let selectedOptionLength = 0;
  let selectedOptionItemQtyLength = 0;

  const optionItems = targetOption.items as OptionType[];
  selectedOptionLength = optionItems.filter((item) => item.checked)?.length;
  selectedOptionItemQtyLength = optionItems
    .filter((item) => item.checked)
    .reduce((acc, item) => {
      if (isGroupType(item)) return acc;

      const itemType = item as CartProductOptionType;

      return acc + itemType.quantity;
    }, 0);

  const isNoLimitSelect = targetOption.maxLimitSelect === 0;
  const isNoLimitQty = targetOption.maxLimitQty === 0;

  let isCheckSelect = false;
  let isCheckItemQty = false;

  if (selectedOptionLength === 0) isCheckSelect = true;
  else
    isCheckSelect = isNoLimitSelect
      ? targetOption.minLimitSelect <= selectedOptionLength
      : targetOption.minLimitSelect <= selectedOptionLength &&
        targetOption.maxLimitSelect >= selectedOptionLength;

  if (selectedOptionItemQtyLength === 0) isCheckItemQty = true;
  else
    isCheckItemQty = isNoLimitQty
      ? targetOption.minLimitQty <= selectedOptionItemQtyLength
      : targetOption.minLimitQty <= selectedOptionItemQtyLength &&
        targetOption.maxLimitQty >= selectedOptionItemQtyLength;

  const isMinMaxSelectSame =
    targetOption.minLimitSelect === targetOption.maxLimitSelect;
  const isMinMaxQtySame = targetOption.minLimitQty === targetOption.maxLimitQty;

  if (!isCheckSelect || !isCheckItemQty) {
    if (locale.value === CHINESE_GAN || locale.value === CHINESE_BUN) {
      if (!isCheckSelect) {
        if (isNoLimitSelect || isMinMaxSelectSame)
          openAlert(
            `${translateLanguage(targetOption.nameArray, targetOption.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${t('종류')} ${targetOption.minLimitSelect}${t('개')}${isMinMaxSelectSame ? '' : t('이상')}`,
          );
        else
          openAlert(
            `${translateLanguage(targetOption.nameArray, targetOption.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${t('종류')} ${targetOption.minLimitSelect} ~ ${targetOption.maxLimitSelect}${t('개 까지')}`,
          );
      }

      if (!isCheckItemQty) {
        if (isNoLimitQty || isMinMaxQtySame)
          openAlert(
            `${translateLanguage(targetOption.nameArray, targetOption.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${targetOption.minLimitQty}${t('개')}${isMinMaxQtySame ? '' : t('이상')}`,
          );
        else
          openAlert(
            `${translateLanguage(targetOption.nameArray, targetOption.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${targetOption.minLimitQty} ~ ${targetOption.maxLimitQty}${t('개 까지')}`,
          );
      }
    } else if (locale.value === ENGLISH) {
      if (!isCheckSelect) {
        if (isNoLimitSelect || isMinMaxSelectSame)
          openAlert(
            `${t('선택 가능합니다.')}\n ${isMinMaxSelectSame ? '' : t('이상')} ${t('종류')} ${targetOption.minLimitSelect}${t('개')} ${t('에서')} ${translateLanguage(targetOption.nameArray, targetOption.name)}.`,
          );
        else
          openAlert(
            `${t('선택 가능합니다.')}\n ${t('종류')} ${targetOption.minLimitSelect} ~ ${targetOption.maxLimitSelect}${t('개 까지')} ${t('에서')} ${translateLanguage(targetOption.nameArray, targetOption.name)}.`,
          );
      }

      if (!isCheckItemQty) {
        if (isNoLimitQty || isMinMaxQtySame)
          openAlert(
            `${t('선택 가능합니다.')}\n ${isMinMaxSelectSame ? '' : t('이상')} ${targetOption.minLimitQty}${t('개')} ${t('에서')} ${translateLanguage(targetOption.nameArray, targetOption.name)}.`,
          );
        else
          openAlert(
            `${t('선택 가능합니다.')}\n ${targetOption.minLimitQty} ~ ${targetOption.maxLimitQty}${t('개 까지')} ${t('에서')} ${translateLanguage(targetOption.nameArray, targetOption.name)}.`,
          );
      }
    } else {
      if (!isCheckSelect) {
        if (isNoLimitSelect || isMinMaxSelectSame)
          openAlert(
            `${translateLanguage(targetOption.nameArray, targetOption.name)}${t('에서')}\n ${t('종류')} ${targetOption.minLimitSelect}${t('개')}${isMinMaxSelectSame ? '' : t('이상')} ${t('선택 가능합니다.')}`,
          );
        else
          openAlert(
            `${translateLanguage(targetOption.nameArray, targetOption.name)}${t('에서')}\n ${t('종류')} ${targetOption.minLimitSelect} ~ ${targetOption.maxLimitSelect}${t('개 까지')} ${t('선택 가능합니다.')}`,
          );
      }

      if (!isCheckItemQty) {
        if (isNoLimitQty || isMinMaxQtySame)
          openAlert(
            `${translateLanguage(targetOption.nameArray, targetOption.name)}${t('에서')}\n ${targetOption.minLimitQty}${t('개')}${isMinMaxQtySame ? '' : t('이상')} ${t('선택 가능합니다.')}`,
          );
        else
          openAlert(
            `${translateLanguage(targetOption.nameArray, targetOption.name)}${t('에서')}\n ${targetOption.minLimitQty} ~ ${targetOption.maxLimitQty}${t('개 까지')} ${t('선택 가능합니다.')}`,
          );
      }
    }
    return;
  }

  selectedOptionGroup.value = index;
};

const getSelectOptionItems: ComputedRef<CartProductOptionType[]> = computed(
  () => {
    const optionItems = selectOptionItems.value?.filter(
      (item) => item.parentGroupIndex === selectedOptionGroup.value,
    );
    return optionItems;
  },
);

const getSelectOptionGroupItems = (optionGroupIndex: number) => {
  const optionItems = selectOptionItems.value?.filter(
    (item) => item.parentGroupIndex === optionGroupIndex,
  );
  return optionItems;
};

const isSingleProduct: ComputedRef<boolean> = computed(() => {
  const isOneMaxQuantity = product.value.maxQuantity === 1;
  return isOneMaxQuantity;
});

const isActive = (index: number): boolean => {
  const active = selectedOptionGroup.value === index;
  return active;
};

const isEmptySelectOptionItems = (
  optionItems: CartProductOptionType[],
): boolean => {
  const isEmpty = optionItems.length === 0;
  return isEmpty;
};

const isSelectOption = (
  productOption: CartProductOptionGroupType | CartProductOptionType,
) => {
  if (isItemType(productOption)) {
    const item = productOption as CartProductOptionType;
    return item.checked;
  }
  const group = productOption as CartProductOptionGroupType;

  const isOption = (group.items as CartProductOptionType[]).find(
    (option) => option.checked,
  );
  if (isOption) return true;
  return false;
};

const isRequireOption = (
  productOption: CartProductOptionGroupType | CartProductOptionType,
) => {
  if (isItemType(productOption)) {
    return true;
  }

  const group = productOption as CartProductOptionGroupType;

  const isProductOptionRequire = group.requireFlag === 1;
  return isProductOptionRequire;
};

const isCheckedOptionGroup = (
  optionGroupIndex: number,
): { active: boolean } => {
  const isChecked = optionGroupIndex === selectedOptionGroup.value;
  const active = { active: isChecked };
  return active;
};

const isAnyCheckOptionInGroup = (
  productOption: CartProductOptionGroupType | CartProductOptionType,
) => {
  if (isItemType(productOption)) {
    const itemType = productOption as CartProductOptionType;
    return itemType.checked;
  }

  const groupType = productOption as CartProductOptionGroupType;

  return groupType.items.some((item) => item.checked);
};

const isCheckedOptionSelect = (
  optionItem: CartProductOptionType,
): { active: boolean } => {
  const isChecked = optionItem.checked;
  const active = { active: isChecked };
  return active;
};

const isOptionChecked = (checked: boolean): string => {
  if (checked && getOptionLayout.value.type !== BASIC)
    return 'https://static.torder.co.kr/torder2/icon_check_red.svg';
  if (!checked && getOptionLayout.value.type !== BASIC) return '';
  if (checked)
    return 'https://static.torder.co.kr/torder2/options-checkbox-red-42x40.svg';
  return 'https://static.torder.co.kr/torder2/options-checkbox-white-42x40.svg';
};

const optionCheckImgRestaurant = (checked: boolean): string => {
  if (isThemeColorBlack.value) {
    if (checked)
      return 'https://static.torder.co.kr/torder2/icn_checkbox_black_checked.svg';

    return 'https://static.torder.co.kr/torder2/icn_checkbox_black.svg';
  }

  if (checked)
    return 'https://static.torder.co.kr/torder2/restaurant-checkbox-black-34x34.svg';
  return 'https://static.torder.co.kr/torder2/restaurant-checkbox-white-34x34.svg';
};

const isOptionMaxQuantity = (item: CartProductOptionType) => {
  const isMaxQuantity = item.limitQty === 1;
  return isMaxQuantity;
};

const isSelectOptionRequire: ComputedRef<boolean> = computed(() => {
  const targetOption = options.value[selectedOptionGroup.value];

  const isRequire = isItemType(targetOption)
    ? true
    : (targetOption as CartProductOptionGroupType).requireFlag === 1;
  return isRequire;
});

const isGroupSelectOptionRequire = (
  option: CartProductOptionGroupType | CartProductOptionType,
) => {
  const targetOption = option;

  const isRequire = isItemType(targetOption)
    ? true
    : (targetOption as CartProductOptionGroupType).requireFlag === 1;
  return isRequire;
};

const getSelectedOptionGroupName = (item: CartProductOptionType) => {
  const { nameArray, name } = options.value[item.parentGroupIndex];

  return translateLanguage(nameArray, name);
};
const getOptionItemKey = (parentGroupIndex: number, code: string): string =>
  `${parentGroupIndex}:${code}`;

const getTotalPrice: ComputedRef<string> = computed(() => {
  const productOptionItemTotalPrice = selectOptionItems.value.reduce(
    (acc, current) => acc + current.price * current.quantity,
    0,
  );
  const totalPrice =
    (product.value.price + productOptionItemTotalPrice) *
    product.value.quantity;
  return totalPrice?.toLocaleString();
});

const addOption = (optionItemIndex: number) => {
  const target = options.value[selectedOptionGroup.value];
  const targetItems = (target as CartProductOptionGroupType)
    .items as CartProductOptionType[];
  const targetOptionItem = isItemType(target)
    ? (target as CartProductOptionType)
    : targetItems[optionItemIndex];
  targetOptionItem.checked = true;

  const newOptionItem = {
    ...targetOptionItem,
    quantity: targetOptionItem.quantity ?? 1,
  };
  selectOptionItems.value.unshift(newOptionItem);
};

const addOptionInGroup = (
  optionGroup: CartProductOptionGroupType,
  optionItemIndex: number,
) => {
  const target = optionGroup;
  const targetItems = (target as CartProductOptionGroupType)
    .items as CartProductOptionType[];
  const targetOptionItem = targetItems[optionItemIndex];
  targetOptionItem.checked = true;

  const newOptionItem = {
    ...targetOptionItem,
    quantity: targetOptionItem.quantity ?? 1,
  };
  selectOptionItems.value.unshift(newOptionItem);
};

const deleteOptionItemAll = () => {
  const targetOption = options.value[selectedOptionGroup.value];
  if (isItemType(targetOption)) {
    const optionItem = targetOption as CartProductOptionType;

    optionItem.checked = false;
    optionItem.quantity = 1;
    return;
  }

  const optionGroup = targetOption as CartProductOptionGroupType;
  optionGroup.items = (optionGroup.items as CartProductOptionType[])?.map(
    (item) => mapOptionItems(item, selectedOptionGroup.value),
  );
  selectOptionItems.value = selectOptionItems.value.filter(
    (item) => item.parentGroupIndex !== selectedOptionGroup.value,
  );
};

const deleteOptionItem = (
  optionItem: CartProductOptionType,
  optionItemIndex: number,
  optionGroupIndex?: number,
) => {
  const targetOption =
    options.value[optionGroupIndex ?? selectedOptionGroup.value];
  if (isItemType(targetOption)) {
    const optionItem = targetOption as CartProductOptionType;
    optionItem.checked = false;
    optionItem.quantity = 1;
    return;
  }

  const optionGroup = targetOption as CartProductOptionGroupType;

  const target = optionGroup.items[optionItemIndex];
  target.checked = false;

  const isFindOptionItem = (item: CartProductOptionType) => {
    const isparentGroupIndex =
      item.parentGroupIndex !== selectedOptionGroup.value;
    const isCode = item.code !== optionItem.code;
    const isFind = isparentGroupIndex || isCode;

    return isFind;
  };

  selectOptionItems.value = selectOptionItems.value.filter(isFindOptionItem);
};

const deleteOptionItemByIndex = (
  selectItem: CartProductOptionType,
  optionItemIndex: number,
) => {
  const targetOption = options.value[selectItem.parentGroupIndex];
  const findCode = (item: CartProductOptionType): boolean =>
    item.code === selectItem.code;
  if (isItemType(targetOption)) {
    const optionItem = targetOption as CartProductOptionType;
    selectOptionItems.value.splice(optionItemIndex, 1);
    optionItem.checked = false;
    optionItem.quantity = 1;
    return;
  }

  const optionGroup = targetOption as CartProductOptionGroupType;
  const targetIndex: number = (
    optionGroup.items as CartProductOptionType[]
  ).findIndex(findCode);
  const target = optionGroup.items[targetIndex];

  selectOptionItems.value.splice(optionItemIndex, 1);
  target.checked = false;
};

const deleteOptionItemByParentGroupIndex = (
  selectItem: CartProductOptionType,
  parentGroupIndex: number,
) => {
  const findCode = (item: CartProductOptionType): boolean =>
    item.code === selectItem.code && item.parentGroupIndex === parentGroupIndex;
  const targetIndex: number = selectOptionItems.value.findIndex(findCode);

  selectOptionItems.value.splice(targetIndex, 1);
};

const isOptionMaxSelect: ComputedRef<boolean> = computed(() => {
  const targetOption = options.value[selectedOptionGroup.value];

  const optionLimitQuantity = isItemType(targetOption)
    ? 0
    : (targetOption as CartProductOptionGroupType).maxLimitQty;
  const currentOptionItemQuantity = (targetOption as CartProductOptionType)
    .checked
    ? 1
    : 0;
  const currentOptionItemsQuantity = (
    (targetOption as CartProductOptionGroupType)
      .items as CartProductOptionType[]
  ).reduce((acc, current) => acc + Number(current.checked), 0);
  const optionCurrentQuantity = isItemType(targetOption)
    ? currentOptionItemQuantity
    : currentOptionItemsQuantity;
  const isMaxSelect = optionLimitQuantity === optionCurrentQuantity;
  const isNoLimit = optionLimitQuantity === 0;

  return isMaxSelect && !isNoLimit;
});

const selectOption = (
  group: CartProductOptionGroupType,
  optionItem: CartProductOptionType,
  optionItemIndex: number,
): void => {
  // 품절 상태면 무시
  if (!optionItem.isSale) {
    openAlert(t('품절되었습니다.'));
    return;
  }

  const targetOption = options.value[selectedOptionGroup.value];

  const target = isItemType(targetOption)
    ? (targetOption as CartProductOptionType)
    : (targetOption as CartProductOptionGroupType).items[optionItemIndex];

  const selectCount = group.items.filter((item) => item.checked).length;

  const selectItemQty = group.items
    .filter((item) => item.checked)
    .reduce((acc, item) => {
      if (isGroupType(item)) return acc;

      if (isProductItemType(item)) {
        const productType = item as productType;

        return acc + productType.quantity;
      }

      const optionItem = item as CartProductOptionType;

      return acc + optionItem.quantity;
    }, 0);

  const isMaxGroupItemQuantity = selectItemQty === group.maxLimitQty;

  const isMaxGroupItemSelect = selectCount === group.maxLimitSelect;

  if (!target.checked && isMaxGroupItemQuantity && group.maxLimitQty !== 0) {
    if (locale.value === CHINESE_GAN || locale.value === CHINESE_BUN) {
      openAlert(`${t('선택 가능합니다.')} ${group.maxLimitQty}${t('개 까지')}`);
    } else if (locale.value === ENGLISH) {
      openAlert(
        `${t('선택 가능합니다.')} ${t('개 까지')} ${group.maxLimitQty}`,
      );
    } else {
      openAlert(`${group.maxLimitQty}${t('개 까지')} ${t('선택 가능합니다.')}`);
    }
    return;
  }

  if (!target.checked && isMaxGroupItemSelect && group.maxLimitSelect !== 0) {
    if (
      locale.value === CHINESE_GAN ||
      locale.value === CHINESE_BUN ||
      locale.value === ENGLISH
    ) {
      openAlert(
        `${t('선택 가능합니다.')} ${t('종류')} ${group.maxLimitSelect}${t('개 까지')}`,
      );
    } else {
      openAlert(
        `${t('종류')} ${group.maxLimitSelect}${t('개 까지')} ${t('선택 가능합니다.')}`,
      );
    }
    return;
  }

  if (target.checked) {
    deleteOptionItem(optionItem, optionItemIndex);
    return;
  }

  if (isOptionMaxSelect.value) {
    openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    return;
  }

  addOption(optionItemIndex);
};

const selectOptionInGroup = (
  group: CartProductOptionGroupType,
  optionIndex: number,
  optionItem: CartProductOptionType,
  optionItemIndex: number,
): void => {
  if (!optionItem.isSale) {
    // 품절 상태면 무시
    openAlert(t('품절되었습니다.'));
    return;
  }

  const targetOption = group;

  selectedOptionGroup.value = optionIndex;

  const target = (targetOption as CartProductOptionGroupType).items[
    optionItemIndex
  ];

  const selectCount = group.items.filter((item) => item.checked).length;

  const selectItemQty = group.items
    .filter((item) => item.checked)
    .reduce((acc, item) => {
      if (isGroupType(item)) return acc;

      if (isProductItemType(item)) {
        const productType = item as productType;

        return acc + productType.quantity;
      }

      const optionItem = item as CartProductOptionType;

      return acc + optionItem.quantity;
    }, 0);

  const isMaxGroupItemQuantity = selectItemQty === group.maxLimitQty;

  const isMaxGroupItemSelect = selectCount === group.maxLimitSelect;

  if (!target.checked && isMaxGroupItemQuantity && group.maxLimitQty !== 0) {
    if (locale.value === CHINESE_GAN || locale.value === CHINESE_BUN) {
      openAlert(`${t('선택 가능합니다.')} ${group.maxLimitQty}${t('개 까지')}`);
    } else if (locale.value === ENGLISH) {
      openAlert(
        `${t('선택 가능합니다.')} ${t('개 까지')} ${group.maxLimitQty}`,
      );
    } else {
      openAlert(`${group.maxLimitQty}${t('개 까지')} ${t('선택 가능합니다.')}`);
    }
    return;
  }

  if (!target.checked && isMaxGroupItemSelect && group.maxLimitSelect !== 0) {
    if (
      locale.value === CHINESE_GAN ||
      locale.value === CHINESE_BUN ||
      locale.value === ENGLISH
    ) {
      openAlert(
        `${t('선택 가능합니다.')} ${t('종류')} ${group.maxLimitSelect}${t('개 까지')}`,
      );
    } else {
      openAlert(
        `${t('종류')} ${group.maxLimitSelect}${t('개 까지')} ${t('선택 가능합니다.')}`,
      );
    }
    return;
  }

  if (target.checked) {
    deleteOptionItem(optionItem, optionItemIndex, optionIndex);
    return;
  }

  if (isOptionMaxSelect.value) {
    openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    return;
  }

  addOptionInGroup(targetOption, optionItemIndex);

  const isSelectDone =
    (isMaxGroupItemQuantity && group.maxLimitQty !== 0) ||
    (isMaxGroupItemSelect && group.maxLimitSelect !== 0) ||
    group.items.every((item) => item.checked);

  const nextGroupIndex = options.value.findIndex((option) => {
    if (isItemType(option)) {
      return false;
    }

    const groupType = option as CartProductOptionGroupType;

    return groupType.items.every((item) => !item.checked);
  });

  if (isSelectDone && nextGroupIndex >= 0) {
    const scrollElement = document.querySelector('.option-wrap') as HTMLElement;
    const scrollTarget = document.getElementById(
      `${options.value[nextGroupIndex].name}-${nextGroupIndex}`,
    ) as HTMLElement;

    scrollMove({
      parent: scrollElement,
      child: scrollTarget,
      adjustScroll: 80,
    });
  }
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

const increaseOptionQuantity = (itemIndex: number): void => {
  const optionItem: CartProductOptionType = selectOptionItems.value[itemIndex];
  const optionItemQuantity: number = optionItem.quantity;
  const optionItemMaxQuantity: number = optionItem.limitQty;
  const isNoLimit: boolean = optionItem.limitQty === 0;
  const isProductQuantityMax: boolean =
    optionItemQuantity === optionItemMaxQuantity;
  const targetGroup = options.value[optionItem.parentGroupIndex];

  let selectItemQty = 0;
  let isMaxGroupItemQuantity = false;
  let isNoLimitGroupMaxQty = false;

  if (targetGroup && isGroupType(targetGroup)) {
    const groupType = targetGroup as CartProductOptionGroupType;
    const options = groupType.items;

    selectItemQty = options
      .filter((item) => item.checked)
      .reduce((acc, item) => {
        if (isGroupType(item)) return acc;

        const itemType = item as CartProductOptionType;

        return acc + itemType.quantity;
      }, 0);

    isMaxGroupItemQuantity = selectItemQty === groupType.maxLimitQty;
    isNoLimitGroupMaxQty = groupType.maxLimitQty === 0;
  }

  if (
    (isProductQuantityMax && !isNoLimit) ||
    (isMaxGroupItemQuantity && !isNoLimitGroupMaxQty)
  ) {
    openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    return;
  }

  if (isGroupType(targetGroup)) {
    const groupType = targetGroup as CartProductOptionGroupType;
    const options = groupType.items;
    const targetItem = options.find((item) => {
      if (item.isOptionExist || item.isProductExist) return false;
      const itemType = item as CartProductOptionType;

      return itemType.code === optionItem.code;
    });

    if (targetItem) targetItem.quantity += 1;
  }

  optionItem.quantity += 1;
};

const decreaseOptionQuantity = (
  selectedOptionItem: CartProductOptionType,
  itemIndex: number,
): void => {
  const optionItem: CartProductOptionType = selectOptionItems.value[itemIndex];
  const optionItemQuantity: number = optionItem.quantity;

  const targetGroup = options.value[optionItem.parentGroupIndex];

  if (optionItemQuantity === 1) {
    deleteOptionItemByIndex(selectedOptionItem, itemIndex);
    return;
  }

  if (isGroupType(targetGroup)) {
    const groupType = targetGroup as CartProductOptionGroupType;
    const options = groupType.items;
    const targetItem = options.find((item) => {
      if (item.isOptionExist || item.isProductExist) return false;
      const itemType = item as CartProductOptionType;

      return itemType.code === optionItem.code;
    });

    if (targetItem) targetItem.quantity -= 1;
  }

  optionItem.quantity -= 1;
};

watch(
  () => selectOptionItems.value.length,
  (newLength) => {
    if (newLength !== 0) {
      tabActive.value = 'selectOption';
      return;
    }

    tabActive.value = 'detail';
  },
);

// optionItems 정렬 함수
const sortSelectOptionItems = (
  optionItems: CartProductOptionType[],
): CartProductOptionType[] =>
  optionItems.sort((a, b) => {
    if (a.code < b.code) return -1;

    if (a.code > b.code) return 1;

    if (a.code === b.code) {
      if (a.parentGroupIndex < b.parentGroupIndex) {
        return -1;
      }

      return 1;
    }

    return -1;
  });

// 장바구니 중복 상품 체크
const checkCartProducts = (product: cartProductType): number => {
  if (cartProducts.value?.length === 0) return -1;

  const targetIndex = cartProducts.value?.findIndex((cartProduct) => {
    const cartProductToString = JSON.stringify(cartProduct.options);
    const productToString = JSON.stringify(product.options);

    return (
      cartProduct.id === product.id && cartProductToString === productToString
    );
  });

  return targetIndex;
};

// 필수 옵션 체크
const checkRequireOptionGroup = (): boolean => {
  const checkSelection: { [index: string]: CartProductOptionType[] } = {};

  selectOptionItems.value?.forEach((item) => {
    if (
      Object.prototype.hasOwnProperty.call(
        checkSelection,
        item.parentGroupIndex,
      )
    ) {
      checkSelection[item.parentGroupIndex].push(item);
    } else {
      checkSelection[item.parentGroupIndex] = [item];
    }
  });

  const checkOptionGroup: number = options.value?.findIndex(
    (
      option: CartProductOptionGroupType | CartProductOptionType,
      index: number,
    ) => {
      const optionGroup = option as CartProductOptionGroupType;

      if (optionGroup.requireFlag !== 1) return false;

      if (isItemType(option) && !option.checked) {
        openAlert(
          `${t('필수 항목 옵션을 선택해주세요.', { option: option.name })}`,
        );
        return true;
      }

      let selectedOptionLength = 0;
      let selectedOptionItemQtyLength = 0;

      if (isGroupType(option)) {
        const group = option as CartProductOptionGroupType;

        const options = group.items as OptionType[];
        selectedOptionLength = options.filter((item) => item.checked)?.length;
        selectedOptionItemQtyLength = options
          .filter((item) => item.checked)
          .reduce((acc, item) => {
            if (isGroupType(item)) return acc;

            const itemType = item as CartProductOptionType;

            return acc + itemType.quantity;
          }, 0);

        if (selectedOptionLength === 0) {
          openAlert(
            `${t('필수 항목 옵션을 선택해주세요.', { option: optionGroup.name })}`,
          );
          selectedOptionGroup.value = index;
          return true;
        }

        const isNoLimitSelect = group.maxLimitSelect === 0;
        const isNoLimitQty = group.maxLimitQty === 0;

        let isCheckSelect = false;
        let isCheckItemQty = false;

        if (selectedOptionLength === 0) isCheckSelect = true;
        else
          isCheckSelect = isNoLimitSelect
            ? group.minLimitSelect <= selectedOptionLength
            : group.minLimitSelect <= selectedOptionLength &&
              group.maxLimitSelect >= selectedOptionLength;

        if (selectedOptionItemQtyLength === 0) isCheckItemQty = true;
        else
          isCheckItemQty = isNoLimitQty
            ? group.minLimitQty <= selectedOptionItemQtyLength
            : group.minLimitQty <= selectedOptionItemQtyLength &&
              group.maxLimitQty >= selectedOptionItemQtyLength;

        const isMinMaxSelectSame =
          group.minLimitSelect === group.maxLimitSelect;
        const isMinMaxQtySame = group.minLimitQty === group.maxLimitQty;

        if (!isCheckSelect || !isCheckItemQty) {
          if (locale.value === CHINESE_GAN || locale.value === CHINESE_BUN) {
            if (!isCheckSelect) {
              if (isNoLimitSelect || isMinMaxSelectSame)
                openAlert(
                  `${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${t('종류')} ${group.minLimitSelect}${t('개')}${isMinMaxSelectSame ? '' : t('이상')}`,
                );
              else
                openAlert(
                  `${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${t('종류')} ${group.minLimitSelect} ~ ${group.maxLimitSelect}${t('개 까지')}`,
                );
            }

            if (!isCheckItemQty) {
              if (isNoLimitQty || isMinMaxQtySame)
                openAlert(
                  `${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${group.minLimitQty}${t('개')}${isMinMaxQtySame ? '' : t('이상')}`,
                );
              else
                openAlert(
                  `${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${t('선택 가능합니다.')} ${group.minLimitQty} ~ ${group.maxLimitQty}${t('개 까지')}`,
                );
            }
          } else if (locale.value === ENGLISH) {
            if (!isCheckSelect) {
              if (isNoLimitSelect || isMinMaxSelectSame)
                openAlert(
                  `${t('선택 가능합니다.')}\n ${isMinMaxSelectSame ? '' : t('이상')} ${t('종류')} ${group.minLimitSelect}${t('개')} ${t('에서')} ${translateLanguage(group.nameArray, group.name)}.`,
                );
              else
                openAlert(
                  `${t('선택 가능합니다.')}\n ${t('종류')} ${group.minLimitSelect} ~ ${group.maxLimitSelect}${t('개 까지')} ${t('에서')} ${translateLanguage(group.nameArray, group.name)}.`,
                );
            }

            if (!isCheckItemQty) {
              if (isNoLimitQty || isMinMaxQtySame)
                openAlert(
                  `${t('선택 가능합니다.')}\n ${isMinMaxSelectSame ? '' : t('이상')} ${group.minLimitQty}${t('개')} ${t('에서')} ${translateLanguage(group.nameArray, group.name)}.`,
                );
              else
                openAlert(
                  `${t('선택 가능합니다.')}\n ${group.minLimitQty} ~ ${group.maxLimitQty}${t('개 까지')} ${t('에서')} ${translateLanguage(group.nameArray, group.name)}.`,
                );
            }
          } else {
            if (!isCheckSelect) {
              if (isNoLimitSelect || isMinMaxSelectSame)
                openAlert(
                  `${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${t('종류')} ${group.minLimitSelect}${t('개')}${isMinMaxSelectSame ? '' : t('이상')} ${t('선택 가능합니다.')}`,
                );
              else
                openAlert(
                  `${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${t('종류')} ${group.minLimitSelect} ~ ${group.maxLimitSelect}${t('개 까지')} ${t('선택 가능합니다.')}`,
                );
            }

            if (!isCheckItemQty) {
              if (isNoLimitQty || isMinMaxQtySame)
                openAlert(
                  `${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${group.minLimitQty}${t('개')}${isMinMaxQtySame ? '' : t('이상')} ${t('선택 가능합니다.')}`,
                );
              else
                openAlert(
                  `${translateLanguage(group.nameArray, group.name)}${t('에서')}\n ${group.minLimitQty} ~ ${group.maxLimitQty}${t('개 까지')} ${t('선택 가능합니다.')}`,
                );
            }
          }

          selectedOptionGroup.value = index;
          return true;
        }
      }

      return false;
    },
  );

  if (checkOptionGroup === -1) return false;

  return true;
};

const convertOptionGroupCart = (items: CartProductOptionType[]) => {
  const cartOptionGroups = [
    ...product.value.options.map((option: any) => ({
      ...option,
      items: [] as CartProductOptionType[],
    })),
  ];

  items.forEach((item) => {
    cartOptionGroups[item.parentGroupIndex].items.push(item);
  });

  return cartOptionGroups;
};

const addCart = (): void => {
  const targetProduct = { ...product.value } as cartProductType;

  // 선택한 옵션 정렬
  targetProduct.options = convertOptionGroupCart(
    sortSelectOptionItems(selectOptionItems.value),
  );

  // 필수옵션 검증
  const checkRequire = checkRequireOptionGroup();

  if (checkRequire) return;

  // 장바구니에 동일한 상품 있는지 검증
  const { name, quantity, maxQuantity } = targetProduct;

  // 동일한 상품 && 옵션이 담겨져 있을때 수량만 증가
  const checkIndex = checkCartProducts(targetProduct);

  // 중복된 상품을 담을 경우
  if (checkIndex !== -1) {
    if (
      maxQuantity !== 0 &&
      cartProducts.value[checkIndex].quantity >= maxQuantity
    ) {
      openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    } else {
      // 수량 추가 확인창
      openConfirmModal(BASIC_CONFIRM, name, t('장바구니 담기'));
      setAdditionalProductIndex(checkIndex);
    }

    return;
  }

  // 장바구니에 없다면 바로 장바구니 추가
  addCartProduct(targetProduct);
  openAlert(
    `${t('상품을 n개 담았습니다.', {
      product: name,
      count: quantity,
    })}`,
  );
  onNextRoot();
  openModal(CART);
};

// 세로테마 전용 로직
const restaurantVerticalSelectOption = (
  group: CartProductOptionGroupType,
  groupIndex: number,
  itemIndex: number,
): void => {
  const targetOption = options.value[groupIndex];
  const target = isItemType(targetOption)
    ? (targetOption as CartProductOptionType)
    : (targetOption as CartProductOptionGroupType).items[itemIndex];
  if (target.isProduct) return;

  const targetItem = target as CartProductOptionType;
  const { checked } = targetItem;

  const selectCount = group.items.filter((item) => item.checked).length;

  const selectItemQty = group.items
    .filter((item) => item.checked)
    .reduce((acc, item) => {
      if (isGroupType(item)) return acc;

      if (isProductItemType(item)) {
        const productType = item as productType;

        return acc + productType.quantity;
      }

      const optionItem = item as CartProductOptionType;

      return acc + optionItem.quantity;
    }, 0);

  const isMaxGroupItemQuantity = selectItemQty === group.maxLimitQty;

  const isMaxGroupItemSelect = selectCount === group.maxLimitSelect;

  if (
    !targetItem.checked &&
    isMaxGroupItemQuantity &&
    group.maxLimitQty !== 0
  ) {
    if (locale.value === CHINESE_GAN || locale.value === CHINESE_BUN) {
      openAlert(`${t('선택 가능합니다.')} ${group.maxLimitQty}${t('개 까지')}`);
    } else if (locale.value === ENGLISH) {
      openAlert(
        `${t('선택 가능합니다.')} ${t('개 까지')} ${group.maxLimitQty}`,
      );
    } else {
      openAlert(`${group.maxLimitQty}${t('개 까지')} ${t('선택 가능합니다.')}`);
    }
    return;
  }

  if (
    !targetItem.checked &&
    isMaxGroupItemSelect &&
    group.maxLimitSelect !== 0
  ) {
    if (
      locale.value === CHINESE_GAN ||
      locale.value === CHINESE_BUN ||
      locale.value === ENGLISH
    ) {
      openAlert(
        `${t('선택 가능합니다.')} ${t('종류')} ${group.maxLimitSelect}${t('개 까지')}`,
      );
    } else {
      openAlert(
        `${t('종류')} ${group.maxLimitSelect}${t('개 까지')} ${t('선택 가능합니다.')}`,
      );
    }
    return;
  }

  if (checked) {
    targetItem.checked = false;
    deleteOptionItemByParentGroupIndex(targetItem, groupIndex);

    return;
  }

  if (isOptionMaxSelect.value) {
    openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    return;
  }

  targetItem.checked = true;
  targetItem.parentGroupIndex = groupIndex;
  selectOptionItems.value.push(targetItem);
};

const restaurantVerticalIncreaseOptionQty = (
  groupIndex: number,
  itemIndex: number,
): void => {
  const targetGroup = product.value.options[groupIndex];
  const target = isItemType(targetGroup)
    ? (targetGroup as CartProductOptionType)
    : (
        (targetGroup as CartProductOptionGroupType)
          .items as CartProductOptionType[]
      )[itemIndex];

  const optionItemQuantity: number = target.quantity;
  const optionItemMaxQuantity: number = target.limitQty;

  const isNoLimit: boolean = target.limitQty === 0;
  const isProductQuantityMax: boolean =
    optionItemQuantity === optionItemMaxQuantity;

  let selectItemQty = 0;
  let isMaxGroupItemQuantity = false;
  let isNoLimitGroupMaxQty = false;

  if (targetGroup && isGroupType(targetGroup)) {
    const groupType = targetGroup as CartProductOptionGroupType;
    const options = groupType.items;

    selectItemQty = options
      .filter((item) => item.checked)
      .reduce((acc, item) => {
        if (isGroupType(item)) return acc;

        const itemType = item as CartProductOptionType;

        return acc + itemType.quantity;
      }, 0);

    isMaxGroupItemQuantity = selectItemQty === groupType.maxLimitQty;
    isNoLimitGroupMaxQty = groupType.maxLimitQty === 0;
  }

  if (
    (isProductQuantityMax && !isNoLimit) ||
    (isMaxGroupItemQuantity && !isNoLimitGroupMaxQty)
  ) {
    openAlert(`${t('더 이상 수량을')} \n ${t('추가하실 수 없습니다.')}`);
    return;
  }

  if (!target.checked) {
    target.checked = true;
    target.parentGroupIndex = groupIndex;
    return;
  }

  target.quantity += 1;
  target.parentGroupIndex = groupIndex;
};

const restaurantVerticalDecreaseOptionQty = (
  groupIndex: number,
  itemIndex: number,
): void => {
  const targetGroup = product.value.options[groupIndex];
  const target = isItemType(targetGroup)
    ? (targetGroup as CartProductOptionType)
    : (
        (targetGroup as CartProductOptionGroupType)
          .items as CartProductOptionType[]
      )[itemIndex];
  const { quantity } = target;

  if (quantity === 1) {
    target.checked = false;
    return;
  }

  target.quantity -= 1;
};

const getItemTotalPrice = (item: CartProductOptionType) =>
  item.price * item.quantity;

const getLimitSelectString = (count: number) => {
  if (locale.value === CHINESE_GAN || locale.value === CHINESE_BUN) {
    return `${t('개 까지 선택할 수 있습니다.')} ${count} ${t('개')}`;
  }
  if (locale.value === ENGLISH) {
    return `${t('개 까지 선택할 수 있습니다.')} ${count}`;
  }
  return `${count}${t('개 까지 선택할 수 있습니다.')}`;
};
const activeAddCartButtonColor = getSubPrimaryColor(
  buttonBackgroundColor.value,
  10,
  'Y',
);
const activeDarkCloseButtonColor = getSubPrimaryColor('#212121', 10, 'Y');
const activeLightCloseButtonColor = getSubPrimaryColor('#f3f3f3', 10, 'Y');
</script>

<style scoped lang="scss">
.option-select-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  word-break: break-all;
  background-color: #fff;

  &.else {
    font-family: pretendard, sans-serif;
    background-color: #222;
  }

  &.not-basic {
    display: grid;
    grid-template-rows: 6.25vw calc(100% - 13.2813vw) 7.0313vw;
    margin: 3.9063vw 1.5625vw;
    border-radius: 1.1719vw;

    &.black {
      background-color: #1e1a1a;
    }

    &.white {
      background-color: #fff;
    }
  }

  &.restaurant-vertical {
    margin-bottom: 13.75vw;
    overflow: scroll;

    &.black {
      background-color: #222;
    }
    &:deep(.product-detail-button-wrap) {
      position: fixed;
      bottom: 0;
    }

    &:deep(.product-detail-description-wrap) {
      flex: none;
    }
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
    border-top: 0.625vw solid #333;
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

.background-wall {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 26;
  background-color: rgba($color: #000000, $alpha: 0.5);
}

.not-basic-product-price-all {
  display: grid;
  grid-template-columns: 55% 45%;
  justify-content: space-between;
  font-size: 2.75vw;
  font-weight: 700;
  border-top: 0.0781vw solid v-bind(buttonBackgroundColor);
  border-bottom-right-radius: 1.1719vw;
  border-bottom-left-radius: 1.1719vw;

  &.black {
    color: #ffffff;
    background-color: #212121;

    .right-side {
      display: flex;
      border-left: 0.0781vw solid #000000;

      .close-button {
        display: flex;
        justify-content: center;
        width: 10vw;

        &.button-active {
          background-color: v-bind(activeDarkCloseButtonColor);
        }
      }

      .product-button {
        flex: 1;
      }
    }
  }

  &.white {
    color: #000;
    background-color: #f3f3f3;

    .right-side {
      display: flex;
      border-left: 0.0781vw solid #b9b9b9;

      .close-button {
        display: flex;
        justify-content: center;
        width: 10vw;

        &.button-active {
          background-color: v-bind(activeLightCloseButtonColor);
        }
      }

      .product-button {
        flex: 1;
      }
    }
  }

  .left-side {
    display: flex;
    justify-content: space-between;
    padding: 0 1.5625vw;

    .quantity {
      display: flex;
      align-items: center;
    }
  }

  .right-side {
    display: flex;
    justify-content: space-between;
  }

  .option-item-quantity-wrap {
    display: flex;
    gap: 2.3438vw;
    align-items: center;
  }

  .quantity-img {
    width: 7.8125vw;
    height: 3.9063vw;
    background-color: #504848;
    border-radius: 0.3906vw;

    &.button-active {
      filter: brightness(0.8);
    }
  }

  .price {
    display: flex;
    align-items: center;
  }

  .close-button {
    display: flex;
    align-items: center;
  }

  .product-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35vw;
    height: 7.0313vw;
    color: #fff;
    background-color: v-bind(buttonBackgroundColor);
    border-bottom-right-radius: 1.1719vw;

    &.button-active {
      background-color: v-bind(activeAddCartButtonColor);
    }
  }
}

.select-wrap {
  &.not-basic {
    &.image {
      .select-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.7813vw;
        padding: 0 0.7813vw 1.5625vw 0.7813vw;
        background-color: #362c2c;
        border-bottom-right-radius: 0.7813vw;
        border-bottom-left-radius: 0.7813vw;
      }

      &.white {
        .select-list {
          background-color: #f5f5f5;
        }
      }

      .select-item {
        display: flex;
        flex-direction: column;
        gap: 0.7813vw;
        align-items: center;
        padding: 0;
        background-color: transparent;

        .text {
          font-size: 1.625vw;
        }
      }
    }

    .select-item {
      padding: 1.4vw 0;

      &.none {
        margin: 0 1.5625vw;

        .name {
          display: flex;
          align-items: center;
          font-size: 2.25vw;
          font-weight: 700;
        }

        &.black {
          .name {
            color: #fff;
          }
        }

        &.white {
          .name {
            color: #000;
          }
        }
      }

      &.image {
        margin: 0;

        &.white {
          .option-image-wrapper {
            background-color: #fff;
          }
        }
      }

      .option-image-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 10.4688vw;
        background-color: #2c2424;
        border-radius: 0.3906vw;

        .option-image {
          margin-left: 1.5625vw;
          object-fit: none;
        }

        .select-item-background-wall {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-color: rgba(0, 0, 0, 0.7);
          border-radius: 0.3906vw;
        }

        .check-option {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 5;
          transform: translate(-50%, -50%);

          &.img {
            width: 55%;
            height: 55%;
          }
        }
      }
    }
  }
}
</style>
