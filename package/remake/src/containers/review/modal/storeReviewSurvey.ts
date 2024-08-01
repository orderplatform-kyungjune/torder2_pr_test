import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
  Answer,
  Review,
} from '@containers/review/types';
import useReviews from '@containers/review/storeReivews';
import { getCompletionStatus } from '@apis/review/review';

type ModalDisplayInfo = {
  /**
   * 수정 모드(평가지가 기제 되었다고 여김)
   * true : '저장' 버튼을 눌렀을때만 서버에 반영
   * false : 설문지 선택시 서버에 반영
   */
  isEdit: boolean,

  /**
   * 보여지는 항목에 대한 리스트
   */
  displayReview: Review[],
}

type AnswerList = {
  review: Review, answer: Answer[],
}[]

const useReviewSurvey = defineStore('storeReviewSurvey', () => {
  const modalDisplayInfo = ref<ModalDisplayInfo>({
    isEdit: false,
    displayReview: [],
  });

  const answerList = ref<AnswerList>([]);

  const open = ref<boolean>(false);
  const setModalDisplayInfo = (info: ModalDisplayInfo) => {
    open.value = true;
    modalDisplayInfo.value = info;
  };

  /**
   * ReviewSurvey 에서 변경한 이력을 변경한다. (만약 최초 설문조사일 경우 서버로 답변을 전달한다)
   * @param review 변경된 review 정보
   * @param answer 리뷰의 상세 내역
   * @return 서버 업데이트 유/무, true: 업데이트, false: answerList 에 저장.
   */
  const update = (review: Review, answer: Answer[] = []) => {
    const reviewed = {
      ...review,
      completionType: getCompletionStatus(review),
    };
    // isEdit 는 내부적으로 가지고 있고 수정되는 곳에서는 isEdit 를 건네받지 않게 해야함.
    modalDisplayInfo.value.displayReview = modalDisplayInfo.value.displayReview.map((r) => {
      if (r.uniqueKey !== reviewed.uniqueKey) return r;
      return reviewed;
    });

    // 리뷰가 수정되지 않았을 경우(최초 리뷰 항목) 바로 서버로 전송한다.
    if (!modalDisplayInfo.value.isEdit) {
      // storeReview 의 onUpdateReview 호출
      useReviews().onUpdateReview({
        ...reviewed,
        answerList: answer,
      });

      return true;
    }

    // 이미 등록되었던 항목일 경우 창 닫을 때 서버에 일괄 전달한다.
    // TODO: 로직상 일괄 답변을 받을 수 없음. 서비스상, 신규는 바로전송, 수정 평가는 단위별로 저장해서 전송하므로 문제가 없으나 추후 일괄 편집 전송시 이슈가 있을 수 있음.
    answerList.value = answerList.value
      .filter((a) => a.review.uniqueKey !== reviewed.uniqueKey)
      .concat([{
        review: reviewed,
        answer,
      }]);
    return false;
  };

  /**
   * 평가 설문지 닫기
   */
  const reviewSurveyClose = () => {
    open.value = false;
    modalDisplayInfo.value = {
      isEdit: false,
      displayReview: [],
    };
    answerList.value = [];
  };

  return {
    open,
    modalDisplayInfo,
    answerList,
    update,
    setModalDisplayInfo,
    reviewSurveyClose,
  };
});

export default useReviewSurvey;
