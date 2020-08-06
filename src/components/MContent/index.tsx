import React, { useEffect, useState } from 'react';

import { Tree } from 'antd';
import style from './index.module.less';

interface PropsI {
  data: Array<ContentI>
}

const MContent = (props: PropsI) => {
  const [isScroll, setIsScroll] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', (e) => {
      const { y } = document.querySelector('.previewC')?.getBoundingClientRect() || { y: 0 };
      setIsScroll(y <= -470);
    });
  }, []);
  return (
    <Tree expandedKeys={props.data.map((item) => item.key)} className={`${style.contentC} ${isScroll ? style.top : ''}`} treeData={props.data} />
  );
};

export default MContent;
