import React, { useEffect, useState } from 'react';
import { Timeline } from 'antd';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { groupBy } from 'ramda';
import { AppState } from '../../store';
import style from './index.module.less';
import MGoTop from '../../components/MGoTop';

interface PropsI extends RouteComponentProps<{ filter: string }>{
  articleInfo: Array<ArticleSubI>
}

const mapState2Props = (state: AppState) => ({
  articleInfo: state.common.articleInfo,
});

const All = (props: PropsI) => {
  const [formattedArticle, setFormattedArticle] = useState<Array<ArticleSubI>>([]);
  useEffect(() => {
    if (props.location.pathname.match(/tag/g)) {
      const { filter } = props.match.params;
      const tmp = props.articleInfo.filter((item) => item.tag === filter);
      setFormattedArticle(tmp);
    } else if (props.location.pathname.match(/category/g)) {
      const { filter } = props.match.params;
      console.log(filter)
      const tmp = props.articleInfo.filter((item) => item.category === filter);
      setFormattedArticle(tmp);
    } else {
      const src = groupBy((item) => item.createTime.slice(0, 4), props.articleInfo);
      let tmp: Array<ArticleSubI> = [];
      Reflect.ownKeys(src).forEach((item) => {
        src[item as string].unshift({ createTime: item as string, title: '', tag: '', category: '' });
        tmp = [...src[item as string], ...tmp];
      });
      setFormattedArticle(tmp);
    }
  }, [props.articleInfo, props.location]);
  return (
    <div className="container homeSearchRef">
      <Timeline>
        <Timeline.Item style={{ height: '80px', fontSize: '16px' }}>
          <span>
            不错！目前共计：
            { formattedArticle.length }
            篇日志，继续努力！
          </span>
        </Timeline.Item>
        {
          formattedArticle.map((item) => (
            <Timeline.Item>
              <div className={`${style.item} ${item.title === '' ? style.big : ''}`} onClick={() => props.history.push(`/article/${item.title}`)}>
                {
                  (item.title !== '' ? item.createTime.slice(5, 10) : item.createTime.slice(0, 4))
                  + item.title
                }
              </div>
            </Timeline.Item>
          ))
        }
      </Timeline>
      <MGoTop referEle=".homeSearchRef" />
    </div>
  );
};

export default connect(mapState2Props)(withRouter(All));
