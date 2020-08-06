import React, { useEffect, useState } from 'react';

import style from './index.module.less';

interface PropsI {
  referEle: string
}

const MGoTop = (props: PropsI) => {
  const [isScroll, setIsScroll] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      const { y } = document.querySelector(props.referEle)?.getBoundingClientRect() || { y: 0 };
      setIsScroll(y <= -470);
    });
  });
  function onGoTopClick() {
    window.scrollTo({ top: 0 });
  }
  return (
    <div className="container">
      {
        isScroll && (
          <div className={style.gotTopC} onClick={onGoTopClick}>
            go top
          </div>
        )
      }
    </div>
  );
};

export default MGoTop;
