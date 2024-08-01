import {
  PopupStatus,
  TriggerType,
} from 'src/containers/review/types';
import axios, { type AxiosError } from 'axios';

import { useMutation } from '@tanstack/vue-query';
import { BaseResponse } from '@apis/review/types';
import { type ReviewListRequest } from '@apis/review';
import { endPoints } from '@apis';

// CLICK, UPDATE, EXIST_REVIEWS, NO_REVIEWS, CLOSE_POPUP
type EventType = TriggerType | Exclude<PopupStatus, 'DETECT_ACTION'>;

type CreateReviewLogRequest = {
  eventType: EventType,
  data?: Partial<ReviewListRequest>,
};

export const useCreateReviewLogMutation = () => useMutation<null, AxiosError<BaseResponse<null>>, CreateReviewLogRequest>({
  mutationFn: async (variables) => {
    const URL = `${endPoints.review.log}`;
    const { data: { data } } = await axios.post<BaseResponse<null>>(URL, variables);
    return data;
  },
});
