import { reactive } from 'vue';
import { defineStore } from 'pinia';

const useExampleStore = defineStore('example', () => {
  const exampleData = reactive({
    title: 'test',
    subtitle: [
      '직접 절대 경로를 통해 불러 오는 방법',
      'script에서 import 하여 :src안에 넣는 방법',
    ],
  });

  return { exampleData };
});

export default useExampleStore;
