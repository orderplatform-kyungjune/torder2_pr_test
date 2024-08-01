import { Vue } from '@sentry/vue/types/types';
import * as Sentry from '@sentry/vue';

export const isProductionConfig = () => import.meta.env.MODE === 'production' && !window.origin.includes('local');

const debugReportInSentry = () => {
  const sentryDsnKey = import.meta.env.VITE_SENTRY_DSN;
  const isProductionEnv = import.meta.env.MODE === 'production';
  const isLocalEnv = window.origin.includes('local');

  if (!sentryDsnKey) {
    console.log('<Sentry> Can not find DSN key in environment config');
  }
  if (!isProductionEnv) {
    console.log('<Sentry> Does not match production environment');
  }
  if (isLocalEnv) {
    console.log(
      '<Sentry> Because it is a local environment, sentry collection is not performed.',
    );
  }
};

export const initSentryWhenProduction = (app: Vue | Vue[] | undefined) => {
  debugReportInSentry();

  if (isProductionConfig()) {
    console.log('Sentry init');
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN,
      tracingOptions: { trackComponents: true },
      // offline error tracking [optional]
      transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport),
      attachProps: true,
    });
  }
};

export const setSentryStoreLogWhenProduction = () => {
  const persistedTabletData = localStorage.getItem('table');
  const persistedCacheInitData = localStorage.getItem('cacheInitData');
  const persistedLastUpdatedTime = localStorage.getItem('latestUpdatedTime') ?? 'Empty';
  const persistedLang = localStorage.getItem('lang') ?? 'Empty';

  const isSetTagInfo = persistedCacheInitData && persistedTabletData && isProductionConfig();
  if (!isSetTagInfo) return;

  const tabletInfo = JSON.parse(persistedTabletData);
  const cacheInitInfo = JSON.parse(persistedCacheInitData);

  const {
    tabletId,
    tablePosCode,
    TabletName,
    TabletNumber,
    van,
  } = tabletInfo;

  const {
    storeName,
    storeCode,
  } = cacheInitInfo.storeInfo;

  const vanTag = van === '' ? 'Empty' : van;

  Sentry.setTags({
    tabletId,
    tablePosCode,
    TabletName,
    TabletNumber,
    van: vanTag,
    lastUpdatedTime: persistedLastUpdatedTime,
    lang: persistedLang,
    storeName,
    storeCode,
  });
};
