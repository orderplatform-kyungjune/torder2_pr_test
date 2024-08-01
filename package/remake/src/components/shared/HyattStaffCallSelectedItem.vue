<template>
  <div
    class="staff-item-count-container"
    :class="getDarkModeClass()"
  >
    <div class="staff-item-top-wrap">
      <div
        class="staff-item-count-title ellipsis-text-3"
        :class="getDarkModeClass()"
      >
        {{ title }}
      </div>
      <div
        class="staff-item-remove-button"
        :class="getDarkModeClass()"
      >
        <div
          id="staff-item-remove-sub-element"
          class="staff-item-remove-text"
          @click="deleteTarget"
        >
          {{ deleteText }}
        </div>
      </div>
    </div>
    <div class="staff-item-count-grid">
      <Trash
        v-if="Number(countUnit.split(' ')[0]) === 1"
        class="item-count-control-button"
        @click="minus"
      />
      <GrayMinus
      v-else
        class="item-count-control-button"
        @click="minus"
      />
      <div
        class="staff-item-count-count"
        :class="getDarkModeClass()"
      >
        {{ countUnit }}
      </div>
      <GrayPlus
        class="item-count-control-button"
        @click="plus"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import useInitStore from '@store/storeInit';
import GrayPlus from '@assets/btn_darkgray_plus.vue';
import GrayMinus from '@assets/btn_darkgray_minus.vue';
import Trash from '@assets/btn_darkgray_trash.vue';

// 커스텀 디자인
const { buttonBackgroundColor } = storeToRefs(useInitStore());
const { getDarkModeClass } = useInitStore();

defineProps<{
  /** 해당 상품 이름입니다. */
  title: string;
  /** 해당 상품 수량입니다.(단위도 같이 넘겨주거나 단위가 없더라도 문자열로 변환해 넘겨주어야 합니다.) */
  countUnit: string;
  /** 상품 추가 함수입니다. */
  plus: () => void;
  /** 상품 추감 함수입니다. */
  minus: () => void;
  /** 해당 상품 삭제 함수입니다. */
  deleteTarget?: () => void;
  /** 삭제버튼의 텍스트입니다. */
  deleteText: string;
  isLast: boolean;
}>();
</script>

<style lang="scss" scoped>
.staff-item-count-container {
  display: flex;
  flex-direction: column;
  padding: 1.5625vw;
  margin-bottom: 0.7813vw;
  background-color: #ffffff;
  border: 0.0781vw solid #d5d5d5;
  border-radius: 1.25vw;

  &.dark-mode {
    background-color: #181818;
    border: 0.0781vw solid #494949;
  }

  .staff-item-top-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.875vw;

    .staff-item-count-title {
      display: -webkit-box;
      width: 17.9688vw;
      font-size: 1.875vw;
      font-weight: 500;
      line-height: 2.3438vw;
      color: #313131;
      word-break: break-all;

      &.dark-mode {
        color: #fff;
      }
    }

    .staff-item-remove-button {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.625vw 1.25vw;
      background-color: #fff;
      border: 0.1172vw solid v-bind(buttonBackgroundColor);
      border-radius: 0.7813vw;

      &.button-active {
        background-color: #ebebeb;
      }

      &.dark-mode {
        background-color: #181818;

        &.button-active {
          background-color: #313131;
        }
      }

      .staff-item-remove-text {
        font-size: 1.7188vw;
        font-weight: 600;
        line-height: 2.1875vw;
        color: v-bind(buttonBackgroundColor);
        letter-spacing: -0.0344vw;
      }
    }
  }

  .staff-item-count-grid {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .item-count-control-button {
      width: 4.5313vw;
      height: 3.9063vw;
    }

    .staff-item-count-count {
      font-size: 2.3438vw;
      font-weight: 700;
      line-height: normal;
      color: #313131;

      &.dark-mode {
        color: #fff;
      }
    }
  }
}
</style>
