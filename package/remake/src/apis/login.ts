import axios,
{ AxiosResponse } from 'axios';
import endPoints from '@apis/endPoints';

export const requestTabletLogin = async (id: string, password: string): Promise<AxiosResponse> => {
  const url = endPoints.login.tabletLogin;
  const fd = new FormData();

  fd.append('tablet_id', id);
  fd.append('tablet_pwd', password);

  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  const res = await axios.post(url, fd, config);

  return res;
};

export default { requestTabletLogin };
