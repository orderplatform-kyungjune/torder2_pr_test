import {
  ref,
  defineAsyncComponent,
  AsyncComponentLoader,
} from 'vue';
import {
  HORIZONTAL,
  RESTAURANT_HORIZONTAL,
  RESTAURANT_HORIZONTAL_CARD,
  RESTAURANT_VERTICAL,
  VERTICAL,
  typeType,
} from '@torder/common';
import ErrorPage from '@common/Error.vue';

const useDynamicLayout = (type: typeType) => {
  const isComponentsLoading = ref(false);
  const layoutComponent = ref(null);

  const getDynamicComponent = (type: typeType) => {
    const dynamicComponent = (path: AsyncComponentLoader) => defineAsyncComponent({
      loader: async () => {
        isComponentsLoading.value = true;
        try {
          const component = await path();
          isComponentsLoading.value = false;
          return component.default || component;
        } catch (error) {
          isComponentsLoading.value = false;
          throw error;
        }
      },
      errorComponent: ErrorPage,
    });

    switch (type) {
      case VERTICAL:
        return dynamicComponent(() => import('../layouts/BasicVerticalScrollLayoutMain.vue'));
      case HORIZONTAL:
        return dynamicComponent(() => import('../layouts/BasicHorizontalScrollLayoutMain.vue'));
      case RESTAURANT_HORIZONTAL_CARD:
      case RESTAURANT_HORIZONTAL:
        return dynamicComponent(() => import('../layouts/RestaurantHorizontalScreenLayout.vue'));
      case RESTAURANT_VERTICAL:
        return dynamicComponent(() => import('../layouts/RestaurantVerticalScreenLayout.vue'));
      default:
        return dynamicComponent(() => import('../layouts/HyattLayout.vue'));
    }
  };
  layoutComponent.value = getDynamicComponent(type);

  return {
    isComponentsLoading,
    layoutComponent,
  };
};

export default useDynamicLayout;
