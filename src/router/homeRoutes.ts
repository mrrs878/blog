import React from 'react';

const HOME = React.lazy(() => import('../views/home'));

const HOME_ROUTES_MAP = {
  home: '/home',
  root: '/',
  search: '/home/search/:keywords',
  tag: '/home/tag/:keywords',
  category: '/home/category/:keywords',
};

const HOME_ROUTES: Array<RouteConfigI> = [
  {
    path: HOME_ROUTES_MAP.home,
    component: HOME,
    title: '首页',
  },
  {
    path: HOME_ROUTES_MAP.root,
    component: HOME,
    title: '首页',
  },
  {
    path: HOME_ROUTES_MAP.tag,
    component: HOME,
    title: '标签',
  },
  {
    path: HOME_ROUTES_MAP.category,
    component: HOME,
    title: '分类',
  },
  {
    path: HOME_ROUTES_MAP.search,
    component: HOME,
    title: '搜索',
  },
];

export {
  HOME_ROUTES_MAP,
  HOME_ROUTES,
};
