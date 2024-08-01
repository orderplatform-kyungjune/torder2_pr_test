import axios,
{ AxiosResponse } from 'axios';
import { EventConfigUpdatePayloadType } from '@interface/torderEvent';
import endPoints from '@apis/endPoints';

export const requestEventConfigUpdate = (params: EventConfigUpdatePayloadType): Promise<AxiosResponse> => {
  const url = endPoints.torderEvent.configUpdate;

  const res = axios.get(url, { params });

  return res;
};

export default { requestEventConfigUpdate };
