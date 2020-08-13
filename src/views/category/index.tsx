import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import style from '../all/index.module.less';
import { AppState } from '../../store';
import { getDataSetFromEventPath } from '../../tools';

interface PropsI extends RouteComponentProps{
  articleInfo: Array<ArticleSubI>;
}

const mapState2Props = (state: AppState) => ({
  articleInfo: state.common.articleInfo,
});

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
    props.history.push(`/home/category/${cat}`);
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
