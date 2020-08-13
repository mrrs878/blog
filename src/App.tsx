import { Provider } from 'react-redux';
import React, { useEffect } from 'react';

import store from './store';
import './global.less';
import MLayout from './layout';
import ARTICLE_MODULE from './modules/article';
import testWorker from './workers';

const worker = new Worker(testWorker);

function App() {
  useEffect(() => {
    Promise.race([ARTICLE_MODULE.computeAllOverview()]).catch((e) => {
      console.log(e);
    });
    worker.postMessage('test');
  }, []);
  return (
    <Provider store={store}>
      <div className="app">
        <MLayout />
      </div>
    </Provider>
  );
}

export default App;
