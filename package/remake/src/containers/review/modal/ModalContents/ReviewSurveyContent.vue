<template>
  <!-- TODO: Swiper 대신 단일 Review 객체를 표시하는 방법 검토 -->
  <Swiper
    ref="swiperElement"
    class="swiper-styles"
    :allowTouchMove="false"
  >
    <SwiperSlide
      v-for="(displayReview, idx) in props.displayReviewList"
      :key="displayReview.uniqueKey"
    >
      <div
        v-if="isActive(idx)"
        class="scroll-container"
      >
        <RenderContent
          v-bind="{
            displayReview,
            isEdit,
            setActiveIndex,
            onContentUpdated,
          }"
        />
      </div>
    </SwiperSlide>
  </Swiper>
</template>

<script setup lang="ts">
import {
  h,
  ref,
} from 'vue';
import {
  Swiper,
  SwiperSlide,
} from 'swiper/vue';
import { storeToRefs } from 'pinia';
import useReviews from '@containers/review/storeReivews';
import useReviewSurvey from '@containers/review/modal/storeReviewSurvey';
import {
  ContentsComponentParameter,
  ReviewModalContentProps,
} from '@containers/review/modal/ModalContents/types';
import StoreContent from '@containers/review/modal/ModalContents/StoreContent/StoreContent.vue';
import SingleContent from '@containers/review/modal/ModalContents/SingleContent/SingleContent.vue';
import ItemContent from '@containers/review/modal/ModalContents/ItemContent/ItemContent.vue';
import CompareContent from '@containers/review/modal/ModalContents/CompareContent';

const swiperElement = ref();

const props = defineProps<ReviewModalContentProps>();
const { reviewSurveyClose } = useReviewSurvey();

const isActive = (idx: number) => props.activeIndex === idx || idx - 1 === props.activeIndex || idx + 1 === props.activeIndex;

const { orderListForReview } = storeToRefs(useReviews());

const { onCreateLogAndMessage } = useReviews();

// template 에서 약어로 사용할 경우 해당 함수가 할당이 되지 않는다.
const onContentUpdated = () => {
  if (props.isEdit) {
    reviewSurveyClose();
    return;
  }

  // 설문지 모두 응답 완료 여부 확인
  const { swiper } = swiperElement.value.$el;
  if (swiper.slides.length - 1 === swiper.activeIndex) {
    if (orderListForReview.value?.triggerType !== 'CLICK') {
      onCreateLogAndMessage();
    }
    reviewSurveyClose();
    return;
  }

  swiper.slideNext(0, false);
  props.setActiveIndex(swiper.activeIndex);
};

function RenderContent(props: ContentsComponentParameter) {
  const { surveyType } = props.displayReview;

  if (surveyType === 'ITEM') {
    return h<ContentsComponentParameter>(ItemContent, props);
  }

  if (surveyType === 'STORE') {
    return h<ContentsComponentParameter>(StoreContent, props);
  }

  if (surveyType === 'CUSTOM') {
    const { surveyCustomType } = props.displayReview;

    if (surveyCustomType === 'SINGLE') {
      return h<ContentsComponentParameter>(SingleContent, props);
    }

    if (surveyCustomType === 'COMPARE') {
      return h<ContentsComponentParameter>(CompareContent, props);
    }
  }

  return null;
}

</script>

<style scoped lang="scss">
@import "@containers/review/modal/modal";
.swiper-styles{
  width: 100%;
  height: 100vh;
  padding: ($HEADER_AREA_HEIGHT + vh) 0 ($BUTTON_AREA_HEIGHT + vh);
}

.scroll-container{
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &::-webkit-scrollbar {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    display: none;
  }
}
</style>
