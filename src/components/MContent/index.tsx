import React, { useEffect } from 'react';

import { Tree } from 'antd';
import style from './index.module.less';

interface PropsI {
  data: Array<ContentI>
}

const MContent = (props: PropsI) => {
  useEffect(() => {}, []);
  return (
    <Tree className={style.contentC} treeData={props.data} />
  );
};

export default MContent;
