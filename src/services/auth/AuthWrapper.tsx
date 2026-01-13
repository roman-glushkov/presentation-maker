import React, { useState, useEffect, ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { account } from '../client';
import { useAutoSave } from '../hooks/useAutoSave';
import { useDispatch, useSelector } from 'react-redux';
import { undo, redo } from '../../store/editorSlice';
import type { RootState } from '../../store';
import { useNotifications } from '../hooks/useNotifications';
import { NOTIFICATION_TIMEOUT, GENERAL_NOTIFICATIONS } from '../notifications';
import type { Notification } from '../notifications/types';
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

  const { notifications, addNotification, removeNotification } = useNotifications();

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

  const handlePlayClick = () => {
    if (!presentation) return;

    const targetPath = presentationId ? `/player/${presentationId}` : '/player';
    navigate(targetPath, { state: { presentation } });
  };

  const renderNotification = ({ id, message, type }: Notification) => (
    <div key={id} className={`presentation-notification presentation-notification--${type}`}>
      <div className="presentation-notification-content">
        <svg
          className="presentation-notification-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          {type === 'success' ? (
            <path
              d="M20 6L9 17l-5-5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
        <span className="presentation-notification-message">{message}</span>
      </div>
      <button className="presentation-notification-close" onClick={() => removeNotification(id)}>
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
  );

  const renderLoadingScreen = () => (
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

  const renderToolbarButton = (
    onClick: () => void,
    icon: string,
    title: string,
    disabled = false,
    className = ''
  ) => (
    <button
      onClick={onClick}
      className={`toolbar-button ${className}`}
      title={title}
      disabled={disabled}
    >
      <span className="toolbar-icon">{icon}</span>
    </button>
  );

  const renderWithNotifications = (content: ReactNode) => (
    <div className="presentation-body">
      <div className="presentation-notifications-container">
        {notifications.map((n: Notification) => renderNotification(n))}
      </div>
      {content}
    </div>
  );

  if (!authChecked) {
    return renderWithNotifications(renderLoadingScreen());
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const showToolbar = location.pathname.startsWith('/editor');

  return renderWithNotifications(
    <>
      {showToolbar && (
        <div className="presentation-toolbar">
          <div className="toolbar-left">
            {renderToolbarButton(() => navigate('/presentations'), '📁', 'Мои презентации')}

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

            {renderToolbarButton(handlePlayClick, '▶️', 'Режим слайд-шоу')}

            <div className="toolbar-separator"></div>

            {renderToolbarButton(
              () => dispatch(undo()),
              '↶',
              'Отменить (Ctrl+Z)',
              !canUndo,
              canUndo ? 'toolbar-button--active' : 'toolbar-button--disabled'
            )}

            {renderToolbarButton(
              () => dispatch(redo()),
              '↷',
              'Вернуть (Ctrl+Y)',
              !canRedo,
              canRedo ? 'toolbar-button--active' : 'toolbar-button--disabled'
            )}
          </div>
        </div>
      )}

      <div className={showToolbar ? 'presentation-content-with-toolbar' : ''}>{children}</div>
    </>
  );
}
