import {
  computed,
  reactive,
} from 'vue';
import { defineStore } from 'pinia';

import {
  themeType,
  changeThemeColorType,
  changeThemeTypeType,
} from '@torder/common/interface/theme';
import {
  BLACK,
  VERTICAL,
} from '@torder/common/constant';
import { THEME } from '@store/keys';

const useThemeStore = defineStore(THEME, () => {
  const theme: themeType = reactive({
    color: BLACK,
    type: VERTICAL,
  });

  const changeThemeColor: changeThemeColorType = (color) => {
    theme.color = color;
  };

  const changeThemeType: changeThemeTypeType = (type) => {
    theme.type = type;
  };

  const isThemeColorBlack = computed(() => theme.color === BLACK);

  return {
    theme,
    changeThemeColor,
    changeThemeType,
    isThemeColorBlack,
  };
});

export default useThemeStore;
