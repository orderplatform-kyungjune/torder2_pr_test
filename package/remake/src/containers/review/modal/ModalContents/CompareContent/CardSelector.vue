<template>
  <div class="images-wrapper">
    <div
      class="card-area"
      :class="ACTIONABLE_ELEMENT_CLASS"
      :style="cardAreaStyle('LEFT', selectedType)"
    >
      <SelectedIcon
        type="LEFT"
        :selectedType="selectedType"
      />
      <CardItem
        :imageUrl="leftImageUrl"
        :value="leftValue"
        :on-click="() => handleClick('LEFT')"
      />
    </div>
    <span class="vs-image-box">
      <img
        :src="`${MEDIA_RESOURCE_URL}/review/review-vs-img.png`"
        alt="vs_image"
      >
    </span>
    <div
      class="card-area"
      :class="ACTIONABLE_ELEMENT_CLASS"
      :style="cardAreaStyle('RIGHT', selectedType)"
    >
      <SelectedIcon
        type="RIGHT"
        :selectedType="selectedType"
      />
      <CardItem
        :imageUrl="rightImageUrl"
        :value="rightValue"
        :on-click="() => handleClick('RIGHT')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue';
import { MEDIA_RESOURCE_URL } from '@torder/common';
import palette from '@styles/colors';
import { SelectedCustomCompareType } from '@containers/review/types';
import SelectedIcon from '@containers/review/modal/ModalContents/CompareContent/SelectedIcon.vue';
import CardItem from '@containers/review/modal/ModalContents/CompareContent/CardItem.vue';
import { ACTIONABLE_ELEMENT_CLASS } from '@containers/review/const';

type Props = {
  leftValue: string,
  leftImageUrl: string,
  rightValue: string,
  rightImageUrl: string,
  initialSelectedType?: SelectedCustomCompareType,
  showAnimation: boolean,
  onSelected: (selectedType: SelectedCustomCompareType) => void,
  isEdit: boolean,
};

const props = defineProps<Props>();
type CardPositionType = SelectedCustomCompareType;

function getCardPos(pos: CardPositionType) {
  if (pos === 'LEFT') {
    return { left: 0 };
  }
  return { right: 0 };
}

function getSelectedStyles(pos: CardPositionType, selectedPos?: CardPositionType) {
  if (!selectedPos) {
    return {
      borderColor: palette.gray50,
      opacity: 1,
    };
  }

  if (pos === selectedPos) {
    return {
      borderColor: '#e30000',
      opacity: 1,
    };
  }

  return {
    borderColor: palette.gray50,
    opacity: 0.3,
    filter: 'saturate(0)',
  };
}

const cardAreaStyle = (pos: CardPositionType, selectedPos?: CardPositionType) => {
  const cardPos = getCardPos(pos);
  const selected = getSelectedStyles(pos, selectedPos);
  return {
    ...cardPos,
    ...selected,
  };
};

const selected = ref<SelectedCustomCompareType>();
const handleClick = (type: SelectedCustomCompareType) => {
  if (!props.isEdit && selected.value) return; // 평가 최초 선택 했을 경우 변경하지 못하게 변경
  selected.value = type;
  props.onSelected(type);
};
const selectedType = computed(() => selected.value || props.initialSelectedType);
</script>

<style scoped lang="scss">
.images-wrapper {
  position: relative;
  min-height: 46vh;
}

.card-area {
  position: absolute;
  z-index: 1;
  overflow: hidden;
  border-style: solid;
  border-width: 4px;
  border-radius: var(--border-radius-l, 16px);
}

.vs-image-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4.21vw;
  height: 6.5vh;
  transform: translate(-50%, -50%);

  > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }
}
</style>
