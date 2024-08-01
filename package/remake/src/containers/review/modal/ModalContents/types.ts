import { Review } from '@containers/review/types';

export type ReviewModalContentProps = {
  displayReviewList: Review[],
  isEdit: boolean,
  activeIndex: number,
  setActiveIndex: (activeIndex: number) => void,
};

export type ContentsComponentParameter = Pick<ReviewModalContentProps, 'setActiveIndex'> & {
  displayReview: Review,
  isEdit: boolean,
  onContentUpdated: () => void,
}
