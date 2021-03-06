import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import {CalendarOutlined, FolderOutlined, LikeOutlined, UserOutlined} from "@ant-design/icons/lib";
import {Badge, Button, Space} from "antd";
import {connect} from "react-redux";
import 'highlight.js/styles/a11y-dark.css';

import CodeBlock from './CodeBlock';
import './preview.module.less';
import '../../assets/less/md.theme.orange.less';
import style from './preview.module.less';
import {AppState} from "../../store";
import MErrorBoundary from '../MErrorBoundary';
import { useDocumentTitle } from '../../tools/hooks';

interface PropsI {
  value: string;
  fullscreen?: boolean;
  articleInfo: Array<ArticleSubI>;
  isLiked: boolean;
  likedCount: number;
  onLikeClick: Function;
  articleId: string;
}

const mapState2Props = (state: AppState) => ({
  articleInfo: state.common.articleInfo,
});

const Header = (props: any) => {
  const { children, level } = props;
  const { value } = children[0]?.props
  const _value = value?.replace(/[/.]/g, '')
  if (level === 1) return <h1 id={_value}>{value}</h1>;
  return (
    <h2 id={_value}>
      <span>{value}</span>
    </h2>
  )
};

const Preview = (props: PropsI) => {
  const [formattedMd, setFormattedMd] = useState<{ head: ArticleSubI; content: string }>();

  useDocumentTitle(formattedMd?.head?.title || 'my blog')

  useEffect(() => {
    const src = props.value.split('---');
    const head = props.articleInfo.find(item => item._id === props.articleId)
      || { title: '', categories: '', createTime: '', tags: '', author: '' };
    setFormattedMd({ head, content: src[2] });
  }, [props.value, props.articleInfo, props.articleId]);

  function onLikeClick() {
    props.onLikeClick()
  }

  return (
    <MErrorBoundary>
      <div className={`container previewC`} id="write" style={{ display: 'block', overflow: "unset" }}>
      {
        formattedMd?.head.title && <div className={style.titleC}>
          <h1>{ formattedMd?.head?.title }</h1>
          <Space style={{ color: '#999' }}>
            { formattedMd?.head?.createTime && <span><UserOutlined /> ??????{ formattedMd?.head?.author }</span> }
            { formattedMd?.head?.createTime && <span><CalendarOutlined /> ?????????{ formattedMd?.head?.createTime }</span> }
            { formattedMd?.head?.updateTime && <span>?????????{ formattedMd?.head?.updateTime }</span>}
            { formattedMd?.head?.categories && <span><FolderOutlined /> ?????????<a href={`/all/category/${formattedMd?.head?.categories}`}>{ formattedMd?.head?.categories }</a></span> }
          </Space>
        </div>
      }
      <ReactMarkdown
        source={formattedMd?.content}
        renderers={{
          code: CodeBlock,
          heading: Header
        }}
      />
    </div>
    <div style={{ textAlign: "center" }}>
      <Button 
        onClick={onLikeClick}
        style={{ outline: 'none', border: "none" }} 
        icon={
          <Badge count={props.likedCount}>
            <LikeOutlined style={{ fontSize: 30, color: props.isLiked ? '#1890ff' : 'rgba(0, 0, 0, 0.65)' }} />
          </Badge>
        }
      />
    </div>
    </MErrorBoundary>
  )
};

export default connect(mapState2Props)(Preview);
