/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-extraneous-dependencies */
// vite.config.ts
import {resolve} from 'path';
import Inspector from 'vite-plugin-vue-inspector';
import VueDevTools from 'vite-plugin-vue-devtools';
import StylelintPlugin from 'vite-plugin-stylelint';
import {VitePluginRadar} from 'vite-plugin-radar';
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import mkcert from 'vite-plugin-mkcert';
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  base: './',
  plugins: [
    VueDevTools(),
    vue({reactivityTransform: true}),
    {
      name: 'singleHMR',
      handleHotUpdate({modules}) {
        return modules.map((m) => ({
          ...m,
          importedModules: new Set(),
          importers: new Set(),
        }));
      },
    },
    StylelintPlugin({
      include: ['src/**/*.{vue,scss}'],
      exclude: ['node_modules'],
      lintOnStart: true,
      emitErrorAsWarning: true,
      fix: true,
      cache: false,
    }),
    Inspector(),
    VitePluginRadar({gtm: [{id: 'GTM-M8Q8S74W'}]}),
    // mkcert(), // local https 테스트시 설정
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    })
  ],
  // readme 참조
  server: {
    proxy: {
      '/socket.io': {
        target: 'ws://development.socket.torder.co.kr',
        // changeOrigin: true,
        // secure: false,
        // ws: true,
        // rewrite: (path) => path.replace(/^\/socket/, ''),
      },
      '/login': {
        target: 'http://development.rest.torder.co.kr',
        changeOrigin: true,
      },
      '/shop': {
        target: 'http://development.rest.torder.co.kr',
        changeOrigin: true,
      },
      '/user': {
        target: 'http://development.rest.torder.co.kr',
        changeOrigin: true,
      },
      '/torder-event': {
        target: 'http://development.rest.torder.co.kr',
        changeOrigin: true,
      },
      '/tada': {
        target: 'http://development.rest.torder.co.kr',
        changeOrigin: true,
      },
      '/event': {
        target: 'http://development.rest.torder.co.kr',
        changeOrigin: true,
      },
      '/tablet_order/order': {
        target: 'http://development.order.torder.co.kr',
        changeOrigin: true,
      },
      '/tablet_order/get_cart_list': {
        target: 'http://development.cart.torder.co.kr',
        changeOrigin: true,
      },
      '/tablet_data': {
        target: 'http://development.cache.torder.co.kr',
        changeOrigin: true,
      },
      '/credit': {
        target: 'https://dev-sgw.torder.co.kr',
        changeOrigin: true,
      },
      '/front': {
        target: 'https://dev-dp-logger.torder.com',
        changeOrigin: true,
      },
      '/survey-app': {
        target: 'https://api2-dev.torder3.com',
        changeOrigin: true,
      },
      // '*':{
      //   target: 'http://development.rest.torder.co.kr',
      // }
    },
  //   // local https 사용, readme 참조
  //   https: {
  //     key: "./*-key.pem", // 생성된 파일의 이름을 입력해주세요
  //     cert: "./*.pem"
  //   }
  },
  resolve: {
    alias: [
      {
        find: '@apis',
        replacement: resolve(__dirname, './src/apis'),
      },
      {
        find: '@assets',
        replacement: resolve(__dirname, './src/assets'),
      },
      {
        find: '@codecs',
        replacement: resolve(__dirname, './src/codecs'),
      },
      {
        find: '@components',
        replacement: resolve(__dirname, './src/components'),
      },
      {
        find: '@composables',
        replacement: resolve(__dirname, './src/composables'),
      },
      {
        find: '@containers',
        replacement: resolve(__dirname, './src/containers'),
      },
      {
        find: '@interface',
        replacement: resolve(__dirname, './src/interface'),
      },
      {
        find: '@layouts',
        replacement: resolve(__dirname, './src/layouts'),
      },
      {
        find: '@router',
        replacement: resolve(__dirname, './src/router'),
      },
      {
        find: '@store',
        replacement: resolve(__dirname, './src/store'),
      },
      {
        find: '@styles',
        replacement: resolve(__dirname, './src/styles'),
      },
      {
        find: '@utils',
        replacement: resolve(__dirname, './src/utils'),
      },
      {
        find: '@views',
        replacement: resolve(__dirname, './src/views'),
      },
      {
        find: '@utils',
        replacement: resolve(__dirname, './src/utils'),
      },
      {
        find: '@locales',
        replacement: resolve(__dirname, './src/locales'),
      },
      {
        find: '@i18n',
        replacement: resolve(__dirname, './src/i18n'),
      },
      {
        find: '@plugins',
        replacement: resolve(__dirname, './src/plugins'),
      },
      {
        find: '@common',
        replacement: resolve(__dirname, './src/common'),
      },
      {
        find: '@',
        replacement: resolve(__dirname, './src'),
      },
    ],
  },
});
