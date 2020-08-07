import React from 'react';

import { Spin } from 'antd';

import loadingStyle from './index.module.less';

const MLoading: React.FC = () => <Spin className={loadingStyle.loading} spinning tip="加载中..." />;

export default MLoading;
