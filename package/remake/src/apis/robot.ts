import axios,
{ AxiosResponse } from 'axios';
import { RequestRobotParamsType } from '@interface/robot';
import endPoints from '@apis/endPoints';

// 로봇 돌려보내기 API
export const requestRobotGoBack = (params: RequestRobotParamsType): Promise<AxiosResponse> => {
  const url = endPoints.robot.message.fromTabletToSignalRobot;

  const fd = new FormData();

  fd.append('storeCode', params.storeCode);
  fd.append('tabletNumber', params.tabletNumber ?? '');

  const res = axios.post(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } });

  return res;
};

// 로봇 호출 전 상태 체크 API
export const requestRobotHealCheck = (params: RequestRobotParamsType): Promise<AxiosResponse> => {
  const url = `${endPoints.robot.message.tableHealCheck}?storeCode=${params.storeCode}&tableName=${params.tableName}`;
  const res = axios.get(url);

  return res;
};

// 로봇 호출 API
export const requestRobotCall = (params: RequestRobotParamsType): Promise<AxiosResponse> => {
  const url = `${endPoints.robot.message.tableCallRobot}?storeCode=${params.storeCode}&tableName=${params.tableName}&callType=delivery`;
  const res = axios.get(url);

  return res;
};

export default {
  requestRobotGoBack,
  requestRobotHealCheck,
  requestRobotCall,
};
