import React from 'react';

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

export {
  CATEGORY_ROUTES_MAP,
  CATEGORY_ROUTES,
};
