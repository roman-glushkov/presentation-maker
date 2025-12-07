// src/appwrite/components/NewPresentationModal.tsx
'use client';
import React, { useState, useEffect, CSSProperties } from 'react';
import { PresentationService } from '../presentation-service';
import { account, AppwriteUser } from '../client';

interface NewPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
  onCancel: () => void;
}

export default function NewPresentationModal({
  isOpen,
  onClose,
  onCreate,
  onCancel,
}: NewPresentationModalProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingTitles, setExistingTitles] = useState<string[]>([]);
  const [user, setUser] = useState<AppwriteUser | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadUserAndTitles();
    }
  }, [isOpen]);

  const loadUserAndTitles = async () => {
    try {
      const currentUser = await account.get<AppwriteUser>();
      setUser(currentUser);

      const presentations = await PresentationService.getUserPresentations(currentUser.$id);
      const titles = presentations.map((p) => p.title.toLowerCase().trim());
      setExistingTitles(titles);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Введите название презентации');
      return;
    }

    if (trimmedTitle.length < 2) {
      setError('Название должно содержать минимум 2 символа');
      return;
    }

    if (trimmedTitle.length > 100) {
      setError('Название должно быть не длиннее 100 символов');
      return;
    }

    // Проверка на уникальность у данного пользователя
    if (existingTitles.includes(trimmedTitle.toLowerCase())) {
      setError(
        `У вас уже есть презентация с названием "${trimmedTitle}". Придумайте уникальное название.`
      );
      return;
    }

    setLoading(true);
    try {
      onCreate(trimmedTitle);
      onClose();
      setTitle('');
    } catch (error: any) {
      setError(error.message || 'Ошибка создания презентации');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setError('');
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          width: '90%',
          maxWidth: '500px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        <h2
          style={{
            margin: '0 0 20px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Создать новую презентацию
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Название презентации *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              placeholder="Моя новая презентация"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${error ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'all 0.2s',
                boxSizing: 'border-box',
              }}
              autoFocus
            />
            {error && (
              <div
                style={{
                  color: '#ef4444',
                  fontSize: '14px',
                  marginTop: '8px',
                }}
              >
                {error}
              </div>
            )}
            <div
              style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '8px',
              }}
            >
              Уникальное название для вашей презентации
            </div>
          </div>

          {existingTitles.length > 0 && (
            <div
              style={{
                marginBottom: '20px',
                padding: '12px',
                background: '#f9fafb',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#6b7280',
              }}
            >
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                Ваши существующие презентации:
              </div>
              <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                {existingTitles.slice(0, 5).map((title, index) => (
                  <div key={index} style={{ padding: '2px 0' }}>
                    • {title}
                  </div>
                ))}
                {existingTitles.length > 5 && (
                  <div style={{ padding: '2px 0', fontStyle: 'italic' }}>
                    ... и еще {existingTitles.length - 5} презентаций
                  </div>
                )}
              </div>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '24px',
            }}
          >
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: '10px 20px',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
