import React, { useEffect, useState } from 'react';

import MOverview from '../../components/MOverview';
import MGoTop from '../../components/MGoTop';
import ARTICLE_MODULE from '../../modules/article';

interface PropsI {
}

const overviewInfo = ARTICLE_MODULE.computeAllOverview();

const Index: React.FC<PropsI> = () => (
  <div className="container homeC" style={{ padding: 0, marginTop: 0 }}>
    {
        overviewInfo.map((item) => (
          <MOverview
            title={item.title}
            description={item.desc}
            category={item.category}
            tag={item.tag}
            createTime={item.createTime}
            modifyTime="2020/8/6 10:00"
            watch={0}
          />
        ))
      }
    <MGoTop referEle=".homeC" />
  </div>
);

export default Index;
