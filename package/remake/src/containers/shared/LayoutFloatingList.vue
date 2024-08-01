<template>
  <div
    class="floating-list"
    :class="type"
  >
    <div
      v-if="quickMenu"
      class="quick-menu-button"
      :class="type"
      @click="openQuickMenuListPage"
    >
      <img
        src="https://static.torder.co.kr/QuickMenu/new_qucikmenu_icon.png"
        class="quick-menu-icon"
        :class="type"
      >
    </div>
    <!-- <div class="valet-button">
      <img src="https://static.torder.co.kr/torder2/svg_valet_normal_white.svg">
    </div> -->
    <div v-if="getStoreInfo.chatingAble">
      <img
        class="talk-button"
        src="https://static.torder.co.kr/torder2/svg_talk_normal_120px.svg"
      >
    </div>
    <div
      v-if="getStoreInfo.gameAble"
      class="vs-game-button"
    >
      <img
        src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/icons/vsGame_newIcon.png"
        class="vs-game-icon"
      >
    </div>
  </div>
</template>

<script setup lang='ts'>
import {
  computed,
  ComputedRef,
} from 'vue';
import { storeToRefs } from 'pinia';
import { pushPage } from '@utils/route.helper';
import { typeType } from '@torder/common/interface/theme';
import useThemeStore from '@store/storeTheme';
import useTableStore from '@store/storeTable';
import useOrderListStore from '@store/storeOrderList';
import useInitStore from '@store/storeInit';
import { quickMenuList } from '@router/routePaths';
import { requestOrderList } from '@apis/orderData';

const { theme } = useThemeStore();

const { getStoreInfo } = storeToRefs(useInitStore());

const { tableInfo } = storeToRefs(useTableStore());

const { orderList } = storeToRefs(useOrderListStore());

const type: ComputedRef<typeType> = computed(() => {
  const { type } = theme;

  return type;
});

const quickMenu = computed(() => orderList.value.quickMenuList?.length > 0);

// 한잔 더 페이지 이동
const openQuickMenuListPage = async () => {
  try {
    await requestOrderList(getStoreInfo.value.storeCode, tableInfo.value.tabletId);

    pushPage(quickMenuList);
  } catch (error) {
    console.error(error);
  }
};

// 한잔 더 아이콘 에니메이션 위치
const quickMenuPositionVertical = () => {
  const vsEnabled = getStoreInfo.value.gameAble;
  const talkEnabled = getStoreInfo.value.chatingAble;
  // 추후 서버에 의한 동적값으로 변경해야함 (서버 미개발)
  const valetParkingUse = 0;

  const summary = talkEnabled + vsEnabled + valetParkingUse;

  let heightVh;

  const iconHeight = 19.5;
  const halfIconHeight = 9.75;
  if (summary === 0) {
    heightVh = iconHeight * 0 + halfIconHeight;
  } else if (summary === 1) {
    heightVh = iconHeight * 1 + halfIconHeight;
  } else if (summary === 2) {
    heightVh = iconHeight * 2 + halfIconHeight;
  } else {
    heightVh = iconHeight * 3 + halfIconHeight;
  }

  return `${-(50 - heightVh)}vh`;
};

const quickMenuPositionHorizontal = () => {
  const vsEnabled = getStoreInfo.value.gameAble;
  const talkEnabled = getStoreInfo.value.chatingAble;
  // 추후 서버에 의한 동적값으로 변경해야함 (서버 미개발)
  const valetParkingUse = 0;

  const summary = talkEnabled + vsEnabled + valetParkingUse;

  let heightVh;

  const iconWidth = 10.5616;
  const halfIconWidth = 5.2808;
  if (summary === 0) {
    heightVh = iconWidth * 0 + halfIconWidth;
  } else if (summary === 1) {
    heightVh = iconWidth * 1 + halfIconWidth;
  } else if (summary === 2) {
    heightVh = iconWidth * 2 + halfIconWidth;
  } else {
    heightVh = iconWidth * 3 + halfIconWidth;
  }

  return `${-(50 - heightVh)}vw`;
};
</script>

<style lang='scss' scoped>
.floating-list {
  position: fixed;
  right: 0.78125vw;
  bottom: 5.3125vw;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-width: 10.56209375vw;

  &.horizontal {
    flex-direction: row;
  }

  .vs-game-icon {
    width: 10.5616vw;
    height: 12.1875vw;
    object-fit: contain;
  }

  .talk-button {
    width: 9.6094vw;
    height: 10.0781vw;
  }

  .quick-menu-button {
    -webkit-transform-origin: center;
    -webkit-animation: popUp-vertical 3s both ease-in;

    &.horizontal {
      animation: popUp-horizontal 3s both ease-in;
    }

    .quick-menu-icon {
      width: 9.6094vw;
      height: 10.0781vw;
      object-fit: contain;
      animation: upDown-vertical 3s infinite linear;

      &.horizontal {
        animation: upDown-horizontal 3s infinite linear;
      }
    }

    @keyframes popUp-vertical {
      0% {
        transform: translateX(calc(-50vw + (10.5616vw / 2))) translateY(v-bind(quickMenuPositionVertical())) scale(0);
      }
      10% {
        transform: translateX(calc(-50vw + (10.5616vw / 2))) translateY(v-bind(quickMenuPositionVertical())) scale(3);
      }
      20% {
        transform: translateX(calc(-50vw + (10.5616vw / 2))) translateY(v-bind(quickMenuPositionVertical())) scale(3);
      }
      50% {
        transform: translateX(calc(-50vw + (10.5616vw / 2))) translateY(v-bind(quickMenuPositionVertical())) scale(3);
      }
      100% {
        transform: translateX(0) translateY(0) scale(1);
      }
    }

    @keyframes popUp-horizontal {
      0% {
        transform: translateX(v-bind(quickMenuPositionHorizontal())) translateY(calc(9.75vh - 50vh)) scale(0);
      }
      10% {
        transform: translateX(v-bind(quickMenuPositionHorizontal())) translateY(calc(9.75vh - 50vh)) scale(3);
      }
      20% {
        transform: translateX(v-bind(quickMenuPositionHorizontal())) translateY(calc(9.75vh - 50vh)) scale(3);
      }
      50% {
        transform: translateX(v-bind(quickMenuPositionHorizontal())) translateY(calc(9.75vh - 50vh)) scale(3);
      }
      100% {
        transform: translateX(0) translateY(0) scale(1);
      }
    }

    @keyframes upDown-vertical {
      0% {
        transform: translateY(-1.250vh) rotate(20deg);
      }
      25% {
        transform: translateY(-1.250vh) rotate(0deg);
      }
      50% {
        transform: translateY(-1.250vh) rotate(-20deg);
      }
      75% {
        transform: translateY(-1.250vh) rotate(0deg);
      }
      100% {
        transform: translateY(-1.250vh) rotate(20deg);
      }
    }

    @keyframes upDown-horizontal {
      0% {
        transform: translateY(-1.250vh) rotate(20deg);
      }
      25% {
        transform: translateY(-1.250vh) rotate(0deg);
      }
      50% {
        transform: translateY(-1.250vh) rotate(-20deg);
      }
      75% {
        transform: translateY(-1.250vh) rotate(0deg);
      }
      100% {
        transform: translateY(-1.250vh) rotate(20deg);
      }
    }
  }
}
</style>
