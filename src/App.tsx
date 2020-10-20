import { Provider } from 'react-redux';
import React from 'react';

import store from './store';
import './global.less';
import MLayout from './layout';
import initMonitor from './tools/monitor';
import MErrorBoundary from './components/MErrorBoundary';
import useGetArticles from './hooks/useGetArticles';
import useGetUserInfo from './hooks/useGetUserInfo';

initMonitor({ reportUrl: process.env.NODE_ENV === 'development'
  ? '/'
  : 'http://mrrs878-monitor.cn-qingdao.log.aliyuncs.com/logstores/monitor/track.gif?APIVersion=0.6.0' });

function App() {
  useGetArticles(false, true);
  useGetUserInfo(false, true);

  return (
    <MErrorBoundary>
      <Provider store={store}>
        <MLayout />
      </Provider>
    </MErrorBoundary>
  );
}

export default App;
