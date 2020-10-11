import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button, message } from 'antd';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import useRequest from '../../hooks/useRequest';
import { ADD_COMMENT, GET_COMMENTS } from '../../api/comment';

interface PropsI {
  user: UserI;
  articleId: string;
}

const mapState2Props = (state: AppState) => ({
  user: state.common.user,
});

const MComment = (props: { comments: Array<CommentI> }) => (
  <div>
    <h2 style={{ fontWeight: 700 }}>评论:</h2>
    {
      props.comments.map((item, index) => (
        <div
          key={item._id}
          style={{ display: 'flex', margin: '20px 0', alignItems: 'center' }}
        >
          <span style={{ width: '60px' }}>
            {
              `${props.comments.length - index}# ${item.name}`
            }
          </span>
          :
          <div style={{ flex: '1', padding: '10px', margin: '0 20px', backgroundColor: '#f6f6f6', borderRadius: '10px' }}>
            {item.content}
          </div>
          {
            item.createTime
          }
        </div>
      ))
    }
  </div>
);

const MCommentPannel = (props: PropsI) => {
  const [comment, setComment] = useState('');
  const inputRel = useRef<HTMLTextAreaElement>(null);
  const [, addCommentRes, addComment] = useRequest<AddCommentReqI, AddCommentResI>(ADD_COMMENT, undefined, false);
  const [, getCommentsRes, reGetComments] = useRequest<GetCommentsReqI, GetCommentsResI>(GET_COMMENTS, { id: props.articleId });

  useEffect(() => {
    if (!addCommentRes) return;
    message.info(addCommentRes.msg);
    if (addCommentRes.success) {
      setComment('');
      if (inputRel.current) inputRel.current.value = '';
      reGetComments({ id: props.articleId });
    }
  }, [addCommentRes, props.articleId, reGetComments]);

  const onInputChange = useCallback(() => {
    setComment(() => inputRel?.current?.value || '');
  }, []);

  const onPublishClick = useCallback(() => {
    const user_id = props.user._id;
    const { name } = props.user;
    const article_id = props.articleId;
    const avatar = '';
    if (props.user.token) addComment({ user_id, content: comment, article_id, name, avatar });
    else {
      console.log(111);
    }
  }, [addComment, comment, props.articleId, props.user]);

  return (
    <div className="container">
      <MComment comments={getCommentsRes?.data || []} />
      <textarea
        ref={inputRel}
        style={{ border: '1px solid #ccc', borderRadius: '10px', height: '100px', outline: 'none', padding: '10px' }}
        placeholder="说点什么吧..."
        onChange={onInputChange}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onPublishClick} size="small" type="primary" style={{ marginTop: '20px' }}>
          {
            props.user.token
              ? `发表
              by:
              ${props.user.name}`
              : '登录'
          }
        </Button>
      </div>
    </div>
  );
};

export default connect(mapState2Props)(MCommentPannel);
