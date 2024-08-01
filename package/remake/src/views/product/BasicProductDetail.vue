<template>
  <div class="basic-detail-container">
    <div class="basic-detail-header">
      <div class="basic-detail-header-title ellipsis-text-1">
        {{ removeNewLine(translateLanguage(productInfo.productLanguage, productInfo.productLanguage?.ko)) }}
      </div>
      <div
        class="basic-detail-header-close-button"
        @click="pushPage(home)"
      >
        <img
          id="basic-detail-header-close-icon-sub-element"
          src="https://static.torder.co.kr/torder2/btn_close_black.svg"
          alt="닫기버튼"
        >
        <span id="basic-detail-header-close-text-sub-element">
          {{ t('닫기') }}
        </span>
      </div>
    </div>
    <div class="basic-detail-body">
      <div class="basic-detail-body-image-wrap">
        <img
          class="basic-detail-body-image"
          :class="{ 'empty-image': !validationImg(productInfo.image) }"
          :src="getProductImg()"
        >
      </div>
      <div class="basic-detail-body-info-container">
        <div class="basic-detail-body-info-tabs-wrap">
          <div
            v-if="isUseDescription"
            class="basic-detail-body-info-tabs-button detail"
            :class="{ 'active-tab': activeTab === 'detail' }"
            @click="setTabsActive('detail')"
          >
            {{ t('상세정보') }}
          </div>
          <div
            v-if="isUseAllergy"
            class="basic-detail-body-info-tabs-button"
            :class="{ 'active-tab': activeTab === 'allergy' }"
            @click="setTabsActive('allergy')"
          >
            {{ t('알레르기 유발 식품') }}
          </div>
        </div>
        <div class="basic-detail-body-product-info-wrap">
          <span class="basic-detail-body-product-info-title">
            {{ t('기본가격') }}
          </span>
          <span class="basic-detail-body-product-info-price">
            {{ checkStandardPriceUnit(productInfo?.price?.toLocaleString()) }}
          </span>
        </div>
        <div
          v-if="activeTab === 'detail'"
          class="basic-detail-body-product-description"
        >
          {{ getProductDescription() }}
        </div>
        <div
          v-if="activeTab === 'allergy'"
          class="basic-detail-body-allergy-container"
        >
          <div class="basic-detail-body-allergy-wrap">
            <div
              v-for="item, index in getValidImageList(productInfo.allergy)"
              :key="getAllergyItemKey(item, index)"
            >
              <img
                class="basic-detail-body-allergy-icon-image"
                :src="item.allergy_image_url"
                :alt="item.allergy_name"
              >
            </div>
          </div>
        </div>
        <div
          v-if="isHaveOptionItem()"
          class="basic-detail-body-product-confirm-button"
          @click="pushOptionPage()"
        >
          {{ t('옵션 선택하기') }}
        </div>
        <div
          v-else
          class="basic-detail-body-product-confirm-button"
          @click="addProductInCart"
        >
          {{ t('장바구니 담기') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  computed,
  ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import {
  getRouteName,
  pushPage,
  pushPageWithParams,
} from '@utils/route.helper';
import { getBasicThemeProductLogoImage } from '@utils/logoUtils';
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import {
  allergyOptionType,
  CART,
  BASIC_CONFIRM,
  removeNewLine,
} from '@torder/common';
import useProductStore from '@store/storeProduct';
import useModalStore from '@store/storeModal';
import useCartStore from '@store/storeCart';
import {
  home,
  productOption,
} from '@router/routePaths';
import requestDescription from '@apis/description';

const { setProductInfo } = useProductStore();
const { productInfo } = storeToRefs(useProductStore());

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

const { t } = useI18n();

// 상품 상세설명 기능 사용 여부
const isUseDescription = computed(() => productInfo.value?.description?.length > 0);
// 알러지 기능 사용 여부
const isUseAllergy = computed(() => productInfo.value?.allergyUse === 'Y');
// 탭 상태값 (상세설명, 알러지)
const activeTab = ref(isUseDescription.value ? 'detail' : 'allergy');

// 탭 선택하는 로직
const setTabsActive = (key: string) => {
  activeTab.value = key;
};

// 옵션기능 사용시 옵션 페이지로 이동
const pushOptionPage = (): void => {
  setProductInfo(productInfo.value);
  pushPageWithParams(getRouteName(productOption), { id: productInfo.value.id });
};

// 이미지 확장자 검사
const validationImg = (url: string): boolean => {
  const regex = /https?:\/\/.*\.(svg$|jpg$|jpeg$|png$|gif$|webp$)/i;
  const isImage = regex.test(url);

  return isImage;
};

// 정상적이지 않은 이미지일 경우 로고 이미지 노출
const getProductImg = (): string => {
  const { image } = productInfo.value;

  const isImage = validationImg(image);

  if (isImage) return image;

  return getBasicThemeProductLogoImage();
};

// 유효한 이미지가 등록된 알러지 아이콘만 노출되도록 필터링 하는 로직
const getValidImageList = (allergyArr: allergyOptionType[]) => (allergyArr?.filter((item) => item.allergy_image_url));

// 상세 설명 번역 관련 로직 (번역 정보가 JSON 경로로 넘어와 axios 요청이 필요함)
const description = ref<string>('');
const getProductDescription = () => {
  requestDescription(productInfo).then((res: string) => {
    description.value = res;
  });

  return description.value;
};

// 옵션이 존재하여 옵션 레이아웃 화면으로 이동해야하는지 판단하는 로직
const isHaveOptionItem = () => {
  const {
    options,
    products,
  } = productInfo.value;

  return options?.length > 0 || products?.length > 0;
};

// 해당 상품 장바구니에 담는 로직
const addProductInCart = (): void => {
  // 장바구니에 상품이 있으면 추가할려는 상품 최대갯수 검증
  const findProductIndex: number = cartProducts.value.findIndex((cartProduct) => cartProduct.id === productInfo.value.id);
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
      openConfirmModal(BASIC_CONFIRM, translatedName, t('장바구니 담기'));
      setAdditionalProductIndex(findProductIndex);
    }
    return;
  }

  openAlert(`${t('상품을 담았습니다.', { item: productInfo.value.name })}`);
  openModal(CART);
  pushPage(home);

  if (findProductIndex !== -1) {
    multiIncreaseCartProductQuantity(findProductIndex, productInfo.value.quantity);
    pushUpItemIndex(findProductIndex);
    return;
  }

  addCartProduct(productInfo.value);
};

// v-for 방어 로직
const getAllergyItemKey = (allergy: allergyOptionType, index: number) => (allergy ? `${allergy.id}-${index}` : `allergy-${index}`);
</script>

<style lang="scss" scoped>
.basic-detail-container {
  position: absolute;
  z-index: 25;
  display: flex;
  flex-direction: column;
  gap: 1.25vw;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1.25vw 1.5625vw 1.5625vw 1.5625vw;
  background-color: #0D0D0D;

  .basic-detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .basic-detail-header-title {
      flex: 1;
      padding-left: 1.25vw;
      font-size: 2.5vw;
      font-weight: 700;
      line-height: 3.125vw;
      color: #fff;
      letter-spacing: -0.05vw;
      background-color: 0 0 0.3125vw 0 rgba(0, 0, 0, 0.25);
      border-left: 0.3125vw solid #f91515;
    }

    .basic-detail-header-close-button {
      display: flex;
      gap: 0.7813vw;
      align-items: center;
      padding: 1.25vw 1.5625vw;
      background-color: #FFF;
      border: 0.0781vw solid #0A0A0A;
      border-radius: 1.25vw;
      box-shadow: 0.4688vw 0.4688vw 0.9375vw 0 rgba(0, 0, 0, 0.20);

      &.button-active {
        background-color: #EBEBEB;
      }

      span {
        font-size: 2.6563vw;
        font-weight: 700;
        line-height: 3.2813vw;
        color: #0A0A0A;
        letter-spacing: -0.0531vw;
      }
    }
  }

  .basic-detail-body {
    display: flex;
    flex: 1;
    gap: 1.25vw;
    width: 100%;
    padding: 1.25vw;
    background-color: #fff;
    border-radius: 0.7813vw;

    .basic-detail-body-image-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60.9375vw;
      height: 50.1563vw;
      background-color: #D5D5D5;
      border-radius: 0.7813vw;

      .basic-detail-body-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 0.7813vw;
      }

      .empty-image {
        object-fit: none;
      }
    }

    .basic-detail-body-info-container {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 1.25vw;

      .basic-detail-body-info-tabs-wrap {
        display: flex;
        gap: 0.9375vw;
        align-items: center;
        justify-content: space-between;

        .basic-detail-body-info-tabs-button {
          display: flex;
          flex-grow: 1;
          align-items: center;
          justify-content: center;
          padding: 1.25vw 1.5625vw;
          font-size: 1.875vw;
          font-weight: 700;
          line-height: 2.5vw;
          color: #0A0A0A;
          letter-spacing: -0.0375vw;
          background-color: #FFF;
          border: 0.0781vw solid #959595;
          border-radius: 0.7813vw;

          &.detail {
            max-width: 15.4688vw;
          }

          &.button-active {
            background-color: #EBEBEB;
          }
        }

        .active-tab {
          color: #fff;
          background-color: #0A0A0A;

          &.button-active {
            background-color: #0A0A0A;
          }
        }
      }

      .basic-detail-body-product-info-wrap {
        display: flex;
        gap: 1.25vw;
        justify-content: space-between;
        padding-bottom: 0.9375vw;
        border-bottom: 0.1172vw solid #D5D5D5;

        .basic-detail-body-product-info-title {
          flex: 1;
          font-size: 1.875vw;
          font-weight: 600;
          line-height: 2.5vw;
          color: #5B5B5B;
          letter-spacing: -0.0375vw;
        }

        .basic-detail-body-product-info-price {
          font-size: 1.875vw;
          font-weight: 700;
          line-height: 2.5vw;
          color: #5B5B5B;
          letter-spacing: -0.0375vw;
        }
      }

      .basic-detail-body-product-description {
        height: 32.1875vw;
        overflow-y: scroll;
        font-size: 1.875vw;
        font-weight: 400;
        line-height: normal;
        color: #494949;
        letter-spacing: -0.0375vw;
        word-break: break-all;
        white-space: pre-line;
      }

      .basic-detail-body-allergy-container {
        height: 32.1875vw;
        overflow-y: scroll;

        .basic-detail-body-allergy-wrap {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25vw;

          .basic-detail-body-allergy-icon-image {
            width: 100%;
            border-radius: 1.5625vw;
          }
        }
      }

      .basic-detail-body-product-confirm-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 1.25vw 1.5625vw;
        font-size: 2.6563vw;
        font-weight: 700;
        line-height: 3.2813vw;
        color: #fff;
        letter-spacing: -0.0531vw;
        background-color: #F91515;
        border-radius: 0.7813vw;

        &.button-active {
          background-color: #D60505;
        }
      }
    }
  }
}
</style>
