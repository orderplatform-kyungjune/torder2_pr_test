import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {},
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
