import { createFromIconfontCN } from '@ant-design/icons/es';
import Mock from 'mockjs';
import MAIN_CONFIG from '../config';

export function createIconFromIconfont() {
  return createFromIconfontCN({
    scriptUrl: MAIN_CONFIG.ICONFONT_URL,
  });
}

export function createMockRes<T, P>(url: string | RegExp, type: MockMethodT, template: (req: MockReqI<T>) => P) {
  return Mock.mock(url, type, template);
}

export function getLastItem<T>(src: Array<T>) {
  return src.length === 0 ? src[0] : src[src.length - 1];
}

export function getDataSetFromEventPath(eventPath: Array<HTMLElement>, elementClass: string) {
  if (!Array.isArray(eventPath)) return {};
  const element = eventPath.find((item) => item?.classList?.contains(elementClass));
  return element?.dataset || {};
}

export function getLocalDate(zone: number, date: Date | string) {
  const _date: Date = new Date(date);
  const len = _date.getTime();
  const offset = _date.getTimezoneOffset() * 60000;
  const utcTime = len + offset;
  return new Date(utcTime + 3600000 * zone);
}
