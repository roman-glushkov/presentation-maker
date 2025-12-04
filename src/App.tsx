// App.tsx
import React from 'react';
import ProjectTitle from './common/components/ProjectTitle';
import Toolbar from './common/components/Toolbar';
import SlidesPanel from './common/components/SlidesPanel';
import Workspace from './common/components/Workspace';
import './appwrite/auth-styles.css';
import './common/view/styles.css';
import useUndoRedoHotkeys from './common/components/Workspace/hooks/useUndoRedoHotkeys';

import AuthWrapper from './appwrite/AuthWrapper';
import { AutoSaveIndicator, ImageUploader, SaveButton } from './appwrite/components';
import { useSelector } from 'react-redux';
import { RootState } from './store';

function AppContent() {
  useUndoRedoHotkeys();
  const currentSlideId = useSelector((state: RootState) => state.editor.selectedSlideId);
  const presentationTitle = useSelector((state: RootState) => state.editor.presentation.title);

  return (
    <div className="container">
      <ProjectTitle />

      {/* Комбинированный тулбар */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Toolbar />
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#334155' }}>
            {presentationTitle}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span
            style={{
              fontSize: '14px',
              color: currentSlideId ? '#64748b' : '#94a3b8',
              fontStyle: !currentSlideId ? 'italic' : 'normal',
            }}
          >
            {currentSlideId ? 'Готов к загрузке' : 'Выберите слайд'}
          </span>
          <ImageUploader />
          <SaveButton /> {/* Добавляем кнопку сохранения */}
        </div>
      </div>

      <div className="main-content">
        <SlidesPanel />
        <Workspace />
      </div>

      <AutoSaveIndicator />
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
