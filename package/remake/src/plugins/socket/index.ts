import { App } from 'vue';
import { connect } from '@plugins/socket/utils';
import useSocket from '@plugins/socket/inject';

export default {
  install(app: App): void {
    const socket = connect(); // useSocket import 하여 사용 시 즉시 소켓 연결함.
    app.provide('socket', socket);
  },
  useSocket,
};

export { useSocket };
