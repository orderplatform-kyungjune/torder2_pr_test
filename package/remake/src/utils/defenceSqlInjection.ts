// sql 예약어
const SQL_RESERVED_KEYWORD = [
  /[%=*><]/,
  'OR',
  'SELECT',
  'INSERT',
  'DELETE',
  'UPDATE',
  'CREATE',
  'DROP',
  'EXEC',
  'UNION',
  'FETCH',
  'DECLARE',
  'TRUNCATE',
];

/**
 * SQL 에서 사용되고 있는 키워드에 대해서 '' 로 처리한다.
 * @param input sql inject 검증 대상 문자열, 대소문자 구별 안함.
 * @param detect 추가적으로 검증할 정규식, 기본검증 대상{@link SQL_RESERVED_KEYWORD} 참조
 */
export default (input: string, detect: (string|RegExp)[] = []) => {
  if (!input || input.length === 0) return true;

  let ret = String(input);

  SQL_RESERVED_KEYWORD.concat(detect).forEach((keyword) => {
    const regex = new RegExp(keyword, 'gi');
    if (regex.test(ret)) {
      ret = ret.replace(regex, '');
    }
  });

  return ret;
};
