'use client';
import React, { useState, useEffect } from 'react';
import { PresentationService, StoredPresentation } from '../presentation-service';
import { account, AppwriteUser } from '../client';
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
import './PresentationList.css';

export default function PresentationList({ onSelect }: { onSelect?: () => void }) {
  const [presentations, setPresentations] = useState<StoredPresentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showNewPresentationModal, setShowNewPresentationModal] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);
  const dispatch = useDispatch();

  const currentPresentation = useSelector((state: RootState) => state.editor.presentation);

  useEffect(() => {
    account
      .get<AppwriteUser>()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const loadPresentations = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const userPresentations = await PresentationService.getUserPresentations(user.$id);
      setPresentations(userPresentations);
      console.log('✅ Презентации загружены:', userPresentations.length);

      if (userPresentations.length === 0) {
        console.log('⚠️ У пользователя нет валидных презентаций');
      }
    } catch (error: any) {
      console.error('Ошибка загрузки:', error);
      setError(`Ошибка загрузки презентаций: ${error.message || 'Неизвестная ошибка'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadPresentations();
    }
  }, [user]);

  const handleCreateNew = () => {
    setShowNewPresentationModal(true);
  };

  const handleCreatePresentation = async (title: string) => {
    try {
      console.log('🆕 Создаем новую презентацию с названием:', title);
      setCreatingNew(true);

      dispatch(createNewPresentation());

      await new Promise((resolve) => setTimeout(resolve, 50));

      const presentationToSave = {
        ...currentPresentation,
        title: title || 'Новая презентация',
      };

      const currentUser = await account.get<AppwriteUser>();

      console.log('Сохраняем данные:', {
        title: presentationToSave.title,
        slidesCount: presentationToSave.slides?.length || 0,
        userId: currentUser.$id,
        userName: currentUser.name,
      });

      const savedPresentation = await PresentationService.savePresentation(
        presentationToSave,
        currentUser.$id,
        currentUser.name || currentUser.email
      );

      console.log('✅ Презентация сохранена в Appwrite:', savedPresentation.$id);

      const loadedPresentation = await PresentationService.getPresentation(savedPresentation.$id);

      const presentationForEditor: Presentation = {
        title: loadedPresentation.title || 'Без названия',
        slides: loadedPresentation.slides || [],
        currentSlideId:
          loadedPresentation.currentSlideId || loadedPresentation.slides?.[0]?.id || '',
        selectedSlideIds:
          loadedPresentation.selectedSlideIds ||
          (loadedPresentation.slides?.[0]?.id ? [loadedPresentation.slides[0].id] : []),
      };

      dispatch(loadExistingPresentation(presentationForEditor));
      dispatch(setPresentationId(savedPresentation.$id));

      console.log('🎯 PresentationId установлен:', savedPresentation.$id);
      console.log('Созданная презентация:', {
        title: presentationForEditor.title,
        slidesCount: presentationForEditor.slides?.length,
        hasElements: presentationForEditor.slides?.[0]?.elements?.length || 0,
      });

      if (onSelect) {
        onSelect();
      }
    } catch (error: any) {
      console.error('❌ Ошибка создания презентации:', error);
      alert(`Ошибка создания презентации: ${error.message || 'Неизвестная ошибка'}`);
    } finally {
      setCreatingNew(false);
      setShowNewPresentationModal(false);
    }
  };

  const handleLoadDemo = () => {
    dispatch(setPresentationId('demo'));
    dispatch(loadDemoPresentation());
    if (onSelect) {
      onSelect();
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      window.location.reload();
    } catch (error) {
      console.error('Ошибка выхода:', error);
      alert('Ошибка при выходе из системы');
    }
  };

  const handleLoadPresentation = async (presentation: StoredPresentation) => {
    try {
      console.log(`🔄 Загружаем презентацию: "${presentation.title}"`);

      const fullPresentation = await PresentationService.getPresentation(
        presentation.id || presentation.$id
      );

      const presentationForEditor: Presentation = {
        title: fullPresentation.title || 'Без названия',
        slides: fullPresentation.slides || [],
        currentSlideId: fullPresentation.currentSlideId || fullPresentation.slides?.[0]?.id || '',
        selectedSlideIds:
          fullPresentation.selectedSlideIds ||
          (fullPresentation.slides?.[0]?.id ? [fullPresentation.slides[0].id] : []),
      };

      dispatch(setPresentationId(fullPresentation.id || fullPresentation.$id));
      dispatch(loadExistingPresentation(presentationForEditor));

      console.log(`✅ Презентация "${fullPresentation.title}" успешно загружена`);
      console.log('Данные:', {
        title: presentationForEditor.title,
        slidesCount: presentationForEditor.slides?.length,
        currentSlideId: presentationForEditor.currentSlideId,
      });

      if (onSelect) {
        onSelect();
      }
    } catch (error: any) {
      console.error('❌ Ошибка загрузки презентации:', error);

      if (error.message && error.message.includes('Данные презентации повреждены')) {
        alert(
          `❌ Ошибка загрузки презентации:\n\n${error.message}\n\nЭта презентация содержит поврежденные данные.`
        );
      } else if (error.message && error.message.includes('Невалидная структура')) {
        alert(
          `❌ Ошибка загрузки:\n\n${error.message}\n\nДанные презентации имеют неверный формат.`
        );
      } else {
        alert(`Не удалось загрузить презентацию: ${error.message || 'Неизвестная ошибка'}`);
      }
    }
  };

  const handleRefresh = () => {
    loadPresentations();
  };

  if (!user) {
    return (
      <div className="presentation-list-container" style={{ textAlign: 'center' }}>
        Войдите, чтобы видеть ваши презентации
      </div>
    );
  }

  return (
    <div className="presentation-list-container">
      <div className="presentation-list-header">
        <h2 className="presentation-list-title">Мои презентации</h2>
        <div className="presentation-list-user-info">
          <span className="presentation-list-user-name">{user?.name || user?.email}</span>
          <button
            onClick={handleLogout}
            className="presentation-list-logout-button"
            title="Выйти из аккаунта"
          >
            Выйти
          </button>
        </div>
      </div>

      <div className="presentation-list-buttons-grid">
        <div className="presentation-list-button-wrapper">
          <button
            onClick={handleCreateNew}
            className="presentation-list-button"
            disabled={creatingNew}
          >
            <span>{creatingNew ? 'Создание...' : 'Создать новую'}</span>
          </button>
        </div>

        <div className="presentation-list-button-wrapper">
          <button
            onClick={handleLoadDemo}
            className="presentation-list-button presentation-list-button-demo"
          >
            <span>Демо-презентация</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="presentation-list-error">
          <strong>Ошибка:</strong> {error}
          <button onClick={handleRefresh} className="presentation-list-retry-button">
            Повторить попытку
          </button>
        </div>
      )}

      {loading ? (
        <div className="presentation-list-loading">
          <div className="presentation-list-loading-spinner" />
          <p>Загрузка презентаций...</p>
        </div>
      ) : (
        presentations.length > 0 && (
          <>
            <div className="presentation-list-count">
              Загружено презентаций: {presentations.length}
            </div>

            <div className="presentation-list-grid">
              {presentations.map((pres) => (
                <div
                  key={pres.id || pres.$id}
                  onClick={() => handleLoadPresentation(pres)}
                  className="presentation-list-card"
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
                      <span>👤 {pres.ownerName || user.name || user.email}</span>
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
        )
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
  );
}
