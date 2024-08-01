import { ref } from 'vue';
import { defineStore } from 'pinia';
import { DEVICE } from '@store/keys';

const useDeviceInfoStore = defineStore(DEVICE, () => {
  const deviceUsage = ref({});

  const updateDeviceUsage = (data: any) => {
    deviceUsage.value = data;
  };

  const cartHash = ref('');

  const updateCartHash = (data: string) => {
    cartHash.value = data;
  };

  return {
    deviceUsage,
    cartHash,
    updateDeviceUsage,
    updateCartHash,
  };
});

export default useDeviceInfoStore;
