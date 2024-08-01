import axios, { AxiosResponse } from 'axios';
import endPoints from '@apis/endPoints';

type NumberEventLog = {
  storeName: string,
  tableName: string,
  route: string,
};

export const requestNumberEventLog = async (
  payload: NumberEventLog,
): Promise<AxiosResponse> => {
  const url = endPoints.banner.numberEvent;

  const res = await axios.post(url, payload);

  return res;
};

export const requestSurveyEventLog = async (
  payload: FormData,
): Promise<AxiosResponse> => {
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };

  const url = endPoints.banner.surveyEvent;

  const res = await axios.post(url, payload, config);

  return res;
};

export const requestDriverCallEventLog = async (
  payload: FormData,
): Promise<AxiosResponse> => {
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };

  const url = endPoints.banner.driverCallEvent;

  const res = await axios.post(url, payload, config);

  return res;
};
