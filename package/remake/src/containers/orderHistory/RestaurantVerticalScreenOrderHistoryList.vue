<template>
  <div class="history-container">
    <RestaurantVerticalScreenOrderHistoryListHead
      :orderIndex="orderIndex"
      :headText="getHeadText()"
      :orderTime="orderTime"
      :active="active"
      :theme="theme.color"
      class="history-head"
    />
    <template
      v-for="history in histories"
      :key="history.display_name"
    >
      <RestaurantVerticalScreenOrderHistoryItem
        v-if="history.cart_show !== 1"
        :itemName="removeSymbol(translateLanguage(history.trans, history.display_name))"
        :quantity="history.order_qty"
        :t="t"
        :theme="theme.color"
      >
        <div
          v-if="isHasLength(history.option)"
          class="options-wrap"
        >
          <RestaurantVerticalScreenOrderHistoryOptionItem
            v-for="option in history.option"
            :key="option.display_name"
            :optionName="removeSymbol(translateLanguage(option.langs, option.display_name))"
            :quantity="option.order_qty"
            :t="t"
            :theme="theme.color"
          />
        </div>
      </RestaurantVerticalScreenOrderHistoryItem>
    </template>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';

import { translateLanguage } from '@utils/langTransfer';
import { removeSymbol } from '@torder/common/utils';
import {
  orderInfoOptionType,
  orderInfoType,
} from '@torder/common/interface/orderList';
import useThemeStore from '@store/storeTheme';
import {
  RestaurantVerticalScreenOrderHistoryItem,
  RestaurantVerticalScreenOrderHistoryListHead,
  RestaurantVerticalScreenOrderHistoryOptionItem,
} from '@components';

const { t } = useI18n();

const props = defineProps<{
  orderIndex: number,
  histories: orderInfoType[],
  active: boolean,
  orderTime: string,
}>();

const getHeadText = () => (props.active ? t('마지막 주문') : t('이전 주문'));

const { theme } = useThemeStore();

const isHasLength = (arr: orderInfoOptionType[] | undefined): boolean => {
  if (arr === undefined) return false;

  const isHas = arr.length > 0;

  return isHas;
};
</script>

<style lang='scss' scoped>
.history-container {
  display: flex;
  flex-direction: column;
  gap: .7813vw;
  padding: 3.125vw 0;
  border-bottom: .0781vw solid #ddd;

  .history-head {
    margin-bottom: 2.5vw;
  }

  .options-wrap {
    display: flex;
    flex-direction: column;
    gap: .625vw;
    padding: 1.25vw 0;
  }
}
</style>
