/* eslint-disable vue/max-len */
/* eslint-disable no-unused-vars */
import {
  productType,
  productLanguage,
} from './product';

export interface childCategoryType {
  childCategoryCode: string,
  childCategoryName: string,
  childCategoryLanguageName: productLanguage,
  childCategorySort: number,
  childCategoryProductCount: number,
  childCategoryProductList: productType[],
}

export interface categoryType {
  categoryName: string,
  categoryLanguageName: productLanguage,
  categoryCode: string,
  serviceUse: number,
  categorySort: number,
  childCategoryList: childCategoryType[],
}

export type getCategoryKeyType = (category: categoryType, index: number) => string | number
export type getChildCategoryKeyType = (childCategory: childCategoryType, index: number) => string | number
