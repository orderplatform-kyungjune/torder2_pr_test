import {
  ref,
  Ref,
} from 'vue';
import { defineStore } from 'pinia';
import { LOG } from '@store/keys';
import { requestDpLoggerFrontParamsType } from '@interface/logger';
import { requestDpLoggerFront } from '@apis/logger';

/**
  데이터플랫폼 광고 로그수집 관련 벌크 작업을 위한 store
  관련 링크 : https://torderjira.atlassian.net/wiki/spaces/DjnA8UQmaZzn/pages/224100762/04+19+API+Gateway
  - 벌크 조건
  1. Bulk Event는 배너 노출 시점부터 데이터 누적하여 배너 닫히는 시점에 한번에 전송
  2. 단, Bulk Event 전송 시 400개가 넘는다면 Split 처리하여 나누어 전송 (횟수 분할)
    예시) 배너 노출 주기동안 1,200회 롤링 시 : 400개씩 3회로 분할하여 API 전송
  - 벌크 조건 처리 작업
  1. 배너 롤링 시점 push data -> 배너페이지 onBeforeUnmount 시점 API 전송
  2. 배너 롤링 시점 push data 시 배열 length 400개 기준하여 API 전송 조건 추가(전송 후 리셋)
*/

const useLogStore = defineStore(LOG, () => {
  const adBannerLogData: Ref<requestDpLoggerFrontParamsType[]> = ref([]);

  const updateAdBannerLogData = (logData: requestDpLoggerFrontParamsType) => {
    adBannerLogData.value.push(logData);
  };

  const resetAdBannerLogData = () => {
    adBannerLogData.value = [];
  };

  const postDpLoggerFront = async () => {
    if (adBannerLogData.value.length > 0) { // 누적 로그 데이터가 없으면 불필요하게 API 전송하지 않도록 함.
      await requestDpLoggerFront(adBannerLogData.value);
    }
  };

  return {
    adBannerLogData,
    updateAdBannerLogData,
    postDpLoggerFront,
    resetAdBannerLogData,
  };
});

export default useLogStore;
