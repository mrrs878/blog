import React, { useCallback, useEffect } from 'react';
import { Button, message } from 'antd';
import { connect } from 'react-redux';
import { when } from 'ramda';
import { AppState } from '../../store';
import useRequest from '../../hooks/useRequest';
import { useInputValue } from '../../tools/hooks';
import { ADD_COMMENT, GET_COMMENTS } from '../../api/comment';
import { isTruth } from '../../tools';

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
          <span style={{ width: '80px' }}>
            {
              `${props.comments.length - index}# ${item.creator.name}`
            }
            :
          </span>
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
  const [, addCommentRes, addComment] = useRequest(ADD_COMMENT, undefined, false);
  const [, getCommentsRes, , reGetComments] = useRequest(GET_COMMENTS, { id: props.articleId });
  const [commentVal, onCommentInputChange, setCommentVal] = useInputValue('');

  useEffect(() => {
    when(isTruth, message.info, addCommentRes?.msg);
    when(isTruth, reGetComments, addCommentRes?.success);
  }, [addCommentRes, props.articleId, reGetComments]);

  const onPublishClick = useCallback(() => {
    const creator_id = props.user._id;
    const article_id = props.articleId;
    addComment({ creator_id, content: commentVal, article_id });
    setCommentVal('');
  }, [addComment, commentVal, props.articleId, props.user._id, setCommentVal]);

  return (
    <div className="container">
      <MComment comments={getCommentsRes?.data || []} />
      <textarea
        value={commentVal}
        style={{ border: '1px solid #ccc', borderRadius: '10px', height: '100px', outline: 'none', padding: '10px' }}
        placeholder="说点什么吧..."
        onChange={onCommentInputChange}
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
