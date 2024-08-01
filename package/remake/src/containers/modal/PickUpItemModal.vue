<template>
  <Teleport
    v-if="flag.pickUp"
    to="#modal"
  >
    <div>
      <CustomTableTag
        v-if="isCustomTheme"
        class="pick-up-table-info"
        :tableInfo="getInitTableName()"
        @click="onNextSecret"
      />
      <BasicLayoutStoreTableInfo
        v-else
        class="pick-up-table-info"
        :title="t('테이블명')"
        :tableName="getInitTableName()"
        :storeName="getStoreName()"
        :theme-color="BLACK"
        @click="onNextSecret"
      />
      <div class="pick-up-container">
        <span class="pick-up-title">
          {{ t('주문하신 메뉴가 나왔습니다.') }}
        </span>
        <div
          class="pick-up-button"
          :class="{ 'custom-theme': isCustomTheme }"
          @click="closeModal(PICK_UP)"
        >
          {{ t('닫기') }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import {
  getInitTableName,
  getStoreName,
} from '@torder/common/utils';
import {
  PICK_UP,
  HYATT,
  BLACK,
} from '@torder/common/constant/string';
import useThemeStore from '@store/storeTheme';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import { useSecret } from '@composables/secret';
import {
  CustomTableTag,
  BasicLayoutStoreTableInfo,
} from '@components';

const { t } = useI18n();

const {
  flag,
  closeModal,
} = useModalStore();

const { theme } = storeToRefs(useThemeStore());

const {
  buttonBackgroundColor,
  buttonFontColor,
} = storeToRefs(useInitStore());

const { onNextSecret } = useSecret();

const isCustomTheme = computed(() => theme.value.type === HYATT);
</script>

<style lang='scss' scoped>
.pick-up-table-info {
  position: fixed;
  top: 0;
  right: 1.5625vw;
  z-index: 10001;
}

.pick-up-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 3.125vw;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: 'Pretendard', sans-serif;
  background-color: rgba(0, 0, 0, 0.80);

  .pick-up-title {
    font-size: 5.625vw;
    font-weight: 700;
    line-height: 6.4063vw;
    color: #fff;
    text-align: center;
    text-shadow: 0 0 0.7813vw rgba(0, 0, 0, 0.20);
    letter-spacing: -0.1125vw;
  }

  .pick-up-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35.1563vw;
    padding: 1.5625vw 1.875vw;
    font-size: 3.2813vw;
    font-weight: 700;
    line-height: 4.375vw;
    color: #fff;
    letter-spacing: -0.0656vw;
    background-color: #F91515;
    border-radius: 0.7813vw;

    &.custom-theme {
      color: v-bind(buttonFontColor);
      background-color: v-bind(buttonBackgroundColor);
    }
  }
}
</style>
