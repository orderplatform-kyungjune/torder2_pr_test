<!-- <template>
  <div class="option-first-category">
    <div class="option-first-category-wrap">
      <template
        v-for="(option, optionIndex) in props.optionList"
        :key="optionIndex"
      >
        <HyattCategoryFirstListItem
          :content="getOptionGroupCategory(option)"
          :active="true"
          :isJapaneseLanguage="isJapaneseLanguage"
          :data-id="optionIndex"
          @click="() => props.changeSelectOptionIndex(optionIndex)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { translateLanguage } from '@utils/langTransfer';
import {
  productOptionItemType,
  productType,
} from '@torder/common/interface/product';
import {
  CartProductOptionGroupType,
  cartProductType,
} from '@torder/common/interface/cartProduct';
import i18n from '@i18n';
import { HyattCategoryFirstListItem } from '@components';

const props = defineProps<{
  optionList: (cartProductType | productType | CartProductOptionGroupType | productOptionItemType)[],
  changeSelectOptionIndex: (selectGroupIndex: number) => void,
}>();

const getOptionGroupCategory = (option: cartProductType | productType | productOptionItemType | CartProductOptionGroupType): string => {
  if (option.isProduct) {
    const product = option as productType;
    return translateLanguage(product.productLanguageDetail, product.productLanguageDetail?.ko);
  }

  const group = option as CartProductOptionGroupType;
  return translateLanguage(group.nameArray, group.name);
};

const isJapaneseLanguage = computed(() => {
  const locale = i18n.global.locale.value;

  return locale === 'jp';
});

</script>

<style lang='scss' scoped>
.option-first-category {
  margin: 1.65vw 0 0.78125vw 0.3906vw;
  overflow: auto;

  .option-first-category-wrap {
    height: 100%;
    overflow: auto;
  }

  .category-list {
    height: 4.6vw;
  }
}
</style> -->
