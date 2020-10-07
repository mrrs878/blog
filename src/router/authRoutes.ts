import React from 'react';

const LOGIN = React.lazy(() => import('../views/auth/login'));

const AUTH_ROUTES_MAP = {
  login: '/auth/login',
};

const AUTH_ROUTES: Array<RouteConfigI> = [
  {
    path: AUTH_ROUTES_MAP.login,
    component: LOGIN,
    auth: false,
    title: '登录',
  },
];

export {
  AUTH_ROUTES_MAP,
  AUTH_ROUTES,
};
