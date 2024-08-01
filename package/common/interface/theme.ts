/* eslint-disable no-unused-vars */
/* eslint-disable vue/max-len */
import {
  RESTAURANT_HORIZONTAL,
  BLACK,
  WHITE,
  VERTICAL,
  HORIZONTAL,
  RESTAURANT_HORIZONTAL_CARD,
  HYATT,
  RESTAURANT_VERTICAL,
} from '../constant/string';

export type colorType = typeof BLACK | typeof WHITE
export type typeType = typeof VERTICAL | typeof HORIZONTAL | typeof RESTAURANT_HORIZONTAL | typeof RESTAURANT_HORIZONTAL_CARD | typeof RESTAURANT_VERTICAL | typeof HYATT

export interface themeType {
  color: colorType,
  type: typeType,
}

export interface changeThemeColorType {
  (color: colorType): void,
}

export interface changeThemeTypeType {
  (type: typeType): void,
}

export interface themeStoreType {
  theme: themeType,
  changeThemeColor: changeThemeColorType,
  changeThemeType: changeThemeTypeType,
}
