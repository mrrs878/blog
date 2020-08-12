import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';

import style from '../all/index.module.less';
import { AppState } from '../../store';
import { getDataSetFromEventPath } from '../../tools';
import Chain, { NEXT_SUCCESSOR } from '../../tools/Chain';

interface PropsI extends RouteComponentProps{
  articleInfo: Array<ArticleSubI>;
}

const mapState2Props = (state: AppState) => ({
  articleInfo: state.common.articleInfo,
});

const tagModalContent = (article: Array<ArticleSubI>, onClick: (item: ArticleSubI) => void) => (
  <div>
    <br />
    {
      article.map((item) => (
        <p
          className={style.item}
          key={item.title}
          onClick={() => onClick(item)}
        >
          { item.title }
        </p>
      ))
    }
  </div>
);

const singleCatHandler = new Chain((article: Array<ArticleSubI>, props: PropsI) => {
  if (article.length !== 1) return NEXT_SUCCESSOR;
  props.history.push(`/article/${article[0].title}`);
});
const multiCatHandler = new Chain((article: Array<ArticleSubI>, props: PropsI) => {
  const modal = Modal.info({
    title: article[0].category,
    content: tagModalContent(article, (item) => {
      modal.destroy();
      props.history.push(`/article/${item.title}`);
    }),
  });
});
singleCatHandler.setNextSuccessor(multiCatHandler);

const Category = (props: PropsI) => {
  const [categories, setCategories] = useState<DynamicObjectKey<number>>({});
  useEffect(() => {
    const res: DynamicObjectKey<number> = {};
    props.articleInfo.map((item) => item.category).forEach((item) => {
      res[item] = res[item] ? res[item] + 1 : 1;
    });
    setCategories(res);
  }, [props.articleInfo]);

  function onCategoryClick(event: any) {
    event.stopPropagation();
    const { cat } = getDataSetFromEventPath(event.nativeEvent.path, style.item);
    if (!cat) return;
    const article = props.articleInfo.filter((item) => item.category.includes(cat));
    singleCatHandler.passRequest(article, props);
  }

  return (
    <div className="container homeSearchRef" style={{ fontSize: '16px' }}>
      <p style={{ fontSize: 20, textAlign: 'center' }}>
        目前共计：
        { Reflect.ownKeys(categories).length }
        个分类
      </p>
      <div className={style.itemC} onClick={onCategoryClick}>
        {
          Reflect.ownKeys(categories).map((item) => (
            <span
              key={String(item)}
              className={style.item}
              data-cat={item}
              style={{ paddingBottom: 5 }}
            >
              {`${String(item)}(${categories[String(item)]})`}
            </span>
          ))
        }
      </div>
    </div>
  );
};

export default connect(mapState2Props)(withRouter(Category));
