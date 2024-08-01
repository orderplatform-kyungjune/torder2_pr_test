<template>
  <template v-if="!isEmpty">
    <span class="review-status-box">
      완료된 리뷰
      <span>
        {{ reviewResult?.completionCount ?? 0 }} / {{ reviewResult?.totalCount ?? 0 }}
      </span>
    </span>
  </template>
  <template v-if="isLoop">
    <div class="push-image-box">
      <img
        :src="`${MEDIA_RESOURCE_URL}/review/push-to-more-img.png`"
        alt="push_to_read"
      >
    </div>
  </template>
  <div
    class="carousel-container"
    :class="ACTIONABLE_ELEMENT_CLASS"
  >
    <Swiper
      class="swiper-styles"
      :spaceBetween="20"
      :slidesPerView="1"
      :loop="isLoop"
      :pagination="{
        clickable: true,
      }"
      :modules="[Pagination]"
      :touchEventsTarget="'container'"
    >
      <template v-if="isEmpty">
        <SwiperSlide>
          <div
            v-for="idx in range(0, 3)"
            :key="`empty_box_${idx}`"
            class="slide-empty-box"
          />
        </SwiperSlide>
      </template>
      <template v-else>
        <SwiperSlide
          v-for="(reviewPage, pageIndex) in reviewList"
          :key="`swiper-slide-${pageIndex}`"
        >
          <template v-for="review in reviewPage">
            <template v-if="review !== undefined">
              <ReviewCarouselCard
                :key="review.uniqueKey"
                :review="review"
                :on-click="()=>showReviewModal(review)"
              />
            </template>
          </template>
        </SwiperSlide>
      </template>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Swiper,
  SwiperSlide,
} from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import { storeToRefs } from 'pinia';
import { range } from 'fp-ts/NonEmptyArray';
import { MEDIA_RESOURCE_URL } from '@torder/common';
import palette from '@styles/colors';
import { type Review } from '@containers/review/types';
import useReviews from '@containers/review/storeReivews';
import { reviewSort } from '@containers/review/reviewLib';
import useReviewSurvey from '@containers/review/modal/storeReviewSurvey';
import { ACTIONABLE_ELEMENT_CLASS } from '@containers/review/const';
import ReviewCarouselCard from '@containers/review/ReviewCarouselCard.vue';

const {
  white,
  gray200,
} = palette;
const { setModalDisplayInfo } = useReviewSurvey();
const { reviewResult } = storeToRefs(useReviews());
const slidesPerView = 3;
const slideCount = computed(() => Math.ceil((reviewResult.value?.totalCount || 0) / slidesPerView));
const isEmpty = computed(() => slideCount.value < 1);
const isLoop = computed(() => slideCount.value > 1);

const reviewList = computed(() => reviewResult.value?.reviewList.reduce((acc, slice, index) => {
  if (index % slidesPerView === 0) {
    acc.push([]);
  }
  acc[Math.floor(index / slidesPerView)][index % slidesPerView] = slice;
  return acc;
}, [] as Review[][]) ?? []);

/**
 * carousel 에서 선택한 카드가 평가가 완료/부분완료/미완료 에 따라 review modal 에 표기되는 설문지를 결정한다.
 * 완료된 카드 선택, 부분완료된 카드 선택 : 선택된 카드 설문지만 노출
 * 미완료된 카드 선택 : 미완된 카드들의 설문지 노출
 * @param review 선택한 평가카드의 정보
 */
const showReviewModal = (review: Review) => {
  if (review.completionType !== 'INCOMPLETED') {
    setModalDisplayInfo({
      displayReview: [review],
      isEdit: true,
    });
  } else {
    // 해당 component 는 reviewResult.value 를 통해 호출되기 때문에 not null 이다.
    const copyList = reviewSort(reviewResult.value!.reviewList.filter((r) => r.completionType !== 'COMPLETED'));
    // 선택한 카드를 최우선으로 둔다.
    // NOTICE: chrome 에서는 copyList.sort((next) => ((next.uniqueKey === review.uniqueKey) ? -1 : 0)); 이 동작하나
    // firefox 에서는 해당 로직이 동작하지 않은 review 값이 있는 위치 index 를 찾아 splice 로 제거하고 제거한 아이템을 앞에 둔다. TODO: 왜 안되는지 규명 안됨.
    const targetIndex = copyList.findIndex((item) => item.uniqueKey === review.uniqueKey);
    const items = copyList.splice(targetIndex, 1);
    const list = items.concat(copyList);
    setModalDisplayInfo({
      displayReview: list,
      isEdit: false,
    });
  }
};

</script>

<style lang="scss">
.swiper-wrapper {
  display: flex;
  height: 100%;
  margin-bottom: 4.75vh;
}

$cardHeight: 21.25;
$bulletSize: 0.937;
$activeBulletWidth: 2.187;

.swiper-styles {
  width: 91.25vw;
  border-radius: var(--border-radius-m, 8px);

  .swiper-slide {
    display: flex;
    gap: 1.562vw;
  }

  &.swiper-horizontal > .swiper-pagination-bullets,
  .swiper-pagination-bullets.swiper-pagination-horizontal {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  &.swiper-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet,
  .swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet {
    display: inline-block;
    margin: 0 0.781vw;
  }

  .swiper-pagination-bullet {
    width: 0.937vw;
    height: 0.937vw;
    background: v-bind(gray200);
    border-radius: 50%;
    opacity: 0.5;
  }

  .swiper-pagination-bullet-active {
    width: 2.187vw;
    background: v-bind(white);
    border-radius: 11999px;
    opacity: 1;
  }
}

</style>

<style scoped lang="scss">
.review-status-box {
  position: absolute;
  top: -1.5vh;
  left: 0;
  font-size: var(--font-size-h5, 1.641vw);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-height-adjust, 130%);
  color: v-bind(white);
  letter-spacing: var(--letter-spacing-base);
  transform: translateY(-100%);

  > span {
    padding-left: 0.781vw;
    font-weight: 500;
  }
}

.push-image-box {
  position: absolute;
  top: -0.4vh;
  right: 0;
  width: 12.5vw;
  pointer-events: none;
  transform: translateY(-100%);

  > img {
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
}

.carousel-container {
  position: relative;
}

.slide-empty-box {
  display: flex;
  flex-shrink: 0;
  width: 29.375vw;
  height: 21.25vh;
  padding: 1.25vw;
  background-color: v-bind(white);
  border-radius: var(--border-radius-m, 8px);
}
</style>
