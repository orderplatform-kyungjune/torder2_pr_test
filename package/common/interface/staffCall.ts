/* eslint-disable camelcase */
export interface GlobalTitleType {
  ko: string,
  en: string,
  jp: string,
  zh_hans: string,
  zh_hant: string,
}

export interface StaffCallItemType {
  title: GlobalTitleType,
  active: string,
  count: number,
  productCode: string,
}

export type StaffCallType = 'legacy' | 'next';
