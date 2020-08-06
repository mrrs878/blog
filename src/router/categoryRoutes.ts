import React from 'react';
import store from '../store';

const CATEGORY = React.lazy(() => import('../views/category'));

const CATEGORY_ROUTES_MAP = {
  category: '/category',
};

const CATEGORY_ROUTES: Array<RouteConfigI> = [
  {
    path: CATEGORY_ROUTES_MAP.category,
    component: CATEGORY,
    title: '分类',
  },
];

console.log(store.getState().common);

export {
  CATEGORY_ROUTES_MAP,
  CATEGORY_ROUTES,
};
