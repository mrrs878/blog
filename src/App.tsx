import { Provider } from 'react-redux';
import React, { useEffect } from 'react';

import store from './store';
import './global.less';
import MLayout from './layout';
import ARTICLE_MODULE from './modules/article';

function App() {
  useEffect(() => {
    Promise.race([ARTICLE_MODULE.computeAllOverview()]).catch((e) => {
      console.log(e);
    });
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
