const {
  VITE_USER_NODE_ENV,
  MODE,
  VITE_TORDER_FLAG,
  VITE_US_EAST_FLAG,
  VITE_US_FLAG,
  VITE_SINGAPORE_FLAG,
  VITE_SYDNEY_FLAG,
} = import.meta.env;

export const IS_LOCAL = window.location.port === '8080' || window.location.port === '8081';
export const IS_DEV = (VITE_USER_NODE_ENV || MODE) === 'development';
export const IS_STG = (VITE_USER_NODE_ENV || MODE) === 'staging';
export const IS_PROD = (VITE_USER_NODE_ENV || MODE) === 'production';
export const IS_DESKTOP = !window.UUID;
export const IS_ORIGIN = VITE_TORDER_FLAG; // 국내 전용 플래그
export const IS_US_EAST = VITE_US_EAST_FLAG; // 해외(캐나다) 전용 플래그
export const IS_US = VITE_US_FLAG; // 해외(US) 전용 플래그
export const IS_SINGAPORE = VITE_SINGAPORE_FLAG; // 해외(싱가폴) 전용 플래그
export const IS_SYDNEY = VITE_SYDNEY_FLAG; // 해외(시드니) 전용 플래그
