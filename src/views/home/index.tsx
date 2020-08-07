import React from 'react';

import { connect } from 'react-redux';
import MOverview from '../../components/MOverview';
import MGoTop from '../../components/MGoTop';
import { AppState } from '../../store';

interface PropsI {
  articleInfo: Array<ArticleSubI>
}

const mapState2Props = (state: AppState) => ({
  articleInfo: state.common.articleInfo,
});

const Index: React.FC<PropsI> = (props: PropsI) => (
  <div className="container homeC homeSearchRef" style={{ padding: 0, marginTop: 0, position: 'relative' }}>
    {
      props.articleInfo.map((item) => (
        <MOverview
          key={item.title}
          title={item.title}
          description={item.description}
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

export default connect(mapState2Props)(Index);
