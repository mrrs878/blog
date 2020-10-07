import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import useRequest from '../../../hooks/useRequest';
import { LOGIN } from '../../../api/auth';
import MAIN_CONFIG from '../../../config';
import store from '../../../store';
import { UPDATE_USER } from '../../../store/actions';

const layout = {
  labelCol: { span: 3, offset: 7 },
  wrapperCol: { span: 4 },
};
const tailLayout = {
  wrapperCol: { offset: 11, span: 2 },
};

interface PropsI extends RouteComponentProps<any, any> {
}

const Index = (props: PropsI) => {
  const [, loginRes, login] = useRequest<LoginReqI, LoginResI>(LOGIN, { name: '', password: '' }, false);
  useEffect(() => {
    if (!loginRes) return;
    message.info(loginRes.msg);
    if (!loginRes.success) return;
    console.log(loginRes);
    localStorage.setItem(MAIN_CONFIG.TOKEN_NAME, loginRes.data.token);
    store.dispatch({ type: UPDATE_USER, data: loginRes.data });
    props.history.replace('/');
  }, [loginRes, props.history]);

  async function onFinish(values: any) {
    login({ name: values.username, password: values.password });
  }
  function onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  }

  return (
    <div className="container" style={{ justifyContent: 'center', marginTop: 0, height: '100vh', width: '100vw' }}>
      <Form
        labelCol={layout.labelCol}
        wrapperCol={layout.wrapperCol}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={tailLayout.wrapperCol}>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default withRouter(Index);