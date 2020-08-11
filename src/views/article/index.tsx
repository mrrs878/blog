import React, { useEffect, useState } from 'react';
import { clone } from 'ramda';
import { RouteComponentProps, withRouter } from 'react-router';

import MPreview from '../../components/MEditor/Preview';
import MContent from '../../components/MContent';
import MGoTop from '../../components/MGoTop';
import ARTICLE_MODULE from '../../modules/article';

interface PropsI extends RouteComponentProps<{ title: string }>{}

function getTitle(_content: string) {
  const tmpArr: Array<ContentI> = [];
  const content = clone(_content);
  let tmp: ContentI = { title: '', level: 2, key: '', children: [] };
  content.replace(/```([\s\S][^```]*)```/g, '')
    .replace(/(#+)[^#][^\n]*?(?:\n)/g, (match, m1) => {
      const title = match.replace('\n', '')
        .replace(/[#*\][]/g, '')
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

const Article = (props: PropsI) => {
  const [md, setMD] = useState<string>('--- ---');
  const [tableOfContent, setTableOfContent] = useState<Array<ContentI>>([]);
  useEffect(() => {
    const title = props.match.params.title.trimStart();
    import(`../../assets/markdown/articles/${title}.md`).then((res) => {
      const content = getTitle(res.default);
      setTableOfContent(content);
      setMD(res.default);
      ARTICLE_MODULE.getArticleUpdateDate(props.match.params.title);
    });
  }, [props.match.params.title]);
  return (
    <div style={{ padding: 0, marginTop: 0, position: 'relative' }}>
      <MPreview value={md} fullscreen />
      <MContent data={tableOfContent} />
      <MGoTop referEle=".previewC" />
    </div>
  );
};

export default withRouter(Article);
