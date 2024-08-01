import { ref } from 'vue';
import { defineStore } from 'pinia';
import { RESTAURANT_VERTICAL } from '@torder/common/constant';

const useRestaurantVerticalStore = defineStore(RESTAURANT_VERTICAL, () => {
  // const upDownFlag = ref(false);
  // 임시주석 우선 레스토랑 세로테마일 경우 메뉴판 위로 올라온 상태로 유지시키기 위한 임시처리
  const upDownFlag = ref(true);

  const handleUpBody = () => {
    upDownFlag.value = true;
  };

  const handleDownBody = () => {
    upDownFlag.value = false;
  };

  return {
    upDownFlag,
    handleDownBody,
    handleUpBody,
  };
});

export default useRestaurantVerticalStore;
