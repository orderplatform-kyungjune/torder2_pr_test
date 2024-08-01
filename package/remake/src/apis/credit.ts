import axios, { AxiosResponse } from 'axios';
import { OrderSpecType } from '@torder/common/interface/cartProduct';
import {
  CreditReadyPayloadType,
  CreditWebLogsPayloadType,
} from '@interface/credit';
import endPoints from '@apis/endPoints';

// 주문하기 -> 결제 준비
export const requestCreditReady = (
  payload: OrderSpecType,
): Promise<AxiosResponse> => {
  const url = endPoints.credit.v2.pays.ready;

  const auth = {
    auth: {
      username: 'torder-credit-api',
      password: 'xldhejtjsrufwp123!',
    },
  };

  const res = axios.post(url, payload, auth);
  return res;
};

// 선결제 웹 -> 서버 로그
export const requestCreditWebLogs = (
  payload: CreditWebLogsPayloadType,
): Promise<AxiosResponse> => {
  const url = endPoints.credit.v2.webLogs;

  const auth = {
    auth: {
      username: 'torder-credit-api',
      password: 'xldhejtjsrufwp123!',
    },
  };

  const res = axios.post(url, payload, auth);
  return res;
};

export default {
  requestCreditReady,
  requestCreditWebLogs,
};
