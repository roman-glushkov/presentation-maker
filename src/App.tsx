import React from 'react';
import ProjectTitle from './common/components/ProjectTitle';
import Toolbar from './common/components/Toolbar';
import SlidesPanel from './common/components/SlidesPanel';
import Workspace from './common/components/Workspace';
import './common/view/styles.css';
import useUndoRedoHotkeys from './common/components/Workspace/hooks/useUndoRedoHotkeys';

function App() {
  useUndoRedoHotkeys();
  return (
    <div className="container">
      <ProjectTitle />
      <Toolbar />
      <div className="main-content">
        <SlidesPanel />
        <Workspace />
      </div>
    </div>
  );
}

export default App;
