<!-- <template>
  <div class="menu-detail-body-wrap">
    <div
      class="menu-detail-img-wrap"
      :class="isProductImg"
    >
      <img
        :src="productImg"
        class="menu-detail-img"
      >
    </div>
    <div class="menu-detail-wrap">
      <div class="menu-detail-title ellipsis-text-3">
        {{ newLineHelper(productName) }}
      </div>
      <div
        v-if="hasProductDescription"
        class="menu-detail-description"
      >
        {{ productDescription }}
      </div>
      <div class="menu-detail-cart-button-wrap">
        <div
          v-if="isProductOption"
          class="menu-detail-cart-button"
          @click="onNextProductOption"
        >
          {{ t('옵션 선택하기') }}
        </div>
        <div
          v-if="!isProductOption && !isNonOrderTable"
          class="menu-detail-cart-button"
          @click="addCart"
        >
          {{ t('장바구니 담기') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import {
  newLineHelper,
  getSubPrimaryColor,
} from '@torder/common/utils';
import useInitStore from '@store/storeInit';

const {
  buttonBackgroundColor,
  buttonFontColor,
} = storeToRefs(useInitStore());

const getActiveButtonColor = (color: string) => getSubPrimaryColor(color, 10, 'Y');

defineProps<{
  productName: string,
  productPrice: string | number,
  productDescription: string,
  productImg: string,
  hasProductDescription: boolean,
  isProductImg: {empty: boolean},
  isProductOption: boolean,
  onNextRoot: () => void,
  onNextProductOption: () => void,
  addCart: () => void,
  t: (str: string) => string,
  isNotKorean: boolean,
  isJapaneseLanguage: boolean,
  isNonOrderTable: boolean,
}>();
</script>

<style scoped lang='scss'>
.menu-detail-body-wrap {
  display: grid;
  grid-template-columns: 70% 30%;
  height: 84vh;
  padding: 1.9531vw;
  margin-top: 1.9531vw;
  font-family: 'Pretendard', sans-serif;
  background-color: #fff;
  border-radius: 1.5625vw;

  .menu-detail-wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 1.5625vw;
  }
}

.menu-detail-img-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: 78vh;
  overflow: hidden;
  border-radius: .7813vw;

  &.empty {
    text-align: center;
    background-color: #EFEFEF;

    .menu-detail-img {
      height: 3.75vw;
      margin: auto;
    }
  }

  .menu-detail-img {
    width: 100%;
    height: 100%;
    border-radius: .7813vw;
  }
}

.menu-detail-title {
  margin-bottom: 2.1875vw;
  font-size: 2.0313vw;
  font-weight: 600;
  line-height: 1.2;
  word-break: break-word;
  white-space: pre-wrap;
}

.menu-detail-cart-button-wrap {
  display: flex;
  flex-direction: column;
  gap: .7813vw;

  .menu-detail-help-text {
    display: flex;
    flex-direction: column;
    gap: .3906vw;
    font-size: 1.25vw;
    font-weight: 500;
    color: #a0a0a0;

    &.japanese-lang {
      word-break: break-word;
    }
  }
}

.menu-detail-cart-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 4.6875vw;
  font-size: 2.0313vw;
  color: v-bind(buttonFontColor);
  background-color: v-bind(buttonBackgroundColor);
  border-radius: .7813vw;
  object-fit: contain;

  &.button-active {
    background-color: v-bind(getActiveButtonColor(buttonBackgroundColor));
  }
}

.menu-detail-description {
  height: 100%;
  max-height: 51vh;
  margin-bottom: 2vw;
  overflow-y: scroll;
  font-size: 1.5625vw;
  font-weight: 300;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-line;
}

.menu-detail-description::-webkit-scrollbar {
  display: none;
}
</style> -->
