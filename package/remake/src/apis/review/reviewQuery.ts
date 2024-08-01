import axios from 'axios';
import { BaseResponse } from '@apis/review/types';
import endPoints from '@apis/endPoints';
import {
  ReviewListResponse,
  ReviewListRequest,
} from './queries/useReviewListQuery';

export const reviewQueryKeys = {
  all: ['review'] as const,
  list: (variables?: ReviewListRequest) => [
    ...reviewQueryKeys.all,
    'list',
    JSON.stringify(variables ?? '{}'),
  ] as const,
};
export const reviewQueryFn = {
  list: async (variables?: ReviewListRequest) => {
    const URL = `${endPoints.review.order}`;
    const { data: { data } } = await axios.post<BaseResponse<ReviewListResponse>>(URL, variables);
    return data;
  },
};
