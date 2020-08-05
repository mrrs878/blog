import React, { useEffect, useState } from 'react';

import MPreview from '../../components/MEditor/Preview';
import TestMd from '../../assets/markdown/test.md';
import MContent from '../../components/MContent';

interface PropsI {
}

function getTitle(content: string) {
  const tmpArr: Array<ContentI> = [];
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

const Index: React.FC<PropsI> = () => {
  const [tableOfContent, setTableOfContent] = useState<Array<ContentI>>([]);
  useEffect(() => {
    const res = getTitle(TestMd);
    console.log(res);
    setTableOfContent(res);
  }, []);
  return (
    <div className="container" style={{ padding: 0, marginTop: 0 }}>
      <MPreview value={TestMd} fullscreen />
      <MContent data={tableOfContent} />
    </div>
  );
};

export default Index;
