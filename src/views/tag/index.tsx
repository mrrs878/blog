import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';

import { Modal } from 'antd';
import style from './index.module.less';
import { AppState } from '../../store';
import { getDataSetFromEventPath } from '../../tools';
import Chain, { NEXT_SUCCESSOR } from '../../tools/Chain';

interface PropsI extends RouteComponentProps{
  articleInfo: Array<ArticleSubI>
}

const mapState2Props = (state: AppState) => ({
  articleInfo: state.common.articleInfo,
});

const tagModalContent = (article: Array<ArticleSubI>, onClick: (item: ArticleSubI) => void) => (
  article.map((item) => (
    <p
      className={style.item}
      style={{ display: 'block' }}
      key={item.title}
      onClick={() => onClick(item)}
    >
      { item.title }
    </p>
  ))
);

const singleTagHandler = new Chain((article: Array<ArticleSubI>, props: PropsI) => {
  if (article.length !== 1) return NEXT_SUCCESSOR;
  props.history.push(`/article/${article[0].title}`);
});
const multiTagHandler = new Chain((article: Array<ArticleSubI>, props: PropsI) => {
  const modal = Modal.info({
    title: article[0].tag,
    content: tagModalContent(article, (item) => {
      modal.destroy();
      props.history.push(`/article/${item.title}`);
    }),
  });
});
singleTagHandler.setNextSuccessor(multiTagHandler);

const Tag = (props: PropsI) => {
  const [tags, setTags] = useState<DynamicObjectKey<number>>({});
  useEffect(() => {
    const res: DynamicObjectKey<number> = {};
    props.articleInfo.map((item) => item.tag).forEach((item) => {
      res[item] = res[item] ? res[item] + 1 : 1;
    });
    setTags(res);
  }, [props.articleInfo]);

  function onTagClick(event: any) {
    event.stopPropagation();
    const { tag } = getDataSetFromEventPath(event.nativeEvent.path, style.item);
    if (!tag) return;
    const article = props.articleInfo.filter((item) => item.tag.includes(tag));
    singleTagHandler.passRequest(article, props);
  }
  return (
    <div className="container homeSearchRef" style={{ display: 'unset', textAlign: 'center', padding: '0 50px' }}>
      <p style={{ fontSize: 20 }}>
        目前共计：
        { Reflect.ownKeys(tags).length }
        个标签
      </p>
      <br />
      <div onClick={onTagClick}>
        {
          Reflect.ownKeys(tags).map((item) => (
            <span
              className={`${style.item} ${tags[String(item)] > 1 ? style.big : ''}`}
              data-tag={item}
              key={String(item)}
            >
              {String(item)}
            </span>
          ))
        }
      </div>
    </div>
  );
};

export default connect(mapState2Props)(withRouter(Tag));
