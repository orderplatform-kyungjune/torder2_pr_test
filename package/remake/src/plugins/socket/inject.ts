/* eslint-disable no-undef */
import { inject } from 'vue';
import io from 'socket.io-client';

const useSocket = (): SocketIOClientStatic['Socket'] => inject<SocketIOClientStatic['Socket']>('socket', io.Socket);
export default useSocket;
