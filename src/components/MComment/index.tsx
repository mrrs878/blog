import React, { useState, useCallback, useRef } from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { AppState } from '../../store';

interface PropsI {
  user: UserI
}

const mapState2Props = (state: AppState) => ({
  user: state.common.user,
});

const MComment = (props: PropsI) => {
  const [comment, setComment] = useState('');
  const inputRel = useRef<HTMLTextAreaElement>(null);

  const onInputChange = useCallback(() => {
    setComment(() => inputRel?.current?.value || '');
  }, []);

  const onPublishClick = useCallback(() => {
    console.log(comment);
  }, [comment]);

  return (
    <div className="container">
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

export default connect(mapState2Props)(MComment);
