<template>
  <div>
    <div class="wrap-event-button">
      <p
        id="wrap-event-button-sub-element"
        class="event-content"
      >
        {{ content }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSubPrimaryColor } from '@torder/common/utils';

const { content = 'no value' } = defineProps<{
  /** 이벤트 버튼에 들어가는 문구입니다. */
  content?: string,
}>();

const activeButtonColor = getSubPrimaryColor('#ffffff', 5, 'Y');
</script>

<style lang="scss" scoped>
.wrap-event-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12.34375vw;
  height: 3.9063vw;
  background-color: #fff;
  border-radius: 0.625vw;

  &.button-active {
    background-color: v-bind(activeButtonColor);
  }

  .event-content {
    font-size: 1.875vw;
    font-style: normal;
    font-weight: 700;
    line-height: 2.5vw;
    color: #0A0A0A;
    letter-spacing: -0.0375vw;
  }
}
</style>
