<template>
  <div class="option-group-item-wrap">
    <div class="option-group-item">
      <div class="item-header">
        <span class="require">{{ isRequireOption ? t('필수') : t('선택') }}</span>
      </div>
      <div
        v-if="isProductType"
        class="name ellipsis-text-2"
      >
        {{ `${isTopGroupSelectedOptionCart ? '✔︎' : ''} ${translateLanguage((option as productType).productLanguageShort, (option as productType).productLanguageShort.ko)}` }}
      </div>
      <div
        v-else-if="isOptionProductType"
        class="name ellipsis-text-2"
      >
        {{ `${isTopGroupSelectedOptionCart ? '✔︎' : ''} ${translateLanguage((option as productType).productLanguageShort, (option as productType).productLanguageShort.ko)}` }}
      </div>
      <div
        v-else
        class="name ellipsis-text-2"
      >
        {{ `${isTopGroupSelectedOptionCart ? '✔︎' : ''} ${translateLanguage((option as CartProductOptionGroupType).nameArray, (option as CartProductOptionGroupType).name)}` }}
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { translateLanguage } from '@utils/langTransfer';
import { productType } from '@torder/common/interface/product';
import {
  CartProductOptionGroupType,
  CartProductOptionType,
} from '@torder/common/interface/cartProduct';

defineProps<{
  option: CartProductOptionGroupType | CartProductOptionType | productType,
  index: number,
  isActive: boolean,
  isRequireOption: boolean,
  isTopGroupSelectedOptionCart: boolean,
  customBackgroundColor: string,
  customActiveFontColor: string,
  t: (str: string) => string,
  isProductType: boolean,
  isOptionProductType: boolean,
}>();
</script>

<style scoped lang='scss'>
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-group-item-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5625vw;
  background-color: #fff;
  border-bottom: .0781vw solid #dfdfdf;

  .finish-alert{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.7);

    span{
      font-size: 2.5vw;
      font-weight: 500;
      color: #fff;
    }
  }

  &.active {
    background-color: v-bind(customBackgroundColor);

    .option-group-item {
      color: #fff;

      .item-header {
        display: flex;
        gap: .7813vw;

        .require {
          color: v-bind(customActiveFontColor);
          word-break: break-word;
          background-color: #fff;
        }
      }

      .name {
        font-weight: 500;
        color: #fff;
      }
    }
  }
  .option-group-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 5.5469vw;

    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .require {
        padding: .3906vw;
        font-family: "Noto Sans SC", sans-serif;
        font-size: 1.25vw;
        font-weight: 500;
        color: gray;
        border: .0781vw solid #dfdfdf;
        border-radius: .3906vw;
      }
    }

    .name {
      margin-top: 1vw;
      font-family: "Noto Sans SC", sans-serif;
      font-size: 1.7969vw;
      font-weight: 500;
    }
  }
}
</style>
