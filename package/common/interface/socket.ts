/* eslint-disable camelcase */
import {
  tableInfo,
  initTableInfoType,
} from './login';
import { initDataType } from './initData';

export interface requestClientType {
  ip: string,
  storeCode: string,
  tableCode: string,
}

export interface RobotInfo {
  robot_id: string,
  name: string,
  battery: number,
  modelCode: string,
  message: string,
}

export interface ApkInfo {
  fileName: string,
  fileSize: number,
  option: {
    remove: number,
    updateTime: number,
    version: string,
  },
  url: string,
}
export interface torderResType {
  configData: initDataType,
  configDataHash: string,
  requestClient: requestClientType,
  socketId: string,
  store: { code: string },
  table: {
    code: string,
    name: string,
  },
  robotInfo?: RobotInfo,
  apkInfo?: ApkInfo,
  ment: string,
  type: string,
  uCode: string,
  result: boolean,
  orderKey: string,
  errorCode: string,
  storeCode: string,
  storeHash: string,
  message: {
    base: string,
    end: string,
  },
  now: string | number,
  time: string | number,
}

export interface torderUpdatedTabletResType {
  type_msg: string,
  data: tableInfo & initTableInfoType,
  tablet_number: string,
  shop_code: string,
}
