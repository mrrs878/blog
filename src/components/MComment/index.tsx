import React, { useState } from 'react';
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
  const [comment, setComment] = useState('111');

  return (
    <div className="container">
      <textarea style={{ border: '1px solid #ccc', borderRadius: '10px', height: '100px', outline: 'none', padding: '10px' }} placeholder="说点什么吧..." />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="small" type="primary" style={{ marginTop: '20px' }}>
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
