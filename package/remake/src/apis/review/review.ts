import {
  type CompletionType,
  type CustomReview,
  type Keyword,
  type KeywordType,
  type Review,
  type SelectedCustomCompareType,
} from 'src/containers/review/types';

const completionType: { [key in CompletionType]: number } = {
  INCOMPLETED: 1,
  POINT: 2,
  COMPLETED: 3,
};

function getAnswerBySelectedKeyword(type: KeywordType, keyword: Keyword) {
  const {
    negativeKeywords,
    generalKeywords,
    positiveKeywords,
  } = keyword;

  switch (type) {
    case 'NEGATIVE':
      return negativeKeywords;
    case 'GENERAL':
      return generalKeywords;
    case 'POSITIVE':
      return positiveKeywords;
    default:
      throw new Error('Invalid KeywordType');
  }
}

function getAnswerBySelectedCompareValue(leftValue: string, rightValue: string, type: SelectedCustomCompareType) {
  switch (type) {
    case 'LEFT':
      return leftValue;
    case 'RIGHT':
      return rightValue;
    default:
      throw new Error('Invalid SelectedCustomCompareType');
  }
}

function getCustomAnswers(review: CustomReview) {
  switch (review.surveyCustomType) {
    case 'SINGLE':
      return review.keywords
        .filter((keyword) => !!keyword.selectedType)
        .map((keyword) => ({
          selectedType: keyword.selectedType!,
          question: keyword.keywordsName,
          answer: getAnswerBySelectedKeyword(keyword.selectedType!, keyword),
        }));
    case 'COMPARE':
      return [{
        selectedType: review.selectedType!,
        question: review.question,
        answer: getAnswerBySelectedCompareValue(review.leftValue, review.rightValue, review.selectedType!),
      }];
    default:
      throw new Error('Invalid SurveyCustomType');
  }
}

// 순서: 미완료, 별점만 평가, 완료(별점과 키워드 평가 or 비교 평가)
export function getSortedReviewList(reviewList: Review[]) {
  return reviewList.sort((a, b) => completionType[a.completionType] - completionType[b.completionType]);
}

export function getCompletionStatus(review: Review): CompletionType {
  if (review.surveyType === 'CUSTOM' && review.surveyCustomType === 'COMPARE') {
    return review.compareCompleted ? 'COMPLETED' : 'INCOMPLETED';
  }

  if (review.keywordsCompleted && review.pointCompleted) {
    return 'COMPLETED';
  }

  if (review.pointCompleted) {
    return 'POINT';
  }

  return 'INCOMPLETED';
}

export function isCompareReview(review: Review) {
  return review.surveyType === 'CUSTOM' && review.surveyCustomType === 'COMPARE';
}

export function getAnswers(review: Review) {
  switch (review.surveyType) {
    case 'ITEM':
    case 'STORE':
      return review.keywords
        .filter((keyword) => !!keyword.selectedType)
        .map((keyword) => ({
          selectedType: keyword.selectedType!,
          question: keyword.keywordsName,
          answer: getAnswerBySelectedKeyword(keyword.selectedType!, keyword),
        }));
    case 'CUSTOM':
      return getCustomAnswers(review);
    default:
      throw new Error('Invalid SurveyType');
  }
}

export function getUniqueKey(review: Review) {
  const {
    orderKey,
    surveyType,
  } = review;

  switch (surveyType) {
    case 'STORE':
      return `${orderKey}$${review.surveyStoreId}`;
    case 'ITEM':
      return `${orderKey}$${review.itemSetId}`;
    case 'CUSTOM':
      return `${orderKey}$${review.surveyCustomId}`;
    default:
      throw new Error('Invalid SurveyType');
  }
}

export function replaceSlashToSpacing(text: string) {
  const regex = /\/+/g;
  return text.replace(regex, (matches) => {
    switch (matches.length) {
      case 1:
        return '/';
      case 2:
        return ' ';
      case 3:
        return ' /';
      case 4:
        return '  ';
      default:
        return `  ${'/'.repeat(matches.length - 4)}`;
    }
  });
}
