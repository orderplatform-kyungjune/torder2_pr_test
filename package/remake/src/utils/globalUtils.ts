import {
  IS_ORIGIN,
  IS_US_EAST,
  IS_US,
  IS_SINGAPORE,
  IS_SYDNEY,
} from '@common/mode';

export const refreshPage = () => {
  // 캐나다 단일 도메인은 리다이랙션 로직이 없어서 1/0/4 버전으로 이동
  if (IS_US_EAST) {
    window.location.href = 'https://us-east-order2.torder.io/';
  }

  if (IS_US) {
    window.location.href = 'https://us-order2.torder.io/';
  }

  if (IS_SINGAPORE) {
    window.location.href = 'https://sg-order2.torder.io/';
  }

  if (IS_SYDNEY) {
    window.location.href = 'https://sydney-order2.torder.io/';
  }

  if (IS_ORIGIN) {
    window.location.href = 'https://order2.torder.io/';
  }
};

export default { refreshPage };
