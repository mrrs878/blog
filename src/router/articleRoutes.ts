import React from 'react';
import store from '../store';

const ARTICLE = React.lazy(() => import('../views/article'));

const ARTICLE_ROUTES_MAP = {
  article: '/article',
};

const ARTICLE_ROUTES: Array<RouteConfigI> = [
  {
    path: `${ARTICLE_ROUTES_MAP.article}/:title`,
    component: ARTICLE,
    title: '详情',
  },
];

export {
  ARTICLE_ROUTES_MAP,
  ARTICLE_ROUTES,
};
