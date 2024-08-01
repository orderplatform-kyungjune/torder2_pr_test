import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from '../constant';
import {
  getCookie,
  deleteCookie,
  setCookie,
} from './cookieUtils';

// 쿠키에 따른 로직 변경
const cookieCheck = async (): Promise<string> => {
  const accessToken = getCookie('accessToken');
  const refreshToken = getCookie('refreshToken');

  // 성공 로직 (두개의 토큰 모두 있음)
  if (accessToken !== '' && refreshToken !== '') {
    return 'success';
  }

  // accessToken 만료, refreshToken 존재
  if (accessToken === '' && refreshToken !== '') {
    // 토큰 발행 로직 이곳에 추가
    deleteCookie(ACCESS_TOKEN);
    deleteCookie(REFRESH_TOKEN);

    const hour = 60;
    const week = 60 * 24 * 7;

    setCookie(ACCESS_TOKEN, '발급 된 엑세스 토큰', hour);
    setCookie(REFRESH_TOKEN, '발급 된 리프레시 토큰', week);

    return 'accessTokenRefresh';
  }

  // accessToken 만료, refreshToken 만료
  if (accessToken === '' && refreshToken === '') {
    return 'refreshTokenRefresh';
  }

  return 'error';
};

export default cookieCheck;
