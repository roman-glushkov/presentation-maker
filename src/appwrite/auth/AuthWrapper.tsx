// appwrite/auth/AuthWrapper.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { account } from '../client';
import { useAutoSave } from '../hooks/useAutoSave';
import { useDispatch, useSelector } from 'react-redux';
import { undo, redo } from '../../store/editorSlice';
import type { RootState } from '../../../store';
import { useNotifications } from '../hooks/useNotifications';
import { NOTIFICATION_TIMEOUT, GENERAL_NOTIFICATIONS } from '../notifications/messages';
import '../styles/AuthWrapper.css';

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  const { isSaving, saveNow } = useAutoSave();
  const dispatch = useDispatch();

  const canUndo = useSelector((state: RootState) => state.editor.history.past.length > 0);
  const canRedo = useSelector((state: RootState) => state.editor.history.future.length > 0);

  const { notifications, addNotification, removeNotification } = useNotifications();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await account.get();
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthChecked(true);
    }
  };

  const handleSaveClick = async () => {
    if (!saveNow) return;

    try {
      await saveNow();
      addNotification(GENERAL_NOTIFICATIONS.SUCCESS.SAVED, 'success', NOTIFICATION_TIMEOUT.SUCCESS);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      addNotification(GENERAL_NOTIFICATIONS.ERROR.SAVE_FAILED, 'error', NOTIFICATION_TIMEOUT.ERROR);
    }
  };

  if (!authChecked) {
    return (
      <div className="presentation-body">
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
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если пользователь аутентифицирован, показываем children с тулбаром (если в редакторе)
  const showToolbar = location.pathname.startsWith('/editor');

  return (
    <>
      {showToolbar && (
        <div className="presentation-toolbar">
          <div className="toolbar-left">
            <button
              onClick={() => (window.location.href = '/presentations')}
              className="toolbar-button"
              title="Мои презентации"
            >
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
      )}

      <div style={showToolbar ? { paddingTop: '60px' } : {}}>{children}</div>
    </>
  );
}
