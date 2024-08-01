<!-- <template>
  <li class="selected-option-item">
    <div class="option-detail-wrap">
      <div class="option-detail">
        <div class="option-group-wrap">
          <div class="option-group">
            {{ selectedOptionGroupName }}
          </div>
        </div>
        <div class="option-item-top">
          <span class="name">{{ optionItemName }}</span>
          <span
            v-if="!isNoPrice"
            class="price"
          >{{ optionItemPrice }}</span>
        </div>
        <div class="plus-icon">
          <img
            src="https://static.torder.co.kr/torder2/icon_plus_btn_gray_19x19.svg"
            alt="plus-icon"
          >
        </div>
      </div>
      <div
        class="delete-option-group-button"
        @click="deleteOptionItemByIndex"
      >
        <img src="https://static.torder.co.kr/torder2/btn_close_white_25.2px.svg">
      </div>
      <div
        v-if="isNoLimitOne"
        class="option-item-bottom"
      >
        <div class="option-item-quantity-wrap">
          <div class="option-quantity-control">
            <img
              class="quantity-img"
              src="https://static.torder.co.kr/torder2/icn_minus_only_white_60x60.svg"
              @click="decreaseOptionQuantity"
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
              @click="increaseOptionQuantity"
            >
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup lang='ts'>

defineProps<{
  increaseOptionQuantity: () => void,
  decreaseOptionQuantity: () => void,
  selectedOptionGroupName: string,
  deleteOptionItemByIndex: () => void,
  t: (str: string) => string,
  isNoLimitOne: boolean,
  isNoPrice: boolean,
  optionItemName: string,
  optionItemPrice: string,
  optionItemQuantity: number,
}>();
</script>

<style scoped lang='scss'>
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-option-item {
  display: flex;
  gap: .7813vw;
  align-items: center;
  justify-content: space-between;
  margin-top: 1vw;

  .option-detail-wrap {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: .7813vw;
    padding: 1.1719vw;
    background-color: #fff;
    border: .0781vw solid #d0d0d0;
    border-radius: .7813vw;

    .option-detail {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: .7813vw;

      // .plus-icon {
      //   position: absolute;
      //   top: 50%;
      //   left: -1.1719vw;
      //   display: flex;
      //   flex-wrap: wrap;
      //   align-items: center;
      //   justify-content: center;
      //   width: 1.9531vw;
      //   height: 1.9531vw;
      //   padding: .4688vw;
      //   background-color: #fff;
      //   border: .0781vw solid #d0d0d0;
      //   border-radius: 50%;
      //   transform: translate(-50%,-50%);

      //   img{
      //     width: 100%;
      //     height: 100%;
      //   }
      // }
    }

    .delete-option-group-button {
      position: absolute;
      top: -0.7813vw;
      right: -0.7813vw;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5vw;
      height: 2.5vw;
      padding: .7813vw;
      color: #fff;
      background-color: #818181;
      border-radius: .3906vw;

      img{
        width: 100%;
        height: 100%;
      }
    }

    .option-group {
      font-family: "Noto Sans SC", sans-serif;
      font-size: 1.25vw;
      font-weight: 500;
      color: #999999;
      word-break: break-all;
    }

    .option-group-wrap{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }

  .option-item-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "Noto Sans SC", sans-serif;
    font-weight: bold;
    color: #000;

    .name {
      font-size: 1.5625vw;
    }

    .price {
      font-size: 1.5625vw;
    }
  }

  .option-item-bottom {
    padding: 1vw 0;
  }
}

.option-item-quantity-wrap {
  display: flex;
  gap: 0.8vw;
  align-items: center;
  justify-content: space-between;

  .option-quantity-control {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 .3906vw;
    background-color: #cbcbcb;
    border-radius: .3906vw;

    .quantity-img{
      width: 3.125vw;
      height: 3.125vw;
    }
  }

  .quantity {
    width: 4.8vw;
    font-family: "Noto Sans SC", sans-serif;
    font-size: 2.0313vw;
    text-align: center;
  }
}
</style> -->
