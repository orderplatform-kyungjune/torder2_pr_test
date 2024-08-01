/* eslint-disable no-unused-vars */
export interface modalType {
  [index: string]: boolean,
}

export interface handleModalType {
  (key: string): void,
}

export interface modalStoreType {
  flag: modalType,
  openModal: handleModalType,
  closeModal: handleModalType,
}
