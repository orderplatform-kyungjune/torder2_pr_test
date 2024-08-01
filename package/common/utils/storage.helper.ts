import { getStorage } from '../utils/storageUtils';
import {
  tableInfo,
  initTableInfoType,
} from '../interface/login';
import { initDataType } from '../interface/initData';
import {
  CACHE_DATA,
  STORE,
  TABLE,
} from '../constant/string';

export const getStoreInfo = () => JSON.parse(getStorage(CACHE_DATA) as string);

export const getStoreName = () => {
  const data: initDataType = JSON.parse(getStorage(CACHE_DATA) as string);

  if (!data?.storeInfo?.storeName) return '';
  return data?.storeInfo?.storeName;
};

export const getStoreCode = () => {
  const data = getStorage(STORE) as string;

  return data || '';
};

export const getTableInfo = () => JSON.parse(getStorage(TABLE) as string);

// 하얏트 때문에 살려놓음.
export const getTableName = () => {
  const data: tableInfo = JSON.parse(getStorage(TABLE) as string);

  if (!data?.Tablet_name) return '';
  return data?.Tablet_name;
};

export const getTableNumber = () => {
  const data: tableInfo = JSON.parse(getStorage(TABLE) as string);

  if (!data?.Tablet_number) return '';
  return data?.Tablet_number;
};

export const getTableId = () => {
  const data: tableInfo = JSON.parse(getStorage(TABLE) as string);

  if (!data?.Ta_id) return '';
  return data?.Ta_id;
};

export const getTableOrderAble = () => {
  const data: tableInfo = JSON.parse(getStorage(TABLE) as string);

  if (data?.Tablet_orderAble === null) return 1;
  return data?.Tablet_orderAble;
};

// init select tableInfo type (티오더2에 우선 적용)
export const getInitTableName = () => {
  const data: initTableInfoType = JSON.parse(getStorage(TABLE) as string);

  if (!data?.TabletName) return '';
  return data?.TabletName;
};

export const getInitTableNumber = () => {
  const data: initTableInfoType = JSON.parse(getStorage(TABLE) as string);

  if (!data?.TabletNumber) return '';
  return data?.TabletNumber;
};

// 테이블코드
export const getInitTableId = () => {
  const data: initTableInfoType = JSON.parse(getStorage(TABLE) as string);

  if (!data?.tabletId) return '';
  return data?.tabletId;
};

export const getInitTableOrderAble = () => {
  const data: initTableInfoType = JSON.parse(getStorage(TABLE) as string);

  if (data?.orderAble === null) return 1;
  return data?.orderAble;
};

export const getInitTableCreditUse = () => {
  const data: initTableInfoType = JSON.parse(getStorage(TABLE) as string);

  if (data?.credit === null) return 0;
  return data?.credit;
};

export const getCreditSerialNumber = () => {
  const data: initTableInfoType = JSON.parse(getStorage(TABLE) as string);

  if (data?.creditSerialNumber === null) return '';
  return data?.creditSerialNumber;
};

export const getTablePosCode = () => {
  const data: initTableInfoType = JSON.parse(getStorage(TABLE) as string);

  if (data?.tablePosCode === null) return '';
  return data?.tablePosCode;
};

export const getCreditFunctionArray = () => {
  const data: initTableInfoType = JSON.parse(getStorage(TABLE) as string);

  if (data?.creditWayArray === null) return [];
  return data?.creditWayArray;
};
