import { ReviewAnswer } from 'src/containers/review/types';
import axios, { type AxiosError } from 'axios';
import { useMutation } from '@tanstack/vue-query';
import { BaseResponse } from '@apis/review/types';
import {
  ReviewListRequest,
  ReviewListResponse,
} from '@apis/review/queries/useReviewListQuery';
import { endPoints } from '@apis';

export type UpdateReviewRequest = ReviewAnswer;

export const useUpdateReviewMutation = (onSuccess: (req: ReviewAnswer, key?: ReviewListRequest) => void) => useMutation<ReviewListResponse, AxiosError<BaseResponse<null>>, { updateReview: UpdateReviewRequest; key?: ReviewListRequest }>({
  mutationFn: ({
    updateReview,
    key,
  }) => axios.post<BaseResponse<ReviewListResponse>>(endPoints.review.review, updateReview).then((ret) => {
    onSuccess(updateReview, key);
    return ret.data.data;
  }),
});
