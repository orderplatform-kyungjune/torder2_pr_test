<template>
  <div
    class="start-container"
    :class="ACTIONABLE_ELEMENT_CLASS"
  >
    <!-- TODO: touch 를 통해 별점 줄수 있도록 진행 필요.-->
    <ReviewPointStar
      v-for="(star, index) in stars"
      :key="index"
      :type="type"
      :size="size"
      :point="star.rate"
      :disabled="disabled"
      :on-click="()=>reviewPointStarClick(star)"
    />
  </div>
</template>

<script setup lang="ts">
// TODO: 소수점은 연산은 가급적 피해야 하며 자연수를 기반으로 되게 수정 필요.
import {
  computed,
  ref,
  watchEffect,
} from 'vue';
import { range } from 'fp-ts/NonEmptyArray';
import { ACTIONABLE_ELEMENT_CLASS } from '@containers/review/const';
import ReviewPointStar, { StarType } from '@containers/review/ReviewPointStar.vue';

type Props = {
  type?: StarType,
  reviewPoint?: number,
  size: number, // vw size
  gap: number, // vw gap
  disabled?: boolean,
  onChange?: (reviewPoint: number) => void,
};

const props = withDefaults(defineProps<Props>(), {
  type: 'Default',
  onChange() {
    return null;
  },
  disabled: false,
  reviewPoint: 0,
});

const point = ref(props.reviewPoint);

const gapSize = computed(() => `${props.gap}vw`);

const calcRate = (p: number) => {
  if (point.value >= p) return 1;
  return Math.abs(point.value - p) === 0.5 ? 0.5 : 0;
};

const stars = computed(() => range(1, 5).reduce((acc, p) => {
  const rate = calcRate(p);
  acc.push({
    rate,
    point: p,
  });
  return acc;
}, [] as {rate: number; point: number}[]));

const handleClick = (p: number) => {
  point.value = p;
  props.onChange?.(p * 2);
};

const reviewPointStarClick = (star: { rate: number; point: number }) => {
  if (props.disabled) return;
  // 비어있거나, 반까지 채워져있는 별을 클릭한 경우
  if (star.rate < 1) {
    handleClick(star.point);
    return;
  }
  // 꽉 채워져있고, 이전의 별을 클릭한 경우
  if (star.point < point.value) {
    handleClick(star.point);
    return;
  }
  handleClick(point.value - 0.5);
};

watchEffect(() => {
  point.value = props.reviewPoint / 2;
});
</script>

<style scoped lang="scss">
.start-container {
  display: inline-flex;
  gap: v-bind(gapSize);
}
</style>
