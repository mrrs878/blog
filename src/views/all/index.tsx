import React, { useEffect, useState } from 'react';
import { Timeline } from 'antd';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { last } from 'ramda';
import { AppState } from '../../store';
import style from './index.module.less';
import MGoTop from '../../components/MGoTop';

interface PropsI extends RouteComponentProps{
  articleInfo: Array<ArticleSubI>
}

const mapState2Props = (state: AppState) => ({
  articleInfo: state.common.articleInfo,
});

const All = (props: PropsI) => {
  const [dateSplit, setDateSplit] = useState<DynamicObjectKey<number>>([]);
  useEffect(() => {
    const tmp: DynamicObjectKey<number> = {};
    props.articleInfo
      .map((item) => item.createTime.slice(1, 5))
      .forEach((item) => {
        tmp[item] = tmp[item] ? tmp[item] + 1 : 1;
      });
    setDateSplit(tmp);
  }, [props.articleInfo]);
  return (
    <div className="container homeSearchRef">
      <Timeline>
        <Timeline.Item style={{ height: '80px', fontSize: '16px' }}>
          <span>
            不错！目前共计：
            { props.articleInfo.length }
            篇日志，继续努力！
          </span>
        </Timeline.Item>
        {
          props.articleInfo.map((item, index) => (
            <Timeline.Item style={{ height: '60px' }}>
              <div className={style.item} onClick={() => props.history.push(`/article/${item.title}`)}>
                {
                  item.createTime.split(' ')[1].slice(5)
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
