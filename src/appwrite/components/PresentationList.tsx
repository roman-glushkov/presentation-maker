// src/appwrite/components/PresentationList.tsx
'use client';
import React, { useState, useEffect, CSSProperties } from 'react';
import { PresentationService, StoredPresentation } from '../presentation-service';
import { account, AppwriteUser } from '../client';
import { useDispatch } from 'react-redux';
import {
  loadDemoPresentation,
  createNewPresentation,
  setPresentationId,
  loadExistingPresentation,
} from '../../store/editorSlice';
import { Presentation } from '../../store/types/presentation';
import NewPresentationModal from './NewPresentationModal';

const styles: { [key: string]: CSSProperties } = {
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  errorBox: {
    background: '#fee2e2',
    border: '1px solid #ef4444',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    color: '#991b1b',
  },
  retryButton: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    cursor: 'pointer',
    marginTop: '10px',
    fontWeight: '600',
  },
};

const addStylesToDocument = () => {
  if (typeof document === 'undefined') return;

  const styleId = 'presentation-list-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
};

export default function PresentationList({ onSelect }: { onSelect?: () => void }) {
  const [presentations, setPresentations] = useState<StoredPresentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showNewPresentationModal, setShowNewPresentationModal] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);
  const dispatch = useDispatch();

  // Константы для отступов (чтобы совпадали)
  const GRID_GAP = '20px'; // Расстояние между карточками презентаций
  const CARD_WIDTH = '300px'; // Ширина карточки презентации

  useEffect(() => {
    addStylesToDocument();
  }, []);

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
    if (!user) return;

    setCreatingNew(true);
    try {
      // Создаем новую пустую презентацию
      const newPresentation = PresentationService.createEmptyPresentation(title);

      // Сохраняем ее в БД с уникальным ID
      const savedPresentation = await PresentationService.savePresentation(
        newPresentation,
        user.$id,
        user.name || user.email
      );

      // Устанавливаем ID в Redux store
      dispatch(setPresentationId(savedPresentation.id || savedPresentation.$id));

      // Загружаем созданную презентацию в редактор
      dispatch(loadExistingPresentation(newPresentation));

      console.log(`✅ Новая презентация создана: "${title}"`);

      // Переходим в редактор
      if (onSelect) {
        onSelect();
      }
    } catch (error: any) {
      console.error('❌ Ошибка создания презентации:', error);
      alert(`Не удалось создать презентацию: ${error.message || 'Неизвестная ошибка'}`);
    } finally {
      setCreatingNew(false);
      setShowNewPresentationModal(false);
    }
  };

  const handleLoadDemo = () => {
    dispatch(setPresentationId(''));
    dispatch(loadDemoPresentation());
    if (onSelect) {
      onSelect();
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      window.location.reload(); // Перезагружаем страницу для сброса состояния
    } catch (error) {
      console.error('Ошибка выхода:', error);
      alert('Ошибка при выходе из системы');
    }
  };

  const handleLoadPresentation = async (presentation: StoredPresentation) => {
    try {
      console.log(`🔄 Загружаем презентацию: "${presentation.title}"`);

      // Загружаем презентацию с валидацией
      const fullPresentation = await PresentationService.getPresentation(
        presentation.id || presentation.$id
      );

      // Устанавливаем ID презентации в Redux
      dispatch(setPresentationId(fullPresentation.id || fullPresentation.$id));

      // Подготавливаем данные презентации для редактора
      const presentationForEditor: Presentation = {
        title: fullPresentation.title || 'Без названия',
        slides: fullPresentation.slides || [],
        currentSlideId: fullPresentation.currentSlideId || fullPresentation.slides?.[0]?.id || '',
        selectedSlideIds:
          fullPresentation.selectedSlideIds ||
          (fullPresentation.slides?.[0]?.id ? [fullPresentation.slides[0].id] : []),
      };

      // Загружаем презентацию в редактор
      dispatch(loadExistingPresentation(presentationForEditor));

      console.log(`✅ Презентация "${fullPresentation.title}" успешно загружена в редактор`);
      console.log('Текущий слайд ID:', presentationForEditor.currentSlideId);

      // Переходим в редактор
      if (onSelect) {
        onSelect();
      }
    } catch (error: any) {
      console.error('❌ Ошибка загрузки презентации:', error);

      // Специальная обработка ошибок валидации
      if (error.message && error.message.includes('Данные презентации повреждены')) {
        alert(
          `❌ Ошибка загрузки презентации:\n\n${error.message}\n\nЭта презентация содержит поврежденные данные. Пожалуйста, выберите другую презентацию или создайте новую.`
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
      <div style={{ padding: '20px', textAlign: 'center' as const }}>
        Войдите, чтобы видеть ваши презентации
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <h2 style={{ margin: 0 }}>Мои презентации</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '14px',
              color: '#64748b',
              marginRight: '10px',
            }}
          >
            {user?.name || user?.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
            title="Выйти из аккаунта"
          >
            Выйти
          </button>
        </div>
      </div>

      {/* Кнопки созданы в сетке, которая совпадает с сеткой презентаций */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(${CARD_WIDTH}, 1fr))`,
          gap: GRID_GAP,
          marginBottom: '30px',
        }}
      >
        {/* Первая кнопка - Создать новую */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={handleCreateNew}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              display: 'flex',
              flexDirection: 'row', // ← ИЗМЕНИТЬ НА row
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px 20px', // ← УМЕНЬШИТЬ padding
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              height: '40px', // ← ЯВНО ЗАДАЁМ ВЫСОТУ
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            }}
            disabled={creatingNew}
          >
            <span>{creatingNew ? 'Создание...' : 'Создать новую'}</span>
          </button>
        </div>

        {/* Вторая кнопка - Демо-презентация */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={handleLoadDemo}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              display: 'flex',
              flexDirection: 'row', // ← ИЗМЕНИТЬ НА row
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px 20px', // ← УМЕНЬШИТЬ padding
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              height: '40px', // ← ЯВНО ЗАДАЁМ ВЫСОТУ
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            }}
          >
            <span>Демо-презентация</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <strong>Ошибка:</strong> {error}
          <button onClick={handleRefresh} style={styles.retryButton}>
            Повторить попытку
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center' as const, padding: '40px' }}>
          <div style={styles.loadingSpinner} />
          <p>Загрузка презентаций...</p>
        </div>
      ) : (
        presentations.length > 0 && (
          <>
            <div style={{ marginBottom: '15px', color: '#64748b', fontSize: '14px' }}>
              Загружено презентаций: {presentations.length}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fill, minmax(${CARD_WIDTH}, 1fr))`,
                gap: GRID_GAP,
              }}
            >
              {presentations.map((pres) => (
                <div
                  key={pres.id || pres.$id}
                  onClick={() => handleLoadPresentation(pres)}
                  style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    position: 'relative',
                    minHeight: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#10b981',
                      color: 'white',
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '600',
                    }}
                    title="Эта презентация прошла проверку валидации"
                  >
                    ✅
                  </div>

                  <div>
                    <h3
                      style={{
                        margin: '0 0 10px 0',
                        fontSize: '18px',
                        color: '#1e293b',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap' as const,
                        paddingRight: '50px',
                      }}
                    >
                      {pres.title || 'Без названия'}
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: '#64748b',
                        fontSize: '14px',
                      }}
                    >
                      <span>📊 {(pres.slides || []).length} слайдов</span>
                      <span>👤 {pres.ownerName || user.name || user.email}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '12px',
                      color: '#94a3b8',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '10px',
                      marginTop: '10px',
                    }}
                  >
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
