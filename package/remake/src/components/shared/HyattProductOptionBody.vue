<!-- <template>
  <div class="product-header"/>
  <slot name="navigation"/>
  <div class="option-select-body">
    <div class="option-wrap">
      <slot name="group"/>
    </div>
    <div class="select-group-wrap">
      <div class="select-scroll-wrap">
        <slot name="select"/>
      </div>
    </div>
  </div>
  <div
    v-if="isShowSelected"
    class="product-wrap"
  >
    <div class="product-selected-wrap">
      <div class="selected-wrap-header">
        <span>
          {{ t('장바구니') }}
        </span>
      </div>
      <div
        v-if="!isSetMenu"
        class="product-only-wrap"
      >
        <div class="product-basic-info">
          <div class="product-name">
            {{ translateLanguage(product.productLanguageDetail, product.productLanguageDetail?.ko) }}
          </div>
          <div class="product-price">
            <div class="price">
              {{ product.price?.toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
      <ul class="product-selected-option-list">
        <slot name="selected"/>
      </ul>
      <div class="option-item-quantity-wrap">
        <div class="option-quantity-control">
          <img
            class="quantity-img"
            src="https://static.torder.co.kr/torder2/icn_minus_only_white_60x60.svg"
            @click="decreaseProductQuantity"
          >
        </div>
        <div class="quantity">
          {{ product.quantity }}
          {{ t('개') }}
        </div>
        <div class="option-quantity-control">
          <img
            class="quantity-img"
            src="https://static.torder.co.kr/torder2/icn_plus_only_white_60x60.svg"
            @click="increaseProductQuantity"
          >
        </div>
      </div>
      <div
        v-if="!isSetMenu"
        class="product-price-all"
      >
        <div class="text">
          {{ t('합계') }}
        </div>
        <div class="price">
          {{ getTotalPrice }}
        </div>
      </div>
    </div>
    <div class="cart-button-wrap">
      <div
        class="close-cart-button"
        @click="closeProductOption"
      >
        {{ t('닫기') }}
      </div>
      <div
        class="add-cart-button"
        @click="addCart"
      >
        {{ t('담기') }}
      </div>
    </div>
  </div>
  <div v-else>
    <div class="hide-go-home-wrap">
      <div
        class="header-button"
        @click="goHome"
      >
        <img
          src="https://static.torder.co.kr/torder2/hyatt-option-page-close-icon.svg"
          class="close-icon"
        >
      </div>
    </div>
    <div class="hide-selected-option-wrap">
      <div
        v-if="selectedOptionLength > 0"
        class="selected-option-button"
      >
        <HyattButton
          class="selected-cart-button"
          :title="t('장바구니')"
          background="#b9b9b9"
          color="#fff"
          fontSize="1.9531vw"
          fontWeight="500"
          @click="openProductOption"
        />
        <div class="selected-option-count-wrap">
          <span class="selected-option-count">
            {{ selectedOptionLength }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { translateLanguage } from '@utils/langTransfer';
import { cartProductType } from '@torder/common/interface/cartProduct';
import useInitStore from '@store/storeInit';
import { HyattButton } from '@components';

const {
  buttonBackgroundColor,
  buttonFontColor,
  backgroundColor,
  activeFontColor,
} = storeToRefs(useInitStore());

defineProps<{
  product: cartProductType,
  getTotalPrice: string,
  increaseProductQuantity: () => void,
  decreaseProductQuantity: () => void,
  closeProductOption: () => void,
  addCart: () => void,
  t: (str: string) => string,
  isShowSelected: boolean,
  goHome: () => void,
  openProductOption: () => void,
  selectedOptionLength: number,
  isSetMenu: boolean,
  isEnglishLanguage: boolean,
  isJapaneseLanguage: boolean,
}>();
</script>

<style scoped lang='scss'>
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-header {
  height: 3.9063vw;
  padding: 1.1719vw .7813vw .3906vw .7813vw;
  font-family: "Noto Sans SC", sans-serif;
  font-size: 2.5vw;
  font-weight: bold;
}

.option-select-body {
  position: relative;
  display: flex;
  flex-direction: row;
  height: calc(100% - 8.5938vw);

  .select-more-scroll {
    position: absolute;
    bottom: 5%;
    left: 21%;
  }
}

.select-group-wrap {
  display: flex;
  flex: 1;
  overflow-x: auto;

  .select-scroll-wrap {
    display: flex;
    flex: 1;
  }
}

.select-wrap {
  display: flex;
  flex-direction: column;
  width: 25vw;
  overflow: auto;
  background-color: v-bind(backgroundColor);
  border: .0781vw solid;

  .select-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.4vw 2vw;
    margin-bottom: 1vw;
    line-height: 1.5vw;
    word-break: break-all;
    background-color: #f5f5f5;
    border: .1563vw solid #dcdcdc;
    border-radius: .7813vw;

    &.active {
      border: solid .1563vw;
      border-color: v-bind(buttonBackgroundColor);
    }

    .select-item-icon {
      display: flex;
      align-items: center;
      justify-content: center;

      &.active {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: v-bind(backgroundColor);
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

  .button-wrap {
    display: flex;
    gap: 1.3vw;

    .prev-button {
      @include flex-center();
      width: 100%;
      height: 4vw;
      margin-top: 1vw;
      font-size: 2vw;
      color: #fff;
      background-color: black;
      border-radius: .7813vw;
    }

    .next-button {
      @include flex-center();
      width: 100%;
      height: 4vw;
      margin-top: 1vw;
      font-size: 2vw;
      color: #fff;
      background-color: black;
      border-radius: .7813vw;

      &.active {
        background-color: red;
      }
    }
  }

}

.product-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: 28%;
  padding-top: 1.5625vw;
  background-color: v-bind(backgroundColor);
  border-radius: .3906vw;

  .product-selected-wrap {
    display: flex;
    flex: 1;
    flex-direction: column;

    .selected-wrap-header {
      display: flex;
      padding: .7813vw 1.1719vw .7813vw 1.4vw;

      span {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        font-size: 1.625vw;
        font-weight: bold;
        word-break: break-word;
      }

      .header-button {
        display: flex;
        gap: .3906vw;
        align-items: center;
        justify-content: center;
        height: 3.2vw;
        padding: .3906vw .7813vw;
        overflow: hidden;
        background-color: #f5f5f5;
        border: .0781vw solid #b9b9b9;
        border-radius: .3906vw;

        &:deep(.button-wrap) {
          padding: 0 1.5625vw;
          word-break: break-word;
          border-radius: 0vw;
        }

        .close-icon {
          width: 1.1719vw;
          height: 1.1719vw;
        }
      }
    }

    .product-name {
      font-family: "Noto Sans SC", sans-serif;
      font-weight: bold;
      line-height: 1.85;
      word-break: break-all;
    }

    .product-price {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1vw 0;
      font-family: "Noto Sans SC", sans-serif;

      .text {
        font-size: 1.5625vw;
      }

      .price {
        font-weight: bold
      }
    }

    .product-selected-option-list {
      display: flex;
      flex: 1;
      flex-basis: 0;
      flex-direction: column;
      padding: 0 1.7vw 0 1.3vw;
      overflow: auto;
    }

    .product-price-all {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5625vw;
      font-weight: 500;
      border-bottom: .0781vw solid;
      border-color: rgba(0, 0, 0, 0.1);

      .quantity {
        margin-left: 1vw;
        font-size: 2vw;
      }

      .text {
        font-family: "Noto Sans SC", sans-serif;
        font-size: 1.5625vw;
      }

      .price {
        font-family: "Noto Sans SC", sans-serif;
        font-size: 1.875vw;
      }
    }
  }

  .cart-button-wrap {
    display: flex;
    gap: .7813vw;
    height: 4.6875vw;
    margin: .7813vw 1.1719vw;
    font-family: "Noto Sans SC", sans-serif;
    font-size: 2vw;
    font-weight: 500;
    color: v-bind(buttonFontColor);
    background-color: v-bind(backgroundColor);

    .add-cart-button {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      padding: 0 1vw;
      background-color: v-bind(buttonBackgroundColor);
      border-radius: .7813vw;
    }

    .close-cart-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32.5%;
      background-color: #cbcbcb;
      border-radius: .7813vw;
    }
  }
}

.option-item-quantity-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .7813vw 1.1719vw;
  background-color: v-bind(backgroundColor);
  border-top: solid .0781vw;
  border-bottom: solid .0781vw;
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 -0.3906vw 1.1719vw 0 rgba(0, 0, 0, 0.1);

  .quantity-img {
    width: 3.125vw;
    height: 3.125vw;
  }

  .option-quantity-control {
    display: flex;
    align-items: center;
    padding: 0 .3906vw;
    background-color: #cbcbcb;
    border-radius: .3906vw;
  }

  .quantity {
    font-size: 2vw;
  }
}

.hide-go-home-wrap{
  position: fixed;
  top: 1.5625vw;
  right: 1.5625vw;
  .header-button {
    display: flex;
    gap: .3906vw;
    align-items: center;
    justify-content: center;
    height: 3.2vw;
    padding: 0 1.9531vw;
    margin-top: 0;
    overflow: hidden;
    font-size: 1.5625vw;
    font-weight: 700;
    background-color: #f5f5f5;
    border: .0781vw solid #b9b9b9;
    border-radius: .3906vw;

    &:deep(.button-wrap) {
      padding: 0 1.5625vw;
      word-break: break-word;
      border-radius: 0vw;
    }

    .close-icon {
      width: 1.1719vw;
      height: 1.1719vw;
    }
  }
}

.hide-selected-option-wrap {
  position: fixed;
  right: .7813vw;
  bottom: .7813vw;

  .selected-option-button {
    position: relative;

    .selected-cart-button {
      display: flex;
      gap: 0.3906vw;
      align-items: center;
      justify-content: center;
      height: 4.6875vw;
      margin-top: 0;
      overflow: hidden;
      font-size: 2vw;
      font-weight: 500;
      border-radius: .3906vw;

      &:deep(.button-wrap) {
        padding: 0 2.3438vw;
        border-radius: .7813vw;
      }
    }

    .selected-option-count-wrap {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      flex-wrap: wrap;
      place-content: center center;
      width: 1.9531vw;
      height: 1.9531vw;
      background-color: #fff;
      border-radius: .3906vw;
      box-shadow: 0vw 0vw .3906vw #999;
      transform: translate(-20%, -50%);
    }

    .selected-option-count {
      margin-top: .1563vw;
      font-weight: 700;
      color: v-bind(activeFontColor);
    }
  }
}

.product-only-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.5625vw;
  padding: 1.1719vw;

  .product-basic-info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 1.1719vw;
    font-size: 1.5625vw;
    background-color: #fff;
    border: solid .0781vw #d0d0d0;
    border-radius: .7813vw;
  }

  .option-item-quantity-wrap {
    margin: 0;
  }
}
</style> -->
