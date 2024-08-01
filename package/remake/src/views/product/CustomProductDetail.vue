<template>
  <div class="custom-detail-container">
    <div class="custom-detail-wrap">
      <div class="custom-detail-left-container">
        <div class="custom-detail-left-header ellipsis-text-1">
          {{
            removeNewLine(
              translateLanguage(
                productInfo.productLanguage,
                productInfo.productLanguage?.ko,
              ),
            )
          }}
        </div>
        <div class="custom-detail-left-body">
          <img
            class="custom-detail-left-body-image"
            :class="{ 'empty-image': !validationImg(productInfo.image) }"
            :src="getProductImg()"
          />
        </div>
      </div>
      <div class="custom-detail-right-container">
        <div class="custom-detail-right-container-body">
          <div class="custom-detail-right-container-tabs">
            <div
              v-if="isUseDescription"
              class="custom-detail-right-container-tab-button"
              :class="{
                'active-tab': activeTab === 'detail',
                'is-both-use': isUseDetailBoth,
              }"
              @click="setTabsActive('detail')"
            >
              {{ t('상세정보') }}
            </div>
            <div
              v-if="isUseAllergy"
              class="custom-detail-right-container-tab-button"
              :class="{
                'active-tab': activeTab === 'allergy',
                'is-both-use': isUseDetailBoth,
              }"
              @click="setTabsActive('allergy')"
            >
              {{ t('알레르기 유발 식품') }}
            </div>
          </div>
          <div
            v-if="activeTab === 'detail'"
            class="custom-detail-right-container-detail"
          >
            {{ getProductDescription() }}
          </div>
          <div
            v-if="activeTab === 'allergy'"
            class="custom-detail-right-container-allergy"
          >
            <div class="custom-detail-right-container-allergy-wrap">
              <div
                v-for="(item, index) in getValidImageList(productInfo.allergy)"
                :key="getAllergyItemKey(item, index)"
              >
                <img
                  class="custom-detail-right-container-allergy-icon-image"
                  :src="item.allergy_image_url"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="custom-detail-right-container-footer">
          <div
            class="custom-detail-right-cancel-button-wrap"
            @click="pushPage(home)"
          >
            <div class="custom-detail-right-cancel-button">
              {{ t('닫기') }}
            </div>
          </div>
          <div
            v-if="isHaveOptionItem()"
            class="custom-detail-right-confirm-button"
            @click="pushOptionPage()"
          >
            <div class="custom-detail-right-confirm-button-wrap">
              {{ t('옵션 선택하기') }}
            </div>
          </div>
          <div
            v-else
            class="custom-detail-right-confirm-button"
            @click="addProductInCart"
          >
            <div class="custom-detail-right-confirm-button-wrap">
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
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import {
  getRouteName,
  pushPage,
  pushPageWithParams,
} from '@utils/route.helper';
import { getCustomThemeProductLogoImage } from '@utils/logoUtils';
import { translateLanguage } from '@utils/langTransfer';
import {
  CART,
  CUSTOM_CONFIRM,
  allergyOptionType,
  removeNewLine,
  getSubPrimaryColor,
} from '@torder/common';
import useProductStore from '@store/storeProduct';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useCartStore from '@store/storeCart';
import {
  home,
  internationalImageOption,
  internationalTextOption,
} from '@router/routePaths';
import requestDescription from '@apis/description';

const { t } = useI18n();

const { setProductInfo } = useProductStore();
const { productInfo } = storeToRefs(useProductStore());

const { addCartProduct, multiIncreaseCartProductQuantity, pushUpItemIndex } =
  useCartStore();
const { cartProducts } = storeToRefs(useCartStore());

const { openModal, openAlert, openConfirmModal, setAdditionalProductIndex } =
  useModalStore();

// 커스텀 스타일
const { init, buttonBackgroundColor, buttonFontColor } =
  storeToRefs(useInitStore());

// 상품 상세설명 기능 사용 여부
const isUseDescription = computed(
  () => productInfo.value?.description?.length > 0,
);
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

  if (init.value?.storeInfo?.optionLayout === 'customImage') {
    pushPageWithParams(getRouteName(internationalImageOption), {
      id: productInfo.value.id,
    });
  } else {
    pushPageWithParams(getRouteName(internationalTextOption), {
      id: productInfo.value.id,
    });
  }
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

  return getCustomThemeProductLogoImage();
};

// 유효한 이미지가 등록된 알러지 아이콘만 노출되도록 필터링 하는 로직
const getValidImageList = (allergyArr: allergyOptionType[]) =>
  allergyArr?.filter((item) => item.allergy_image_url);

// 상세 설명 번역 관련 로직 (번역 정보가 JSON 경로로 넘어와 axios 요청이 필요함)
const description = ref<string>('');
const getProductDescription = () => {
  requestDescription(productInfo).then((res: string) => {
    description.value = res;
  });

  return description.value;
};

// 상세 설명, 알레르기 기능 모두 사용 여부
const isUseDetailBoth = computed(() => {
  const isDescriptionUse = productInfo.value?.description?.length > 0;
  const isAllergyUse = productInfo.value?.allergyUse === 'Y';

  return isDescriptionUse && isAllergyUse;
});

// 옵션이 존재하여 옵션 레이아웃 화면으로 이동해야하는지 판단하는 로직
const isHaveOptionItem = () => {
  const { options, products } = productInfo.value;

  return options?.length > 0 || products?.length > 0;
};

// 해당 상품 장바구니에 담는 로직
const addProductInCart = (): void => {
  // 장바구니에 상품이 있으면 추가할려는 상품 최대갯수 검증
  const findProductIndex: number = cartProducts.value.findIndex(
    (cartProduct) => cartProduct.id === productInfo.value.id,
  );
  const isFindProduct: boolean = findProductIndex !== -1;

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
    return;
  }

  openAlert(`${t('상품을 담았습니다.', { item: productInfo.value.name })}`);
  openModal(CART);
  pushPage(home);

  if (findProductIndex !== -1) {
    multiIncreaseCartProductQuantity(
      findProductIndex,
      productInfo.value.quantity,
    );
    pushUpItemIndex(findProductIndex);
    return;
  }

  addCartProduct(productInfo.value);
};

const getActiveButtonColor = () =>
  getSubPrimaryColor(buttonBackgroundColor.value, 10, 'Y');

// v-for 방어 로직
const getAllergyItemKey = (allergy: allergyOptionType, index: number) =>
  allergy ? `${allergy.id}-${index}` : `allergy-${index}`;
</script>

<style lang="scss" scoped>
.custom-detail-container {
  position: absolute;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);

  .custom-detail-wrap {
    display: flex;
    font-family: 'Pretendard', sans-serif;
    background-color: #fff;
    border-radius: 1.25vw;

    .custom-detail-left-container {
      display: flex;
      flex-direction: column;
      gap: 1.25vw;
      padding: 1.5625vw;
      border-right: 0.0781vw solid #d5d5d5;

      .custom-detail-left-header {
        max-width: 63.2813vw;
        font-size: 2.1875vw;
        font-weight: 700;
        line-height: 2.5vw;
        color: #313131;
        letter-spacing: -0.0438vw;
      }

      .custom-detail-left-body {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 63.2813vw;
        height: 46.875vw;
        background-color: #ebebeb;
        border-radius: 0.7813vw;

        .custom-detail-left-body-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 0.7813vw;
        }

        .empty-image {
          height: 3.75vw;
        }
      }
    }

    .custom-detail-right-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: #f8f8f8;
      border-radius: 0 1.25vw 1.25vw 0;

      .custom-detail-right-container-body {
        display: flex;
        flex-direction: column;
        gap: 1.25vw;
        height: 100%;
        padding: 1.5625vw 1.5625vw 0 1.5625vw;

        .custom-detail-right-container-tabs {
          display: flex;

          .custom-detail-right-container-tab-button {
            flex-grow: 1;
            padding: 0 1.4063vw 0.625vw 1.4063vw;
            font-size: 1.875vw;
            font-weight: 500;
            line-height: 2.3438vw;
            color: #5b5b5b;
            text-align: left;
            letter-spacing: -0.0562vw;
            border-bottom: 0.0781vw solid #d5d5d5;
          }

          .active-tab {
            font-weight: 700;
            color: v-bind(buttonBackgroundColor);
            border-bottom: 0.2344vw solid v-bind(buttonBackgroundColor);
          }

          .is-both-use {
            text-align: center;
          }
        }

        .custom-detail-right-container-detail {
          width: 27.3438vw;
          height: 39.8438vw;
          overflow-y: scroll;
          font-size: 1.875vw;
          font-weight: 500;
          line-height: 2.3438vw;
          color: #7a7a7a;
          letter-spacing: -0.0562vw;
          word-break: break-all;
          white-space: pre-line;
        }

        .custom-detail-right-container-allergy {
          width: 27.3438vw;
          height: 39.8438vw;
          overflow-y: scroll;

          .custom-detail-right-container-allergy-wrap {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25vw 0.7813vw;

            .custom-detail-right-container-allergy-icon-image {
              width: 100%;
              border-radius: 1.25vw;
            }
          }
        }
      }

      .custom-detail-right-container-footer {
        display: flex;

        .custom-detail-right-cancel-button-wrap {
          padding: 1.25vw 0.3906vw 1.25vw 1.5625vw;

          .custom-detail-right-cancel-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 7.8125vw;
            padding: 1.25vw 1.875vw;
            font-size: 2.3438vw;
            font-weight: 700;
            line-height: 3.125vw;
            color: #fff;
            letter-spacing: -0.0469vw;
            background-color: #5b5b5b;
            border-radius: 0.7813vw;

            &.button-active {
              background-color: #494949;
            }
          }
        }

        .custom-detail-right-confirm-button {
          padding: 1.25vw 1.5625vw 1.25vw 0.3906vw;

          .custom-detail-right-confirm-button-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 18.75vw;
            padding: 1.25vw 1.875vw;
            font-size: 2.3438vw;
            font-weight: 700;
            line-height: 3.125vw;
            color: v-bind(buttonFontColor);
            letter-spacing: -0.0469vw;
            white-space: nowrap;
            background-color: v-bind(buttonBackgroundColor);
            border-radius: 0.7813vw;

            &.button-active {
              background-color: v-bind(getActiveButtonColor());
            }
          }

          .disabled {
            background-color: #ebebeb;
          }
        }
      }
    }
  }
}
</style>
