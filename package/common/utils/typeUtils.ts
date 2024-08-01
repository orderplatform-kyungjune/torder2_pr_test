export const typeChecker = <T, K>(value: T, defaultValue: K, type: string, condition = true): T | K => {
  /**
    value로 원시값만 넣어줍니다.(화면단에 나오는 값은 원시타입이므로)
    defaultValue로 지정한 타입이 아닐경우 반환될 값을 넣어줍니다.
    type으로 받을데이터의 타입을 지정합니다. (string, name, boolean)
    condition은 옵션으로 넣지 않으면 기본으로 true를 반환하여 넘어갑니다.
    boolean을 반환하는 콜백함수를 넣어주면 되고 해당 조건의 boolean값에 따라 기본값이 나올지 들어오는 값이 나올지 결정됩니다.
  */
  if (!condition) return defaultValue;

  // eslint-disable-next-line valid-typeof
  const isType = typeof value !== type;

  if (isType) return defaultValue;

  const isUndefined = value === undefined;

  if (isUndefined) return defaultValue;
  return value;
};

export default { typeChecker };
