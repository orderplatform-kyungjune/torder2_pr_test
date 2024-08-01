import { initDataType } from '@torder/common/interface/initData';

export interface EventConfigUpdatePayloadType {
  MACAddr: string,
  uCode: string,
  path: string,
  storeCode: string,
  tableCode: string,
  configHash: string,
}

export interface EventConfigUpdateResponseDataType {
  type: string,
  configDataHash: string,
  configData?: initDataType,
}
