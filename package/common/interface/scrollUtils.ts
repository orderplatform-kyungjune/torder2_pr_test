/* eslint-disable no-undef */
import {
  VERTICAL,
  HORIZONTAL,
} from '../constant';
import { typeType } from './theme';

export interface CategoryInputType {
  className: string,
  categoryWrapper: HTMLElement,
  type: 'main' | 'sub',
  direction: typeof VERTICAL | typeof HORIZONTAL,
  fixScroll?: number,
  scrollBehavior?: ScrollBehavior,
}

export interface RootScrollType {
  scrollElement: HTMLElement | Element,
  margin?: string,
}

export interface scrollMoveConfigType {
  type?: typeType,
  parent: HTMLElement,
  child: HTMLElement,
  direction?: 'top'|'left',
  isBodyChange?: boolean,
  behavior?: 'auto' | 'smooth',
  adjustScroll?: number,
}
