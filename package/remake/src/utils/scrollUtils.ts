import { storeToRefs } from 'pinia';
import { convertNodeListsToArray } from '@torder/common/utils';
import {
  RootScrollType,
  CategoryInputType,
  scrollMoveConfigType,
} from '@torder/common/interface/scrollUtils';
import {
  CART,
  RESTAURANT_HORIZONTAL,
  HORIZONTAL,
  VERTICAL,
  RESTAURANT_HORIZONTAL_CARD,
  RESTAURANT_VERTICAL,
  HYATT,
} from '@torder/common/constant';
import useModalStore from '@store/storeModal';

export const scrollMove: (config: scrollMoveConfigType) => void = ({
  type,
  parent,
  child,
  direction = 'top',
  isBodyChange = false,
  behavior = 'auto',
  adjustScroll = 0,
}) => {
  if (direction === 'top') {
    if (type === VERTICAL) {
      parent?.scrollTo({
        top: child.offsetTop,
        behavior,
      });
      return;
    }

    if (type === RESTAURANT_VERTICAL) {
      const scrollFix = isBodyChange ? 260 : 530;
      // 임시주석 레스토랑 위 아래 메뉴판 펼치는 기능 미사용으로 인한 스크롤 높이 재조정
      // const scrollFix = 240;

      parent?.scrollTo({
        top: child.offsetTop - scrollFix,
        behavior,
      });
      return;
    }

    if (type === RESTAURANT_HORIZONTAL_CARD) {
      parent?.scrollTo({
        top: child.offsetTop - 90,
        behavior,
      });
      return;
    }

    if (type === RESTAURANT_HORIZONTAL) {
      parent?.scrollTo({
        top: child.offsetTop - 110,
        behavior,
      });
      return;
    }

    if (type === HYATT) {
      parent?.scrollTo({
        top: child.offsetTop - 70,
        behavior,
      });

      const { closeModal } = useModalStore();

      closeModal(CART);

      return;
    }

    parent?.scrollTo({
      top: child.offsetTop - adjustScroll,
      behavior,
    });
  }

  if (direction === 'left') {
    if (type === HORIZONTAL) {
      parent?.scrollTo({
        left: child.offsetLeft,
        behavior,
      });
      return;
    }

    if (type === HYATT) {
      parent?.scrollTo({
        left: child.offsetLeft - 830,
        behavior,
      });
      return;
    }

    parent?.scrollTo({
      left: child.offsetLeft - adjustScroll,
      behavior,
    });
  }
};

export const scrollSpyCategory = (
  element: Element,
  rootElement: RootScrollType,
  categoryList: CategoryInputType,
  fn?: (value: string) => void,
) => {
  const categoryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const targetId = entry.target?.id;
      const hasIdAndIsIntersecting = targetId && entry.isIntersecting;

      if (!hasIdAndIsIntersecting) return;

      if (fn) fn(targetId);

      const categoryLists = document.querySelectorAll(categoryList.className);

      const findCategory = (category: Element) => {
        const target = category as HTMLElement;
        const { id } = target.dataset;

        return id === targetId;
      };

      const targetCategory = [...convertNodeListsToArray(categoryLists)].find(findCategory) as HTMLElement;

      if (targetCategory) {
        if (categoryList.direction === 'horizontal') {
          categoryList.categoryWrapper?.scrollTo({
            left: targetCategory?.offsetLeft - (categoryList.fixScroll ?? 0),
            behavior: categoryList.scrollBehavior ?? 'smooth',
          });
        } else {
          categoryList.categoryWrapper?.scrollTo({
            top: targetCategory?.offsetTop - (categoryList.fixScroll ?? 0),
            behavior: categoryList.scrollBehavior ?? 'smooth',
          });
        }
      }
    });
  }, {
    root: rootElement.scrollElement,
    rootMargin: rootElement.margin ?? '-10% -80% -90% -20%',
  });
  categoryObserver.observe(element);
};

// 메인 화면 상품 리스트 스크롤시 장바구니 닫기 로직
const closeModalAction = () => {
  const { closeModal } = useModalStore();
  const { flag } = storeToRefs(useModalStore());

  if (!flag.value.cart) return;
  closeModal(CART);
};

export const scrollCloseCartModal = (addEvent: boolean) => {
  const productList = document.querySelector('.middle-body');

  if (!productList) return;

  if (addEvent) {
    productList.addEventListener('scroll', closeModalAction, true);
  } else {
    productList.removeEventListener('scroll', closeModalAction, true);
  }
};
