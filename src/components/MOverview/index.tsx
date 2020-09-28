/*
 * @Author: mrrs878
 * @LastEditors: mrrs878
 */
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { CalendarOutlined, CarryOutOutlined, EyeOutlined, FolderOutlined, TagOutlined } from '@ant-design/icons';

import style from './index.module.less';

interface PropsI extends ArticleSubI, RouteComponentProps{
}

const MOverview = (props: PropsI) => (
  <div className={style.item} onClick={() => props.history.push(`/article/${props._id}`)}>
    <div className={style.itemTitle}>{ props.title }</div>
    <div className={style.itemContent}>
      { props.description }
    </div>
    <div className={style.itemFooter}>
      <span>
        <FolderOutlined style={{ color: '#40a9ff' }} />
        <span className={style.itemFooterHC}>
          ：
          { props.categories }
        </span>
      </span>
      <span>
        <TagOutlined style={{ color: '#40a9ff' }} />
        <span className={style.itemFooterHC}>
          ：
          { props.tag }
        </span>
      </span>
      <span>
        <CalendarOutlined />
        ：
        { props.createTime }
      </span>
      <span>
        <CarryOutOutlined />
        ：
        { props.updateTime || '--' }
      </span>
      <span>
        <EyeOutlined />
        ：
        --
      </span>
    </div>
  </div>
);

export default withRouter(MOverview);
