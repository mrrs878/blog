import React from 'react';
import { useInputValue, useInternetStateChange, useWindowSizeChange } from '../../tools/hooks';

const About = () => {
  const [value, onChange] = useInputValue('111');
  const windowSize = useWindowSizeChange();
  const internetState = useInternetStateChange();
  return (
    <div className="container">
      <p>{value}</p>
      <p>{windowSize.innerHeight}</p>
      <p>{internetState}</p>
      <input type="text" value={value} onChange={onChange} />
    </div>
  );
};

export default About;
