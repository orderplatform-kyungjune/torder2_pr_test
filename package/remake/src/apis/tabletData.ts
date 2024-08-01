import axios,
{ AxiosResponse } from 'axios';
import { pushPage } from '@utils/route.helper';
import { errorPage } from '@router/routePaths';
import endPoints from '@apis/endPoints';

// init 전체 조회
export const requestInit = async (storeCode: string): Promise<AxiosResponse> => {
  const url = endPoints.tabletData.init;
  const instance = axios.create({ baseURL: url });
  const fd = new FormData();

  fd.append('store_code', storeCode);

  // // 에러 발생시 재요청 로직
  // let retryCount = 1;

  // 1분 동안 5초씩 재시도 (총 1분)
  // const retry = (errorConfig: AxiosRequestConfig) => new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(instance.request(errorConfig));
  //     retryCount += 1;
  //   }, 5000);
  // });

  // 즉시 에러페이지로 이동 (서버 과부화에 대한 우려로 재시도 기능 제거)
  instance.interceptors.response.use((res) => res, async (error) => {
    // if (error.config && retryCount < 12) {
    //   return retry(error.config);
    // }

    pushPage(errorPage);
    console.error('init request Error');
    return Promise.reject(error);
  });

  const res = await instance.post(url, fd).catch((error) => {
    console.log(error);
    return error;
  });

  return res;
};

// init 선택 조회
export const requestSelectInit = (storeCode: string, selectType: string): Promise<AxiosResponse> => {
  const url = endPoints.tabletData.init;
  const instance = axios.create({ baseURL: url });
  const fd = new FormData();

  fd.append('store_code', storeCode);
  fd.append('api_type', '2');
  fd.append('case_type', selectType);

  // let retryCount = 1;

  // 1분 동안 5초씩 재시도 (총 1분)
  // const retry = (errorConfig: AxiosRequestConfig) => new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(instance.request(errorConfig));
  //     retryCount += 1;
  //   }, 5000);
  // });

  // 즉시 에러페이지로 이동 (서버 과부화에 대한 우려로 재시도 기능 제거)
  instance.interceptors.response.use((res) => res, async (error) => {
    // if (error.config && retryCount < 12) {
    //   return retry(error.config);
    // }

    pushPage(errorPage);

    return Promise.reject(error);
  });

  const res = instance.post('', fd).catch((error) => {
    console.log(error);
    return error;
  });

  return res;
};

export default {
  requestInit,
  requestSelectInit,
};
