/**
 * @overview: 主路由配置文件
 * @description: 整合所有子路由配置、鉴权、导出路由配置表
 * @author: Mr.RS<mrrs878@foxmail.com>
 * @date 2020/7/30/0001
*/

import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import MLoading from '../components/MLoading';
import { HOME_ROUTES, HOME_ROUTES_MAP } from './homeRoutes';
import { ABOUT_ROUTES, ABOUT_ROUTES_MAP } from './aboutRoutes';
import { ALL_ROUTES, ALL_ROUTES_MAP } from './allRoutes';
import { CATEGORY_ROUTES, CATEGORY_ROUTES_MAP } from './categoryRoutes';
import { TAG_ROUTES, TAG_ROUTES_MAP } from './tagRoutes';

const ROUTES_MAP = {
  ...HOME_ROUTES_MAP,
  ...ABOUT_ROUTES_MAP,
  ...ALL_ROUTES_MAP,
  ...TAG_ROUTES_MAP,
  ...CATEGORY_ROUTES_MAP,
};

const ROUTES: Array<RouteConfigI> = [
  ...HOME_ROUTES,
  ...ABOUT_ROUTES,
  ...ALL_ROUTES,
  ...TAG_ROUTES,
  ...CATEGORY_ROUTES,
];

const Router = () => {
  function beforeEach(route: RouteConfigI) {
    const Com = route.component;
    return <Com />;
  }

  return (
    <Suspense fallback={<MLoading />}>
      <Switch>
        {
          ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact || true}
              render={(): React.ReactNode => beforeEach(route)}
            />
          ))
        }
      </Switch>
    </Suspense>
  );
};

export {
  ROUTES_MAP,
};
export default Router;
