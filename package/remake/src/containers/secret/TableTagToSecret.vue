<template>
  <div
    class="table-tag-wrap"
    @click="onNextSecret"
  >
    <RestaurantHorizontalScreenTableTag
      :tableNO="getInitTableName()"
      :customTableBackgroundColor="tableNumBackgroundColor"
      :customTableFontColor="tableNumFontColor"
    />
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { getInitTableName } from '@torder/common/utils';
import useInitStore from '@store/storeInit';
import { useSecret } from '@composables/secret';
import { RestaurantHorizontalScreenTableTag } from '@components';

const { onNextSecret } = useSecret();

// 커스텀 디자인
const {
  tableNumBackgroundColor,
  tableNumFontColor,
} = storeToRefs(useInitStore());
</script>
