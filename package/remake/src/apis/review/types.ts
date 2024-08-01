import {
  AxiosError,
  AxiosResponse,
} from 'axios';

export interface BaseResponse<T> extends AxiosResponse {
  status: number,
  message: string,
  data: T,
}

export type BaseError<T> = AxiosError<{
  status: number,
  message: string,
  data: T,
}>;

export type BasePatternError<T> = AxiosError<{
  status: number,
  message: Array<{ field: string; reason: string }>,
  data: T,
}>;

export type ListResponse<T> = {
  contents: T[],
  totalElements: number,
  totalPages: number,
  currentPage: number,
  size: number,
  elementsOfCurrentPage: number,
};
