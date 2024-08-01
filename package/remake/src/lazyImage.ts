import { storeToRefs } from 'pinia';
import useInitStore from '@store/storeInit';
import { IS_ORIGIN } from '@common/mode';
import LoadingImageCI from '@assets/icon_torder_logo_ci_white.svg';
import LoadingImageBI from '@assets/icon_torder_logo_bi_white.svg';
import LoadingImageLG from '@assets/icon_lg_logo_white.svg';
import networkErrorImage from '@assets/icn_network_error.svg';

function lazyImage(el: Element) {
  interface ImageWrapperProps {
    parent: HTMLElement,
    type?: 'loading' | 'error',
    newEl: HTMLElement,
    curEl: HTMLElement,
  }

  const LoadingImage = () => {
    const { getStoreInfo } = storeToRefs(useInitStore());

    // 해외망 (CI)
    if (!IS_ORIGIN) return LoadingImageCI;

    // LG U+
    if (getStoreInfo.value.businessType === 'uplus') return LoadingImageLG;

    // 국내망 (BI)
    return LoadingImageBI;
  };

  const imageWrapperStyleConvert = ({
    parent,
    type,
    newEl,
    curEl,
  }: ImageWrapperProps) => {
    if (type === 'loading') {
      parent.setAttribute('class', `${parent.getAttribute('class')} loading`);
      parent.replaceChild(newEl, curEl);
      return;
    }

    if (type === 'error') {
      parent.setAttribute('class', `${parent.getAttribute('class')} error`);
      parent.replaceChild(newEl, curEl);
      return;
    }

    parent.setAttribute(
      'class',
      `${parent
        .getAttribute('class')
        ?.replace('loading', '')
        .replace('error', '')}`,
    );
    parent.replaceChild(newEl, curEl);
  };

  function imageLoad(targetElement: HTMLElement) {
    const imgElement = targetElement;
    const { parentElement } = imgElement;

    const cloneImg = imgElement.cloneNode(false) as HTMLElement;
    cloneImg.setAttribute('src', LoadingImage());
    cloneImg.removeAttribute('data-lazy');

    if (parentElement) {
      imageWrapperStyleConvert({
        parent: parentElement,
        type: 'loading',
        newEl: cloneImg,
        curEl: imgElement,
      });
    }

    // data-lazy 에 지정된 이미지 경로를 <img src=""> 에 셋팅 합니다.
    imgElement.setAttribute(
      'src',
      imgElement.getAttribute('data-lazy') as string,
    );

    imgElement.onerror = () => {
      imgElement.setAttribute('onerror', '');
      imgElement.setAttribute('src', networkErrorImage);
      imgElement.setAttribute('onload', '');
      if (parentElement) {
        imageWrapperStyleConvert({
          parent: parentElement,
          type: 'error',
          newEl: imgElement,
          curEl: cloneImg,
        });
      }
      // imgElement.removeAttribute('data-lazy');
    };

    imgElement.onload = () => {
      if (parentElement) {
        imageWrapperStyleConvert({
          parent: parentElement,
          newEl: imgElement,
          curEl: cloneImg,
        });
      }
      // imgElement.removeAttribute('data-lazy');
    };
  }

  function callIntersectionApi(root: string | null, margin: string | null) {
    const options = {
      root: root ? document.querySelector(root) : null,
      threshold: 0,
      rootMargin: margin ?? '0px',
    };

    const lazyLoadCallback = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver,
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 감지대상이 교차영역에 진입 할 경우
          const target = entry.target as HTMLElement;

          imageLoad(target);
          observer.unobserve(target);
        }
      });
    };

    const lazyLoadingIO = new IntersectionObserver(lazyLoadCallback, options);
    lazyLoadingIO.observe(el);
  }

  // 지원되는 브라우저가 있기때문에, 이런식으로 처리
  // eslint-disable-next-line no-unused-expressions
  window.IntersectionObserver
    ? callIntersectionApi(
      el.getAttribute('data-root'),
      el.getAttribute('data-margin'),
    )
    : imageLoad(el as HTMLElement);
}

export default lazyImage;
