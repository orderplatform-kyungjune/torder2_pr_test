<template>
  <li
    class="select-item"
    :class="{
      'not-basic': optionLayout.type !== BASIC,
      black: optionLayout.color === BLACK,
      white: optionLayout.color === WHITE,
      image: optionLayout.type === IMAGE,
    }"
  >
    <div
      v-if="optionLayout.type === IMAGE"
      class="option-image-wrapper"
      :class="isOptionImage"
    >
      <img
        class="option-image"
        :src="optionImage"
        alt="option-image"
      >
      <template v-if="optionItem.checked">
        <img
          v-if="optionItem.limitQty === 1"
          class="check-option img"
          :src="isOptionChecked"
        >
        <span
          v-else
          class="check-option qty"
        >
          {{ optionItem.quantity }}
        </span>
      </template>
      <div
        v-if="optionItem.checked"
        class="background-wall"
      />
    </div>
    <div
      v-if="optionLayout.type === IMAGE && !optionItem.isSale"
      class="sold-out-label"
    >
      품절
    </div>

    <div class="name">
      <img
        v-if="optionLayout.type !== IMAGE"
        :src="isOptionChecked"
      >
      <span class="text ellipsis-text-1">
        {{ translateLanguage(optionItem.nameArray, optionItem.name) }}
      </span>
      <span
        v-if="optionLayout.type !== IMAGE && !optionItem.isSale"
        class="sold-out"
      >
        품절
      </span>
    </div>
    <div class="option-info-wrapper">
      <span
        v-if="optionLayout.type !== BASIC && optionLayout.type !== IMAGE"
        class="qty"
      >
        <span class="qty-number">{{ !optionItem.checked ? 0 : optionItem.quantity }}</span>
        <span>{{ t('개') }}</span>
      </span>
      <span class="price">
        {{ `${optionLayout.type !== BASIC ? '' : '+'} ${checkStandardPriceUnit(optionItem.price?.toLocaleString())}` }}
      </span>
    </div>
  </li>
</template>

<script setup lang='ts'>
import { translateLanguage } from '@utils/langTransfer';
import checkStandardPriceUnit from '@utils/checkStandardPriceUnit';
import { CartProductOptionType } from '@torder/common/interface/cartProduct';
import {
  BASIC,
  BLACK,
  IMAGE,
  WHITE,
} from '@torder/common/constant';

defineProps<{
  optionItem: CartProductOptionType,
  isOptionChecked: string,
  t: (str: string) => string,
  customFontActiveColor: string,
  optionLayout: {type: string; color: string},
  isOptionImage: {empty: boolean},
  optionImage: string,
}>();
</script>

<style scoped lang='scss'>
.select-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4vw 2vw;
  margin-bottom: 1vw;
  color: #111;
  word-break: break-all;
  background-color: #f5f5f5;
  border: .0781vw solid #dcdcdc;
  border-radius: .7813vw;

  &.active {
    border: .2344vw solid v-bind(customFontActiveColor);

    .name {
      color: v-bind(customFontActiveColor);
    }

    .price {
      font-weight: 900;
    }
  }

  .name {
    display: flex;
    align-items: center;

    .text {
      max-width: 22vw;
      margin-left: 0.3vw;
      font-size: 1.6406vw;
      line-height: 1.2;
    }

    .sold-out {
      min-width: 3.5156vw;
      margin: 0 1.5625vw;
      font-size: 1.8750vw;
      font-weight: bold;
      color: #fc0000;
    }
  }

  .price {
    font-size: 1.5625vw;
    font-weight: 500;
  }

  &.not-basic{
    display: grid;
    grid-template-columns: 70% 30%;
    min-height: 6.25vw;
    margin: 0 1.5625vw;
    margin-bottom: 0vw;
    background-color: transparent;
    border: none;
    border-radius: 0vw;

    &:last-child{
      border-bottom: none;
    }

    &.black{
      color: #fff;
      border-bottom: .0781vw solid #403939;

      .qty{
        color: #504848;
      }
    }

    &.white{
      color: #000;
      border-bottom: .0781vw solid #b9b9b9;

      .name{
        color: #000;
      }

      .qty{
        color: #999;
      }
    }

    .text{
      max-width: 36vw;
      margin-left: 0;
    }

    .text, .price, .qty{
      font-size: 2.25vw;
    }

    .name {
      font-weight: 700;
      color: #fff;
    }

    .price {
      font-weight: 500;
    }

    .qty{
      .qty-number{
        font-weight: 700;
      }
    }

    &.active{
      &.black{
        .qty{
          color: #fff;
        }
      }
      &.white{
        .qty{
          color: #000;
        }
      }
    }

    .option-info-wrapper {
      display: flex;
      justify-content: space-between;
    }

    &.image{
      border-bottom: none;

      .text, .price, .qty{
        max-width: 13.8102vw;
        font-size: 1.625vw;
      }

      &.white{
        .option-image-wrapper{

          &.empty{
            background-color: #fff;
          }
        }
      }

      .option-image-wrapper{
        position: relative;
        width: 100%;
        height: 10.4688vw;

        &.empty{
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #2c2424;
          border-radius: .3906vw;

          .option-image{
            margin-left: 1.5625vw;
            object-fit: none;
          }
        }

        .background-wall{
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-color: rgba(0,0,0,0.7);
          border-radius: .3906vw;
        }

        .check-option{
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 5;
          transform: translate(-50%,-50%);

          &.img{
            width: 55%;
            height: 55%;
          }

          &.qty{
            font-size: 4vw;
            font-weight: 700;
            color: v-bind(customFontActiveColor);
          }
        }
      }

      .option-image{
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }

      .sold-out-label {
        width: 13.9063vw;
        margin-top: -3.7500vw;
        font-size: 1.4844vw;
        font-weight: 500;
        line-height: 2.9688vw;
        text-align: center;
        letter-spacing: -.0375vw;
        background-color: red;
        border-bottom-right-radius: 0.3906vw;
        border-bottom-left-radius: 0.3906vw;
        opacity: .85;
      }
    }
  }
}
</style>
