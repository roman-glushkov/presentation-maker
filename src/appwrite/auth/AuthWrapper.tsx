import React, { useState, useEffect, ReactNode } from 'react';
import { account } from '../client';
import Login from './Login';
import Register from './Register';
import PresentationList from '../components/PresentationList';
import { useAutoSave } from '../hooks/useAutoSave';
import { useDispatch, useSelector } from 'react-redux';
import { setPresentationId, undo, redo } from '../../store/editorSlice';
import type { RootState } from '../../store/index';
import './AuthWrapper.css';

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState<'login' | 'register' | 'presentations'>('login');
  const [currentPresentationId, setCurrentPresentationId] = useState<string | null>(null);

  const { isSaving, saveNow } = useAutoSave();
  const dispatch = useDispatch();

  const canUndo = useSelector((state: RootState) => state.editor.history.past.length > 0);
  const canRedo = useSelector((state: RootState) => state.editor.history.future.length > 0);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await account.get();
      setIsAuthenticated(true);
      setPage('presentations');
    } catch {
      setIsAuthenticated(false);
      setPage('login');
    } finally {
      setAuthChecked(true);
    }
  };

  const handleSelectPresentation = () => {
    setCurrentPresentationId('current');
  };

  const handleReturnToList = () => {
    setCurrentPresentationId(null);
    dispatch(setPresentationId(''));
  };

  const handleSaveClick = async () => {
    if (saveNow) {
      try {
        await saveNow();
      } catch (error) {
        console.error('Ошибка сохранения:', error);
      }
    }
  };

  if (!authChecked) {
    return (
      <div className="presentation-loading-container">
        <div className="presentation-loading-content">
          <div className="presentation-loading-logo">SlideCraft</div>
          <div className="presentation-loading-dots">
            <div className="presentation-loading-dot"></div>
            <div className="presentation-loading-dot"></div>
            <div className="presentation-loading-dot"></div>
          </div>
          <p className="presentation-loading-text">Загружаем вашу презентацию...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return page === 'login' ? (
      <Login onSuccess={checkAuth} switchToRegister={() => setPage('register')} />
    ) : (
      <Register onSuccess={checkAuth} switchToLogin={() => setPage('login')} />
    );
  }

  if (!currentPresentationId) {
    return (
      <div className="presentation-body">
        <PresentationList onSelect={handleSelectPresentation} />
      </div>
    );
  }

  return (
    <div className="presentation-body" style={{ paddingTop: '60px' }}>
      <div className="presentation-toolbar">
        <div className="toolbar-left">
          <button onClick={handleReturnToList} className="toolbar-button" title="Мои презентации">
            <span className="toolbar-icon">📁</span>
          </button>

          <button
            onClick={handleSaveClick}
            className="toolbar-button"
            title="Сохранить"
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="saving-spinner"></span>
            ) : (
              <span className="toolbar-icon">💾</span>
            )}
          </button>

          <div className="toolbar-separator"></div>

          <button
            onClick={() => dispatch(undo())}
            className="toolbar-button"
            title="Отменить (Ctrl+Z)"
            disabled={!canUndo}
            style={{ opacity: canUndo ? 1 : 0.5 }}
          >
            <span className="toolbar-icon">↶</span>
          </button>

          <button
            onClick={() => dispatch(redo())}
            className="toolbar-button"
            title="Вернуть (Ctrl+Y)"
            disabled={!canRedo}
            style={{ opacity: canRedo ? 1 : 0.5 }}
          >
            <span className="toolbar-icon">↷</span>
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
