import { Review } from '@containers/review/types';

/**
 * 우선순위를 정의한 트리
 * 먼저 정의된 하위 메뉴가 우선순위가 높음
 * value 값 : 우선순위를 Offset 을 둘수 있음. 기본 +1 씩 증가함.
 */
const priorityTree = {
  INCOMPLETED: {
    CUSTOM: {
      COMPARE: 0,
      SINGLE: 0,
    },
    STORE: 0,
    ITEM: 0,
  },
  POINT: {
    CUSTOM: {
      COMPARE: 0,
      SINGLE: 0,
    },
    STORE: 0,
    ITEM: 0,
  },
  COMPLETED: {
    CUSTOM: {
      COMPARE: 0,
      SINGLE: 0,
    },
    STORE: 0,
    ITEM: 0,
  },
};

/**
 * priorityTree 를 토대로 각 트리의 우선순위 값을 부여한다.
 * 숫자가 작을 수록 우선순위가 높다.
 */
const priorityPoint = ((initValue: number) => {
  let weight = initValue;
  return (prior: object|number): any => {
    if (typeof prior === 'object') {
      return Object.entries(prior).reduce(
        (obj: any, [
          key,
          value,
        ]) => {
          obj[key] = priorityPoint(value);
          return obj;
        },
        {} as object,
      );
    }
    weight = weight + prior + 1;
    return weight;
  };
})(0);

/**
 * 우선순위 결과 값
 */
const priorityTable = priorityPoint(priorityTree);
/**
 * 평가 카드에 상태를 보고 priority 표에 우선순위 값을 얻어온다.
 * @param review
 */
const calculatePriority = (review: Review): number => {
  const ret = priorityTable[review.completionType][review.surveyType];
  if (review.surveyType === 'CUSTOM') return ret[review.surveyCustomType];
  return ret;
};

/**
 * 리뷰 항목에 대한 정렬 우선 순서 정책
 * - 평가상태: 미완료 > 부분완료 > 완료
 * - 평가유형: 커스텀 > 매장평가 > 메뉴
 * - 순서: 미완료(커스텀,매장,메뉴), 부분완료(커스텀,매장,메뉴), 완료(커스텀,매장,메뉴)
 */
export const reviewSort = (reviewList: Review[]) => {
  const copyList = reviewList.filter(() => true); // gecko 115 버전 이전까지 toSort 가 되지 않은 복사본을 만들어 사용한다.

  copyList.sort((next, prev) => calculatePriority(next) - calculatePriority(prev));
  return copyList;
};
