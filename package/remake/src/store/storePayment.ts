import { ref } from 'vue';
import { defineStore } from 'pinia';
import { PAYMENT } from '@store/keys';

const usePaymentStore = defineStore(PAYMENT, () => {
  const currentPaymentOrderKey = ref('');

  const updatePaymentOrderKey = (orderKey: string) => {
    currentPaymentOrderKey.value = orderKey;
  };

  return {
    currentPaymentOrderKey,
    updatePaymentOrderKey,
  };
});

export default usePaymentStore;
