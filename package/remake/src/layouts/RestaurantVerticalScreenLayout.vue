<template>
  <slot/>
  <ModalSelectTheme/>
  <div
    class="total-wrap"
    :class="theme.color"
  >
    <header
      class="top-container"
      :class="[theme.color]"
    >
      <LogoWhite class="logo"/>
      <span class="store-name">{{ getStoreInfo.storeName }}</span>
      <RestaurantVerticalScreenTableInfo
        class="tableInfo"
        :tableName="getInitTableName()"
        :customTableFontColor="tableNumFontColor"
        @click="onNextSecret"
      />
    </header>
    <div
      class="main-container"
      :class="theme.color"
    >
      <main
        class="middle-container"
        :class="[isActive(), theme.color]"
      >
        <!-- 임시주석 매장에서 메뉴판 위 아래로 움직여야 한다고 하면 주석 풀고 upDownFlag store 기본값 false로 바꾸기 -->
        <div class="middle-up-button">
          <!-- 메뉴판 updown 사용시 클릭이벤트 문자열 풀기 -->
          <img
            v-if="upDownFlag"
            src="https://static.torder.co.kr/torder2/svg_down_arrow_normal_lightgray.svg"
            alt="upButton"
            @click="'handleDownBody'"
          >
          <img
            v-else
            src="https://static.torder.co.kr/torder2/svg_up_arrow_normal_lightgray.svg"
            alt="upButton"
            @click="'handleUpBody'"
          >
        </div>
        <div class="middle-header">
          <RestaurantCategoryFirstList/>
          <RestaurantCategorySubList/>
        </div>
        <div
          class="middle-body"
          @touchmove="touchCartModalClose"
        >
          <ProductContainer/>
        </div>
      </main>
      <footer
        class="bottom-container"
        :class="theme.color"
      >
        <RestaurantVerticalScreenMenuBar/>
      </footer>
    </div>
  </div>
  <SecretLogin/>
  <SecretMain/>
  <CartContainer/>
</template>

<script setup lang='ts'>
import {
  computed,
  onMounted,
  onUnmounted,
} from 'vue';
import { storeToRefs } from 'pinia';
import {
  SecretLogin,
  SecretMain,
} from '@views';
import { afterMountedScreenSaver } from '@utils/mountScreenSaver';
import { getInitTableName } from '@torder/common/utils';
import {
  // CACHE_DATA,
  CART,
  RESTAURANT_VERTICAL,
} from '@torder/common/constant';
import useThemeStore from '@store/storeTheme';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';
import useRestaurantVerticalStore from '@store/restaurantVertical';
import RestaurantCategorySubList from '@containers/category/RestaurantCategorySubList.vue';
import CartContainer from '@containers/cart/CartContainer.vue';
import {
  ProductContainer,
  RestaurantCategoryFirstList,
  ModalSelectTheme,
  RestaurantVerticalScreenMenuBar,
} from '@containers';
import { useSecret } from '@composables/secret';
import {
  LogoWhite,
  RestaurantVerticalScreenTableInfo,
} from '@components';

const { onNextSecret } = useSecret();

const {
  getStoreInfo,
  init,
  tableNumFontColor,
} = storeToRefs(useInitStore());

const { closeModal } = useModalStore();
const { flag } = storeToRefs(useModalStore());

const { upDownFlag } = storeToRefs(useRestaurantVerticalStore());

const { theme } = useThemeStore();

onMounted(() => {
  const productList = document.querySelector('.middle-body');

  if (!productList) return;

  // eslint-disable-next-line no-undef
  let timer = null as unknown as NodeJS.Timeout;
  let oldScrollY = productList.scrollTop;

  productList.addEventListener('scroll', () => {
    if (timer !== null) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      const scrollSize = Math.abs(oldScrollY - productList.scrollTop);
      if (scrollSize <= 50) return;
      oldScrollY = productList.scrollTop;

      if (!flag.value.cart) return;
      closeModal(CART);
    }, 150);
  }, false);

  onUnmounted(() => clearTimeout(timer));
});

// 레이아웃 미들바디 높이 컨트롤
// 레스토랑 위 아래 메뉴판 펼치는 기능 미사용으로 인한 임시주석
// const {
//   handleDownBody,
//   handleUpBody,
// } = useRestaurantVerticalStore();

const isActive = () => ({ active: upDownFlag.value });

const getRestaurantVerticalFlag = () => {
  const isVertical = theme.type === RESTAURANT_VERTICAL;
  return isVertical;
};

const isTypeRestaurantVertical = computed(getRestaurantVerticalFlag);

// 레스토랑 세로테마 드래그시 장바구니 자동닫힘 로직
const touchCartModalClose = () => {
  if (flag.value.cart && isTypeRestaurantVertical.value) closeModal(CART);
};

onMounted(() => {
  const guideElement = document.querySelector('.initial-guide-container') as HTMLElement;
  guideElement.style.display = 'none';

  const product = document.querySelector('.middle-body') as HTMLElement;

  const {
    screenDisplayTimer,
    cartResetTimer,
  } = afterMountedScreenSaver(product, init);

  onUnmounted(() => {
    clearInterval(screenDisplayTimer.value);
    clearInterval(cartResetTimer.value);
  });
});
</script>

<style lang='scss' scoped>
.total-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;

  &.black {
    background-color: #111111;
  }

  .top-container {
    display: grid;
    grid-template-columns: 11.7188vw 1fr 11.7188vw;
    align-items: center;
    height: 12.5vw;

    &.white {
      color: #fff;
      background-color: #2F2A26;
    }

    &.black {
      color: #fff;
      background-color: #111111;
    }

    .logo {
      padding: 1.25vw;
      padding-left: .625vw;
    }

    .store-name {
      overflow: hidden;
      font-family: 'Pretendard', sans-serif;
      font-size: 3.0469vw;
      text-align: center;
      text-overflow: ellipsis;
      white-space: pre-line;
    }

    .tableInfo {
      gap: .625vw;
      justify-content: center;
      margin-right: 3.125vw;
    }
  }

  .main-container {
    &.white {
      background-color: #2F2A26;
    }

    &.black {
      background-color: #111111;
    }
  }

  .middle-container {
    display: flex;
    flex-direction: column;
    height: 100vw;
    padding: 5vw 5vw 0;
    margin-bottom: 12.5vw;
    overflow: auto;
    border-top-left-radius: 3.9063vw;
    border-top-right-radius: 3.9063vw;
    border-color: transparent;

    &.black {
      background-color: #222222;
    }

    &.white {
      background-color: #fff;
    }

    &.active {
      height: 134vw;
    }

    .middle-up-button {
      margin-top: -0.7813vw;
      margin-bottom: .7813vw;
      text-align: center;

      // 해당 기능 미사용으로 이미지 임시 주석 (유저혼동방지)
      img{
        opacity: 0;
      }
    }

    .middle-header {
      margin-bottom: 2vw;
    }

    .middle-body {
      flex-grow: 1;
      overflow-y: auto;
    }
  }

  .bottom-container {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 12.5vw;

    &.white {
      background-color: #fff;
    }

    &.black {
      background-color: #222222;
    }
  }
}
</style>
