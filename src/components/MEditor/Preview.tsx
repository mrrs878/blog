import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import './preview.module.less'
import '../../assets/less/md.theme.orange.less'

interface PropsI {
  value: string;
  fullscreen?: boolean;
}

const Preview = (props: PropsI) => (
  <div className={`container`} id="write" style={{ display: 'block', overflow: "unset" }}>
    <ReactMarkdown
      source={props.value}
      renderers={{ code: CodeBlock }}
    />
  </div>
);

export default Preview;
