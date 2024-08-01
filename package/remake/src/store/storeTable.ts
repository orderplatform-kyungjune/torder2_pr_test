import {
  Ref,
  ref,
} from 'vue';
import { defineStore } from 'pinia';

import { initTableInfoType } from '@torder/common/interface/login';
import { TABLE } from '@store/keys';

const useTableStore = defineStore(TABLE, () => {
  const tableInfo: Ref<initTableInfoType> = ref({} as initTableInfoType);
  const setTableInfo = (data: initTableInfoType) => {
    tableInfo.value = data;
  };

  return {
    tableInfo,
    setTableInfo,
  };
});

export default useTableStore;
