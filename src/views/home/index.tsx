import React from 'react';

import MOverview from '../../components/MOverview';
import MGoTop from '../../components/MGoTop';

interface PropsI {
}

const Index: React.FC<PropsI> = () => (
  <div className="container homeC" style={{ padding: 0, marginTop: 0 }}>
    {
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => (
        <MOverview
          title="hello Mr.RS"
          description="Here is my new blog site"
          category="hello"
          tag="hello"
          createTime="2020/8/6 10:00"
          modifyTime="2020/8/6 10:00"
          watch={0}
        />
      ))
    }
    <MGoTop referEle=".homeC" />
  </div>
);

export default Index;
