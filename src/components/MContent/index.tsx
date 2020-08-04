import React, { useEffect } from 'react';

import style from './index.module.less';

const MContent = () => {
  useEffect(() => {}, []);
  return (
    <div className={`content ${style.contentC}`}>this is table of contents</div>
  );
};

export default MContent;
