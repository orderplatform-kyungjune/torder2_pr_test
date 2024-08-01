<template>
  <div class="label-text">
    <span class="label-text-content">
      {{ label }}
    </span>
    <component :is="value"/>
  </div>
</template>

<script setup lang="ts">
import { VNode } from 'vue';
import palette from '@styles/colors';

type Props ={
  label: string,
  value: VNode,
}

defineProps<Props>();

const { gray50 } = palette;
</script>

<style scoped lang="scss">
.label-text {
  display: flex;
  gap: 1.25vw;
  font-size: 2.187vw;
  line-height: var(--line-height-base, 160%);
  letter-spacing: var(--letter-spacing-base, -1.5%);
}
.label-text-content {
  flex-shrink: 0;
  font-weight: 600;
  color: v-bind(gray50);
}
</style>
