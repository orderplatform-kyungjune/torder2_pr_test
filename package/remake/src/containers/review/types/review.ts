import { productLanguage } from '@torder/common';

const SURVEY_TYPE = [
  'STORE',
  'ITEM',
  'CUSTOM',
] as const;
export type SurveyType = (typeof SURVEY_TYPE)[number];

const COMPLETION_TYPE = [
  'INCOMPLETED',
  'POINT',
  'COMPLETED',
] as const;
export type CompletionType = (typeof COMPLETION_TYPE)[number];

type BaseReview = {
  surveyType: SurveyType,
  surveyId: string,
  storeId: string,
  storeCode: string,
  brandCode: string,
  businessId: string,
  popupTimer: number,
  limitCnt: number,
  reviewId?: string,
  reviewPoint: number,
  orderId: string,
  orderKey: string,
  uniqueKey: string, // 화면에서 관리하는 유니크 키값. store: surveyStoreId + orderKey, item: itemSetId + orderKey, custom: surveyCustomId + orderKey;
  /**
   * 화면에서 관리하는 완료 값
   * store, item, customSingle
   * - !pointCompleted: 'INCOMPLETED'
   * - pointCompleted && !keywordsCompleted: 'POINT'
   * - pointCOmpleted && keywordsCompleted: 'COMPLETED'
   * customCompare
   * - !compareCompleted: 'INCOMPLETED'
   * - compareCompleted: 'COMPLETED'
   */
  completionType: CompletionType,
}

export type KeywordType = 'POSITIVE' | 'GENERAL' | 'NEGATIVE';

export type Keyword = {
  keywordsName: string,
  positiveKeywords: string,
  generalKeywords: string,
  negativeKeywords: string,
  selectedType?: KeywordType,
};

export type StoreReview = BaseReview & {
  surveyType: 'STORE',
  surveyStoreId: string,
  displayName: string,
  keywords: Keyword[],
  storeImgUrl: string,
  pointCompleted: boolean,
  keywordsCompleted: boolean,
}

const SUPPORTED_LANGUAGES = [
  'en',
  'jp',
  'ko',
  'zh_hans',
  'zh_hant',
] as const;
type SupportedLanguageType = (typeof SUPPORTED_LANGUAGES[number]);
export type SupportedLanguage = { [key in SupportedLanguageType]: string };

export type Option = {
  optionCode: string,
  optionName: string,
  quantity: number,
  price: number,
  langs: productLanguage,
  imgUrl: string|null,
};

export type ItemReview = BaseReview & {
  surveyType: 'ITEM',
  surveyItemId: string,
  itemSetId: string,
  itemId: string,
  itemCode: string,
  imgUrl: string,
  displayName: string,
  price: number,
  keywords: Keyword[],
  options: Option[],
  pointCompleted: boolean,
  keywordsCompleted: boolean,
  langs: productLanguage,
}

const SURVEY_CUSTOM_TYPE = [
  'SINGLE',
  'COMPARE',
] as const;
export type SurveyCustomType = (typeof SURVEY_CUSTOM_TYPE)[number];

type CustomReviewBase = BaseReview & {
  surveyType: 'CUSTOM',
  surveyCustomType: SurveyCustomType,
  surveyCustomId: string,
  displayName: string,
  question: string,
  surveyCustomTitle: string,
  customDescription: string,
}

export type CustomSingleReview = CustomReviewBase & {
  surveyCustomType: 'SINGLE',
  imgUrl: string,
  negativeAnswer: string,
  positiveAnswer: string,
  keywords: Keyword[],
  pointCompleted: boolean,
  keywordsCompleted: boolean,
}

export type SelectedCustomCompareType = 'LEFT' | 'RIGHT';

export type CustomCompareReview = CustomReviewBase & {
  surveyCustomType: 'COMPARE',
  leftImageUrl: string,
  leftTitle: string,
  leftDescription: string,
  leftValue: string,
  rightImageUrl: string,
  rightTitle: string,
  rightDescription: string,
  rightValue: string,
  selectedType?: SelectedCustomCompareType,
  compareCompleted: boolean,
}

export type CustomReview = CustomSingleReview | CustomCompareReview;

export type Review = StoreReview | ItemReview | CustomReview;

export type Answer = {
  selectedType: KeywordType | SelectedCustomCompareType,
  question: string,
  answer: string,
}

export type ReviewAnswer = Review & {
  answerList?: Answer[],
};
