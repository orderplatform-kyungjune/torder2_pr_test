export interface OrderListType {
  code: string,
  qty: number,
}

export interface CreditReadyPayloadType {
  store: {
    storeCode: string,
    tabletCode: string,
  },
  orderList: OrderListType[],
}

export interface CreditWebLogsPayloadType {
  orderKey: string,
  status: string,
  store: {
    storeCode: string,
    tabletCode: string,
  },
  errorCode?: string,
}
