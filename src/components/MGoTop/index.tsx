import React, { useCallback, useState } from 'react';
import { useWindowScroll } from '../../tools/hooks';

import style from './index.module.less';

interface PropsI {
  referEle: string
}

const MGoTop = (props: PropsI) => {
  const [isScroll, setIsScroll] = useState(false);
  const onScroll = useCallback(() => {
    const { y } = document.querySelector(props.referEle)?.getBoundingClientRect() || { y: 0 };
    setIsScroll(y <= -470);
  }, [props.referEle]);

  useWindowScroll(onScroll);

  const onGoTopClick = useCallback(() => {
    window.scrollTo({ top: 0 });
  }, []);

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
