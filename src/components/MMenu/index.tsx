import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { ClickParam } from 'antd/es/menu';

import style from './index.module.less';
import avatarImg from '../../assets/images/avatar.png';
import githubLogo from '../../assets/images/github.jpg';

interface PropsI extends RouteComponentProps{}

const MMenu = (props: PropsI) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<Array<string>>([]);
  useEffect(() => {
    if (props.location.pathname === '/') {
      setSelectedMenuItem(['/home']);
      return;
    }
    const paths = props.location.pathname.split('/');
    setSelectedMenuItem([`/${paths[1]}`]);
  }, [props.location]);
  function onMenuItemClick(item: ClickParam) {
    props.history.push(item.key);
  }
  return (
    <div className={`container ${style.menuC}`}>
      <div className={style.avatarC}>
        <img src={avatarImg} style={{ borderRadius: '50%' }} height={120} alt="" />
      </div>
      <a className={style.callMeC} href="https://github.com/mrrs878">
        <img className={style.callMe} src={githubLogo} width="20%" alt="" />
      </a>
      <Menu mode="inline" selectedKeys={selectedMenuItem} onClick={onMenuItemClick}>
        <Menu.Item key="/home">首页</Menu.Item>
        <Menu.Item key="/about">关于</Menu.Item>
        <Menu.Item key="/tag">标签</Menu.Item>
        <Menu.Item key="/category">分类</Menu.Item>
        <Menu.Item key="/all">归档</Menu.Item>
      </Menu>
    </div>
  );
};

export default withRouter(MMenu);
