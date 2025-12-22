'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PresentationService, StoredPresentation } from '../services/PresentationService';
import { account, AccountUser } from '../client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  loadDemoPresentation,
  createNewPresentation,
  setPresentationId,
  loadExistingPresentation,
} from '../../store/editorSlice';
import { Presentation } from '../../store/types/presentation';
import NewPresentationModal from './NewPresentationModal';
import { useNotifications } from '../hooks/useNotifications';
import { PRESENTATION_NOTIFICATIONS, NOTIFICATION_TIMEOUT } from '../notifications';
import '../styles/PresentationList.css';

const NotificationIcons = {
  success: '✅',
  info: 'ℹ️',
  error: '❌',
  warning: '⚠️',
};

export default function PresentationList() {
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState<StoredPresentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [showNewPresentationModal, setShowNewPresentationModal] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);

  const validationErrorDetected = useRef(false);
  const notificationsShown = useRef(false);

  const dispatch = useDispatch();
  const currentPresentation = useSelector((state: RootState) => state.editor.presentation);
  const { notifications, addNotification, removeNotification } = useNotifications();

  useEffect(() => {
    account
      .get<AccountUser>()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const originalWarn = console.warn;

    console.warn = function (...args) {
      if (
        args[0] &&
        typeof args[0] === 'string' &&
        args[0].includes('не прошел валидацию') &&
        !validationErrorDetected.current
      ) {
        validationErrorDetected.current = true;
      }
      return;
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  const loadPresentations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    validationErrorDetected.current = false;
    notificationsShown.current = false;

    try {
      const userPresentations = await PresentationService.getUserPresentations(user.$id);
      setPresentations(userPresentations);

      if (userPresentations.length === 0) {
        if (!notificationsShown.current) {
          addNotification(
            PRESENTATION_NOTIFICATIONS.INFO.NO_PRESENTATIONS,
            'info',
            NOTIFICATION_TIMEOUT.INFO
          );
          notificationsShown.current = true;
        }
      } else {
        if (!notificationsShown.current) {
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (validationErrorDetected.current) {
            addNotification(
              PRESENTATION_NOTIFICATIONS.WARNING.VALIDATION_FAILED,
              'warning',
              NOTIFICATION_TIMEOUT.WARNING
            );
          }

          addNotification(
            PRESENTATION_NOTIFICATIONS.SUCCESS.LOADED(userPresentations.length),
            'success',
            NOTIFICATION_TIMEOUT.SUCCESS
          );
          notificationsShown.current = true;
        }
      }
    } catch {
      if (!notificationsShown.current) {
        addNotification(
          PRESENTATION_NOTIFICATIONS.ERROR.LOAD_FAILED,
          'error',
          NOTIFICATION_TIMEOUT.ERROR
        );
        notificationsShown.current = true;
      }
    } finally {
      setLoading(false);
    }
  }, [user, addNotification]);

  useEffect(() => {
    if (user) {
      loadPresentations();
    }
  }, [user, loadPresentations]);

  const handleCreatePresentation = async (title: string) => {
    setCreatingNew(true);
    try {
      dispatch(createNewPresentation());
      const presentationToSave = { ...currentPresentation, title: title || 'Новая презентация' };
      const currentUser = await account.get<AccountUser>();

      const saved = await PresentationService.savePresentation(
        presentationToSave,
        currentUser.$id,
        currentUser.name || currentUser.email || ''
      );

      const loaded = await PresentationService.getPresentation(saved.$id);

      const presForEditor: Presentation = {
        title: loaded.title || 'Без названия',
        slides: loaded.slides || [],
        currentSlideId: loaded.currentSlideId || loaded.slides?.[0]?.id || '',
        selectedSlideIds:
          loaded.selectedSlideIds || (loaded.slides?.[0]?.id ? [loaded.slides[0].id] : []),
      };

      dispatch(loadExistingPresentation(presForEditor));
      dispatch(setPresentationId(saved.$id));

      addNotification(
        PRESENTATION_NOTIFICATIONS.SUCCESS.CREATED,
        'success',
        NOTIFICATION_TIMEOUT.SUCCESS
      );

      loadPresentations();
      navigate(`/editor/${saved.$id}`);
    } catch {
      addNotification(
        PRESENTATION_NOTIFICATIONS.ERROR.CREATE_FAILED,
        'error',
        NOTIFICATION_TIMEOUT.ERROR
      );
    } finally {
      setCreatingNew(false);
      setShowNewPresentationModal(false);
    }
  };

  const handleLoadDemo = () => {
    dispatch(setPresentationId('demo'));
    dispatch(loadDemoPresentation());
    addNotification(PRESENTATION_NOTIFICATIONS.INFO.DEMO_LOADED, 'info', NOTIFICATION_TIMEOUT.INFO);
    navigate('/editor');
  };

  const handleLoadPresentation = async (presentation: StoredPresentation) => {
    try {
      const full = await PresentationService.getPresentation(presentation.id || presentation.$id);
      const presForEditor: Presentation = {
        title: full.title || 'Без названия',
        slides: full.slides || [],
        currentSlideId: full.currentSlideId || full.slides?.[0]?.id || '',
        selectedSlideIds:
          full.selectedSlideIds || (full.slides?.[0]?.id ? [full.slides[0].id] : []),
      };
      dispatch(setPresentationId(full.id || full.$id));
      dispatch(loadExistingPresentation(presForEditor));

      addNotification(
        PRESENTATION_NOTIFICATIONS.SUCCESS.PRESENTATION_LOADED(presForEditor.title),
        'success',
        NOTIFICATION_TIMEOUT.SUCCESS
      );
      navigate(`/editor/${full.id || full.$id}`);
    } catch {
      addNotification(
        PRESENTATION_NOTIFICATIONS.ERROR.LOAD_FAILED,
        'error',
        NOTIFICATION_TIMEOUT.ERROR
      );
    }
  };

  if (!user)
    return (
      <div className="presentation-list-container--empty">
        Войдите, чтобы видеть ваши презентации
      </div>
    );

  return (
    <>
      <div className="presentation-notifications-container">
        {notifications.map(({ id, message, type }) => (
          <div key={id} className={`presentation-notification presentation-notification--${type}`}>
            <div className="presentation-notification-content">
              <span className="presentation-notification-icon">
                {NotificationIcons[type as keyof typeof NotificationIcons] || 'ℹ️'}
              </span>
              <span className="presentation-notification-message">{message}</span>
            </div>
            <button
              className="presentation-notification-close"
              onClick={() => removeNotification(id)}
              aria-label="Закрыть уведомление"
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      <div className="presentation-list-container">
        <div className="presentation-list-header">
          <h2 className="presentation-list-title">Мои презентации</h2>
          <div className="presentation-list-user-info">
            <span className="presentation-list-user-name">{user.name || user.email}</span>
            <button
              className="presentation-list-logout-button"
              onClick={async () => {
                await account.deleteSession('current');
                window.location.href = '/login';
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-log-out"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Выйти
            </button>
          </div>
        </div>

        <div className="presentation-list-buttons-grid">
          <div className="presentation-list-button-wrapper">
            <button
              onClick={() => setShowNewPresentationModal(true)}
              className="presentation-list-button"
              disabled={creatingNew}
            >
              {creatingNew ? 'Создание...' : 'Создать новую'}
            </button>
          </div>

          <div className="presentation-list-button-wrapper">
            <button
              onClick={handleLoadDemo}
              className="presentation-list-button presentation-list-button-demo"
            >
              Демо-презентация
            </button>
          </div>
        </div>

        {loading && (
          <div className="presentation-list-loading">
            <div className="presentation-list-loading-spinner" />
            <p>Загружаем ваши презентации...</p>
          </div>
        )}

        {!loading && presentations.length > 0 && (
          <>
            <div className="presentation-list-count">
              Загружено презентаций: {presentations.length}
              {validationErrorDetected.current && (
                <span
                  style={{
                    fontSize: '12px',
                    color: '#f59e0b',
                    marginLeft: '10px',
                    fontWeight: 'normal',
                  }}
                >
                  (некоторые презентации повреждены)
                </span>
              )}
            </div>

            <div className="presentation-list-grid">
              {presentations.map((pres) => (
                <div
                  key={pres.id || pres.$id}
                  className="presentation-list-card"
                  onClick={() => handleLoadPresentation(pres)}
                >
                  <div
                    className="presentation-list-card-valid"
                    title="Эта презентация прошла проверку валидации"
                  >
                    ✅
                  </div>

                  <div>
                    <h3 className="presentation-list-card-title">{pres.title || 'Без названия'}</h3>

                    <div className="presentation-list-card-meta">
                      <span>📊 {(pres.slides || []).length} слайдов</span>
                      <span>👤 {pres.ownerName || user?.name || user?.email || ''}</span>
                    </div>
                  </div>

                  <div className="presentation-list-card-footer">
                    Обновлено:{' '}
                    {pres.updatedAt
                      ? new Date(pres.updatedAt).toLocaleString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })
                      : 'Нет данных'}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && presentations.length === 0 && (
          <div
            className="presentation-list-container--empty"
            style={{ textAlign: 'center', padding: '40px' }}
          >
            <p>У вас пока нет презентаций</p>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '10px' }}>
              Создайте новую или попробуйте демо-презентацию
            </p>
          </div>
        )}

        {showNewPresentationModal && (
          <NewPresentationModal
            isOpen={showNewPresentationModal}
            onClose={() => setShowNewPresentationModal(false)}
            onCreate={handleCreatePresentation}
            onCancel={() => setShowNewPresentationModal(false)}
          />
        )}
      </div>
    </>
  );
}
