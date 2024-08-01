import {
  Ref,
  ref,
} from 'vue';
import { defineStore } from 'pinia';

import { cartProductType } from '@torder/common/interface/cartProduct';
import { PRODUCT } from '@store/keys';

const useProductStore = defineStore(PRODUCT, () => {
  const productInfo: Ref<cartProductType> = ref({} as cartProductType);
  const setProductInfo = (data: cartProductType) => {
    productInfo.value = data;
  };

  return {
    productInfo,
    setProductInfo,
  };
});

export default useProductStore;
