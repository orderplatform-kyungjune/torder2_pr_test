import {
  Ref,
  ref,
} from 'vue';
import { defineStore } from 'pinia';

import { BANNER } from '@store/keys';

// TODO : 광고 배너 관련 스토어 관련 로직들 모두 이관하고 추후 떼어내면 될 것
const useBannerStore = defineStore(BANNER, () => {
  const currentBannerIndex: Ref<number> = ref(0);

  const handleCurrentBannerIndex = (index: number) => {
    currentBannerIndex.value = index;
  };

  return {
    currentBannerIndex,
    handleCurrentBannerIndex,
  };
}, { persist: true });

export default useBannerStore;
