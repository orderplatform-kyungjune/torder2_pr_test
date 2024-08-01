<template>
  <span class="select-icon">
    <IconCheckCircleRed
      width="98%"
      height="98%"
    />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { SelectedCustomCompareType } from '@containers/review/types';
import IconCheckCircleRed from '@assets/review/color_icons/icon-check_circle-red-color.vue';

type Props = {
  type: SelectedCustomCompareType,
  selectedType?: SelectedCustomCompareType,
}
const props = defineProps<Props>();
const visible = computed(() => (props.selectedType && props.selectedType === props.type ? 'visible' : 'hidden'));
</script>

<style scoped lang="scss">
.select-icon {
  position: absolute;
  top: 0.781vw;
  right: 0.781vw;
  z-index: 1;
  width: 3.75vw;
  height: 3.75vw;
  visibility: v-bind(visible);
}
</style>
