import { Provider } from 'react-redux';
import React, { useEffect } from 'react';

import store from './store';
import './global.less';
import MLayout from './layout';
import ARTICLE_MODULE from './modules/article';
import testWorker from './workers';
import initMonitor from './tools/monitor';
import MErrorBoundary from './components/MErrorBoundary';

const worker = new Worker(testWorker);

initMonitor({ reportUrl: 'http://localhost:3000/api/monitor' });

function App() {
  useEffect(() => {
    Promise.race([ARTICLE_MODULE.computeAllOverview()]).catch((e) => {
      console.log(e);
    });
    worker.postMessage('getLastCommit');
    worker.postMessage('computeCommit');
    worker.onmessage = async (e: MessageEvent) => {
      const { type, data } = e.data;
      if (type === 'compute') ARTICLE_MODULE.computeAllOverview(data);
      if (type === 'last') ARTICLE_MODULE.computeAllOverview(data);
    };
  }, []);
  return (
    <MErrorBoundary>
      <Provider store={store}>
        <div className="app">
          <MLayout />
        </div>
      </Provider>
    </MErrorBoundary>
  );
}

export default App;
