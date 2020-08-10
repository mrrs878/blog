import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import {CalendarOutlined, FolderOutlined} from "@ant-design/icons/lib";
import {Space} from "antd";

import CodeBlock from './CodeBlock';
import './preview.module.less'
import '../../assets/less/md.theme.orange.less'
import 'highlight.js/styles/a11y-dark.css'
import style from './preview.module.less'
import {AppState} from "../../store";
import {connect} from "react-redux";

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
  if (level === 1) return <h1>{ children[0]?.props?.value }</h1>;
  return (
    <h2>
      <span>{ children[0]?.props?.value }</span>
    </h2>
  )
};

const Preview = (props: PropsI) => {
  const [formattedMd, setFormattedMd] = useState<{ head: ArticleSubI; content: string }>();
  useEffect(() => {
    const src = props.value.split('---');
    const title = src[1].match(/title: (.+)/) || '';
    const head = props.articleInfo.find(item => item.title === title[1])
      || { title: '', category: '', createTime: '', tag: '' };
    setFormattedMd({ head, content: src[2] });
  }, [props.value, props.articleInfo]);
  useEffect(() => {
    document.title = formattedMd?.head?.title || 'my blog'
  }, [formattedMd]);
  return (
    <div className={`container previewC`} id="write" style={{ display: 'block', overflow: "unset" }}>
      <div className={style.titleC}>
        <h1>{ formattedMd?.head?.title }</h1>
        <Space style={{ color: '#999' }}>
          { formattedMd?.head?.createTime && <span><CalendarOutlined /> 创建于{ formattedMd?.head?.createTime }</span> }
          { formattedMd?.head?.modifyTime && <span>更新于{ formattedMd?.head?.modifyTime }</span>}
          { formattedMd?.head?.category && <span><FolderOutlined /> 分类于<a href={`/category/${formattedMd?.head?.category}`}>{ formattedMd?.head?.category }</a></span> }
        </Space>
      </div>
      <ReactMarkdown
        source={formattedMd?.content}
        renderers={{
          code: CodeBlock,
          heading: Header
        }}
      />
    </div>
  )
};

export default connect(mapState2Props)(Preview);
