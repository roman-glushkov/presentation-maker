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
  const dispatch = useDispatch();

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
    dispatch(setPresentationId(''));
    dispatch(createNewPresentation());
    console.log('Создана новая пустая презентация');
    if (onSelect) {
      onSelect();
    }
  };

  const handleLoadDemo = () => {
    dispatch(setPresentationId(''));
    dispatch(loadDemoPresentation());
    if (onSelect) {
      onSelect();
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleRefresh}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            ⟳ Обновить
          </button>
          <button
            onClick={handleCreateNew}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            + Новая презентация
          </button>
          <button
            onClick={handleLoadDemo}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            📁 Демо-презентация
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
          <p>Загрузка презентаций с проверкой данных...</p>
        </div>
      ) : presentations.length === 0 ? (
        <div
          style={{
            textAlign: 'center' as const,
            padding: '60px 20px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '2px dashed #e2e8f0',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📁</div>
          <h3 style={{ marginBottom: '10px' }}>У вас пока нет валидных презентаций</h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            Создайте первую презентацию и она появится здесь
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={handleCreateNew}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px',
              }}
            >
              Создать новую
            </button>
            <button
              onClick={handleLoadDemo}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px',
              }}
            >
              Посмотреть демо
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '15px', color: '#64748b', fontSize: '14px' }}>
            Загружено валидных презентаций: {presentations.length}
            <span style={{ marginLeft: '10px', color: '#94a3b8', fontSize: '12px' }}>
              (Некорректные презентации автоматически отфильтрованы)
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '40px',
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
                  ✅ Валидна
                </div>

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
                    marginBottom: '15px',
                  }}
                >
                  <span>📊 {(pres.slides || []).length} слайдов</span>
                  <span>👤 {pres.ownerName || user.name || user.email}</span>
                </div>

                <div
                  style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '10px',
                  }}
                >
                  Обновлено:{' '}
                  {pres.updatedAt
                    ? new Date(pres.updatedAt).toLocaleDateString('ru-RU')
                    : 'Нет данных'}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              textAlign: 'center' as const,
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
            }}
          >
            <p style={{ marginBottom: '15px', color: '#64748b' }}>
              Всего валидных презентаций: {presentations.length}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={handleCreateNew}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                + Создать новую презентацию
              </button>
              <button
                onClick={handleLoadDemo}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                📁 Загрузить демо-презентацию
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
