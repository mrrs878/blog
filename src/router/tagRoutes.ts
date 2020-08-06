import React from 'react';
import store from '../store';

const TAG = React.lazy(() => import('../views/tag'));

const TAG_ROUTES_MAP = {
  tag: '/tag',
};

const TAG_ROUTES: Array<RouteConfigI> = [
  {
    path: TAG_ROUTES_MAP.tag,
    component: TAG,
    title: '标签',
  },
];

export {
  TAG_ROUTES_MAP,
  TAG_ROUTES,
};
