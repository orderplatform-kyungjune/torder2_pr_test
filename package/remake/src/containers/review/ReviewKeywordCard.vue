<template>
  <dev
    class="card-container"
    @click="onClick"
  >
    <template v-if="selected">
      <MonoIcon
        name="IconCheckCircle"
        size="1.875vw"
        color="black"
        :style="{ flexShrink: 0 }"
      />
    </template>
    <span class="keyword-text">
      {{ keyword }}
    </span>
  </dev>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import palette from '@styles/colors';
import MonoIcon from './MonoIcon.vue';

const props = defineProps<{
  keyword: string,
  selected: boolean,
  onClick: () => void,
}>();

const keywordTextColor = computed(() => (props.selected ? palette.black900 : palette.gray100));

const cardContainerBackgroundColor = computed(() => (props.selected ? palette.white : 'rgba(119,129,151,0.6)'));
</script>

<style scoped lang="scss">
.card-container {
  display: flex;
  gap: 0.312vw;
  align-items: center;
  justify-content: center;
  width: 21.875vw;
  height: 16.25vh;
  padding: 0 1.562vw;
  cursor: pointer;
  background-color: v-bind(cardContainerBackgroundColor);
  border-radius: var(--border-radius-m, 8px);
}

.keyword-text {
  font-size: 2.187vw;
  font-weight: 600;
  line-height: var(--line-height-adjust, 130%);
  color: v-bind(keywordTextColor);
  text-align: center;
  letter-spacing: var(--letter-spacing-base, -1.5%);
}
</style>
