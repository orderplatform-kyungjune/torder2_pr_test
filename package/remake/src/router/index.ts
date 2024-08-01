import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { reloadGuard, notProductGuard } from '@utils/route.guards';
import { routeHelper } from '@utils';
import { STORE, TABLE_CODE } from '@torder/common';
import {
  home,
  login,
  tableSelect,
  staffCall,
  billOrder,
  orderHistory,
  secretLogin,
  secretMain,
  banner,
  logo,
  productOption,
  orderComplete,
  productOptionView,
  internationalStaffCall,
  eventModulePage,
  quickMenuList,
  eventListPage,
  internationalTextOption,
  internationalImageOption,
  customEventListPage,
  customOrderHistory,
  customProductDetail,
  basicProductDetail,
  errorPage,
  movingServingRobot,
  arriveServingRobot,
} from '@router/routePaths';
import { LayoutHub } from '@layouts';

const retryLazy = (componentImport: any) => async () => {
  const pageAlreadyRefreshed = JSON.parse(
    window.localStorage.getItem('pageRefreshed') ?? 'false',
  );
  try {
    const component = await componentImport();
    window.localStorage.setItem('pageRefreshed', 'false');
    return component;
  } catch (error) {
    if (!pageAlreadyRefreshed) {
      window.localStorage.setItem('pageRefreshed', 'true');
      return window.location.reload();
    }
    throw error;
  }
};

const StoreLogin = retryLazy(() => import('../views/login/StoreLogIn.vue'));
const StoreTableSelect = retryLazy(
  () => import('../views/tableSelect/StoreTableSelect.vue'),
);
const BillOrder = retryLazy(() => import('../views/billOrder/BillOrder.vue'));
const OrderHistory = retryLazy(
  () => import('../views/orderHistory/OrderHistory.vue'),
);

const StaffCall = retryLazy(() => import('../views/staffCall/StaffCall.vue'));
const HyattStaffCall = retryLazy(
  () => import('../views/staffCall/HyattStaffCall.vue'),
);
const SecretLogin = retryLazy(() => import('../views/secret/SecretLogin.vue'));
const SecretMain = retryLazy(() => import('../views/secret/SecretMain.vue'));
const BannerPage = retryLazy(() => import('../views/banner/BannerPage.vue'));
const LogoPage = retryLazy(() => import('../views/logo/LogoPage.vue'));

const OrderComplete = retryLazy(
  () => import('../views/orderComplete/OrderComplete.vue'),
);
const ProductOptionView = retryLazy(
  () => import('../views/product/ProductOptionView.vue'),
);
const EventModulePage = retryLazy(
  () => import('../views/modulePage/EventModulePage.vue'),
);
const QuickMenuList = retryLazy(
  () => import('../views/quickMenu/QuickMenuList.vue'),
);
const EventListPage = retryLazy(
  () => import('../views/eventPage/EventListPage.vue'),
);
const CustomEventListPage = retryLazy(
  () => import('../views/eventPage/CustomEventListPage.vue'),
);
const HyattTextOption = retryLazy(
  () => import('../views/product/HyattTextOption.vue'),
);
const HyattImageOption = retryLazy(
  () => import('../views/product/HyattImageOption.vue'),
);
const CustomOrderHistory = retryLazy(
  () => import('../views/orderHistory/CustomOrderHistory.vue'),
);
const CustomProductDetail = retryLazy(
  () => import('../views/product/CustomProductDetail.vue'),
);
const BasicProductDetail = retryLazy(
  () => import('../views/product/BasicProductDetail.vue'),
);
const BasicProductOption = retryLazy(
  () => import('../views/product/BasicProductOption.vue'),
);
const ErrorPage = retryLazy(() => import('../common/Error.vue'));

const MovingServingRobot = retryLazy(
  () => import('../views/robot/MovingServingRobot.vue'),
);

const ArriveServingRobot = retryLazy(
  () => import('../views/robot/ArriveServingRobot.vue'),
);

// TODO : 사용 안함 -> 추후 제거
// const HyattOrderHistory = retryLazy(
//   () => import('../views/orderHistory/HyattOrderHistory.vue'),
// );
// const HyattProductDetail = retryLazy(
//   () => import('../views/product/HyattProductDetail.vue'),
// );
// const HyattProductOption = retryLazy(
//   () => import('../views/product/HyattProductOption.vue'),
// );

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: home,
  },
  {
    path: home,
    name: routeHelper.getRouteName(home),
    component: LayoutHub,
    children: [
      {
        path: billOrder,
        name: routeHelper.getRouteName(billOrder),
        component: BillOrder,
        beforeEnter: [reloadGuard],
      },
      {
        path: orderHistory,
        name: routeHelper.getRouteName(orderHistory),
        component: OrderHistory,
        beforeEnter: [reloadGuard],
      },

      {
        path: staffCall,
        name: routeHelper.getRouteName(staffCall),
        component: StaffCall,
      },
      {
        path: internationalStaffCall,
        name: routeHelper.getRouteName(internationalStaffCall),
        component: HyattStaffCall,
      },
      {
        path: secretLogin,
        name: routeHelper.getRouteName(secretLogin),
        component: SecretLogin,
      },
      {
        path: secretMain,
        name: routeHelper.getRouteName(secretMain),
        component: SecretMain,
      },
      {
        path: banner,
        name: routeHelper.getRouteName(banner),
        component: BannerPage,
      },
      {
        path: logo,
        name: routeHelper.getRouteName(logo),
        component: LogoPage,
      },
      {
        path: basicProductDetail,
        name: routeHelper.getRouteName(basicProductDetail),
        component: BasicProductDetail,
        beforeEnter: [notProductGuard],
      },
      {
        path: orderComplete,
        name: routeHelper.getRouteName(orderComplete),
        component: OrderComplete,
        beforeEnter: [reloadGuard],
      },
      {
        path: productOptionView,
        name: routeHelper.getRouteName(productOptionView),
        component: ProductOptionView,
        beforeEnter: [notProductGuard],
      },
      {
        path: quickMenuList,
        name: routeHelper.getRouteName(quickMenuList),
        component: QuickMenuList,
      },
      {
        path: eventListPage,
        name: routeHelper.getRouteName(eventListPage),
        component: EventListPage,
      },
      {
        path: customEventListPage,
        name: routeHelper.getRouteName(customEventListPage),
        component: CustomEventListPage,
      },
      {
        path: internationalTextOption,
        name: routeHelper.getRouteName(internationalTextOption),
        component: HyattTextOption,
        beforeEnter: [notProductGuard],
      },
      {
        path: internationalImageOption,
        name: routeHelper.getRouteName(internationalImageOption),
        component: HyattImageOption,
        beforeEnter: [notProductGuard],
      },
      {
        path: customOrderHistory,
        name: routeHelper.getRouteName(customOrderHistory),
        component: CustomOrderHistory,
      },
      {
        path: customProductDetail,
        name: routeHelper.getRouteName(customProductDetail),
        component: CustomProductDetail,
      },
      {
        path: productOption,
        name: routeHelper.getRouteName(productOption),
        component: BasicProductOption,
        // component: ProductOption, (기존 옵션 레이아웃)
        beforeEnter: [notProductGuard],
      },
      {
        path: eventModulePage,
        name: routeHelper.getRouteName(eventModulePage),
        component: EventModulePage,
      },
      {
        path: movingServingRobot,
        name: routeHelper.getRouteName(movingServingRobot),
        component: MovingServingRobot,
      },
      {
        path: arriveServingRobot,
        name: routeHelper.getRouteName(arriveServingRobot),
        component: ArriveServingRobot,
      },

      // TODO : 사용안함 -> 추후 제거
      // {
      //   path: internationalProductDetail,
      //   name: routeHelper.getRouteName(internationalProductDetail),
      //   component: HyattProductDetail,
      //   beforeEnter: [notProductGuard],
      // },
      // {
      //   path: internationalProductOption,
      //   name: routeHelper.getRouteName(internationalProductOption),
      //   component: HyattProductOption,
      //   beforeEnter: [notProductGuard],
      // },
      // {
      //   path: internationalOrderHistory,
      //   name: routeHelper.getRouteName(internationalOrderHistory),
      //   component: HyattOrderHistory,
      //   beforeEnter: [reloadGuard],
      // },
    ],
  },
  {
    path: login,
    name: routeHelper.getRouteName(login),
    component: StoreLogin,
  },
  {
    path: tableSelect,
    name: routeHelper.getRouteName(tableSelect),
    component: StoreTableSelect,
  },
  {
    path: errorPage,
    name: routeHelper.getRouteName(errorPage),
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = localStorage.getItem(STORE);
  const tableCode = localStorage.getItem(TABLE_CODE);

  const routerPath = (path: string) => {
    if (to.path !== path) {
      next({ path });
    } else {
      next();
    }
  };

  const isLogin = to.path === login;
  const isTableSelect = to.path === tableSelect;
  const isGoRoot = isLogin || isTableSelect;

  try {
    if (!store) {
      routerPath(login);
    } else if (to.path === tableSelect) {
      routerPath(tableSelect);
    } else if (!tableCode) {
      routerPath(tableSelect);
    } else if (isGoRoot) {
      routerPath(home);
    } else {
      next();
    }
  } catch (error) {
    console.error(error, '페이지 오류');
  }
});

export default router;
