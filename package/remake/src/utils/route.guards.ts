import { RouteLocationNormalized } from 'vue-router';
import useProductStore from '@store/storeProduct';

export const notProductGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const { productInfo } = useProductStore();

  if (productInfo.id === undefined) { return { path: from.path }; }
  return true;
};

export const reloadGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  if (from.name === undefined) { return { path: from.path }; }
  return true;
};

export default {
  notProductGuard,
  reloadGuard,
};
