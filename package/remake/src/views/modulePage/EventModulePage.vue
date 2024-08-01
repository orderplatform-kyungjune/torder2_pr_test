<template>
  <iframe
    class="event-page"
    title="event-module-page"
    width="100%"
    height="100%"
    :src="iframeSource"
  />
  <CloseButton
    v-if="isTermClosed"
    class="close-btn"
    color="#fff"
    background="#000"
    route="https://static.torder.co.kr/torder2/btn_close_white_25.2px.svg"
    :content="t('닫기')"
    theme-type="white"
    @click="pushPage(home)"
  />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
} from 'vue';
import { pushPage } from '@utils/route.helper';
import { home } from '@router/routePaths';
import { CloseButton } from '@components';
import { IS_DEV } from '@common/mode';

const { t } = useI18n();

const route = useRoute();

const iframeSource = computed(() => {
  const { protocol } = window.location;
  // DEV환경 일 경우 staging.numbers.torder.io로 이동하지만 DEV환경의 번호 수집페이지가 맞음
  const NUMBERS_URL = IS_DEV ? '//staging.numbers.torder.io' : '//numbers.torder.io';

  let moduleUrl = `${protocol}${NUMBERS_URL}/#/collectPhoneNumberPage?`;

  const queryArray = Object.entries(route.query);

  queryArray.forEach(([
    key,
    value,
  ], index) => {
    moduleUrl += `${key}=${value}`;
    if (index !== queryArray.length - 1) moduleUrl += '&';
  });

  return moduleUrl;
});

const isTermClosed = ref(true);

const checkStatus = (event: MessageEvent) => {
  if (event.data.status === 'success') {
    pushPage(home);
  }
  if (event.data.status === 'termOpen') {
    isTermClosed.value = false;
  }
  if (event.data.status === 'termClose') {
    isTermClosed.value = true;
  }
};

onMounted(() => {
  window.addEventListener('message', checkStatus);
});

onUnmounted(() => {
  window.removeEventListener('message', checkStatus);
});
</script>

<style lang="scss" scoped>
.event-page{
  position: absolute;
  z-index: 50;
  background-color: #fff;
}

.close-btn{
  position: absolute;
  top: 0.7813vw;
  right: 0.7813vw;
  z-index: 55;
}
</style>
