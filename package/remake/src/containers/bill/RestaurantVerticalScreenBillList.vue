<template>
  <div class="bill-container">
    <RestaurantVerticalScreenBillItem
      :key="`bill-${bill.goodName ?? bill.posOrderId}`"
      :itemName="removeSymbol(translateLanguage(bill.trans, bill.goodName))"
      :quantity="bill.orderQty"
      :itemPrice="bill.goodPrice?.toLocaleString()"
      :sumPrice="bill.orderPrice?.toLocaleString()"
      :t="t"
      :theme="theme.color"
    >
      <div
        v-if="isHasLength(bill.option)"
        class="options-wrap"
      >
        <RestaurantVerticalScreenBillOptionItem
          v-for="option in bill.option"
          :key="`bill-option-${option.optionName ?? option.order_qty}`"
          :optionName="removeSymbol(translateLanguage(option.langs, option.optionName))"
          :quantity="option.order_qty"
          :itemPrice="option.optionUnitPrice?.toLocaleString()"
          :sumPrice="option.optionOrderPrice?.toLocaleString()"
          :t="t"
          :theme="theme.color"
        />
      </div>
    </RestaurantVerticalScreenBillItem>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';

import { translateLanguage } from '@utils/langTransfer';
import { removeSymbol } from '@torder/common/utils';
import {
  billsArrayOptionType,
  billsArrayType,
} from '@torder/common/interface/orderList';
import useThemeStore from '@store/storeTheme';
import {
  RestaurantVerticalScreenBillItem,
  RestaurantVerticalScreenBillOptionItem,
} from '@components';

const { t } = useI18n();

defineProps<{
  bill: billsArrayType,
}>();

const { theme } = useThemeStore();

const isHasLength = (arr: billsArrayOptionType[] | undefined): boolean => {
  if (arr === undefined) return false;
  const isHas = arr.length > 0;

  return isHas;
};
</script>

<style lang='scss' scoped>
.bill-container {
  display: flex;
  flex-direction: column;
  gap: .7813vw;
  padding: 3.125vw 0;
  border-bottom: .0781vw solid #ddd;

  .options-wrap {
    display: flex;
    flex-direction: column;
    gap: .625vw;
    padding: 1.25vw 0;
  }
}
</style>
