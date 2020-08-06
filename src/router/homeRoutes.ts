import React from 'react';

const HOME = React.lazy(() => import('../views/home'));

const HOME_ROUTES_MAP = {
  home: '/home',
  root: '/',
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
];

export {
  HOME_ROUTES_MAP,
  HOME_ROUTES,
};
