<template>
  <Suspense>
    <router-view/>
  </Suspense>
  <VueQueryDevtools/>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import {
  onMounted,
  onBeforeUnmount,
  Ref,
  ref,
} from 'vue';
import { parseQueryString } from '@utils/route.helper';
import { i18nLocaleChange } from '@utils/i18nUtils';
import {
  generateUcode,
  getStorage,
  removeStorage,
  setStorage,
} from '@torder/common/utils';
import {
  colorType,
  typeType,
} from '@torder/common/interface/theme';
import { LocaleType } from '@torder/common/interface/i18nLocale';
import {
  LANGUAGE,
  STORE,
  TABLE_CODE,
  THEME,
  TYPE,
} from '@torder/common/constant';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import useThemeStore from '@store/storeTheme';
import { setLocale } from '@i18n';
import { useReviews } from '@containers/review';

// 현재 비동기 함수(pushFirstPage) 안에서 useReviews() 에 있는 useMutation 를 사용한다. 이때 간혈적으로 inject 를 호출 할 수 없기 때문에
// app.vue 에서 미리 inject 를 호출하기 위해서 사전 useReviews() 를 호출하여 defineStore 가 실행되게 한다.
// 추가설명 : tanstack vue 의 훅은 inject 를 사용하는데 이는 context 가 있는 곳에서 (setup) 에서 사용되어 져야 하므로 비동기함수가 실행되는 시점이
// context 를 벗어 나있을 경우 오류가 발생하는 경우가 있다.
// TODO: 임시로 호출하는 방법 이외에 근본적으로 해결할 방법 모색
useReviews();

const themeStore = useThemeStore();

const hasType = getStorage(TYPE);

const hasTheme = getStorage(THEME);

const isHasType = hasType !== null;

if (isHasType) themeStore.changeThemeType(hasType as typeType);

const isHasTheme = hasTheme !== null;

if (isHasTheme) themeStore.changeThemeColor(hasTheme as colorType);

// uCode 생성
generateUcode();

// i18n 국제화 캐싱
const hasLanguage = getStorage(LANGUAGE) as LocaleType;

// i18n 국제화 S3 다운로드
Promise.all([
  setLocale('ko'),
  setLocale('en'),
  setLocale('jp'),
  setLocale('chBun'),
  setLocale('chGan'),
]);

if (hasLanguage) i18nLocaleChange(hasLanguage);

const setStoreTableInfo = () => {
  // 리다이렉션 스토어 코드 저장
  const storeCodeQuery = parseQueryString(window.location.search)?.storeCode;
  const tableCodeQuery = parseQueryString(window.location.search)?.tableCode;

  if (storeCodeQuery || tableCodeQuery) {
    if (storeCodeQuery) setStorage(STORE, storeCodeQuery);
    if (tableCodeQuery) setStorage(TABLE_CODE, tableCodeQuery);

    // 리다이렉션시 (쿼리 존재시) 테마 캐싱 없애 상점 설정 테마 나오도록 제거
    removeStorage(THEME);

    const url = window.location.pathname;
    window.history.replaceState({}, document.title, url);
  }
};

/**
 * 태블릿에서 long-pressed 시 가상선택자 :active가 유지되는 버그 대응
 * -> 'button-active' 클래스로 동적 & 전역 관리
 *
 * 버튼 안에 span, img, svg 등의 세부 구성요소가 있는 경우
 * -> element id에 'sub-element' 포함한 문구 지정, class에 'button' 없어야 함
 * -> 위 문구가 포함된 요소의 경우 부모 element가 선택되도록 동적 제어: 부모 요소 클래스에 'button'이 들어야 함
 */
const elementAtTouch: Ref<Element | undefined> = ref();

const countFindParent = ref(0);
const findButtonFromChild = (touched: Element | undefined) => {
  if (!touched) return;

  const touchedClassName = typeof touched?.className === 'string' ? touched?.className : (touched.className as SVGAnimatedString)?.baseVal;
  if (touchedClassName?.includes('button')) {
    elementAtTouch.value = touched;
    return;
  }

  if (countFindParent.value > 3) return;
  countFindParent.value += countFindParent.value;
  findButtonFromChild(touched?.parentElement ?? undefined);
};

// 버튼 선택 효과를 위해 class 추가/제거 로직으로 이외의 기능 추가 지양
const focusEventListener = (event: TouchEvent | MouseEvent) => {
  if (event.type === 'touchstart') {
    const touchX = (event as TouchEvent).touches[0]?.clientX;
    const touchY = (event as TouchEvent).touches[0]?.clientY;
    elementAtTouch.value = document.elementFromPoint(touchX, touchY) ?? undefined;
  }
  if (event.type === 'mousedown') {
    const mouseX = (event as MouseEvent)?.clientX;
    const mouseY = (event as MouseEvent)?.clientY;
    elementAtTouch.value = document.elementFromPoint(mouseX, mouseY) ?? undefined;
  }

  // 버튼 내부의 요소를 선택한 경우 부모 요소로 지정: 커스텀테마-언어 버튼 / 모달 닫기버튼
  if (elementAtTouch.value?.id?.includes('sub-element')) {
    findButtonFromChild(elementAtTouch.value);
  }

  if (!elementAtTouch.value) {
    return;
  }

  // eslint-disable-next-line default-case
  switch (event.type) {
    case 'touchstart':
    case 'mousedown':
      elementAtTouch.value?.classList?.add('button-active');
      break;

    case 'touchcancel':
    case 'touchend':
    case 'mouseup':
    case 'click':
      elementAtTouch.value?.classList?.remove('button-active');
      elementAtTouch.value = undefined;
      break;
  }
};

const setSelectEventListener = () => {
  const bodyElement = document.body;
  if (!bodyElement) return;

  bodyElement.addEventListener('touchstart', focusEventListener);
  bodyElement.addEventListener('touchend', focusEventListener);
  bodyElement.addEventListener('touchcancel', focusEventListener);
  bodyElement.addEventListener('mousedown', focusEventListener);
  bodyElement.addEventListener('mouseup', focusEventListener);
  bodyElement.addEventListener('click', focusEventListener);
};

const removeSelectEventListener = () => {
  const bodyElement = document.body;
  if (!bodyElement) return;

  bodyElement.removeEventListener('touchstart', focusEventListener);
  bodyElement.removeEventListener('touchend', focusEventListener);
  bodyElement.removeEventListener('touchcancel', focusEventListener);
  bodyElement.removeEventListener('mousedown', focusEventListener);
  bodyElement.removeEventListener('mouseup', focusEventListener);
  bodyElement.removeEventListener('click', focusEventListener);
};

onMounted(() => { setSelectEventListener(); });

onBeforeUnmount(() => { removeSelectEventListener(); });

setStoreTableInfo();
</script>

<style>
@import '@styles/reset.css';

.ellipsis-text-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis-text-2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.ellipsis-text-3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.modal-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
