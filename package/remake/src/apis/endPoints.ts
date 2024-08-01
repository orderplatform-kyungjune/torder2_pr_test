import { IS_DEV, IS_STG } from '@common/mode';

// local https 사용시 설정 값
// const DEV_API_URL = '//localhost:8080';
// const DEV_API_INIT_URL = '//localhost:8080';
// const DEV_ORDER_URL = '//localhost:8080';
// let DEV_SOCKET_URL = '//localhost:8080';
// let DEV_GET_CART_API_URL = '//localhost:8080/tablet_order/get_cart_list';

const DEV_API_URL = '//development.rest.torder.co.kr';
const DEV_API_INIT_URL = '//development.cache.torder.co.kr';
const DEV_ORDER_URL = '//development.order.torder.co.kr';
let DEV_GET_CART_API_URL =
  '//development.cart.torder.co.kr/tablet_order/get_cart_list';
let DEV_SOCKET_URL = '//development.socket.torder.co.kr';
let PRD_API_URL = '//api.torder.co.kr';
let PRD_REST_API_URL = '//rest.torder.co.kr';
let PRD_SOCKET_URL = '//socketio.torder.co.kr';

// us-east
if (import.meta.env.VITE_US_EAST_FLAG) {
  DEV_GET_CART_API_URL = '//rest.us-east.torder.io/tablet_order/get_cart_list';
  DEV_SOCKET_URL = '//socketio.us-east.torder.io';
  PRD_API_URL = '//init.us-east.torder.io';
  PRD_REST_API_URL = '//rest.us-east.torder.io';
  PRD_SOCKET_URL = '//socketio.us-east.torder.io';
}

// us
if (import.meta.env.VITE_US_FLAG) {
  DEV_GET_CART_API_URL = '//rest.torder.us/tablet_order/get_cart_list';
  DEV_SOCKET_URL = '//socketio.torder.us';
  PRD_API_URL = '//api.torder.us';
  PRD_REST_API_URL = '//rest.torder.us';
  PRD_SOCKET_URL = '//socketio.torder.us';
}

// singapore
if (import.meta.env.VITE_SINGAPORE_FLAG) {
  DEV_GET_CART_API_URL = '//rest.sg.torder.com/tablet_order/get_cart_list';
  DEV_SOCKET_URL = '//socket.sg.torder.com';
  PRD_API_URL = '//init.sg.torder.com';
  PRD_REST_API_URL = '//rest.sg.torder.com';
  PRD_SOCKET_URL = '//socket.sg.torder.com';
}

// sydney
if (import.meta.env.VITE_SYDNEY_FLAG) {
  DEV_GET_CART_API_URL = '//rest.sydney.torder.io/tablet_order/get_cart_list';
  DEV_SOCKET_URL = '//socket.sydney.torder.io';
  PRD_API_URL = '//init.sydney.torder.io';
  PRD_REST_API_URL = '//rest.sydney.torder.io';
  PRD_SOCKET_URL = '//socket.sydney.torder.io';
}

const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';

const ORDER_API_URL = IS_DEV
  ? protocol + DEV_ORDER_URL
  : protocol + PRD_REST_API_URL;
const REST_API_URL = IS_DEV
  ? protocol + DEV_API_URL
  : protocol + PRD_REST_API_URL;
const INIT_API_URL = IS_DEV
  ? protocol + DEV_API_INIT_URL
  : protocol + PRD_API_URL;

const SOCKET_URL = IS_DEV
  ? protocol + DEV_SOCKET_URL
  : protocol + PRD_SOCKET_URL;

const GET_CART_LIST_URL = IS_DEV
  ? DEV_GET_CART_API_URL
  : `${REST_API_URL}/tablet_order/get_cart_list`;
const PAYMENT_API_URL = IS_DEV
  ? // ? 'https://localhost:8080'  // local https 사용시 설정
    'https://dev-sgw.torder.co.kr'
  : 'https://sgw.torder.co.kr';
const DP_LOGGER_URL = IS_DEV
  ? // ? 'https://localhost:8080'  // local https 사용시 설정
    'https://dev-dp-logger.torder.com'
  : 'https://prd-dp-logger.torder.com';

const REVIEW_URL = (() => {
  if (IS_DEV) return 'https://api2-dev.torder3.com'; // 'https://localhost:8080'  // local https 사용시 설정
  if (IS_STG) return 'https://api2-test.torder3.com';
  return 'https://api2.torder3.com';
})();

const endPoints = {
  login: { tabletLogin: `${REST_API_URL}/login/tablet_login` },
  tabletList: { tablet: `${REST_API_URL}/shop/get_table_list` },
  orders: `${ORDER_API_URL}/tablet_order/orders`,
  socket: SOCKET_URL,
  tabletData: { init: `${INIT_API_URL}/tablet_data/init` },
  orderData: { orderList: GET_CART_LIST_URL },
  user: {
    inVisitGroups: `${REST_API_URL}/user/inVisitGroups`,
    initVisitInfo: `${REST_API_URL}/user/initVisitInfo`,
  },
  credit: {
    v2: {
      pays: { ready: `${PAYMENT_API_URL}/credit/v2/pays/v2/ready` },
      webLogs: `${PAYMENT_API_URL}/credit/v2/web-logs`,
    },
  },
  torderEvent: {
    configUpdate: `${REST_API_URL}/torder-event/v1/store/config/update`,
  },
  logger: { front: `${DP_LOGGER_URL}/front` },
  banner: {
    numberEvent: `${REST_API_URL}/tada/insight`,
    surveyEvent: `${REST_API_URL}/event/event_click_route`,
    driverCallEvent: `${REST_API_URL}/event/insightDriverCall`,
  },
  robot: {
    message: {
      fromTabletToSignalRobot: `${REST_API_URL}/robotmessage/fromTabletToSignalRobot`,
      tableHealCheck: `${REST_API_URL}/robotmessage/tableHealCheck`,
      tableCallRobot: `${REST_API_URL}/robotmessage/tableCallRobot`,
    },
  },
  review: {
    order: `${REVIEW_URL}/survey-app/v1/order2`,
    log: `${REVIEW_URL}/survey-app/v1/log`,
    review: `${REVIEW_URL}/survey-app/v1/review`,
  },
};

export default endPoints;
