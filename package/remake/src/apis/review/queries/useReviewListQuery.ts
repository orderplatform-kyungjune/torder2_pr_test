import { Ref } from 'vue';
import {
  CustomReview,
  ItemReview,
  StoreReview,
  Review,
  ReviewList,
  OrderList,
} from 'src/containers/review/types';
import axios, { type AxiosError } from 'axios';
import {
  QueryClient,
  useQueryClient,
} from '@tanstack/vue-query';
import { BaseResponse } from '@apis/review/types';
import {
  reviewQueryFn,
  reviewQueryKeys,
} from '@apis/review/reviewQuery';
import {
  getCompletionStatus,
  getSortedReviewList,
  getUniqueKey,
} from '@apis/review/review';
import endPoints from '@apis/endPoints';

export type ReviewListRequest = ReviewList

export type ReviewListResponse = {
  reviewComplete: boolean,
  popupTimes: string[],
  surveyStores: StoreReview[],
  surveyCustoms: CustomReview[],
  surveyItems: ItemReview[],
}

export type ReviewData = {
  reviewList: Review[],
  popupTimes: string[],
  isAllCompleted: boolean,
  totalCount: number,
  completionCount: number,
  remainingCount: number,
}

function setCompletionStatus(reviewList: Review[]) {
  return reviewList.map((review) => ({
    ...review,
    completionType: getCompletionStatus(review),
  }));
}

function setUniqueKey(reviewList: Review[]) {
  return reviewList.map((review) => ({
    ...review,
    uniqueKey: getUniqueKey(review),
  }));
}

function convertReviewList(customReviewList: CustomReview[], storeReviewList: StoreReview[], itemReviewList: ItemReview[]) {
  // 순서: custom, store, item
  let reviewList = [
    ...customReviewList,
    ...storeReviewList,
    ...itemReviewList,
  ];
  reviewList = setUniqueKey(reviewList);
  reviewList = setCompletionStatus(reviewList);
  reviewList = getSortedReviewList(reviewList);

  return reviewList;
}

/**
 * TODO: parameter 에 variables 반응형객체로 들어오게 수정.
 */
export const useReviewListQuery = (client: QueryClient) => (variables?: ReviewListRequest) => client.ensureQueryData<ReviewListResponse, AxiosError<BaseResponse<null>>, ReviewData>({
  // queryKey: reviewQueryKeys.list(list.value?.variables),
  queryKey: reviewQueryKeys.list(variables),
  queryFn: async (): Promise<any> => {
    const URL = `${endPoints.review.order}`;
    if (!variables) return null;

    return axios.post<BaseResponse<ReviewListResponse>>(URL, variables).then((ret) => {
      // ReviewListResponse -> ReviewData
      const { data } = ret.data;
      if (!data) return null;
      const {
        surveyCustoms,
        surveyItems,
        surveyStores,
        popupTimes,
        reviewComplete,
      } = data;
      const reviewList = convertReviewList(surveyCustoms, surveyStores, surveyItems);
      const totalCount = reviewList.length;
      const completionCount = reviewComplete ? totalCount : reviewList.filter((review) => review.completionType === 'COMPLETED').length;
      const remainingCount = totalCount - completionCount;
      const isAllCompleted = remainingCount < 1;

      return {
        reviewList,
        popupTimes,
        totalCount,
        completionCount,
        remainingCount,
        isAllCompleted,
      };
    });
  },
  staleTime: Infinity,
  // TODO: select 활용 방안 검토
  // select: (data: ReviewListResponse) => {
  //   if (!data) return null;
  //   const {
  //     surveyCustoms,
  //     surveyItems,
  //     surveyStores,
  //     popupTimes,
  //     reviewComplete,
  //   } = data;
  //   const reviewList = convertReviewList(surveyCustoms, surveyStores, surveyItems);
  //   const totalCount = reviewList.length;
  //   const completionCount = reviewComplete ? totalCount : reviewList.filter((review) => review.completionType === 'COMPLETED').length;
  //   const remainingCount = totalCount - completionCount;
  //   const isAllCompleted = remainingCount < 1;
  //
  //   return {
  //     reviewList,
  //     popupTimes,
  //     totalCount,
  //     completionCount,
  //     remainingCount,
  //     isAllCompleted,
  //   };
  // },
  // enabled: !!list.value,
});
