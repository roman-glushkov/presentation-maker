import React from 'react';
import Toolbar from './common/components/Toolbar';
import SlidesPanel from './common/components/SlidesPanel';
import Workspace from './common/components/Workspace';
import './appwrite/AuthStyles.css';
import './common/view/styles.css';
import useUndoRedoHotkeys from './common/components/Workspace/hooks/useUndoRedoHotkeys';
import AuthWrapper from './appwrite/AuthWrapper';

function AppContent() {
  useUndoRedoHotkeys();

  return (
    <div className="container">
      <Toolbar />

      <div className="main-content">
        <SlidesPanel />
        <Workspace />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthWrapper>
      <AppContent />
    </AuthWrapper>
  );
}
