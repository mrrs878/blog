import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';

import style from './index.module.less';
import { AppState } from '../../store';
import { getDataSetFromEventPath } from '../../tools';

interface PropsI extends RouteComponentProps{
  articleInfo: Array<ArticleSubI>
}

const mapState2Props = (state: AppState) => ({
  articleInfo: state.common.articleInfo,
});

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
    if (article.length === 1) props.history.push(`/article/${article[0].title}`);
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
