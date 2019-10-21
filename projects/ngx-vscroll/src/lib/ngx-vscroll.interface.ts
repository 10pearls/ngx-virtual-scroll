import { ChangeOperation } from './ngx-vscroll.enum';


export interface ItemMeta<T> {
  offsetTop: number;
  height: number;
  value: T;
}

export interface ItemDiff<T> {
  index: number;
  value: T;
}

export interface ViewportMeta {
  startIndex: number;
  count: number;
}

export interface ItemChange<T> {
  operation: ChangeOperation;
  diff?: ItemDiff<T>[];
}

export interface ScrollToOptions {
  index?: number;
  offsetTop?: number;
}
