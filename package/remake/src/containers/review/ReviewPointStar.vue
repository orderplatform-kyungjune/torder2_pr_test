<template>
  <div class="star-container">
    <MonoIcon
      :name="star.icon"
      :size="vwSize"
      class="clip-position-styles"
      :color="star.color"
    />
    <div class="clip">
      <ClipComp
        :width="vwSize"
        :height="vwSize"
        :viewBox="star.viewBox"
      />
    </div>
    <div
      class="star-handler"
      @click="(e)=>{
        if (!disabled) onClick?.();
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MonoIcon from '@containers/review/MonoIcon.vue';
import IconGradationStarSelected from '@assets/review/color_icons/icon-gradation_star-selected-color.vue';
import IconDefaultStarSelected from '@assets/review/color_icons/icon-default_star-selected-color.vue';

export type StarType = 'Default' | 'Gradation';

export interface ReviewPointStarProps {
  type?: StarType,
  point?: number,
  size: number, // vw
  disabled: boolean,
  onClick?: () => void,
}
const props = withDefaults(defineProps<ReviewPointStarProps>(), {
  point: 0,
  type: 'Default',
  onClick() {
    return null;
  },
});
const starHandlerCursor = computed(() => !props.disabled && 'pointer');
const starHandlerPointerEvents = computed(() => props.disabled && 'none');
const cursor = computed(() => props.disabled && 'pointer');
const vwSize = computed(() => `${props.size}vw`);
const pointWidth = computed(() => `${(props.point ?? 0) * 100}%`);
const isDefault = computed(() => props.type === 'Default');
const ClipComp = computed(() => (isDefault.value ? IconDefaultStarSelected : IconGradationStarSelected));
type StarInfo = {
  icon: 'IconDefaultStarEmpty'|'IconGradationStarEmpty',
  color: string,
  viewBox: string,
}
const star = computed<StarInfo>(() => {
  if (isDefault.value) {
    return {
      icon: 'IconDefaultStarEmpty',
      color: '#D2D7DC',
      viewBox: '0 0 32 32',
    };
  }
  return {
    icon: 'IconGradationStarEmpty',
    color: '#606C85',
    viewBox: '0 0 140 140',
  };
});
</script>

<style scoped lang="scss">
.star-container {
  position: relative;
  display: inline-block;
  width: v-bind(vwSize);
  height: v-bind(vwSize);
  cursor: v-bind(cursor);
}

.clip {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  width: v-bind(pointWidth);
  height: 100%;
  overflow: hidden;
}

.star-handler {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: v-bind(starHandlerPointerEvents);
  cursor: v-bind(starHandlerCursor);
}

.clip-position-styles {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
