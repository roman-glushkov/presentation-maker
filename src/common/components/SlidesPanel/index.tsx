import React from 'react';
import SlidesContainer from './parts/Container';
import useSlidesActions from './hooks/useSlidesActions';
import useSlidesNavigation from './hooks/useSlidesNavigation';
import './styles/index.css';
import './styles/Container.css';
import './styles/Row.css';
import './styles/PreviewWorkspace.css';
import './styles/SlideElements.css';

export default function SlidesPanel() {
  useSlidesActions();
  useSlidesNavigation();

  return (
    <div className="slides-panel">
      <h3>Слайды</h3>
      <SlidesContainer />
    </div>
  );
}
