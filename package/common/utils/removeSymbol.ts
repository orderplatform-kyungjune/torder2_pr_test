export const removeSymbol = (text: string) => {
  let replacedText = text;

  if (typeof replacedText !== 'string') return replacedText;

  replacedText = replacedText.replace(/(&amp;)/g, '&');
  replacedText = replacedText.replace(/(&quot;)/g, '"');
  replacedText = replacedText.replace(/(&nbsp;)/g, ' ');
  replacedText = replacedText.replace(/(&lt;)/g, '<');
  replacedText = replacedText.replace(/(&gt;)/g, '>');
  replacedText = replacedText.replace(/(&#035;)/g, '#');
  replacedText = replacedText.replace(/(&#039;)/g, '‘');
  replacedText = replacedText.replace(/(<br>|<br\/>|<br \/>|\/{2,})/g, '\n');

  return replacedText;
};

export const removeSymbolInCount = (text: string, count: number) => {
  let replacedText = text;

  if (typeof replacedText !== 'string') return replacedText;

  const replaceFunction = () => {
    replacedText = replacedText.replace(/(&amp;)/i, '&');
    replacedText = replacedText.replace(/(&quot;)/i, '"');
    replacedText = replacedText.replace(/(&nbsp;)/i, ' ');
    replacedText = replacedText.replace(/(&lt;)/i, '<');
    replacedText = replacedText.replace(/(&gt;)/i, '>');
    replacedText = replacedText.replace(/(&#035;)/i, '#');
    replacedText = replacedText.replace(/(&#039;)/i, '‘');
    replacedText = replacedText.replace(/(<br>|<br\/>|<br \/>|\/{2,})/i, '\n');
  };

  for (let i = 0; i < count; i += 1) {
    replaceFunction();
  }

  return replacedText;
};

// 특수 문자 제거 로직
export const removeSpecialCharacters = (text: string) => {
  // eslint-disable-next-line no-useless-escape
  const regex = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gim;
  const changedGroupName = text.replace(regex, '').replace(/\s+/g, '');

  return changedGroupName;
};
