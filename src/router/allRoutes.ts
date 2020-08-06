import React from 'react';

const ALL = React.lazy(() => import('../views/all'));

const ALL_ROUTES_MAP = {
  all: '/all',
};

const ALL_ROUTES: Array<RouteConfigI> = [
  {
    path: ALL_ROUTES_MAP.all,
    component: ALL,
    title: '归档',
  },
];

export {
  ALL_ROUTES,
  ALL_ROUTES_MAP,
};
