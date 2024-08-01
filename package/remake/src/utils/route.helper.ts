import {
  LocationQueryRaw,
  RouteParamsRaw,
  RouteRecordName,
} from 'vue-router';
import router from '@router';

const getRemovedSlashPath = (path: string) => path.replace('/', '');

export const getRouteName = (path: string): string => {
  if (path === '/') {
    const homeName = 'home';

    return homeName;
  }

  return getRemovedSlashPath(path);
};

export const pushPage = (routePath: string): void => {
  router.push({ name: getRouteName(routePath) });
};

export const pushPageWithParams = (
  name: RouteRecordName,
  params: RouteParamsRaw,
): void => {
  router.push({
    name,
    params,
  });
};

export const pushPageWithQueries = (
  name: RouteRecordName,
  query: LocationQueryRaw,
): void => {
  router.push({
    name,
    query,
  });
};

export const goBackPage = (): void => {
  router.go(-1);
};

export const parseQueryString = (url: string) => {
  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _,
    query,
  ] = url.split('?');
  if (!query) return {};
  return query.split('&').reduce((acc: any, e: any) => {
    const [
      key,
      value,
    ] = e.split('=').map(decodeURIComponent);
    return {
      ...acc,
      [key]: value,
    };
  }, {});
};

export const getRoutePath = () => router.currentRoute.value.path;

export default {
  getRouteName,
  pushPage,
  goBackPage,
  parseQueryString,
};
