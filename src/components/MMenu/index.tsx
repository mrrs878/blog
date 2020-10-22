import React, { useCallback, useEffect, useState } from 'react';
import { Input, Menu } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';

import { connect } from 'react-redux';
import style from './index.module.less';
import githubLogo from '../../assets/images/github.jpg';
import npmLogo from '../../assets/images/npm.jpg';
import { AppState } from '../../store';
import { useWindowScroll } from '../../tools/hooks';

interface PropsI extends RouteComponentProps{
  articleInfo: Array<ArticleSubI>;
  user: UserI;
}

const { Search } = Input;

const mapState2Props = (state: AppState) => ({
  articleInfo: state.common.articleInfo,
  user: state.common.user,
});

const MMenu = (props: PropsI) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<Array<string>>([]);
  const [isScroll, setIsScroll] = useState(false);
  const onWindowScroll = useCallback(() => {
    const { y } = document.querySelector('.homeSearchRef')?.getBoundingClientRect() || { y: 0 };
    setIsScroll(y <= -470);
  }, []);

  useWindowScroll(onWindowScroll);

  useEffect(() => {
    if (props.location.pathname === '/') {
      setSelectedMenuItem(['/home']);
      return;
    }
    const paths = props.location.pathname.split('/');
    setSelectedMenuItem([`/${paths[1]}`]);
  }, [props.location]);

  function onMenuItemClick(item: any) {
    props.history.push(item.key);
  }

  function onSearch(e: string) {
    props.history.push(e ? `/home/search/${e}` : '/home');
    window.scrollTo({ top: 0 });
  }

  return (
    <div className={`container ${style.menuC}`}>
      <div className={style.avatarC}>
        <img src="https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg" style={{ borderRadius: '50%' }} height={120} alt="" />
      </div>
      <div className={style.callMeC}>
        <a href="https://github.com/mrrs878">
          <img className={style.callMe} src={githubLogo} width="20%" alt="" />
        </a>
        <a href="https://www.npmjs.com/~mrrs">
          <img className={style.callMe} src={npmLogo} width="20%" alt="" />
        </a>
      </div>
      <Menu mode="inline" selectedKeys={selectedMenuItem} onClick={onMenuItemClick}>
        <Menu.Item key="/home">首页</Menu.Item>
        <Menu.Item key="/about">关于</Menu.Item>
        <Menu.Item key="/tag">标签</Menu.Item>
        <Menu.Item key="/category">分类</Menu.Item>
        <Menu.Item key="/all">归档</Menu.Item>
      </Menu>
      <Search
        className={`${style.searchC} ${isScroll ? style.top : ''}`}
        placeholder="input search text"
        onSearch={onSearch}
        enterButton
      />
    </div>
  );
};

export default connect(mapState2Props)(withRouter(MMenu));
