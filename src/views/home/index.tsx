import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import MOverview from '../../components/MOverview';
import MGoTop from '../../components/MGoTop';
import { AppState } from '../../store';
import Chain, { NEXT_SUCCESSOR } from '../../tools/Chain';

interface PropsI extends RouteComponentProps<{ keywords: string }> {
  articleInfo: Array<ArticleSubI>
}

const mapState2Props = (state: AppState) => ({
  articleInfo: state.common.articleInfo,
});

const handlerTag = new Chain((path: string, keywords: string, src: Array<ArticleSubI>) => {
  if (path.match(/tag/g)) {
    return src.filter((item) => item.tag.includes(keywords));
  }
  return NEXT_SUCCESSOR;
});
const handlerCat = new Chain((path: string, keywords: string, src: Array<ArticleSubI>) => {
  if (path.match(/cat/g)) {
    return src.filter((item) => item.category.includes(keywords));
  }
  return NEXT_SUCCESSOR;
});
const handleSearch = new Chain((path: string, keywords: string, src: Array<ArticleSubI>) => {
  const reg = new RegExp(keywords, 'ig');
  return (keywords ? src.filter((item) => item.title.match(reg) || item.tag.match(reg) || item.category.match(reg)) : src);
});
handlerTag.setNextSuccessor(handlerCat);
handlerCat.setNextSuccessor(handleSearch);

const Index: React.FC<PropsI> = (props: PropsI) => {
  const [articles, setArticles] = useState(props.articleInfo);

  useEffect(() => {
    const { keywords } = props.match.params;
    const res = handlerTag.passRequest(props.location.pathname, keywords, props.articleInfo);
    setArticles(res);
  }, [props.articleInfo, props.location.pathname, props.match.params]);

  return (
    <div className="container homeC homeSearchRef" style={{ padding: 0, marginTop: 0, position: 'relative' }}>
      {
        articles.map((item) => (
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
};

export default connect(mapState2Props)(withRouter(Index));
