import { reactive } from 'vue';
import { defineStore } from 'pinia';

import { BOTTOM_BAR } from '@store/keys';

const useBottomNavBarStore = defineStore(BOTTOM_BAR, () => {
  const bottomBarConfig = reactive({
    isFull: false,
    isShowButton: true,
  });

  const changeToWithButtonBottomBar = () => {
    bottomBarConfig.isFull = false;
    bottomBarConfig.isShowButton = true;
  };

  const changeToOnlyLanguageBottomBar = () => {
    bottomBarConfig.isFull = true;
    bottomBarConfig.isShowButton = false;
  };

  return {
    bottomBarConfig,
    changeToWithButtonBottomBar,
    changeToOnlyLanguageBottomBar,
  };
});

export default useBottomNavBarStore;
