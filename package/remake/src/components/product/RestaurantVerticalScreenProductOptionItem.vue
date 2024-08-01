<template>
  <div class="product-option-item-wrap">
    <div class="left-wrap">
      <img :src="optionCheckImgRestaurant">
      <div class="name">
        {{ optionItemName }}
      </div>
    </div>
    <div class="right-wrap">
      <div class="quantity-wrap">
        <img
          src="https://static.torder.co.kr/torder2/goods-increase-white-46x46.svg"
          class="increase"
          @click.stop="restaurantVerticalIncreaseOptionQty"
        >
        <div class="quantity">
          {{ optionItemQuantity }}개
        </div>
        <img
          src="https://static.torder.co.kr/torder2/goods-decrease-black-42x42.svg"
          class="decrease"
          @click.stop="restaurantVerticalDecreaseOptionQty"
        >
      </div>
      <div class="price">
        + {{ optionItemPrice?.toLocaleString() }}
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  optionCheckImgRestaurant: string,
  optionItemName: string,
  optionItemPrice: number | string,
  optionItemQuantity: number,
  isThemeColorBlack: boolean,
  restaurantVerticalIncreaseOptionQty: () => void,
  restaurantVerticalDecreaseOptionQty: () => void,
}>();
</script>

<style scoped lang='scss'>
.product-option-item-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 12vw;
  padding: 3.75vw;
  font-family: 'Noto Serif KR', serif;
  word-break: break-all;
  border: solid .1563vw #e8e8e8;
  border-radius: .7813vw;

  &.black {
    background-color: #303030;
    border: .1563vw solid #303030;
  }

  &.active.white {
    border: solid .1563vw #2f2a26;
  }

  &.active.black {
    background-color: #111;
    border: solid .1563vw #fff;
  }

  .left-wrap {
    display: flex;
    gap: 1.4vw;
    align-items: center;

    .name {
      font-size: 1.875vw;
      font-weight: 700;
    }
  }

  .right-wrap {
    display: flex;
    gap: 1.4vw;
    align-items: center;

    .quantity-wrap {
      display: flex;
      gap: 1.2vw;
      align-items: center;

      .quantity {
        width: 9.25vw;
        font-size: 2.1875vw;
        text-align: center;
      }
    }

    .price {
      width: 21vw;
      font-size: 2.1875vw;
      text-align: right;
    }
  }
}
</style>
