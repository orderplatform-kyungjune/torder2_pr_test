<template>
  <teleport
    v-if="flag.theme"
    to="#modal"
  >
    <div class="select-theme-container">
      <div class="select-theme-background"/>
      <ModalHead
        :content="'테마'"
        :button-text="t('닫기')"
        @click="closeModal(THEME)"
      />
      <div class="modal-body">
        <ul class="theme-list">
          <li
            v-for="themeInfo in newThemeList"
            :key="themeInfo.no"
            class="theme-item"
            :class="{ vertical: isVerticalScreenTheme(themeInfo) }"
            @click="getTargetTheme(themeInfo)"
          >
            <img
              :src="themeInfo.themeUrl"
              alt="테마 이미지"
            >
            <div class="name">
              {{ themeInfo.themeName }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </teleport>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import {
  computed,
  ComputedRef,
} from 'vue';
import { storeToRefs } from 'pinia';
import { setStorage } from '@torder/common/utils';
import {
  colorType,
  typeType,
} from '@torder/common/interface/theme';
import { themeListType } from '@torder/common/interface/initData';
import {
  BLACK,
  HORIZONTAL,
  THEME,
  TYPE,
  VERTICAL,
  WHITE,
  RESTAURANT_HORIZONTAL_CARD,
  RESTAURANT_HORIZONTAL,
  RESTAURANT_VERTICAL,
  HYATT,
  LOADING_IMAGE,
  COLOR,
  GRAY,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import { ModalHead } from '@components';
import { IS_DEV } from '@common/mode';

const { t } = useI18n();

const {
  flag,
  closeModal,
} = useModalStore();

const { theme } = storeToRefs(useThemeStore());
const {
  changeThemeColor,
  changeThemeType,
} = useThemeStore();

const { getThemeList } = storeToRefs(useInitStore());

const newThemeList: ComputedRef<themeListType[]> = computed(() => getThemeList.value.filter((item) => item.api_version2_yn === 'Y'));

const getTheme = (color: colorType, type: typeType) => {
  const isHorizontalToVertical = !theme.value.type.includes(RESTAURANT_VERTICAL) && type.includes(RESTAURANT_VERTICAL);
  const isVerticalToHorizontal = theme.value.type.includes(RESTAURANT_VERTICAL) && !type.includes(RESTAURANT_VERTICAL);

  if ((isHorizontalToVertical || isVerticalToHorizontal) && window?.UUID) {
    try {
      // eslint-disable-next-line no-throw-literal
      if (!window?.UUID && !IS_DEV) throw '안드로이드 인터페이스 없습니다.';

      if (window?.UUID && window.UUID?.setOrientationToHorizontal && isVerticalToHorizontal) {
        window.UUID.setOrientationToHorizontal();
      }

      if (window?.UUID && window.UUID?.setOrientationToVertical && isHorizontalToVertical) {
        window.UUID.setOrientationToVertical();
      }
    } catch (error) {
      console.log(error);
    }
  }

  setStorage(TYPE, type);
  setStorage(THEME, color);

  changeThemeColor(color);
  changeThemeType(type);
  closeModal(THEME);
};

const isVerticalScreenTheme = (themeInfo: themeListType) => themeInfo.no === 16 || themeInfo.no === 17;

const getTargetTheme = (themeInfo: themeListType) => {
  if (themeInfo.no == 9) {
    getTheme(
      WHITE,
      VERTICAL,
    );
    setStorage(LOADING_IMAGE, COLOR);
    return;
  }

  if (themeInfo.no == 10) {
    getTheme(
      WHITE,
      HORIZONTAL,
    );
    setStorage(LOADING_IMAGE, COLOR);
    return;
  }

  if (themeInfo.no == 11) {
    getTheme(
      BLACK,
      VERTICAL,
    );
    setStorage(LOADING_IMAGE, COLOR);
    return;
  }

  if (themeInfo.no == 12) {
    getTheme(
      BLACK,
      HORIZONTAL,
    );
    setStorage(LOADING_IMAGE, COLOR);
    return;
  }

  if (themeInfo.no === HYATT) {
    getTheme(
      BLACK,
      HYATT,
    );
    setStorage(LOADING_IMAGE, GRAY);
    return;
  }

  if (themeInfo.no == 14) {
    getTheme(
      WHITE,
      RESTAURANT_HORIZONTAL,
    );
    setStorage(LOADING_IMAGE, GRAY);
    return;
  }

  if (themeInfo.no == 15) {
    getTheme(
      WHITE,
      RESTAURANT_HORIZONTAL_CARD,
    );
    setStorage(LOADING_IMAGE, GRAY);
    return;
  }

  if (themeInfo.no == 16) {
    getTheme(
      BLACK,
      RESTAURANT_VERTICAL,
    );
    setStorage(LOADING_IMAGE, GRAY);
    return;
  }

  if (themeInfo.no == 17) {
    getTheme(
      WHITE,
      RESTAURANT_VERTICAL,
    );
    setStorage(LOADING_IMAGE, GRAY);
    return;
  }

  getTheme(
    BLACK,
    HYATT,
  );
};
</script>

<style lang='scss' scoped>
.select-theme-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;

  .select-theme-background {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: stretch;
    justify-content: center;
    padding: 0 1vw 1vw;
    overflow: hidden;

    .theme-list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin: 0;
      overflow: scroll;
      list-style: none;

      .theme-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 18vw;
        padding: 0;
        margin: 1vw 2vw;
        color: #fafafa;

        &.vertical {
          width: 11.25vw;
        }

        img {
          width: 100%;
          border: 0.8vw solid #000;
          border-radius: 1vw;
          box-shadow: 0 0 1vw -0.6vw #fff;
        }

        .name {
          padding: 0.4vw 0;
          font-size: 1.6vw;
          font-weight: 900;
          text-align: center;
        }
      }
    }
  }
}
</style>
