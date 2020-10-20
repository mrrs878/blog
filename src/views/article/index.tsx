import React, { ReactText, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Base64 } from 'js-base64';

import { clone } from 'ramda';
import { message } from 'antd';
import { connect } from 'react-redux';
import MPreview from '../../components/MEditor/Preview';
import MContent from '../../components/MContent';
import MGoTop from '../../components/MGoTop';
import { GET_ARTICLE } from '../../api/article';
import MCommentPannel from '../../components/MComment';
import useRequest from '../../hooks/useRequest';
import { GET_ARTICLE_LIKES, LIKE, UN_LIKE } from '../../api/like';
import { AppState } from '../../store';

interface PropsI extends RouteComponentProps<{ title: string }>{
  user: UserI;
}

const mapState2Props = (state: AppState) => ({
  user: state.common.user,
});

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
  const [, getLikesRes, , reGetLikes] = useRequest(GET_ARTICLE_LIKES, { id: props.match.params.title }, true);
  const [, likeRes, like] = useRequest(LIKE, undefined, false);
  const [, unRikeRes, unlike] = useRequest(UN_LIKE, undefined, false);
  const [, getArticleRes] = useRequest(GET_ARTICLE, { id: props.match.params.title }, true);
  const [isLiked, setIsLiked] = useState(false);
  const [tableOfContent, setTableOfContent] = useState<Array<ContentI>>([]);

  useEffect(() => {
    if (!getLikesRes || !getLikesRes.success) return;
    setIsLiked(getLikesRes.data.findIndex((item) => item.name === props.user.name) !== -1);
  }, [getLikesRes, props.user.name]);

  useEffect(() => {
    if (!likeRes) return;
    message.info(likeRes.msg);
    reGetLikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likeRes]);

  useEffect(() => {
    if (!unRikeRes) return;
    message.info(unRikeRes.msg);
    reGetLikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unRikeRes]);

  useEffect(() => {
    if (!getArticleRes) return;
    if (!getArticleRes.success) {
      message.info(getArticleRes.msg);
      return;
    }
    const content = Base64.decode(getArticleRes.data.content || '');
    setTableOfContent(getContent(content));
    setMD(content);
  }, [getArticleRes]);

  function onContentClick(e: Array<ReactText>) {
    const [id] = e;
    const _id = String(id)?.replace(/[/.]/g, '');
    document.querySelector(`#${_id}`)?.scrollIntoView({ behavior: 'smooth' });
  }

  function onLikeClick() {
    if (isLiked) {
      unlike({ article_id: props.match.params.title });
    } else {
      like({ article_id: props.match.params.title });
    }
  }

  return (
    <div style={{ padding: 0, marginTop: 0, position: 'relative' }}>
      <MPreview value={md} articleId={props.match.params.title} fullscreen isLiked={isLiked} onLikeClick={onLikeClick} likedCount={getLikesRes?.data?.length || 0} />
      <MContent data={tableOfContent} onContentClick={onContentClick} />
      <MCommentPannel articleId={props.match.params.title} />
      <MGoTop referEle=".previewC" />
    </div>
  );
};

export default connect(mapState2Props)(withRouter(Article));
