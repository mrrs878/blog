import React, { useEffect, useState } from 'react';
import { clone } from 'ramda';
import TestMd from '../../assets/markdown/articles/服务端渲染-简介.md';
import MPreview from '../../components/MEditor/Preview';
import MContent from '../../components/MContent';
import MGoTop from '../../components/MGoTop';

function getTitle(_content: string) {
  const tmpArr: Array<ContentI> = [];
  const content = clone(_content);
  let tmp: ContentI = { title: '', level: 2, key: '', children: [] };
  content.replace(/(#+)[^#][^\n]*?(?:\n)/g, (match, m1) => {
    const title = match.replace('\n', '')
      .replace(/^#+/, '')
      .replace(/\([^)]*?\)/, '');
    const level = m1.length;
    const item = {
      title,
      level,
      key: title,
      children: [],
    };
    if (level <= tmp.level) {
      tmpArr.push(item);
      tmp = item;
    } else tmp.children.push(item);
    return '';
  });

  return tmpArr;
}

const Article = () => {
  const [tableOfContent, setTableOfContent] = useState<Array<ContentI>>([]);
  useEffect(() => {
    const res = getTitle(TestMd);
    setTableOfContent(res);
  }, []);
  return (
    <div style={{ padding: 0, marginTop: 0, position: 'relative' }}>
      <MPreview value={TestMd} fullscreen />
      <MContent data={tableOfContent} />
      <MGoTop referEle=".previewC" />
    </div>
  );
};

export default Article;
