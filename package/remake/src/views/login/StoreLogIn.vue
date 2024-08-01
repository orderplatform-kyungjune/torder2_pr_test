<template>
  <FlashModal
    v-if="flag.flash"
    :isLogin="'login'"
    :content="getAlertContent"
  />
  <div
    class="container"
    :class="theme.type"
  >
    <div class="login-grid">
      <div
        class="login-layout"
        :class="theme.type"
      >
        <div class="store-code">
          {{ getUCode }}
        </div>
        <div
          class="login-input-grid"
          :class="theme.type"
        >
          <div class="login-input-wrap">
            <LoginInput
              :title="t('아이디')"
              :value="inputId"
              :input-text="onChangeId"
              :type="'text'"
            />
            <LoginInput
              :title="t('패스워드')"
              :value="inputPwd"
              :input-text="onChangePwd"
              :type="'password'"
            />
          </div>
          <div class="login-button">
            <LoginButton
              :title="t('확인')"
              :background="'red'"
              :color="'#fff'"
              @click="getLogin"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="web-version">
    {{ currentWebVersion }}
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import {
  Ref,
  onMounted,
  ref,
} from 'vue';
import { storeToRefs } from 'pinia';

import { pushPage } from '@utils/route.helper';
import { getStorage } from '@torder/common/utils';
import {
  STORE,
  U_CODE,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useModalStore from '@store/storeModal';
import useBannerStore from '@store/storeBanner';
import { tableSelect } from '@router/routePaths';
import { FlashModal } from '@containers';
import {
  LoginInput,
  LoginButton,
} from '@components';
import {
  IS_DEV,
  IS_LOCAL,
} from '@common/mode';
import { requestTabletLogin } from '@apis/login';

const { theme } = storeToRefs(useThemeStore());
const { handleCurrentBannerIndex } = useBannerStore();
const currentWebVersion = window.location.pathname === '/' ? '/v' : window.location.pathname;

const inputId: Ref<string> = ref('');
const inputPwd: Ref<string> = ref('');

const { t } = useI18n();

const getUCode = getStorage(U_CODE);

const {
  flag,
  getAlertContent,
} = useModalStore();

const onChangeId = (text: Event) => {
  const target = text.target as HTMLInputElement;
  inputId.value = target.value;
};

const onChangePwd = (text: Event) => {
  const target = text.target as HTMLInputElement;
  inputPwd.value = target.value;
};

const getLogin = async () => {
  const responseData = await requestTabletLogin(inputId.value, inputPwd.value);

  if (responseData.data.result) {
    const storeCode = responseData.data?.store_init?.T_order_store_code;
    const redirectionUrl = responseData.data?.store_init?.T_order_store_tablet_version;

    const formatInitTabletVersion = redirectionUrl[redirectionUrl?.length - 1] !== '/' ? `${redirectionUrl}/` : redirectionUrl;
    const currentUrl = window.location.origin + window.location.pathname;

    // 안드로이드 접근 URL 저장
    if (window.UUID && window.UUID.setHomeUrl) {
      window.UUID.setHomeUrl(redirectionUrl);
    }

    // 배너 인덱스 초기화
    handleCurrentBannerIndex(0);
    /*
      1. url이 같을때 : storeCode 저장 -> 테이블선택 페이지 이동
      2. 버전이 다를때 : storeCode 저장 -> url 이동 -> 테이블 선택 페이지 이동
      3. url이 다를때 : 티오더1 테이블 선택 페이지 이동
    */
    if (IS_DEV || IS_LOCAL || currentUrl === formatInitTabletVersion) { // 1번
      localStorage.setItem(STORE, storeCode);
      pushPage(tableSelect);
    } else if (formatInitTabletVersion.includes(currentUrl) || currentUrl.includes(formatInitTabletVersion)) { // 2번
      localStorage.setItem(STORE, storeCode);
      window.location.href = formatInitTabletVersion;
    } else { // 3번
      window.location.href = `${formatInitTabletVersion}?storeCode=${storeCode}`;
    }
  } else {
    console.log('로그인 실패');
  }
};

// 테블릿 강제 디폴트 가로로 변경
if (window?.UUID && window.UUID?.setOrientationToHorizontal) {
  window.UUID.setOrientationToHorizontal();
}

onMounted(() => {
  const guideElement = document.querySelector('.initial-guide-container') as HTMLElement;
  if (guideElement) guideElement.style.display = 'none';
});
</script>

<style lang='scss' scoped>
.container {
  display: flex;
  width: 100%;
  height: 62.5vw;
  font-family: 'Pretendard', sans-serif;

  &.restaurant-vertical {
    height: 160vw;
  }

  .login-grid {
    justify-content: center;
    margin: auto;

    .login-layout {
      display: flex;
      flex-direction: column;
      width: 50vw;
      padding: 1vw;
      color: #fafafa;
      border-radius: 1vw;

      &.restaurant-vertical {
        width: 54.6875vw;

        .store-code {
          margin-bottom: -2.2vw;
          font-size: 1.875vw;
        }
      }

      .store-code {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: -1vw;
        font-size: 1.25vw;
        font-weight: 100;
      }

      .login-input-grid {
        display: flex;
        flex-direction: column;
        gap: 2vw;

        &.restaurant-vertical {
          gap: 4.6875vw;

          .login-input-wrap {
            display: flex;
            flex-direction: column;
            gap: 3.125vw;
          }

          .login-button {
            height: 10vw;

            &:deep(.login-button) {
              font-size: 3.75vw;
            }
          }

          &:deep(.wrapper) {
            gap: 1.5625vw;
          }

          &:deep(.title) {
            font-size: 1.875vw;
          }

          &:deep(.input) {
            height: 10vw;
            font-size: 2.5vw;
          }
        }
      }

      .login-button {
        height: 4vw;
      }
    }
  }
}

.web-version {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 99999;
  font-size: 0.9375vw;
  font-weight: 500;
  color: #fff;
  letter-spacing: -0.0187vw;
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
