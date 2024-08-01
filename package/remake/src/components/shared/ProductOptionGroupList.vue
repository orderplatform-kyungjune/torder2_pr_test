<template>
  <div
    class="option-group-wrapper"
    :class="{
      'not-basic': optionLayout.type !== BASIC,
      'option-require': (option as CartProductOptionGroupType).requireFlag === 1,
      black: optionLayout.color === BLACK,
      white: optionLayout.color === WHITE,
      image: optionLayout.type === IMAGE,
    }"
  >
    <div
      class="option-item"
      :class="{
        'not-basic': optionLayout.type !== BASIC,
        ...isCheckedOptionGroup,
        black: optionLayout.color === BLACK,
        white: optionLayout.color === WHITE,
        image: optionLayout.type === IMAGE,
      }"
      @click="changeSelectOptionIndex(optionIndex)"
    >
      <div class="option-item-left">
        <div
          v-show="isRequireOption && optionLayout.type !== BASIC"
          class="option-require"
        >
          {{ t('필수') }}
        </div>
        <span
          v-if="optionLayout.type === BASIC"
          class="number"
        >
          {{ index }}
        </span>
        <span
          class="name ellipsis-text-1"
          :class="{ isOptional: !(!isSelectOption && isRequireOption && optionLayout.type === BASIC) }"
        >
          {{ `${optionLayout.type === BASIC ? '' : `${index}. `}${translateLanguage(option.nameArray, option.name)}` }}
        </span>
      </div>
      <div
        v-show="isSelectOption && optionLayout.type === BASIC"
        class="option-item-right-complete"
      >
        {{ t('선택완료') }}
      </div>
      <div
        v-show="!isSelectOption && isRequireOption && optionLayout.type === BASIC"
        class="option-item-right-require"
      >
        * {{ t('필수옵션') }}
      </div>
      <div
        v-if="optionLayout.type !== BASIC "
        class="select-title"
        :class="{
          'not-basic': optionLayout.type !== BASIC,
          image: optionLayout.type === IMAGE,
        }"
      >
        <p
          v-if="isAnyCheckOptionInGroup && optionLayout.type !== BASIC "
          class="comment"
        >
          <span class="strong">*</span>
          {{ t('선택완료') }}
        </p>
        <p
          v-else-if="isGroupNoLimit || isItemType"
          class="comment"
        >
          <span class="strong">*</span>
          <span class="text">{{ t('갯수 제한이 없습니다.') }}</span>
        </p>
        <p
          v-else
          class="comment"
        >
          <span class="strong">*</span>
          <span class="text">
            {{ getLimitSelectString((option as CartProductOptionGroupType).maxLimitQty) }}
          </span>
        </p>
      </div>
    </div>
    <slot name="option-list"/>
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { translateLanguage } from '@utils/langTransfer';
import {
  CartProductOptionGroupType,
  CartProductOptionType,
} from '@torder/common/interface/cartProduct';
import {
  BASIC,
  BLACK,
  IMAGE,
  WHITE,
} from '@torder/common/constant';
import useInitStore from '@store/storeInit';

const {
  buttonBackgroundColor,
  buttonFontColor,
  activeFontColor,
} = storeToRefs(useInitStore());

const props = defineProps<{
  option: (CartProductOptionGroupType | CartProductOptionType),
  index: number,
  optionIndex: number,
  isSelectOption: boolean,
  isRequireOption: boolean,
  t: (str: string) => string,
  optionLayout: {type: string; color: string},
  isGroupNoLimit: boolean,
  isItemType: boolean,
  changeSelectOptionIndex: (index: number) => void,
  isCheckedOptionGroup: {active: boolean},
  isAnyCheckOptionInGroup: boolean,
  getLimitSelectString: (count: number) => string,
}>();

const getTextWidth = () => (props.isRequireOption && props.optionLayout.type !== BASIC ? '30vw' : '40vw');

</script>

<style scoped lang='scss'>
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.option-group-wrapper.not-basic{
  flex: 1;
  border-radius: .7813vw;

  &.white{
    border: .1563vw solid #b9b9b9;
  }

  &.black{
    border: .1563vw solid #000;
  }

  &.option-require{
    white-space: nowrap;
    border: .1563vw solid v-bind(buttonBackgroundColor);
  }
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 5.4688vw;
  padding: 0.78125vw;
  margin-bottom: 1vw;
  background-color: rgba(1,1,1,.7);
  border-radius: .7813vw;

  &.active {
    position: relative;
    background-color: #fff;

    .option-item-left {
      .name {
        max-width: 11.3281vw;
        font-size: 1.875vw;
        font-weight: 700;
        line-height: 2.5vw;
        color: #313131;
        letter-spacing: -0.0375vw;
      }

      .number {
        background-color: v-bind(buttonBackgroundColor);
      }

      .text {
        color: #fff;
      }
    }

    .option-item-right-complete {
      color: black;
      white-space: nowrap;
      border: 0.0781vw solid #111;
    }
  }

  &.not-basic{
    margin-bottom: 0vw;
    font-size: 1.875vw;
    color: #fff;
    border-bottom: .0781vw solid #fff;
    border-radius: 0vw;
    border-top-left-radius: .7813vw;
    border-top-right-radius: .7813vw;

    &.black{
      background-color: #362c2c;
    }

    &.white{
      color: #000;
      background-color: #000;

      &.image{
        background-color: #f5f5f5;
      }
    }

    &::after{
      display: none
    }

    .option-item-left{
      gap: .7813vw;

      .option-require{
        width: auto;
        min-width: 4.6484vw;
        font-weight: 700;
        color: #fff;
      }

      .name, .number{
        max-width: v-bind(getTextWidth());
        font-size: 2.125vw;
        font-weight: 400;
        color: #fff
      }

      .text {
        color: #fff;
      }
    }

    &.image{
      &.option-item{
        align-items: flex-start;
        border-bottom: none;
      }

      &.white{
        .name, .number, .text{
          color: #000
        }

        .option-require{
          color: #fff;
        }
      }

      .option-item-left{
        flex-direction: column;
        gap: 1.5625vw;
        align-items: flex-start;
        padding-top: .7813vw;

        .option-require{
          width: auto;
          padding: .7813vw 1.4063vw;
          margin-top: -1.5625vw;
          margin-left: -0.78125vw;
          border-top-right-radius: 0vw;
          border-bottom-right-radius: .7813vw;
          border-bottom-left-radius: 0vw;
        }
      }
    }
  }

  .option-item-left {
    @include flex-center();

    .option-require {
      padding: .625vw .9375vw;
      font-size: 1.5vw;
      background-color: v-bind(buttonBackgroundColor);
      border-radius: .3906vw;
    }

    .number {
      @include flex-center();
      width: 3.125vw;
      height: 3.125vw;
      margin-right: 0.7vw;
      font-size: 1.4vw;
      font-weight: 900;
      color: #fff;
      background-color: black;
      border-radius: .7813vw;
    }

    .name {
      max-width: 11.3281vw;
      font-size: 1.875vw;
      font-weight: 700;
      line-height: 2.5vw;
      color: #fff;
      letter-spacing: -0.0375vw;
      word-break: break-all;
    }

    .isOptional {
      max-width: 16.4063vw
    }

    .text {
      color: #fff;
    }
  }

  .option-item-right-complete {
    @include flex-center();
    height: 3.2vw;
    padding: 0 0.3vw;
    font-size: 1.25vw;
    font-weight: 500;
    color: #fff;
    white-space: nowrap;
    border: .0781vw solid #fff;
    border-radius: 0.3906vw;
  }

  .option-item-right-require {
    @include flex-center();
    margin-left: 0.625vw;
    font-size: 1.2109vw;
    font-weight: 700;
    color: v-bind(activeFontColor);
    white-space: nowrap;
  }

  .select-title {
    .comment {
      padding-left: 1.5vw;
      margin-top: 1.9vw;
      margin-bottom: 2.1vw;
      font-size: 1.4063vw;

      .strong {
        color: v-bind(buttonBackgroundColor);
      }
      .text {
        min-width: 14.6094vw;
        color: #fff;
      }
    }

    .title-wrap {
      display: flex;

      .number {
        @include flex-center();
        width: 2vw;
        height: 2vw;
        margin-right: 0.5vw;
        font-size: 1.4vw;
        font-weight: 700;
        color: v-bind(buttonFontColor);
        background-color: v-bind(buttonBackgroundColor);
        border-radius: .3906vw;
      }

      .name {
        font-size: 2.125vw;
      }

      .require {
        @include flex-center();
        margin-left: 1vw;
        font-weight: 700;
        color: v-bind(activeFontColor);
      }
    }

    &.not-basic{

      .comment{
        min-width: 16.8750vw;
        margin: 0vw;
        font-size: 1.625vw;
      }

      &.image{
        padding-top: .7813vw;
      }
    }
  }
}
</style>
