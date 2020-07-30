import React from 'react';
import store from '../store';

const ALL = React.lazy(() => import('../views/all'));

const ALL_ROUTES_MAP = {
  all: '/all',
};

const ALL_ROUTES: Array<RouteConfigI> = [
  {
    path: ALL_ROUTES_MAP.all,
    component: ALL,
  },
];

console.log(store.getState().common);

export {
  ALL_ROUTES,
  ALL_ROUTES_MAP,
};
