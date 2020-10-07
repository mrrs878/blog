/**
 * @overview: 主布局配置文件
 * @description: 页面整体布局
 * @author: Mr.RS<mrrs878@foxmail.com>
 * @date 2020/7/1/0001
*/

import { Layout } from 'antd';
import React, { Suspense, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import MMenu from '../components/MMenu';
import MLoading from '../components/MLoading';
import Router from '../router';
import MFooter from '../components/MFooter';

const { Content, Sider } = Layout;

const MLayout = () => {
  const [isFullScreen] = useState(window.location.href.match(/login/));

  return (
    <BrowserRouter>
      {
        isFullScreen && (
          <Suspense fallback={<MLoading />}>
            <Router />
          </Suspense>
        )
      }
      {
        !isFullScreen && (
          <div className="app">
            <Layout>
              <Sider theme="light">
                <MMenu />
              </Sider>
              <Content>
                <div className="content">
                  <Suspense fallback={<MLoading />}>
                    <Router />
                  </Suspense>
                </div>
              </Content>
            </Layout>
            <MFooter />
          </div>
        )
      }
    </BrowserRouter>
  );
};

export default MLayout;
