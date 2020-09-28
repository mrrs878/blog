import React, { ReactText, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Base64 } from 'js-base64';

import MPreview from '../../components/MEditor/Preview';
import MContent from '../../components/MContent';
import MGoTop from '../../components/MGoTop';
import { GET_ARTICLE } from '../../api/article';

interface PropsI extends RouteComponentProps<{ title: string }>{}

const Article = (props: PropsI) => {
  const [md, setMD] = useState<string>('--- ---');
  const [tableOfContent, setTableOfContent] = useState<Array<ContentI>>([]);
  useEffect(() => {
    let mounted = true;
    const title = props.match.params.title.trimStart();
    GET_ARTICLE({ id: title }).then((res) => {
      if (!mounted) return;
      setTableOfContent([]);
      setMD(Base64.decode(res.data.content));
    });
    return () => {
      mounted = false;
    };
  }, [props.match.params.title]);

  function onContentClick(e: Array<ReactText>) {
    const [title] = e;
    const _title = String(title)?.replace(/[/.]/g, '');
    console.log(111);

    document.querySelector(`#${_title}`)?.scrollIntoView({ behavior: 'smooth' });
  }
  return (
    <div style={{ padding: 0, marginTop: 0, position: 'relative' }}>
      <MPreview value={md} fullscreen />
      <MContent data={tableOfContent} onContentClick={onContentClick} />
      <MGoTop referEle=".previewC" />
    </div>
  );
};

export default withRouter(Article);
