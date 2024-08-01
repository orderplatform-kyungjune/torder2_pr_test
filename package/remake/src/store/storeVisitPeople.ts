import {
  computed,
  ref,
} from 'vue';
import { defineStore } from 'pinia';
import { VISIT } from '@torder/common/constant';

const useVisitPeopleStore = defineStore(VISIT, () => {
  const totalVisitPeople = ref<number>(0);
  const isOccupied = ref<boolean>(false);

  const getTotalVisitPeople = computed(() => totalVisitPeople.value);

  const setOccupiedTable = () => {
    isOccupied.value = true;
  };

  const resetOccupiedTable = () => {
    isOccupied.value = false;
  };

  const setTotalVisitPeople = (total: number) => {
    totalVisitPeople.value = total;

    if (totalVisitPeople.value !== 0) {
      setOccupiedTable();
    }
  };

  return {
    totalVisitPeople,
    getTotalVisitPeople,
    setTotalVisitPeople,
    setOccupiedTable,
    resetOccupiedTable,
    isOccupied,
  };
});

export default useVisitPeopleStore;
