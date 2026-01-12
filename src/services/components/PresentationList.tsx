'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PresentationService, StoredPresentation } from '../services/PresentationService';
import { account, AccountUser } from '../client';
import { useDispatch } from 'react-redux';
import {
  loadDemoPresentation,
  setPresentationId,
  loadExistingPresentation,
} from '../../store/editorSlice';
import { Presentation } from '../../store/types/presentation';
import NewPresentationModal from './NewPresentationModal';
import EditPresentationModal from './EditPresentationModal';
import { useNotifications } from '../hooks/useNotifications';
import { PRESENTATION_NOTIFICATIONS, NOTIFICATION_TIMEOUT } from '../notifications';
import { slideTitle } from '../../store/templates/slide';
import '../styles/PresentationList.css';

export default function PresentationList() {
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState<StoredPresentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [showNewPresentationModal, setShowNewPresentationModal] = useState(false);
  const [showEditPresentationModal, setShowEditPresentationModal] = useState(false);
  const [editingPresentation, setEditingPresentation] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { notifications, addNotification, removeNotification } = useNotifications();

  useEffect(() => {
    account
      .get<AccountUser>()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const loadPresentations = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const userPresentations = await PresentationService.getUserPresentations(user.$id);
      setPresentations(userPresentations);

      if (userPresentations.length === 0) {
        addNotification(
          PRESENTATION_NOTIFICATIONS.INFO.NO_PRESENTATIONS,
          'info',
          NOTIFICATION_TIMEOUT.INFO
        );
      } else {
        addNotification(
          PRESENTATION_NOTIFICATIONS.SUCCESS.LOADED(userPresentations.length),
          'success',
          NOTIFICATION_TIMEOUT.SUCCESS
        );
      }
    } catch {
      addNotification(
        PRESENTATION_NOTIFICATIONS.ERROR.LOAD_FAILED,
        'error',
        NOTIFICATION_TIMEOUT.ERROR
      );
    } finally {
      setLoading(false);
    }
  }, [user, addNotification]);

  const hasLoadedRef = React.useRef(false);

  useEffect(() => {
    if (!user || hasLoadedRef.current) return;

    hasLoadedRef.current = true;
    loadPresentations();
  }, [user, loadPresentations]);

  const handleCreatePresentation = async (title: string) => {
    setCreatingNew(true);
    try {
      const newSlideId = `slide-${Date.now()}`;

      const titleSlide = {
        ...slideTitle,
        id: newSlideId,
      };

      titleSlide.elements = titleSlide.elements.map((el) => ({
        ...el,
        id: `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }));

      const presentation: Presentation = {
        title: title || 'Новая презентация',
        slides: [titleSlide],
        currentSlideId: newSlideId,
        selectedSlideIds: [newSlideId],
      };

      const currentUser = await account.get<AccountUser>();
      const saved = await PresentationService.savePresentation(
        presentation,
        currentUser.$id,
        currentUser.name || currentUser.email || ''
      );

      const loaded = await PresentationService.getPresentation(saved.$id);
      const presForEditor: Presentation = {
        title: loaded.title,
        slides: loaded.slides,
        currentSlideId: loaded.currentSlideId || loaded.slides[0]?.id || '',
        selectedSlideIds: loaded.selectedSlideIds || [loaded.slides[0]?.id || ''],
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

  const handleUpdatePresentation = async (presentationId: string, newTitle: string) => {
    try {
      const currentUser = await account.get<AccountUser>();
      const presentation = presentations.find((p) => (p.id || p.$id) === presentationId);

      if (!presentation) {
        throw new Error('Презентация не найдена');
      }

      await PresentationService.savePresentation(
        { ...presentation, title: newTitle },
        currentUser.$id,
        currentUser.name || currentUser.email || '',
        presentationId
      );

      setPresentations((prev) =>
        prev.map((p) =>
          (p.id || p.$id) === presentationId
            ? { ...p, title: newTitle, updatedAt: new Date().toISOString() }
            : p
        )
      );

      addNotification(
        'Название презентации успешно изменено',
        'success',
        NOTIFICATION_TIMEOUT.SUCCESS
      );

      loadPresentations();
    } catch {
      addNotification(
        'Не удалось изменить название презентации',
        'error',
        NOTIFICATION_TIMEOUT.ERROR
      );
      throw new Error('Failed to update presentation');
    }
  };

  const handleLoadDemo = () => {
    dispatch(setPresentationId('demo'));
    dispatch(loadDemoPresentation());
    addNotification(PRESENTATION_NOTIFICATIONS.INFO.DEMO_LOADED, 'info', NOTIFICATION_TIMEOUT.INFO);
    setTimeout(() => {
      navigate('/editor');
    }, 2000);
  };

  const handleLoadPresentation = async (presentation: StoredPresentation) => {
    try {
      const full = await PresentationService.getPresentation(presentation.id || presentation.$id);
      const presForEditor: Presentation = {
        title: full.title,
        slides: full.slides,
        currentSlideId: full.currentSlideId || full.slides[0]?.id || '',
        selectedSlideIds: full.selectedSlideIds || [full.slides[0]?.id || ''],
      };
      dispatch(setPresentationId(full.id || full.$id));
      dispatch(loadExistingPresentation(presForEditor));

      addNotification(
        PRESENTATION_NOTIFICATIONS.SUCCESS.PRESENTATION_LOADED(presForEditor.title),
        'success',
        NOTIFICATION_TIMEOUT.SUCCESS
      );
      setTimeout(() => {
        navigate(`/editor/${full.id || full.$id}`);
      }, 2000);
    } catch {
      addNotification(
        PRESENTATION_NOTIFICATIONS.ERROR.LOAD_FAILED,
        'error',
        NOTIFICATION_TIMEOUT.ERROR
      );
    }
  };

  const handleEditPresentation = (presentationId: string, currentTitle: string) => {
    setEditingPresentation({
      id: presentationId,
      title: currentTitle,
    });
    setShowEditPresentationModal(true);
  };

  const handleDeletePresentation = async (presentationId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Вы уверены, что хотите удалить эту презентацию?')) {
      return;
    }

    setDeletingId(presentationId);
    try {
      await PresentationService.deletePresentation(presentationId);

      setPresentations((prev) => prev.filter((p) => (p.id || p.$id) !== presentationId));

      addNotification('Презентация успешно удалена', 'success', NOTIFICATION_TIMEOUT.SUCCESS);
    } catch {
      addNotification(
        PRESENTATION_NOTIFICATIONS.ERROR.DELETE_FAILED,
        'error',
        NOTIFICATION_TIMEOUT.ERROR
      );
    } finally {
      setDeletingId(null);
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
          <button
            onClick={() => setShowNewPresentationModal(true)}
            className="presentation-list-button"
            disabled={creatingNew}
          >
            {creatingNew ? 'Создание...' : 'Создать новую'}
          </button>

          <button
            onClick={handleLoadDemo}
            className="presentation-list-button presentation-list-button-demo"
          >
            Демо-презентация
          </button>
        </div>

        {loading && (
          <div className="presentation-list-loading">
            <p>{PRESENTATION_NOTIFICATIONS.INFO.LOADING}</p>
          </div>
        )}

        {!loading && presentations.length > 0 && (
          <>
            <div className="presentation-list-count">
              Загружено презентаций: {presentations.length}
            </div>

            <div className="presentation-list-grid">
              {presentations.map((pres) => (
                <div
                  key={pres.id || pres.$id}
                  className="presentation-list-card"
                  onClick={() => handleLoadPresentation(pres)}
                >
                  <div className="presentation-list-card-header">
                    <h3 className="presentation-list-card-title">{pres.title}</h3>
                    <div className="presentation-list-card-actions">
                      <button
                        className="presentation-list-card-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPresentation(pres.id || pres.$id, pres.title);
                        }}
                        title="Изменить название"
                        aria-label="Изменить название"
                      >
                        ✏️
                      </button>
                      <button
                        className="presentation-list-card-delete"
                        onClick={(e) => handleDeletePresentation(pres.id || pres.$id, e)}
                        disabled={deletingId === (pres.id || pres.$id)}
                        title="Удалить презентацию"
                        aria-label="Удалить презентацию"
                      >
                        {deletingId === (pres.id || pres.$id) ? '...' : '🗑'}
                      </button>
                    </div>
                  </div>

                  <div className="presentation-list-card-meta">
                    <span>{(pres.slides || []).length} слайдов</span>
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
                        })
                      : 'Нет данных'}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && presentations.length === 0 && (
          <div className="presentation-list-container--empty">
            <p>{PRESENTATION_NOTIFICATIONS.INFO.NO_PRESENTATIONS}</p>
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

        {showEditPresentationModal && editingPresentation && (
          <EditPresentationModal
            isOpen={showEditPresentationModal}
            onClose={() => {
              setShowEditPresentationModal(false);
              setEditingPresentation(null);
            }}
            onUpdate={handleUpdatePresentation}
            presentationId={editingPresentation.id}
            currentTitle={editingPresentation.title}
          />
        )}
      </div>
    </>
  );
}
