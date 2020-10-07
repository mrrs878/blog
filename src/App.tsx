import { Provider } from 'react-redux';
import React, { useEffect } from 'react';

import store from './store';
import './global.less';
import MLayout from './layout';
import testWorker from './workers';
import initMonitor from './tools/monitor';
import MErrorBoundary from './components/MErrorBoundary';
import useGetArticles from './hooks/useGetArticles';
import useGetUserInfo from './hooks/useGetUserInfo';

const worker = new Worker(testWorker);

initMonitor({ reportUrl: process.env.NODE_ENV === 'development'
  ? '/'
  : 'http://mrrs878-monitor.cn-qingdao.log.aliyuncs.com/logstores/monitor/track.gif?APIVersion=0.6.0' });

function App() {
  const [getArticles] = useGetArticles(false);
  const [getUserInfo] = useGetUserInfo(false);
  useEffect(() => {
    Promise.race([getArticles(), getUserInfo()]).catch((e) => {
      console.log(e);
    });
    // worker.postMessage('getLastCommit');
    // worker.postMessage('computeCommit');
    worker.onmessage = async (e: MessageEvent) => {
      // const { type, data } = e.data
      // if (type === 'compute') ARTICLE_MODULE.computeAllOverview(data);
      // if (type === 'last') ARTICLE_MODULE.computeAllOverview(data);
    };
  }, [getArticles, getUserInfo]);
  return (
    <MErrorBoundary>
      <Provider store={store}>
        <MLayout />
      </Provider>
    </MErrorBoundary>
  );
}

export default App;
