export interface iDefineReports {
  프로퍼티: string,
  '예상한 타입': string,
  값: string,
}

export type iTypeError = Array<string | iDefineReports>
