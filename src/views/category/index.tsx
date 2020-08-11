import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Space } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';

import style from '../all/index.module.less';
import { AppState } from '../../store';

const mapState2Props = (state: AppState) => ({
  articleInfo: state.common.articleInfo,
});

interface PropsI extends RouteComponentProps{
  articleInfo: Array<ArticleSubI>;
}

const Category = (props: PropsI) => {
  const [categories, setCategories] = useState<DynamicObjectKey<number>>({});
  useEffect(() => {
    const res: DynamicObjectKey<number> = {};
    props.articleInfo.map((item) => item.category).forEach((item) => {
      res[item] = res[item] ? res[item] + 1 : 1;
    });
    setCategories(res);
  }, [props.articleInfo]);
  return (
    <div className="container homeSearchRef" style={{ fontSize: '16px' }}>
      <p style={{ fontSize: 20, textAlign: 'center' }}>
        目前共计：
        { Reflect.ownKeys(categories).length }
        个分类
      </p>
      <Space direction="vertical">
        {
          Reflect.ownKeys(categories).map((item) => (
            <span
              key={String(item)}
              className={style.item}
              style={{ paddingBottom: 5 }}
              onClick={() => props.history.push(`/category/${String(item).trim()}`)}
            >
              {`${String(item)}(${categories[String(item)]})`}
            </span>
          ))
        }
      </Space>
    </div>
  );
};

export default connect(mapState2Props)(withRouter(Category));
