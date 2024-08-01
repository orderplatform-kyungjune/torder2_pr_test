import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { SELECTED_CATEGORY } from '@store/keys';

const useStoreSelectedCategory = defineStore(SELECTED_CATEGORY, () => {
  const selectedCategory = reactive({
    firstCategory: '',
    subCategory: '',
  });

  const setFirstSelectedCategory = (value: string) => {
    if (!selectedCategory) return;
    selectedCategory.firstCategory = value;
  };

  const setSubSelectedCategory = (value: string) => {
    if (!selectedCategory) return;
    selectedCategory.subCategory = value;
  };

  const storeConfig = {
    selectedCategory,
    setFirstSelectedCategory,
    setSubSelectedCategory,
  };

  return storeConfig;
});

export default useStoreSelectedCategory;
