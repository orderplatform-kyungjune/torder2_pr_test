import { storeToRefs } from 'pinia';
import {
  getRouteName,
  pushPageWithQueries,
} from '@utils/route.helper';
import {
  getInitTableId,
  getInitTableName,
  getStoreCode,
  getStoreName,
} from '@torder/common';
import useTableStore from '@store/storeTable';
import useInitStore from '@store/storeInit';
import {
  banner,
  eventListPage,
  customEventListPage,
  eventModulePage,
  home,
} from '@router/routePaths';
import {
  requestNumberEventLog,
  requestDriverCallEventLog,
  requestSurveyEventLog,
} from '@apis/banner';
import { usePreviousPagePath } from './usePreviousPagePath';

export const eventModule = () => {
  const { init } = storeToRefs(useInitStore());
  const { tableInfo } = storeToRefs(useTableStore());
  const { previousPagePath } = usePreviousPagePath();
  const storeCode = getStoreCode();
  const tabletCode = getInitTableId();
  const tableName = getInitTableName();

  const from = () => {
    let pathName = '';
    const prevPath = previousPagePath.value;
    if (prevPath) {
      if (prevPath.includes(banner)) pathName = '배너';
      else if (prevPath.includes(eventListPage) || prevPath.includes(customEventListPage)) pathName = '리스트';
      else if (prevPath.includes(home)) pathName = '하단버튼';
    }
    return pathName;
  };

  // route: '1577 - 이벤트 리스트' | '1577 - 배너' | '1577 - 하단버튼'
  const postLogDriverCall = async (targetBanner: string) => {
    const routePath = from() === '리스트' ? '이벤트 리스트' : from();

    const payload = new FormData();
    payload.append('storeCode', storeCode);
    payload.append('tabletCode', tabletCode);
    payload.append('route', `${targetBanner} - ${routePath}`);
    await requestDriverCallEventLog(payload);
  };

  // route: 'eventName_리스트' | 'eventName_배너'
  /**
     * @deprecated postLogSurvey 로 대체됨.
     * (TADA 전용 API였다가 이벤트 타입별로 받을 수 있는 API로 통일)
     */
  const postLogNumber = async (targetBanner: string) => {
    const payload = {
      storeName: getStoreName(),
      tableName,
      route: `${targetBanner}_${from()}`,
    };
    await requestNumberEventLog(payload);
  };

  // route: '배너' | '리스트'
  const postLogSurvey = async (eventBannerName: string) => {
    const payload = new FormData();
    payload.append('storeCode', storeCode);
    payload.append('tabletCode', tabletCode);
    payload.append('route', from());
    payload.append('eventName', eventBannerName);
    await requestSurveyEventLog(payload);
  };

  // 이벤트 로그 적재 api가 endpoint 형식으로 분기 형태라 분기문이 많아짐
  // 추후 로그 적재 요청은 하나로 통합하고 payload를 변경하는 형식으로 개선해야함 -> 이게 postLogSurvey 에서 개선되었어요.
  const handlePostEventLog = async (bannerType: string) => {
    let postRouteName = bannerType;

    // 일치하지 않는 이벤트 이름 필터링 추후 제거
    if (bannerType === 'tada_event') postRouteName = 'TADA';
    if (bannerType === 'KDRIVE') postRouteName = '1577';

    const isSurveyBanner = bannerType.includes('survey');
    const isDriverCallBanner = bannerType.includes('KDRIVE');

    if (isSurveyBanner) return;

    // TODO isDriverCallBanner 일 때만 postLogDriverCall()를 쓰는 것 같은데 postRouteName 이게 필요한지? '1577'를 적용하면 안되는지?
    //  반대로 postRouteName는 왜 필요한지? tada_event일 때 postRouteName를 사용하는 곳이 없음.
    if (isDriverCallBanner) postLogDriverCall(postRouteName);
    else postLogSurvey(bannerType);
  };

  /**
     * 이벤트 모듈 페이지로 이동하는 함수입니다.
     * @param {string} eventType - 이벤트의 타입입니다.
     * @param {string} adType - 광고의 타입입니다.
     * @param {boolean} needTerms - 약관이 필요한지 여부를 나타내는 플래그입니다.
     * @returns {void}
     */
  const moveEventModulePage = (
    eventType: string,
    adType: string,
    needTerms: number,
  ): void => {
    let eventTarget: string = eventType;
    let eventAdType: string = adType;
    // 이상한 이벤트 이름으로 넘긴 배너 판별, 이벤트 제거되면 추후 삭제
    if (eventType === 'tada_event') eventTarget = 'TADA';
    if (eventType.includes('survey')) eventTarget = eventType; // survey(설문형)가 포함된 eventName은 동적으로 받아서 번호수집에서 처리해요.

    // 영상 배너(남궁민) 사용하는 이벤트는 대리운전 이벤트 배너밖에 없다고 추측 됨
    // 다른 영상 배너 이벤트가 추가된다면 수정 필요
    if (eventType === 'KDRIVE') eventAdType = 'video';

    // 이벤트 로그 전송
    if (eventType) handlePostEventLog(eventType);

    const queryData = {
      eventType: eventTarget,
      storeCode: init.value?.storeInfo?.storeCode,
      storeName: init.value?.storeInfo?.storeName,
      tableNo: tableInfo.value.tabletId,
      tableName: tableInfo.value.TabletName,
      storeAdd: `${init.value?.storeInfo?.storeAddress}${init.value?.storeInfo?.storeAddress2}`,
      adType: eventAdType,
      needTerms,
    };
    pushPageWithQueries(getRouteName(eventModulePage), queryData);
  };

  return {
    moveEventModulePage,
    postLogSurvey,
  };
};

export default eventModule;
