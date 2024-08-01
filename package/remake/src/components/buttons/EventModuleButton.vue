<template>
  <div :class="`${styleTypeClassName()}-theme-container`">
    <button
      class="event-module-button"
      :class="`${styleTypeClassName()}-theme-button-wrapper`"
      @click="onClickHandler"
    >
      <img
        class="event-module-icon"
        :src="icon"
        :alt="`${title} 아이콘`"
      >
      <span
        class="button-title"
        :class="getDarkModeClass()"
      >{{ title }}</span>
    </button>
  </div>
</template>

<script setup lang='ts'>
import useInitStore from '@store/storeInit';

const {
  title,
  icon,
  onClickHandler,
  isHyattTheme,
} = defineProps<{
  title: string,
  icon: string,
  isHyattTheme: boolean,
  onClickHandler: () => void,
}>();

const styleTypeClassName = (): 'hyatt' | 'default' => {
  if (isHyattTheme) return 'hyatt';
  return 'default';
};

const { getDarkModeClass } = useInitStore();

</script>

<style lang='scss' scoped>
.hyatt-theme-container {
  display: flex;
  align-items: center;
  margin: 0.7813vw 0.4688vw;
  border: 0.0781vw solid #5B5B5B;
  border-radius: 0.9375vw;
}

.default-theme-container {
  font-weight: 500;
}

.event-module-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 1.875vw;
  color: #fff;
  background-color: transparent;
  border: none;
  outline: none;
}

.hyatt-theme-button-wrapper  {
  gap: 0.7813vw;
  padding: 1.25vw 1.875vw;
  font-size: 2.3438vw;
  font-weight: 700;
  line-height: 3.125vw;
  color: #5B5B5B;
  letter-spacing: -0.0469vw;
}

.default-theme-button-wrapper {
  gap: 0.625vw;
  padding: 0 0.9375vw;
}

.event-module-icon {
  width: 2.5vw;
  height: 2.5vw;
}

.button-title {
  display: block;
  line-height: 1.5;

  &.dark-mode {
    color: #fff;
  }
}

</style>
