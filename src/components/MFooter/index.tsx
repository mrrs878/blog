import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';

const mapState2Props = (state: AppState) => ({
  totalWord: state.common.totalWord,
});

interface PropsI {
  totalWord: number
}

const MFooter = (props: PropsI) => (
  <footer className="container" style={{ backgroundColor: 'rgba(0, 0, 0, 0)', textAlign: 'center', marginLeft: '210px' }}>
    <span>
      博客全站共：
      { props.totalWord / 1000 >> 0 }
      k字
    </span>
    <span id="busuanzi_container_site_pv">
      本站访客数:
      <span id="busuanzi_value_site_pv" />
    </span>
    <span>Powered By Mr.RS</span>
  </footer>
);

export default connect(mapState2Props)(MFooter);
