<!-- <template>
  <div class="cart-modal-option-wrap">
    <span
      v-if="isProduct"
      class="name"
    >
      <span>- </span>
      {{ translateLanguage((option as productType).productLanguageShort, (option as productType).productLanguageShort?.ko) }}
    </span>
    <span
      v-else
      class="name"
    >
      <span>- </span>
      {{ translateLanguage((option as CartProductOptionType).nameArray, (option as CartProductOptionType).name) }}
    </span>
    <span class="quantity">
      {{ option.quantity }}
      {{ t('개') }}
    </span>
    <span class="price">
      {{ getProductOptionPrice(option)?.toLocaleString() }}
    </span>
  </div>
</template>

<script setup lang='ts'>
import { translateLanguage } from '@utils/langTransfer';
import {
  productOptionItemType,
  productType,
} from '@torder/common/interface/product';
import { CartProductOptionType } from '@torder/common/interface/cartProduct';

defineProps<{
  option: productOptionItemType | productType,
  isProduct: boolean,
  getProductOptionPrice: (item: productOptionItemType | productType) => number,
  t: (str: string) => string,
}>();

//
</script>

<style scoped lang='scss'>
.cart-modal-option-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.8vw;
  font-family: "Noto Sans SC", sans-serif;
  font-size: 1.875vw;
  color: #0080ff;
  letter-spacing: -0.0469vw;
  word-break: break-all;

  .name {
    width: 47%;
    font-weight: normal;
    line-height: 1.58;
  }

  .quantity {
    width: 9%;
    text-align: center;
  }

  .price {
    width: 18%;
    margin-right: calc(23% + 1.3vw);
    margin-left: 0.5vw;
    font-weight: normal;
    text-align: right;
  }
}
</style> -->
