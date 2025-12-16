import React, { useState, useEffect, ReactNode } from 'react';
import { account } from '../client';
import Login from './Login';
import Register from './Register';
import PresentationList from '../components/PresentationList';
import { useAutoSave } from '../hooks/useAutoSave';
import { useDispatch, useSelector } from 'react-redux';
import { setPresentationId, undo, redo } from '../../store/editorSlice';
import type { RootState } from '../../store/index';
import { useNotifications } from '../hooks/useNotifications';
import { NOTIFICATION_TIMEOUT, GENERAL_NOTIFICATIONS } from '../notifications/messages';
import '../styles/AuthWrapper.css';

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

  const { notifications, addNotification, removeNotification, clearNotifications } =
    useNotifications();

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
    if (!saveNow) return;

    try {
      await saveNow();
      addNotification(GENERAL_NOTIFICATIONS.SUCCESS.SAVED, 'success', NOTIFICATION_TIMEOUT.SUCCESS);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      addNotification(GENERAL_NOTIFICATIONS.ERROR.SAVE_FAILED, 'error', NOTIFICATION_TIMEOUT.ERROR);
    }
  };

  const renderWithNotifications = (content: ReactNode) => (
    <div className="presentation-body">
      <div className="presentation-notifications-container">
        {notifications.map(({ id, message, type }) => (
          <div key={id} className={`presentation-notification presentation-notification--${type}`}>
            <div className="presentation-notification-content">
              <svg
                className="presentation-notification-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="presentation-notification-message">{message}</span>
            </div>
            <button
              className="presentation-notification-close"
              onClick={() => removeNotification(id)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
      {content}
    </div>
  );

  if (!authChecked) {
    return renderWithNotifications(
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
    return renderWithNotifications(
      page === 'login' ? (
        <Login onSuccess={checkAuth} switchToRegister={() => setPage('register')} />
      ) : (
        <Register onSuccess={checkAuth} switchToLogin={() => setPage('login')} />
      )
    );
  }

  if (!currentPresentationId) {
    return renderWithNotifications(<PresentationList onSelect={handleSelectPresentation} />);
  }

  return renderWithNotifications(
    <div style={{ paddingTop: '60px' }}>
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
