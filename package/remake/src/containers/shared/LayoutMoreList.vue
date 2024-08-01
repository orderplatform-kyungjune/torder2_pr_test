<template>
  <div
    class="more-list-background"
    @click="onClickCloseFlagShowMoreList"
  />
  <div class="more-list-container">
    <!-- 사용 안함으로 인한 임시주석 -->
    <!-- <BasicLayoutMoreListItem :content="t('간단히 보기')"/>
    <BasicLayoutMoreListItem :content="t('추천메뉴')"/> -->
    <BasicLayoutMoreListItem
      v-if="IS_LOCAL"
      :content="t('테마변경')"
      @click="onClickOpenModal(THEME)"
    />
    <BasicLayoutMoreListItem
      :content="t('언어변경')"
      @click="onClickOpenModal(LANGUAGE)"
    />
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import {
  THEME,
  LANGUAGE,
} from '@torder/common/constant';
import useModalStore from '@store/storeModal';
import { BasicLayoutMoreListItem } from '@components';
import { IS_LOCAL } from '@common/mode';

const props = defineProps<{closeFlagShowMoreList: () => void}>();

const { t } = useI18n();

const { openModal } = useModalStore();

const onClickCloseFlagShowMoreList = () => {
  if (props) props.closeFlagShowMoreList();
};

const onClickOpenModal = (key: string) => {
  openModal(key);

  if (props) props.closeFlagShowMoreList();
};
</script>

<style lang='scss' scoped>
.more-list-container {
  position: absolute;
  bottom: 0;
  left: 43.2vw;
  z-index: 25;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 17vw;
  height: auto;
  padding: 1vw 0.6vw 0.7vw;
  background-color: hsla(0, 0%, 100%, 0);
  border-radius: 0.7813vw;
}

.more-list-background {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 25;
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
