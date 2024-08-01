/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import {resolve} from "path";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: '/vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['html'],
      reportsDirectory: './tests/unit/coverage',
    },
  },
  plugins: [vue()],
  base: "./",
  resolve: {
    alias: [
      {
        find: '@apis',
        replacement: resolve(__dirname, './package/remake/src/apis'),
      },
      {
        find: '@assets',
        replacement: resolve(__dirname, './package/remake/src/assets'),
      },
      {
        find: '@codecs',
        replacement: resolve(__dirname, './package/remake/src/codecs'),
      },
      {
        find: '@components',
        replacement: resolve(__dirname, './package/remake/src/components'),
      },
      {
        find: '@composables',
        replacement: resolve(
          __dirname,
          './package/remake/src/composables',
        ),
      },
      {
        find: '@containers',
        replacement: resolve(__dirname, './package/remake/src/containers'),
      },
      {
        find: '@interface',
        replacement: resolve(__dirname, './package/remake/src/interface'),
      },
      {
        find: '@layouts',
        replacement: resolve(__dirname, './package/remake/src/layouts'),
      },
      {
        find: '@router',
        replacement: resolve(__dirname, './package/remake/src/router'),
      },
      {
        find: '@store',
        replacement: resolve(__dirname, './package/remake/src/store'),
      },
      {
        find: '@styles',
        replacement: resolve(__dirname, './package/remake/src/styles'),
      },
      {
        find: '@utils',
        replacement: resolve(__dirname, './package/remake/src/utils'),
      },
      {
        find: '@views',
        replacement: resolve(__dirname, './package/remake/src/views'),
      },
      {
        find: '@utils',
        replacement: resolve(__dirname, './package/remake/src/utils'),
      },
      {
        find: '@locales',
        replacement: resolve(__dirname, './package/remake/src/locales'),
      },
      {
        find: '@i18n',
        replacement: resolve(__dirname, './package/remake/src/i18n'),
      },
      {
        find: '@plugins',
        replacement: resolve(__dirname, './package/remake/src/plugins'),
      },
      {
        find: '@common',
        replacement: resolve(__dirname, './package/remake/src/common'),
      },
      {
        find: '@',
        replacement: resolve(__dirname, './src'),
      },
    ],
  },
});
