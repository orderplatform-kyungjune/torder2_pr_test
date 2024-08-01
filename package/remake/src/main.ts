/* eslint-disable no-unused-vars */
import { createApp } from 'vue';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createPinia } from 'pinia';
import { initSentryWhenProduction } from '@utils/sentryUtil';
import {
  QueryClient,
  VueQueryPlugin,
} from '@tanstack/vue-query';
import router from '@router';
import socket from '@plugins/socket';
import i18n from '@i18n';
import lazyImage from './lazyImage';
import App from './App.vue';
import 'swiper/css';

const app = createApp(App);

// sentry 이니셜라이즈
initSentryWhenProduction(app);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      gcTime: Infinity,
      staleTime: Infinity,
    },
    mutations: { retry: false },
  },
});

app.provide('queryClient', queryClient);

app.use(createPinia().use(piniaPluginPersistedstate))
  .use(socket)
  .use(router)
  .use(i18n)
  .use(VueQueryPlugin)
  .directive('lazyload', {
    mounted: lazyImage,
    updated: lazyImage,
  })
  .mount('#app');

export default { app };
