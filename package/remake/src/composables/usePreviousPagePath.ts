import {
  ref,
  onMounted,
} from 'vue';

/**
 * 현재 페이지 이전의 경로를 추적하는 훅입니다.
 * @returns {{ previousPagePath: Ref<null | string> }} 이전 페이지의 경로를 포함하는 객체
 */
// eslint-disable-next-line import/prefer-default-export
export const usePreviousPagePath = () => {
  const previousPagePath = ref<null | string>(null);

  onMounted(() => {
    previousPagePath.value = window.history.state.current;
  });

  return { previousPagePath };
};
