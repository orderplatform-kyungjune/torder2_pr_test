<template>
  <div class="option-group-item-wrap">
    <div
      v-if="isActive"
      class="div top"
    />
    <div class="tmp-wrap">
      <div
        v-if="isActive"
        class="div-black"
      />
      <div class="option-group-item">
        <div class="item-header">
          <span class="number">
            {{ index }}
          </span>
          <span
            v-if="isRequireOption"
            class="require"
          >* {{ t('필수선택') }}</span>
        </div>
        <div class="name ellipsis-text-2">
          {{ translateLanguage(option.nameArray, option.name) }}
        </div>
      </div>
    </div>
    <div
      v-if="isActive"
      class="div bottom"
    />
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { translateLanguage } from '@utils/langTransfer';
import {
  CartProductOptionGroupType,
  CartProductOptionType,
} from '@torder/common/interface/cartProduct';
import useInitStore from '@store/storeInit';

const {
  categoryBackgroundColor,
  buttonBackgroundColor,
  buttonFontColor,
} = storeToRefs(useInitStore());

defineProps<{
  option: CartProductOptionGroupType | CartProductOptionType,
  index: number,
  isActive: boolean,
  isSelectOption: boolean,
  isRequireOption: boolean,
  t: (str: string) => string,
}>();
</script>

<style scoped lang='scss'>
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-group-item-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1vw;

  &.active {
    background-color: #fff;

    .tmp-wrap {
      .option-group-item {
        padding-top: 1.5625vw;
        padding-bottom: 1.5625vw;
        padding-left: 1.5625vw;
        margin-top: 0;
        margin-bottom: 0;
        margin-left: -4.5vw;
        background-color: #fff;
        border-radius: 2.3438vw;

        .item-header {
          .number {
            color: #fff;
            background-color: v-bind(buttonBackgroundColor);
          }

          .require {
            color: v-bind(buttonFontColor);
          }
        }

        .name {
          color: black;
        }
      }
    }
  }

  .div {
    width: 100%;
    height: 1.5625vw;
    background-color: v-bind(categoryBackgroundColor);
    border: none;

    &.top {
      border-radius: 0 0 1.9531vw 0;
    }

    &.bottom {
      border-radius: 0 1.9531vw 0 0;
    }
  }

  .tmp-wrap {
    display: flex;
    width: 100%;

    .option-group-item {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-height: 5.5469vw;
      padding-right: 1.9531vw;
      margin: 0.5vw 0;

      .item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .require {
          font-family: 'Pretendard',serif;
          font-size: 1.5625vw;
          font-weight: 300;
          color: #f1cbb3;
        }

        .number {
          display: flex;
          padding: 0.6vw 0.8vw;
          font-size: 1.4063vw;
          font-weight: 500;
          background-color: #fff;
          border-radius: .3906vw;
        }
      }

      .name {
        margin-top: 1vw;
        font-family: 'Noto Serif KR', serif;
        font-size: 1.7969vw;
        font-weight: 300;
        color: #fff;
      }
    }
  }
}
.div-black {
  width: 5vw;
  background-color: v-bind(categoryBackgroundColor);
}
</style>
