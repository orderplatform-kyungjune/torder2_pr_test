import axios,
{ AxiosResponse } from 'axios';
import { getCartListType } from '@torder/common/interface/orderList';
import useVisitPeopleStore from '@store/storeVisitPeople';
import endPoints from '@apis/endPoints';

export const requestOrderList = async (storeCode: string, tabletNumber: string): Promise<AxiosResponse> => {
  // get_cart_list
  const url = endPoints.orderData.orderList;
  const fd = new FormData();

  fd.append('store_code', storeCode);
  fd.append('tablet_number', tabletNumber);

  const res = await axios.post(url, fd);

  return res;
};

export const checkOrderExist = async (storeCode: string, tabletNumber: string, setOrderList?: (data: getCartListType) => void): Promise<boolean> => {
  try {
    const { setTotalVisitPeople } = useVisitPeopleStore();

    const res: AxiosResponse = await requestOrderList(storeCode, tabletNumber);
    const { data }: {data: getCartListType} = res;

    setTotalVisitPeople(data?.visitPeopleArray?.total ?? 0);

    if (setOrderList) setOrderList(data); // store에 주문내역 업데이트

    // const isNullish = (value: any) => !!value;
    // const isHaveLength = (value: any[]) => value.length > 0;
    /*
      isOrderExist : 주문내역 여부
      order_info : 주문내역 데이터 리스트

      bills : 토탈 계산서 데이터
      bills.billsArray : 계산서 리스트
    */
    // return data.isOrderExist && isNullish(data.order_info) && isHaveLength(data.order_info ?? []) && isNullish(data.bills) && isHaveLength(data.bills?.billsArray ?? []);
    return !!data.isOrderExist;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const checkBillExist = async (storeCode: string, tabletNumber: string, fn?: (data?: any) => void): Promise<boolean> => {
  try {
    const { setTotalVisitPeople } = useVisitPeopleStore();

    const res: AxiosResponse = await requestOrderList(storeCode, tabletNumber);
    const { data }: {data: getCartListType} = res;

    setTotalVisitPeople(data?.visitPeopleArray?.total ?? 0);

    if (fn) fn(data);

    const isHaveLength = (value: any[]) => value.length > 0;

    /*
      isOrderExist : 주문내역 여부
      order_info : 주문내역 데이터 리스트

      bills : 토탈 계산서 데이터
      bills.billsArray : 계산서 리스트
    */
    return isHaveLength(data.bills?.billsArray ?? []);
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default {
  requestOrderList,
  checkOrderExist,
  checkBillExist,
};
