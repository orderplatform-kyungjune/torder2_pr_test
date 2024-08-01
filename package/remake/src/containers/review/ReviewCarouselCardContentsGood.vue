<template>
  <dev class="item-contents-wrap">
    <p class="item-name-text">
      {{ replaceSlashToSpacing }}
    </p>
    <span class="item-price-text">{{ Number(price).toLocaleString() }}원</span>
  </dev>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import palette from '@styles/colors';

const {
  gray800,
  gray700,
} = palette;

export type ReviewCarouselCardGoodProps = { price: number; displayName: string }

const props = withDefaults(defineProps<ReviewCarouselCardGoodProps>(), {
  price() {
    return 0;
  },
  displayName() {
    return '';
  },
});

const replaceSlashToSpacing = computed(() => {
  const regex = /\/+/g;
  return props.displayName.replace(regex, (matches) => {
    switch (matches.length) {
      case 1:
        return '/';
      case 2:
        return ' ';
      case 3:
        return ' /';
      case 4:
        return '  ';
      default:
        return `  ${'/'.repeat(matches.length - 4)}`;
    }
  });
});

</script>

<style scoped lang="scss">
.item-contents-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
  justify-content: center;
}

.item-name-text {
  overflow: hidden;
  font-size: var(--font-size-h4, 1.875vw);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-height-adjust);
  color: v-bind(gray800);
  text-align: left;
  text-overflow: ellipsis;
  letter-spacing: var(--letter-spacing-adjust);
  white-space: nowrap;
}

.item-price-text {
  font-size: var(--font-size-h5, 1.641vw);
  font-style: normal;
  font-weight: 500;
  line-height: var(--line-height-base);
  color: v-bind(gray700);
  text-align: left;
  letter-spacing: var(--letter-spacing-base);
}
</style>
