import { computed, Ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { initDataType } from '@torder/common';
import useCartStore from '@store/storeCart';
import screenSaver from '@composables/screenSaver';
import cartTimer from '@composables/cartTimer';

export const afterMountedScreenSaver = (
  product: HTMLElement,
  init: Ref<initDataType>,
) => {
  const { currentIntervalId, changedScreenSaverTime } = screenSaver(
    {
      touchElement: document.body,
      scrollElement: product,
    },
    init.value.storeInfo?.bannerWaitingTime,
  );
  const { cartTimeId } = storeToRefs(useCartStore());
  const { changedCartTimerTime } = cartTimer(
    init.value.storeInfo?.cartRefreshTime,
  );
  const screenDisplayTimer = computed(() => currentIntervalId.value);
  const cartResetTimer = computed(() => cartTimeId.value);

  // 타임 설정 변경 감지 로직
  watch(init, (newValue) => {
    changedScreenSaverTime(newValue.storeInfo?.bannerWaitingTime);
    changedCartTimerTime(newValue.storeInfo?.cartRefreshTime);
  });

  return {
    screenDisplayTimer,
    cartResetTimer,
  };
};
