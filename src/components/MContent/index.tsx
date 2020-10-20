import React, { ReactText, useState, useCallback } from 'react';

import { Tree } from 'antd';
import style from './index.module.less';
import { useWindowScroll } from '../../tools/hooks';

interface PropsI {
  data: Array<ContentI>;
  onContentClick: (e: Array<ReactText>) => void;
}

const MContent = (props: PropsI) => {
  const [isScroll, setIsScroll] = useState(false);
  const onScroll = useCallback(() => {
    const { y } = document.querySelector('.previewC')?.getBoundingClientRect() || { y: 0 };
    setIsScroll(y <= -470);
  }, []);

  useWindowScroll(onScroll);

  return (
    <div>
      { props.data.length > 0
      && (
      <Tree
        expandedKeys={props.data.map((item) => item.key)}
        className={`${style.contentC} ${isScroll ? style.top : ''}`}
        treeData={props.data}
        onSelect={props.onContentClick}
      />
      )}
    </div>
  );
};

export default MContent;
