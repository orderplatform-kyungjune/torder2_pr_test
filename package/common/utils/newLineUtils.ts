export const newLineHelper = (word: string): string => {
  if (word?.includes('//')) {
    let formattedWord = word;

    for (let i = 0; i < 2; i += 1) {
      formattedWord = formattedWord?.replace('//', '\n');
    }

    return formattedWord;
  }
  return word;
};

export const isNewLine = (word: string): boolean => (word.includes('//'));

export const removeNewLine = (word: string): string => {
  if (word?.includes('//')) {
    let formattedWord = word;

    for (let i = 0; i < 2; i += 1) {
      formattedWord = formattedWord?.replace('//', ' ');
    }

    return formattedWord;
  }
  return word;
};

export const removeNewLineTag = (word: string): string => {
  if (word?.includes('\n')) {
    let formattedWord = word;

    for (let i = 0; i < 2; i += 1) {
      formattedWord = formattedWord?.replace('\n', ' ');
    }

    return formattedWord;
  }
  return word;
};

// 중분류 특정 글자수 이상 말줄임표 적용
export const setEllipsisWordLength = (text: string, length: number) => {
  if (text.length > length) {
    const sliceWord = text.slice(0, length);

    return `${sliceWord}...`;
  }
  return text;
};

export default {
  newLineHelper,
  isNewLine,
  removeNewLine,
  removeNewLineTag,
  setEllipsisWordLength,
};
