import { ref } from 'vue';
import { defineStore } from 'pinia';
import { STAFF_CALL_ITEMS } from '@store/keys';

/** 직원 호출 완료 모달에 분기로 나뉘는 텍스트를 보여주기 위해 담긴 아이템이 있는지 확인하는 스토어 */
const useStaffCallItems = defineStore(STAFF_CALL_ITEMS, () => {
  const haveSelectedServiceItems = ref(false);

  const existsSelectedStaffCallService = () => {
    haveSelectedServiceItems.value = true;
  };

  const noEmployeeCallServiceSelected = () => {
    haveSelectedServiceItems.value = false;
  };

  return {
    haveSelectedServiceItems,
    existsSelectedStaffCallService,
    noEmployeeCallServiceSelected,
  };
});

export default useStaffCallItems;
