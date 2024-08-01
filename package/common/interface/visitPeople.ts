export interface VisitGroupInfo {
  [key: string]: number,
}

export interface VisitGroupType {
  total: number,
  groupInfo?: VisitGroupInfo,
}

export interface VisitPeopleDataType {
  storeCode: string,
  tabletNumber: string,
  groupArray: VisitGroupType,
}

export interface VisitPeopleResetDataType {
  storeCode: string,
  tabletNumber: string,
}
