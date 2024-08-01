import axios, { AxiosResponse } from 'axios';
import {
  OrderDataType,
  OrderSpecType,
} from '@torder/common/interface/cartProduct';
import endPoints from '@apis/endPoints';

export const requestOrders = async (
  data: OrderSpecType,
): Promise<AxiosResponse> => {
  const url = endPoints.orders;
  const res = await axios.post(url, data);

  return res;
};
