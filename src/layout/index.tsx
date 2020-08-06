/**
 * @overview: 主布局配置文件
 * @description: 页面整体布局
 * @author: Mr.RS<mrrs878@foxmail.com>
 * @date 2020/7/1/0001
*/

import { Layout } from 'antd';
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import MMenu from '../components/MMenu';
import MLoading from '../components/MLoading';
import Router from '../router';
import { AppState } from '../store';
import MFooter from '../components/MFooter';

const { Content, Sider, Footer } = Layout;

const mapState2Props = (state: AppState) => ({
  fullScreen: state.common.fullScreen,
});

interface PropsI{
  fullScreen: boolean
}

const MLayout = (props: PropsI) => (
  <BrowserRouter>
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
  </BrowserRouter>
);

export default connect(mapState2Props)(MLayout);
