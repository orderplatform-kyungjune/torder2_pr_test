import {
  getStoreCode,
  getInitTableId,
} from '@torder/common/utils';
import usePaymentStore from '@store/storePayment';
import { requestCreditWebLogs } from '@apis/credit';

const postCreditWebLogs = async (status: string, errorCode?: string) => {
  try {
    const { currentPaymentOrderKey } = usePaymentStore();

    const payload = {
      orderKey: currentPaymentOrderKey,
      status,
      store: {
        storeCode: getStoreCode(),
        tabletCode: getInitTableId(),
      },
      errorCode,
    };

    await requestCreditWebLogs(payload);
  } catch (error) {
    console.log(error);
  }
};
export default postCreditWebLogs;
