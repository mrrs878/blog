import React, { ReactText, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Base64 } from 'js-base64';

import { clone } from 'ramda';
import MPreview from '../../components/MEditor/Preview';
import MContent from '../../components/MContent';
import MGoTop from '../../components/MGoTop';
import { GET_ARTICLE } from '../../api/article';
import MCommentPannel from '../../components/MComment';

interface PropsI extends RouteComponentProps<{ title: string }>{}

function getContent(_content: string) {
  const tmpArr: Array<ContentI> = [];
  const content = clone(_content);
  let tmp: ContentI = { title: '', level: 2, key: '', children: [] };
  content.replace(/```([\s\S][^```]*)```/g, '')
    .replace(/(#+) [^#][^\n]*?(?:\n)/g, (match, m1) => {
      const title = match.replace('\n', '')
        .replace(/[#*\][]/g, '')
        .replace(/\([^)]*?\)/, '').trim();
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
    let mounted = true;
    const { title } = props.match.params;
    GET_ARTICLE({ id: title }).then((res) => {
      if (!mounted) return;
      const content = Base64.decode(res.data.content || '');
      setTableOfContent(getContent(content));
      setMD(content);
    });
    return () => {
      mounted = false;
    };
  }, [props.match.params]);

  function onContentClick(e: Array<ReactText>) {
    const [id] = e;
    const _id = String(id)?.replace(/[/.]/g, '');
    document.querySelector(`#${_id}`)?.scrollIntoView({ behavior: 'smooth' });
  }
  return (
    <div style={{ padding: 0, marginTop: 0, position: 'relative' }}>
      <MPreview value={md} fullscreen />
      <MContent data={tableOfContent} onContentClick={onContentClick} />
      <MCommentPannel articleId={props.match.params.title} />
      <MGoTop referEle=".previewC" />
    </div>
  );
};

export default withRouter(Article);
