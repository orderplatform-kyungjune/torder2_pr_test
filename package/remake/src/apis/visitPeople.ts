import axios,
{ AxiosResponse } from 'axios';
import {
  VisitPeopleDataType,
  VisitPeopleResetDataType,
} from '@torder/common/interface';
import endPoints from '@apis/endPoints';

export const requestVisitPeople = async (data: VisitPeopleDataType): Promise<AxiosResponse> => {
  const url = endPoints.user.inVisitGroups;
  const res = await axios.post(url, data);

  return res;
};

export const resetVisitPeople = async (data: VisitPeopleResetDataType): Promise<AxiosResponse> => {
  const fd = new FormData();

  fd.append('storeCode', data.storeCode);
  fd.append('tabletNumber', data.tabletNumber);

  const url = endPoints.user.initVisitInfo;
  const res = await axios.post(url, fd);

  return res;
};

export default {
  requestVisitPeople,
  resetVisitPeople,
};
