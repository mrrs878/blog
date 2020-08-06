import React from 'react';
import aboutMe from '../../assets/markdown/about.md';
import MPreview from '../../components/MEditor/Preview';

const About = () => (
  <div className="container">
    <MPreview value={aboutMe} fullscreen />
  </div>
);

export default About;
