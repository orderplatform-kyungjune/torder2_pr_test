import { useI18n } from 'vue-i18n';

export const getOrderCompleteMessage = (businessType: string) => {
  const { t } = useI18n();

  switch (businessType) {
    case 'torder':
      return t('티오더로 주문을 완료하였습니다.');
    case 'uplus':
      return t('주문을 완료하였습니다.');
    case 'brand1':
      return t('주문을 완료하였습니다.');

    default:
      return t('주문을 완료하였습니다.');
  }
};

export const getStaffCallMessage = (businessType: string) => {
  const { t } = useI18n();

  switch (businessType) {
    case 'torder':
      return t('티오더로 직원을 호출하였습니다.');
    case 'uplus':
      return t('직원을 호출하였습니다.');
    case 'brand1':
      return t('직원을 호출하였습니다.');

    default:
      return t('직원을 호출하였습니다.');
  }
};

export const getContactMessage = (businessType: string) => {
  const { t } = useI18n();

  switch (businessType) {
    case 'torder':
      return t('(주)티오더 고객센터 1644-2448로 문의 바랍니다.');
    case 'uplus':
      return t('고객센터로 문의 바랍니다.');
    case 'brand1':
      return t('고객센터로 문의 바랍니다.');

    default:
      return t('고객센터로 문의 바랍니다.');
  }
};
