import axios,
{ AxiosResponse } from 'axios';
import { requestDpLoggerFrontParamsType } from '@interface/logger';
import endPoints from '@apis/endPoints';

// 광고배너 노출되는 시점마다 로그 수집 (데이터플랫폼팀)
// 관련 포스트맨 : https://torder-backend-team.postman.co/workspace/torder-dataplatform~6c71a153-ff69-4bf0-8060-8ab7f94624cd/collection/29580067-f9a75ab3-cfca-4b77-bff7-1405b1fb97dd
export const requestDpLoggerFront = (params: requestDpLoggerFrontParamsType[]): Promise<AxiosResponse> => {
  const url = endPoints.logger.front;
  const res = axios.post(
    url,
    params,
    { headers: { 'X-Amz-Invocation-Type': 'Event' } }, // X-Amz-Invocation-Type 헤더 추가
  );
  return res;
};

export default { requestDpLoggerFront };
