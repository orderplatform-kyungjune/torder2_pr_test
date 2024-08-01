import { reactive } from 'vue';

interface useModalConfigType {
  open: () => void,
  close: () => void,
}

const useModal = (config?: useModalConfigType) => {
  const modalState = reactive({ show: false });

  const openModal = () => {
    modalState.show = true;
  };

  const closeModal = () => {
    modalState.show = false;
  };

  return {
    modalState,
    open: () => {
      openModal();
      if (config) config.open();
    },
    close: () => {
      closeModal();
      if (config) config.close();
    },
  };
};

export default useModal;
