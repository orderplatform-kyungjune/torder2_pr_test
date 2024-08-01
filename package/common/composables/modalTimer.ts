import { ref } from 'vue';

const useModalTimer = (second: number) => {
  const time = ref(second);
  const flag = ref(true);

  const timer = () => {
    const intervalId = setInterval(() => {
      time.value -= 1;
      const isZero = time.value === 0;
      if (isZero) flag.value = false;
    }, 1000);

    return intervalId;
  };

  const resetTimer = () => {
    time.value = second;
  };

  return {
    time,
    flag,
    timer,
    resetTimer,
  };
};

export default useModalTimer;
