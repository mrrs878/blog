import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import {CalendarOutlined, FolderOutlined} from "@ant-design/icons/lib";
import {Space} from "antd";
import {connect} from "react-redux";

import CodeBlock from './CodeBlock';
import './preview.module.less';
import 'highlight.js/styles/a11y-dark.css';
import '../../assets/less/md.theme.orange.less';
import style from './preview.module.less';
import {AppState} from "../../store";
import MErrorBoundary from '../MErrorBoundary';

interface PropsI {
  value: string;
  fullscreen?: boolean;
  articleInfo: Array<ArticleSubI>;
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
  useEffect(() => {
    const src = props.value.split('---');
    const title = src[1].match(/title: (.+)/) || '';
    const head = props.articleInfo.find(item => item.title === title[1])
      || { title: '', categories: '', createTime: '', tag: '' };
    setFormattedMd({ head, content: src[2] });
  }, [props.value, props.articleInfo]);
  useEffect(() => {
    document.title = formattedMd?.head?.title || 'my blog'
  }, [formattedMd]);
  return (
    <MErrorBoundary>
      <div className={`container previewC`} id="write" style={{ display: 'block', overflow: "unset" }}>
      {
        formattedMd?.head.title && <div className={style.titleC}>
          <h1>{ formattedMd?.head?.title }</h1>
          <Space style={{ color: '#999' }}>
            { formattedMd?.head?.createTime && <span><CalendarOutlined /> 创建于{ formattedMd?.head?.createTime }</span> }
            { formattedMd?.head?.updateTime && <span>更新于{ formattedMd?.head?.updateTime }</span>}
            { formattedMd?.head?.categories && <span><FolderOutlined /> 分类于<a href={`/all/category/${formattedMd?.head?.categories}`}>{ formattedMd?.head?.categories }</a></span> }
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
    </MErrorBoundary>
  )
};

export default connect(mapState2Props)(Preview);
