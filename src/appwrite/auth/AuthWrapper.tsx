// appwrite/auth/AuthWrapper.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { account } from '../client';
import { useAutoSave } from '../hooks/useAutoSave';
import { useDispatch, useSelector } from 'react-redux';
import { undo, redo } from '../../store/editorSlice';
import type { RootState } from '../../store';
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSaving, saveNow } = useAutoSave();

  const canUndo = useSelector((state: RootState) => state.editor.history.past.length > 0);
  const canRedo = useSelector((state: RootState) => state.editor.history.future.length > 0);

  const presentation = useSelector((state: RootState) => state.editor.presentation);
  const presentationId = useSelector((state: RootState) => state.editor.presentationId);

  const { addNotification } = useNotifications();

  useEffect(() => {
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

    checkAuth();
  }, []);

  const handleSaveClick = async () => {
    if (!saveNow) return;

    try {
      await saveNow();
      addNotification(GENERAL_NOTIFICATIONS.SUCCESS.SAVED, 'success', NOTIFICATION_TIMEOUT.SUCCESS);
    } catch {
      addNotification(GENERAL_NOTIFICATIONS.ERROR.SAVE_FAILED, 'error', NOTIFICATION_TIMEOUT.ERROR);
    }
  };

  if (!authChecked) {
    return <div className="presentation-loading-container">Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const showToolbar = location.pathname.startsWith('/editor');

  return (
    <>
      {showToolbar && (
        <div className="presentation-toolbar">
          <div className="toolbar-left">
            <button
              onClick={() => navigate('/presentations')}
              className="toolbar-button"
              title="Мои презентации"
            >
              📁
            </button>

            <button
              onClick={handleSaveClick}
              className="toolbar-button"
              title="Сохранить"
              disabled={isSaving}
            >
              {isSaving ? '...' : '💾'}
            </button>

            <button
              onClick={() => {
                if (!presentation) return;

                navigate(presentationId ? `/player/${presentationId}` : '/player', {
                  state: { presentation },
                });
              }}
              className="toolbar-button"
              title="Режим слайд-шоу"
            >
              ▶️
            </button>

            <div className="toolbar-separator" />

            <button onClick={() => dispatch(undo())} className="toolbar-button" disabled={!canUndo}>
              ↶
            </button>

            <button onClick={() => dispatch(redo())} className="toolbar-button" disabled={!canRedo}>
              ↷
            </button>
          </div>
        </div>
      )}

      <div style={showToolbar ? { paddingTop: 60 } : undefined}>{children}</div>
    </>
  );
}
