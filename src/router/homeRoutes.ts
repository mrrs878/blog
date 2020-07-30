import React from 'react';

const HOME = React.lazy(() => import('../views/home'));

const HOME_ROUTES_MAP = {
  home: '/home',
};

const HOME_ROUTES: Array<RouteConfigI> = [
  {
    path: HOME_ROUTES_MAP.home,
    component: HOME,
  },
];

export {
  HOME_ROUTES_MAP,
  HOME_ROUTES,
};
