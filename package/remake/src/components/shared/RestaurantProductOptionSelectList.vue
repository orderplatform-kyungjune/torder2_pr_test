<template>
  <li class="select-item">
    <div class="select-item-left">
      <img
        class="img"
        :src="optionCheckImgRestaurant"
      >
      <span class="name">{{ translateLanguage(optionItem.nameArray, optionItem.name) }}</span>
    </div>
    <span class="price">+ {{ optionItem.price?.toLocaleString() }}</span>
  </li>
</template>

<script setup lang='ts'>
import { translateLanguage } from '@utils/langTransfer';
import { CartProductOptionType } from '@torder/common/interface/cartProduct';

defineProps<{
  optionItem: CartProductOptionType,
  optionCheckImgRestaurant: string,
}>();
</script>

<style scoped lang='scss'>
.select-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4vw 2vw;
  margin-bottom: 1vw;
  font-family: 'Noto Serif KR', serif;
  font-weight: 500;
  line-height: 1.5vw;
  word-break: break-all;
  background-color: #f5f5f5;
  border: .1563vw solid #dcdcdc;
  border-radius: .7813vw;

  &.active {
    border: solid .1563vw #2f2a26;
  }

  .select-item-left {
    display: flex;
    align-items: center;

    .select-item-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .name {
      margin-left: 1.2vw;
      font-size: 1.6406vw;
    }
  }

  .price {
    font-size: 1.5625vw;
    font-weight: 700;
  }
}
</style>
