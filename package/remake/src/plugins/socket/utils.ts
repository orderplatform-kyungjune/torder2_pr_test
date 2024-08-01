/* eslint-disable @typescript-eslint/no-explicit-any */
import io from 'socket.io-client';
import {
  getInitTableId,
  getStorageData,
} from '@torder/common/utils';
import {
  STORE,
  U_CODE,
} from '@torder/common/constant';
import { endPoints } from '@apis';

export const connect = () => io(endPoints.socket, {
  transports: ['websocket'],
  query: {
    v: '1',
    storeCode: getStorageData(STORE, ''),
    tableCode: getInitTableId() ?? '',
    uCode: getStorageData(U_CODE, ''),
    MACAddr: '',
  },
});

export default connect;
