import { BANNER_CONTROL } from '@torder/common/constant';
import useModalStore from '@store/storeModal';

export const useHiddenBannerController = () => {
  const { openModal } = useModalStore();

  let timer: ReturnType<typeof setTimeout>;
  let clickCount = 0;

  const onNextClick = () => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      clickCount = 0;
    }, 1000);

    clickCount += 1;

    if (clickCount > 4) openModal(BANNER_CONTROL);
  };

  return { onNextClick };
};

export default useHiddenBannerController;
