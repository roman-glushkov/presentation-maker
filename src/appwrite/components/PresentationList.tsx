'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { PRESENTATION_NOTIFICATIONS, NOTIFICATION_TIMEOUT } from '../notifications/messages';
import '../styles/PresentationList.css';

// Иконки для уведомлений
const NotificationIcons = {
  success: '✅',
  info: 'ℹ️',
  error: '❌',
  warning: '⚠️',
};

export default function PresentationList({ onSelect }: { onSelect?: () => void }) {
  const [presentations, setPresentations] = useState<StoredPresentation[]>([]);
  const [invalidPresentations, setInvalidPresentations] = useState<StoredPresentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [showNewPresentationModal, setShowNewPresentationModal] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);

  const dispatch = useDispatch();
  const currentPresentation = useSelector((state: RootState) => state.editor.presentation);
  const { notifications, addNotification, removeNotification } = useNotifications();

  useEffect(() => {
    account
      .get<AccountUser>()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const loadPresentations = useCallback(async () => {
    if (!user) {
      console.log('🚫 loadPresentations: пользователь не авторизован');
      return;
    }

    console.log('🔄 loadPresentations: начали загрузку для пользователя', {
      userId: user.$id,
      userName: user.name || user.email,
    });

    setLoading(true);

    try {
      console.log('📥 Загружаем презентации из PresentationService...');
      const userPresentations = await PresentationService.getUserPresentations(user.$id);

      console.log('📊 Получены презентации:', {
        totalCount: userPresentations.length,
        presentations: userPresentations.map((p) => ({
          id: p.id || p.$id,
          title: p.title || '(без названия)',
          slidesCount: p.slides?.length || 0,
          hasOwner: !!p.ownerId,
          ownerName: p.ownerName || '(нет имени)',
          updatedAt: p.updatedAt || '(нет даты)',
        })),
      });

      // Разделяем презентации на валидные и невалидные
      const validPres: StoredPresentation[] = [];
      const invalidPres: StoredPresentation[] = [];

      userPresentations.forEach((presentation, index) => {
        console.log(`🔍 Проверяем презентацию ${index + 1}/${userPresentations.length}:`, {
          id: presentation.id || presentation.$id || '(нет ID)',
          title: presentation.title || '(без названия)',
          slidesType: typeof presentation.slides,
          slidesIsArray: Array.isArray(presentation.slides),
          slidesLength: presentation.slides?.length || 0,
          ownerId: presentation.ownerId || '(нет ownerId)',
          ownerName: presentation.ownerName || '(нет имени владельца)',
        });

        // Проверяем основные поля на валидность
        const isValid = validatePresentation(presentation);

        if (isValid) {
          console.log(
            `✅ Презентация ${presentation.title} (${presentation.id || presentation.$id}) - ВАЛИДНАЯ`
          );
          validPres.push(presentation);
        } else {
          console.log(
            `❌ Презентация ${presentation.title} (${presentation.id || presentation.$id}) - НЕВАЛИДНАЯ`
          );
          invalidPres.push(presentation);

          // Детальный лог невалидной презентации
          console.log('❌ Детали невалидной презентации:', {
            id: presentation.id || presentation.$id || '(нет ID)',
            title: presentation.title,
            slides: presentation.slides,
            slidesType: typeof presentation.slides,
            slidesIsArray: Array.isArray(presentation.slides),
            ownerId: presentation.ownerId,
            ownerName: presentation.ownerName,
            userId: user.$id,
          });
        }
      });

      setPresentations(validPres);
      setInvalidPresentations(invalidPres);

      console.log('📈 Результаты валидации:', {
        validCount: validPres.length,
        invalidCount: invalidPres.length,
        totalCount: userPresentations.length,
      });

      if (validPres.length === 0 && invalidPres.length === 0) {
        console.log('📭 Нет ни одной презентации');
        addNotification(
          PRESENTATION_NOTIFICATIONS.INFO.NO_PRESENTATIONS,
          'info',
          NOTIFICATION_TIMEOUT.INFO
        );
      } else if (validPres.length > 0) {
        console.log(`✅ Найдено ${validPres.length} валидных презентаций`);
        // Показываем уведомление о валидных презентациях
        addNotification(
          PRESENTATION_NOTIFICATIONS.SUCCESS.LOADED(validPres.length),
          'success',
          NOTIFICATION_TIMEOUT.SUCCESS
        );

        // Показываем предупреждение о невалидных презентациях
        if (invalidPres.length > 0) {
          console.log(`⚠️ Найдено ${invalidPres.length} невалидных презентаций`);
          addNotification(
            PRESENTATION_NOTIFICATIONS.WARNING.VALIDATION_FAILED,
            'warning',
            NOTIFICATION_TIMEOUT.WARNING
          );
        }
      } else if (invalidPres.length > 0) {
        console.log(`❌ Есть ${invalidPres.length} презентаций, но все они невалидные`);
        addNotification(
          PRESENTATION_NOTIFICATIONS.WARNING.VALIDATION_FAILED,
          'warning',
          NOTIFICATION_TIMEOUT.WARNING
        );
      }
    } catch (error) {
      console.error('💥 Ошибка загрузки презентаций:', error);
      addNotification(
        PRESENTATION_NOTIFICATIONS.ERROR.LOAD_FAILED,
        'error',
        NOTIFICATION_TIMEOUT.ERROR
      );
    } finally {
      console.log('🏁 loadPresentations: завершено');
      setLoading(false);
    }
  }, [user, addNotification]);

  // Функция для валидации презентации
  const validatePresentation = (presentation: StoredPresentation): boolean => {
    try {
      // Проверка обязательных полей
      if (!presentation.id && !presentation.$id) {
        console.log('❌ Презентация без ID:', presentation);
        return false;
      }

      // Проверка структуры slides
      if (!Array.isArray(presentation.slides)) {
        console.log('❌ Презентация с некорректными слайдами:', {
          id: presentation.id || presentation.$id,
          title: presentation.title,
          slidesType: typeof presentation.slides,
        });
        return false;
      }

      // Проверка, что все слайды имеют нужные поля
      const hasInvalidSlides = presentation.slides.some((slide: any, index: number) => {
        if (!slide || typeof slide !== 'object') {
          console.log(`❌ Слайд ${index} не является объектом:`, slide);
          return true;
        }

        if (!slide.id || typeof slide.id !== 'string') {
          console.log(`❌ Слайд ${index} без ID или ID не строка:`, slide);
          return true;
        }

        return false;
      });

      if (hasInvalidSlides) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Ошибка при валидации презентации:', error, presentation);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadPresentations();
    }
  }, [user]);

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
      onSelect?.();
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
    onSelect?.();
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
      onSelect?.();
    } catch (error) {
      console.error('Ошибка загрузки презентации:', error);
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
                window.location.reload();
              }}
            >
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

        {!loading && (
          <>
            <div className="presentation-list-count">
              Загружено презентаций: {presentations.length}
              {invalidPresentations.length > 0 && (
                <span
                  style={{
                    fontSize: '12px',
                    color: '#f59e0b',
                    marginLeft: '10px',
                    fontWeight: 'normal',
                  }}
                >
                  ({invalidPresentations.length} поврежденных скрыто)
                </span>
              )}
            </div>

            {presentations.length > 0 ? (
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
                      <h3 className="presentation-list-card-title">
                        {pres.title || 'Без названия'}
                      </h3>

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
            ) : (
              <div
                className="presentation-list-container--empty"
                style={{ textAlign: 'center', padding: '40px' }}
              >
                <p>У вас пока нет презентаций</p>
                <p style={{ fontSize: '14px', color: '#64748b', marginTop: '10px' }}>
                  Создайте новую или попробуйте демо-презентацию
                </p>
                {invalidPresentations.length > 0 && (
                  <p style={{ fontSize: '12px', color: '#f59e0b', marginTop: '10px' }}>
                    ⚠️ Обнаружено {invalidPresentations.length} поврежденных презентаций
                  </p>
                )}
              </div>
            )}
          </>
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
