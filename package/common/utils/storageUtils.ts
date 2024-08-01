import {
  CACHE_DATA,
  LANGUAGE,
  LOADING_IMAGE,
  STOP_EXPOSURE,
  STORE,
  TABLE,
  TABLE_CODE,
  THEME,
  TYPE,
  U_CODE,
} from '../constant';

// TODO: 사용되지 않는 로직 getter/setter pair 가 안되는 로직 정리 필요.
type LocalStorageKeyDefs =
  typeof CACHE_DATA |
  typeof STORE |
  typeof TABLE |
  typeof U_CODE |
  typeof TYPE |
  typeof THEME |
  typeof TABLE_CODE |
  typeof STOP_EXPOSURE |
  typeof LOADING_IMAGE |
  typeof LANGUAGE |
  'orderUniqueData' |
  'pageRefreshed' |
  'latestUpdatedTime';

/**
 * {@link getStorageData} 로 대체
 * @param findKey
 */
export const getStorage = (findKey: LocalStorageKeyDefs) => localStorage.getItem(findKey);

/**
 *
 * @param findKey localStorage 저장 할 key 값
 * @param defaultValue localStorage 의 key 에 저장된 값이 없을 경우 반환되는 값
 */
export const getStorageData = <R = any>(findKey: LocalStorageKeyDefs, defaultValue: R): R => {
  const storedData = localStorage.getItem(findKey);
  if (!storedData) {
    return defaultValue;
  }

  try {
    return JSON.parse(storedData);
  } catch (e) {
    return storedData as R;
  }
};

/**
 * @param key localStorage 에 저장 될 value dKey 값
 * @param value 저장하는 string 데이터
 */
export const setStorage = (key: LocalStorageKeyDefs, value: string) => {
  localStorage.setItem(key, value);
};

/**
 * localStorage 데이터 저장
 * @param key
 * @param value
 */
export const setStorageData = (key: LocalStorageKeyDefs, value: string | object) => {
  let data;

  if (typeof value === 'object') {
    data = JSON.stringify(value);
  } else {
    data = value;
  }
  localStorage.setItem(key, data);
};

/**
 * localStorage 삭제
 * @param key 삭제할 키
 */
export const removeStorage = (key: LocalStorageKeyDefs) => localStorage.removeItem(key);
