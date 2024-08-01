<template>
  <Teleport
    v-if="flag.secretLogin"
    to="#modal"
  >
    <div class="secret-login-background">
      <div class="secret-login-container">
        <div class="secret-login-header">
          <div class="secret-login-password">
            <input
              type="password"
              :value="makeString()"
              class="secret-login-input"
              disabled
            >
          </div>
          <div>
            <CloseButton
              :color="'#fff'"
              :background="'#202020'"
              route="https://static.torder.co.kr/torder2/btn_close_white_25.2px.svg"
              :content="t('닫기')"
              :theme-type="theme.type"
              @click="closeSecretLoginModal"
            />
          </div>
        </div>
        <div class="secret-login-number">
          <div
            v-for="number in numberArr"
            :key="number"
          >
            <LoginNumberButton
              :text="number"
              :background="'#eaeaea'"
              :color="'#202020'"
              @click="enterPassword(number)"
            />
          </div>
        </div>
        <div
          class="secret-login-button"
          :class="theme.type"
        >
          <LoginButton
            :title="t('확인')"
            :background="'#202020'"
            :color="'#fff'"
            @click="secretLogin"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import {
  ref,
  Ref,
} from 'vue';
import { getStorage } from '@torder/common/utils';
import {
  DELETE,
  RESET,
  SECRET_LOGIN,
  CACHE_DATA,
  SECRET_MAIN,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useModalStore from '@store/storeModal';
import {
  LoginButton,
  CloseButton,
  LoginNumberButton,
} from '@components';

const {
  flag,
  openModal,
  closeModal,
} = useModalStore();

const { theme } = useThemeStore();

const localData = getStorage(CACHE_DATA) as string;
const { storeInfo = {} } = JSON.parse(localData);
const { staffPassWord = '0000' } = storeInfo;

const secretKey = staffPassWord;

const numberArr = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'delete',
  '0',
  'reset',
];

const { t } = useI18n();
const password: Ref<string[]> = ref([]);

const enterPassword = (input: string) => {
  const isDelete = input === DELETE;
  const isReset = input === RESET;

  if (isDelete) {
    password.value.pop();
  } else if (isReset) {
    password.value.length = 0;
  } else {
    password.value.push(input);
  }
};

const makeString = () => password.value.join('');

const openSecretMainModal = () => openModal(SECRET_MAIN);

const closeSecretLoginModal = () => {
  closeModal(SECRET_LOGIN);
  password.value = [];
};

const secretLogin = () => {
  const flag = makeString() === secretKey;

  if (flag) {
    closeSecretLoginModal();
    openSecretMainModal();
  }
};
</script>

<style lang='scss' scoped>
.secret-login-background {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);

  .secret-login-container {
    display: flex;
    flex-direction: column;
    width: 76.0156vw;
    color: #000;
    background-color: #fff;
    box-shadow: 0 0 1vw 0 #000;

    .secret-login-header {
      display: flex;
      gap: 1vw;
      justify-content: space-between;
      padding: 1vw;
      font-size: 2vw;
      font-weight: 100;

      .secret-login-password {
        display: flex;
        flex: 1;
        justify-content: flex-start;
        height: 3.5vw;
        margin-left: 2vw;
        overflow: hidden;
        background-color: transparent;

        .secret-login-input {
          font-size: 6.25vw;
          letter-spacing: 1em;
          background-color: transparent;
          border: none;
        }
      }
    }

    .secret-login-number {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      margin: 0 1vw;
    }

    .secret-login-button {
      padding: 1vw 2vw;

      &:deep(.login-button-layout) {
        height: 5.1875vw;

        .login-button {
          font-weight: 400;
        }
      }

      &.restaurant-vertical {
        &:deep(.login-button-layout) {
          height: 6.2500vw;

          .login-button {
            font-size: 2.5vw;
          }
        }
      }
    }
  }
}
</style>
