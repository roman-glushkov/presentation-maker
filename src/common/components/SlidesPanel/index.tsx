import React from 'react';
import SlidesContainer from './parts/Container';
import './styles.css';

export default function SlidesPanel() {
  return (
    <div className="slides-panel">
      <h3>Слайды</h3>
      <SlidesContainer />
    </div>
  );
}
