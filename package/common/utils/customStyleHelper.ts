// eslint-disable-next-line import/prefer-default-export
export const validateValue = (flag: boolean, value: string | null | undefined, fallback: string) => {
  if (flag && value) return value ?? fallback;

  return fallback;
};

// 커스텀컬러의 주색상을 변환해주는 로직 hex => hsl (hsl(a, b% (c - option)%)
export const getSubPrimaryColor = (H: string, option: number, use: string) => {
  // 커스텀 색상 미사용일 경우
  if (use === 'N') return '#3A5E05';
  if (H === '#000' || H === '#000000') return '#333333';
  if (H === '#181818') return '#494949';

  let r = '0';
  let g = '0';
  let b = '0';

  if (H.length == 4) {
    r = `0x${H[1]}${H[1]}`;
    g = `0x${H[2]}${H[2]}`;
    b = `0x${H[3]}${H[3]}`;
  } else if (H.length == 7) {
    r = `0x${H[1]}${H[2]}`;
    g = `0x${H[3]}${H[4]}`;
    b = `0x${H[5]}${H[6]}`;
  }

  // Then to HSL
  const r2 = Number(r) / 255;
  const g2 = Number(g) / 255;
  const b2 = Number(b) / 255;

  const cmin = Math.min(r2, g2, b2);
  const cmax = Math.max(r2, g2, b2);
  const delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  if (delta == 0) { h = 0; } else if (cmax == r2) { h = ((g2 - b2) / delta) % 6; } else if (cmax == g2) { h = (b2 - r2) / delta + 2; } else { h = (r2 - g2) / delta + 4; }

  h = Math.round(h * 60);

  if (h < 0) { h += 360; }

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `hsl(${h},${s}%,${l - option}%)`;
};
