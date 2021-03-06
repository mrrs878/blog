declare function onNavBarLeftClick();
declare function createIconFromIconfont();

type DynamicObjectKey<T> = {
  [propName: string]: T;
};
type ModuleResI = { success: boolean; msg: string };

type MockMethodT = 'get' | 'post' | 'delete' | 'put';
interface MockReqI<T> {
  url: string,
  type: MockMethodT,
  body: T
}

type MenuTitlesI = DynamicObjectKey<string>;

type MenuRoutesI = DynamicObjectKey<string>;
