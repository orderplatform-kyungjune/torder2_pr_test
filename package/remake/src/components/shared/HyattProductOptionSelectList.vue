<!-- <template>
  <li
    class="select-item"
    :class="{
      'no-child': !isHasChildGroup,
      active: isChecked,
      image: isOptionImageType,
    }"
  >
    <div
      class="select-item-info-wrap"
      :class="{ image: isOptionImageType }"
    >
      <div class="select-item-left">
        <div
          v-if="isOptionImageType"
          class="option-image"
          :class="isOptionImage"
        >
          <img
            :class="isOptionImage"
            :src="optionImage || 'https://static.torder.co.kr/torder2/logo_white_82x39.svg'"
            alt="option-image"
          >
          <div
            v-if="isChecked && !isNonOrderTable"
            class="checked-image"
          />
          <div
            v-if="isChecked && !isNoLimitOne && !isNonOrderTable"
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
          <div
            v-if="isProductSoldOut"
            class="sold-out"
          >
            {{ t('품절') }}
          </div>
          <div
            v-if="isChecked && isNoLimitOne && !isNonOrderTable"
            class="option-image-item-quantity-wrap"
          >
            <div class="option-quantity-control">
              <img
                class="quantity-img"
                src="https://static.torder.co.kr/torder2/icn_minus_only_white_60x60.svg"
                @click.stop="decreaseOptionQuantity"
              >
            </div>
            <div class="quantity">
              {{ optionItemQuantity }}
              {{ t('개') }}
            </div>
            <div class="option-quantity-control">
              <img
                class="quantity-img"
                src="https://static.torder.co.kr/torder2/icn_plus_only_white_60x60.svg"
                @click.stop="increaseOptionQuantity"
              >
            </div>
          </div>
        </div>
        <div class="item-name-icon-wrap">
          <div
            v-if="!isOptionImageType"
            class="select-item-icon"
            :class="{ active: isChecked }"
          >
            <img
              class="img"
              :src="optionCheckImage"
            >
          </div>
          <span
            class="name"
            :class="{ image: isOptionImageType }"
          >
            {{ optionItemName }}
          </span>
        </div>
        <span
          v-if="!isGroupType"
          class="price"
        >
          {{ optionItemPrice }}
        </span>
      </div>
      <div
        v-if="isNoLimitOne && isSetMenu && !isOptionGroup && !isOptionImageType && isChecked"
        class="option-item-bottom"
      >
        <div
          class="option-item-quantity-wrap"
          :class="{ active: isChecked && !isOptionImageType }"
        >
          <div class="option-quantity-control">
            <img
              class="quantity-img"
              src="https://static.torder.co.kr/torder2/icn_minus_only_white_60x60.svg"
              @click.stop="decreaseOptionQuantity"
            >
          </div>
          <div class="quantity">
            {{ optionItemQuantity }}
            {{ t('개') }}
          </div>
          <div class="option-quantity-control">
            <img
              class="quantity-img"
              src="https://static.torder.co.kr/torder2/icn_plus_only_white_60x60.svg"
              @click.stop="increaseOptionQuantity"
            >
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isHasChildGroup && !isOptionImageType"
      class="have-group"
    >
      <span>
        ►
      </span>
    </div>
    <div
      v-if="isProductSoldOut && !isOptionImageType"
      class="sold-out"
    >
      {{ t('품절') }}
    </div>
  </li>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import useInitStore from '@store/storeInit';

const { buttonBackgroundColor } = storeToRefs(useInitStore());

defineProps<{
  increaseOptionQuantity: () => void,
  decreaseOptionQuantity: () => void,
  optionCheckImage: string,
  t: (str: string) => string,
  isChecked: boolean,
  isNoLimitOne: boolean,
  optionItemName: string,
  optionItemPrice: string,
  optionItemQuantity: number,
  optionImage: string,
  isSetMenu: boolean,
  isHasChildGroup: boolean,
  isOptionGroup: boolean,
  isGroupSetGroup: boolean,
  isOptionImageType: boolean,
  isProductSoldOut: boolean,
  isOptionImage: {empty: boolean},
  isNonOrderTable: boolean,
  isGroupType: boolean,
}>();
</script>

<style scoped lang='scss'>
.select-item {
  position: relative;
  display: grid;
  grid-template-columns: 90% 10%;
  gap: .3906vw .7813vw;
  align-items: center;
  justify-content: space-between;
  font-family: "Noto Sans SC", sans-serif;
  font-weight: 500;
  line-height: 1.5vw;
  word-break: break-all;
  border-bottom: .0781vw solid #dfdfdf;

  &.no-child {
    grid-template-columns: 100%;
  }

  &.active {
    color: #fff;
    background-color: v-bind(buttonBackgroundColor);
  }

  &.image {
    grid-template-columns: 100%;
    align-items: flex-start;
    padding: 0 .9375vw;
    margin: 0;
    color: #000;
    background-color: transparent;
  }

  .sold-out {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 2.5vw;
    color: #fff;
    background-color: rgba(0,0,0,0.8);
  }

  .select-item-info-wrap {
    display: flex;
    flex-direction: column;
    gap: .7813vw;

    &.image {

      .select-item-left{
        gap: .3906vw;
      }

      .item-name-icon-wrap {
        justify-content: center;
      }

      .price {
        padding-bottom: .3906vw;
        margin-left: 0vw;
        text-align: center;
      }
    }
  }

  .select-item-left {
    display: flex;
    flex-direction: column;
    gap: .7813vw;
    width: 100%;

    .option-image {
      position: relative;
      height: 15.625vw;
      overflow: hidden;
      border-radius: .7813vw;

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-position: center;
      }

      &.empty {
        background-color: #efefef;
        border-radius: 0.7813vw;

        .empty {
          width: 30%;
          margin: auto;
        }
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

      .sold-out {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: 2.5vw;
        color: #fff;
        background-color: rgba(0,0,0,0.8);
      }

      .option-image-item-quantity-wrap {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        gap: 0.8vw;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        > .quantity {
          width: 30%;
          font-family: "Noto Sans SC", sans-serif;
          font-size: 2.0313vw;
          color: #fff;
          text-align: center;
        }
      }
    }

    .item-name-icon-wrap {
      display: flex;
      align-items: center;
      overflow: hidden;
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
      padding: .3906vw 0;
      margin-left: 1.2vw;
      overflow: hidden;
      font-size: 1.6406vw;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.image {
        margin-left: 0;
      }
    }
  }

  .price {
    min-width: 2.3438vw;
    margin-left: 3.9063vw;
    font-size: 1.5625vw;
    font-weight: 700;
  }
}

.option-item-bottom {
  display: flex;
  width: 100%;
}

.option-item-quantity-wrap {
  display: flex;
  gap: 0.8vw;
  align-items: center;
  justify-content: space-between;
  width: 15.625vw;
  margin-left: 3.9063vw;

  .quantity-img {
    width: 2.3438vw;
    height: 2.3438vw;
  }

  .option-quantity-control {
    padding: 0 .7813vw;
    background-color: #cbcbcb;
    border-radius: .7813vw;
  }

  .quantity {
    width: 30%;
    font-family: "Noto Sans SC", sans-serif;
    font-size: 2.0313vw;
    text-align: center;
  }

  &.active {
    .option-quantity-control {
      background-color: #000;
    }
  }
}
</style> -->
