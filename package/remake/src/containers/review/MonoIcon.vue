<template>
  <Comp
    :id="v4()"
    :width="size"
    :height="size"
    :fill="color"
    v-bind="props"
  />
</template>

<script setup lang="ts">
import { VNodeProps } from 'vue';
import { v4 } from 'uuid';
import IconX from '@assets/review/mono_icons/icon-x-mono.vue';
import IconRight from '@assets/review/mono_icons/icon-right-mono.vue';
import IconLeft from '@assets/review/mono_icons/icon-left-mono.vue';
import IconGradationStarEmpty from '@assets/review/mono_icons/icon-gradation_star-empty-mono.vue';
import IconDefaultStarEmpty from '@assets/review/mono_icons/icon-default_star-empty-mono.vue';
import IconCheckCircle from '@assets/review/mono_icons/icon-check_circle-mono.vue';

const MONO_ICONS = {
  IconLeft,
  IconRight,
  IconDefaultStarEmpty,
  IconGradationStarEmpty,
  IconX,
  IconCheckCircle,
};

type MonoIconName = keyof typeof MONO_ICONS;
type Props = VNodeProps & {
  name: MonoIconName,
  color?: string,
  size?: number | string,
}

const props = defineProps<Props>();

const Comp = MONO_ICONS[props.name];
</script>
